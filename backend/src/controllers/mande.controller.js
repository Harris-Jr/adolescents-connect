import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

const prisma = new PrismaClient();

function parseRange(query) {
  let from = query.from ? new Date(query.from) : null;
  let to = query.to ? new Date(query.to) : null;
  if (from && isNaN(from.getTime())) from = null;
  if (to && isNaN(to.getTime())) to = null;
  if (to) to.setHours(23, 59, 59, 999); // inclusive end of day
  return { from, to };
}

function rangeFilter(field, from, to) {
  const bounds = {};
  if (from) bounds.gte = from;
  if (to) bounds.lte = to;
  return Object.keys(bounds).length ? { [field]: bounds } : {};
}

const monthKey = (date) => date.toISOString().slice(0, 7);

function bucketByMonth(dates) {
  const buckets = {};
  for (const d of dates) {
    const key = monthKey(d);
    buckets[key] = (buckets[key] ?? 0) + 1;
  }
  return Object.keys(buckets)
    .sort()
    .map((month) => ({ month, count: buckets[month] }));
}

const pct = (part, whole) => (whole ? Math.round((part / whole) * 100) : 0);

async function buildMandeData(from, to) {
  const learnerWhere = { role: "LEARNER" };

  const [
    totalLearners,
    totalTeachers,
    genderGroups,
    provinceGroups,
    districtGroups,
    disabilityGroups,
    registrations,
    attempts,
    challengeCompletions,
    clubJoins,
    quizzes,
  ] = await Promise.all([
    prisma.user.count({ where: learnerWhere }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.user.groupBy({ by: ["gender"], where: learnerWhere, _count: { _all: true } }),
    prisma.user.groupBy({ by: ["province"], where: learnerWhere, _count: { _all: true } }),
    prisma.user.groupBy({
      by: ["province", "district"],
      where: learnerWhere,
      _count: { _all: true },
    }),
    prisma.user.groupBy({ by: ["disabilityStatus"], where: learnerWhere, _count: { _all: true } }),
    prisma.user.findMany({
      where: { ...learnerWhere, ...rangeFilter("createdAt", from, to) },
      select: { createdAt: true },
    }),
    prisma.quizAttempt.findMany({
      where: rangeFilter("completedAt", from, to),
      select: { userId: true, quizId: true, score: true, user: { select: { province: true } } },
    }),
    prisma.challengeAttempt.count({ where: rangeFilter("completedAt", from, to) }),
    prisma.clubMember.findMany({
      where: rangeFilter("joinedAt", from, to),
      select: { joinedAt: true },
    }),
    prisma.quiz.findMany({ select: { id: true, title: true, passMark: true } }),
  ]);

  const [activeAmbassadors, pendingApplications, ambassadorReports] = await Promise.all([
    prisma.ambassador.count({ where: { status: "APPROVED" } }),
    prisma.ambassador.count({ where: { status: "PENDING" } }),
    prisma.ambassadorReport.findMany({
      where: rangeFilter("activityDate", from, to),
      select: { status: true, participants: true },
    }),
  ]);
  const verifiedReports = ambassadorReports.filter((r) => r.status === "VERIFIED");
  const ambassadorActivity = {
    activeAmbassadors,
    pendingApplications,
    reportsSubmitted: ambassadorReports.length,
    reportsVerified: verifiedReports.length,
    adolescentsReached: verifiedReports.reduce((sum, r) => sum + (r.participants ?? 0), 0),
  };

  // Active learners = distinct users with a quiz attempt in range
  const activeByProvince = {};
  const activeUserIds = new Set();
  for (const attempt of attempts) {
    if (!activeUserIds.has(attempt.userId)) {
      activeUserIds.add(attempt.userId);
      const province = attempt.user?.province ?? "Unknown";
      (activeByProvince[province] ??= new Set()).add(attempt.userId);
    }
  }

  const participationByProvince = provinceGroups.map((group) => {
    const province = group.province ?? "Unknown";
    const learners = group._count._all;
    const active = activeByProvince[province]?.size ?? 0;
    return { province, learners, active, rate: pct(active, learners) };
  });

  // Per-quiz: attempts, average score, pass rate (score >= passMark)
  const quizStats = {};
  for (const attempt of attempts) {
    const stats = (quizStats[attempt.quizId] ??= { attempts: 0, scoreSum: 0 });
    stats.attempts += 1;
    stats.scoreSum += attempt.score;
  }
  const quizPerformance = quizzes
    .map((quiz) => {
      const stats = quizStats[quiz.id];
      if (!stats) return { quiz: quiz.title, attempts: 0, avgScore: 0, passRate: 0 };
      const passed = attempts.filter(
        (a) => a.quizId === quiz.id && a.score >= quiz.passMark,
      ).length;
      return {
        quiz: quiz.title,
        attempts: stats.attempts,
        avgScore: Math.round(stats.scoreSum / stats.attempts),
        passRate: pct(passed, stats.attempts),
      };
    })
    .sort((a, b) => b.attempts - a.attempts);

  return {
    range: {
      from: from ? from.toISOString().slice(0, 10) : null,
      to: to ? to.toISOString().slice(0, 10) : null,
    },
    totals: {
      learners: totalLearners,
      teachers: totalTeachers,
      registrationsInRange: registrations.length,
      activeLearners: activeUserIds.size,
      participationRate: pct(activeUserIds.size, totalLearners),
      quizAttempts: attempts.length,
      avgQuizScore: attempts.length
        ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
        : 0,
      challengeCompletions,
      clubJoins: clubJoins.length,
    },
    registrationsByMonth: bucketByMonth(registrations.map((r) => r.createdAt)),
    participationByProvince,
    quizPerformance,
    genderBreakdown: genderGroups.map((g) => ({
      gender: g.gender ?? "Unspecified",
      count: g._count._all,
    })),
    disabilityBreakdown: disabilityGroups.map((g) => ({
      status: g.disabilityStatus ?? "Unspecified",
      count: g._count._all,
    })),
    districtBreakdown: districtGroups
      .map((g) => ({
        province: g.province ?? "Unknown",
        district: g.district ?? "Unknown",
        learners: g._count._all,
      }))
      .sort((a, b) => a.province.localeCompare(b.province) || a.district.localeCompare(b.district)),
    clubJoinsByMonth: bucketByMonth(clubJoins.map((j) => j.joinedAt)),
    ambassadorActivity,
  };
}

export async function getMandeOverview(req, res) {
  try {
    const { from, to } = parseRange(req.query);
    const data = await buildMandeData(from, to);
    res.json(data);
  } catch (err) {
    console.error("getMandeOverview error:", err);
    res.status(500).json({ error: "Failed to load M&E data" });
  }
}

// ---------- Export helpers ----------

function reportSections(data) {
  return [
    {
      title: "Summary",
      headers: ["Metric", "Value"],
      rows: [
        ["Date range", `${data.range.from ?? "all time"} to ${data.range.to ?? "present"}`],
        ["Total learners", data.totals.learners],
        ["Total teachers", data.totals.teachers],
        ["Registrations in range", data.totals.registrationsInRange],
        ["Active learners (quiz activity)", data.totals.activeLearners],
        ["Participation rate %", data.totals.participationRate],
        ["Quiz attempts", data.totals.quizAttempts],
        ["Average quiz score %", data.totals.avgQuizScore],
        ["Challenge completions", data.totals.challengeCompletions],
        ["Club joins", data.totals.clubJoins],
      ],
    },
    {
      title: "Registrations by Month",
      headers: ["Month", "Registrations"],
      rows: data.registrationsByMonth.map((r) => [r.month, r.count]),
    },
    {
      title: "Participation by Province",
      headers: ["Province", "Learners", "Active", "Rate %"],
      rows: data.participationByProvince.map((p) => [p.province, p.learners, p.active, p.rate]),
    },
    {
      title: "Learners by District",
      headers: ["Province", "District", "Learners"],
      rows: data.districtBreakdown.map((d) => [d.province, d.district, d.learners]),
    },
    {
      title: "Gender Breakdown",
      headers: ["Gender", "Learners"],
      rows: data.genderBreakdown.map((g) => [g.gender, g.count]),
    },
    {
      title: "Disability Inclusion",
      headers: ["Status", "Learners"],
      rows: data.disabilityBreakdown.map((d) => [d.status, d.count]),
    },
    {
      title: "Quiz Performance",
      headers: ["Quiz", "Attempts", "Avg Score %", "Pass Rate %"],
      rows: data.quizPerformance.map((q) => [q.quiz, q.attempts, q.avgScore, q.passRate]),
    },
    {
      title: "Club Joins by Month",
      headers: ["Month", "Joins"],
      rows: data.clubJoinsByMonth.map((j) => [j.month, j.count]),
    },
    {
      title: "Ambassador Activities",
      headers: ["Metric", "Value"],
      rows: [
        ["Active ambassadors", data.ambassadorActivity.activeAmbassadors],
        ["Pending applications", data.ambassadorActivity.pendingApplications],
        ["Reports submitted (period)", data.ambassadorActivity.reportsSubmitted],
        ["Reports verified (period)", data.ambassadorActivity.reportsVerified],
        ["Adolescents reached (verified)", data.ambassadorActivity.adolescentsReached],
      ],
    },
  ];
}

function sendCsv(res, data, filename) {
  const escape = (value) => `"${String(value).replace(/"/g, '""')}"`;
  const lines = [];
  for (const section of reportSections(data)) {
    lines.push(escape(section.title));
    lines.push(section.headers.map(escape).join(","));
    for (const row of section.rows) lines.push(row.map(escape).join(","));
    lines.push("");
  }
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}.csv"`);
  res.send(lines.join("\n"));
}

