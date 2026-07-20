import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getLeaderboard(_req, res) {
  try {
    // Sum points from quiz attempts
    const quizPoints = await prisma.quizAttempt.groupBy({
      by: ["userId"],
      _sum: { pointsEarned: true },
    });

    // Sum points from challenge attempts
    const challengePoints = await prisma.challengeAttempt.groupBy({
      by: ["userId"],
      _sum: { pointsEarned: true },
    });

    // Sum points from verified ambassador reports
    const ambassadorPoints = await prisma.ambassadorReport.groupBy({
      by: ["ambassadorId"],
      where: { status: "VERIFIED" },
      _sum: { pointsAwarded: true },
    });
    const ambassadors = ambassadorPoints.length
      ? await prisma.ambassador.findMany({
          where: { id: { in: ambassadorPoints.map((row) => row.ambassadorId) } },
          select: { id: true, userId: true },
        })
      : [];
    const ambassadorUserId = Object.fromEntries(ambassadors.map((a) => [a.id, a.userId]));

    // Merge into a map: userId -> totalPoints
    const pointsMap = {};
    for (const row of quizPoints) {
      pointsMap[row.userId] = (pointsMap[row.userId] ?? 0) + (row._sum.pointsEarned ?? 0);
    }
    for (const row of challengePoints) {
      pointsMap[row.userId] = (pointsMap[row.userId] ?? 0) + (row._sum.pointsEarned ?? 0);
    }
    for (const row of ambassadorPoints) {
      const userId = ambassadorUserId[row.ambassadorId];
      if (userId) pointsMap[userId] = (pointsMap[userId] ?? 0) + (row._sum.pointsAwarded ?? 0);
    }

    if (Object.keys(pointsMap).length === 0) {
      return res.json({ leaderboard: [] });
    }

    // Fetch user details for all users in the map
    const users = await prisma.user.findMany({
      where: { id: { in: Object.keys(pointsMap) } },
      select: { id: true, firstName: true, lastName: true, grade: true, schoolName: true },
    });

    // Build ranked list
    const leaderboard = users
      .map((u) => ({
        userId: u.id,
        name: `${u.firstName} ${u.lastName}`,
        grade: u.grade,
        school: u.schoolName,
        points: pointsMap[u.id] ?? 0,
      }))
      .sort((a, b) => b.points - a.points)
      .map((entry, i) => ({ rank: i + 1, ...entry }));

    res.json({ leaderboard });
  } catch (err) {
    console.error("getLeaderboard error:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
}