async function sendXlsx(res, data, filename) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "A-LINKS M&E";
  for (const section of reportSections(data)) {
    const sheet = workbook.addWorksheet(section.title.slice(0, 31));
    const headerRow = sheet.addRow(section.headers);
    headerRow.font = { bold: true };
    for (const row of section.rows) sheet.addRow(row);
    sheet.columns.forEach((column) => {
      let width = 12;
      column.eachCell({ includeEmpty: false }, (cell) => {
        width = Math.max(width, String(cell.value ?? "").length + 2);
      });
      column.width = Math.min(width, 40);
    });
  }
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader("Content-Disposition", `attachment; filename="${filename}.xlsx"`);
  await workbook.xlsx.write(res);
  res.end();
}

function sendPdf(res, data, filename) {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}.pdf"`);
  const doc = new PDFDocument({ margin: 40, size: "A4" });
  doc.pipe(res);

  doc.fontSize(18).font("Helvetica-Bold").text("A-LINKS — Monitoring & Evaluation Report");
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#555")
    .text(
      `Period: ${data.range.from ?? "all time"} to ${data.range.to ?? "present"} · Generated ${new Date().toISOString().slice(0, 10)}`,
    );
  doc.moveDown(1);

  for (const section of reportSections(data)) {
    if (doc.y > doc.page.height - 150) doc.addPage();
    doc.fillColor("#000").fontSize(13).font("Helvetica-Bold").text(section.title);
    doc.moveDown(0.4);

    const columnCount = section.headers.length;
    const tableWidth = doc.page.width - 80;
    // First column gets extra room for labels; the rest share evenly
    const firstWidth = columnCount > 2 ? tableWidth * 0.4 : tableWidth / columnCount;
    const restWidth = columnCount > 1 ? (tableWidth - firstWidth) / (columnCount - 1) : 0;
    const colX = (i) => 40 + (i === 0 ? 0 : firstWidth + restWidth * (i - 1));
    const colW = (i) => (i === 0 ? firstWidth : restWidth);

    const drawRow = (cells, bold) => {
      if (doc.y > doc.page.height - 60) doc.addPage();
      const y = doc.y;
      doc.fontSize(9).font(bold ? "Helvetica-Bold" : "Helvetica");
      let maxHeight = 0;
      cells.forEach((cell, i) => {
        doc.text(String(cell), colX(i), y, { width: colW(i) - 6 });
        maxHeight = Math.max(maxHeight, doc.y - y);
      });
      doc.x = 40;
      doc.y = y + maxHeight + 3;
    };

    drawRow(section.headers, true);
    if (section.rows.length === 0) {
      doc.fontSize(9).font("Helvetica").fillColor("#777").text("No data for this period.");
      doc.fillColor("#000");
    } else {
      for (const row of section.rows) drawRow(row, false);
    }
    doc.moveDown(0.8);
  }

  doc.end();
}

export async function exportMandeReport(req, res) {
  try {
    const { from, to } = parseRange(req.query);
    const format = String(req.query.format ?? "csv").toLowerCase();
    if (!["csv", "xlsx", "pdf"].includes(format)) {
      return res.status(400).json({ error: "format must be csv, xlsx or pdf" });
    }
    const data = await buildMandeData(from, to);
    const filename = `alinks-mande-report-${new Date().toISOString().slice(0, 10)}`;
    if (format === "csv") return sendCsv(res, data, filename);
    if (format === "xlsx") return sendXlsx(res, data, filename);
    return sendPdf(res, data, filename);
  } catch (err) {
    console.error("exportMandeReport error:", err);
    res.status(500).json({ error: "Failed to export M&E report" });
  }
}
