import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// ─── Lesson Plans ───────────────────────────────────────────────

export async function listLessonPlans(req, res) {
  try {
    const plans = await prisma.lessonPlan.findMany({
      where: { teacherId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json({ plans });
  } catch (err) {
    console.error("listLessonPlans error:", err);
    res.status(500).json({ error: "Failed to fetch lesson plans" });
  }
}

export async function createLessonPlan(req, res) {
  try {
    const { title, subject, grade, description, objectives, activities } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
    const plan = await prisma.lessonPlan.create({
      data: {
        teacherId: req.user.id,
        title,
        subject,
        grade: String(grade),
        description: description || null,
        objectives: objectives || [],
        activities: activities || [],
      },
    });
    res.status(201).json({ plan });
  } catch (err) {
    console.error("createLessonPlan error:", err);
    res.status(500).json({ error: "Failed to create lesson plan" });
  }
}

export async function deleteLessonPlan(req, res) {
  try {
    const { count } = await prisma.lessonPlan.deleteMany({
      where: { id: req.params.id, teacherId: req.user.id },
    });
    if (count === 0) return res.status(404).json({ error: "Lesson plan not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteLessonPlan error:", err);
    res.status(500).json({ error: "Failed to delete lesson plan" });
  }
}

// ─── Materials ───────────────────────────────────────────────────

export async function listMaterials(req, res) {
  try {
    const materials = await prisma.teacherMaterial.findMany({
      where: { teacherId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json({ materials });
  } catch (err) {
    console.error("listMaterials error:", err);
    res.status(500).json({ error: "Failed to fetch materials" });
  }
}

export async function createMaterial(req, res) {
  try {
    const { title, type, subject, grade, description, url } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
    const material = await prisma.teacherMaterial.create({
      data: {
        teacherId: req.user.id,
        title,
        type: type || "Document",
        subject,
        grade: Array.isArray(grade) ? grade.join(", ") : String(grade || "—"),
        description: description || null,
        url: url || null,
        status: "Pending",
      },
    });
    res.status(201).json({ material });
  } catch (err) {
    console.error("createMaterial error:", err);
    res.status(500).json({ error: "Failed to create material" });
  }
}

export async function deleteMaterial(req, res) {
  try {
    const { count } = await prisma.teacherMaterial.deleteMany({
      where: { id: req.params.id, teacherId: req.user.id },
    });
    if (count === 0) return res.status(404).json({ error: "Material not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteMaterial error:", err);
    res.status(500).json({ error: "Failed to delete material" });
  }
}

// ─── Classroom Activities ────────────────────────────────────────

export async function listActivities(req, res) {
  try {
    const activities = await prisma.classroomActivity.findMany({
      where: { teacherId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json({ activities });
  } catch (err) {
    console.error("listActivities error:", err);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
}

export async function createActivity(req, res) {
  try {
    const { title, gradeGroup, due } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
    const activity = await prisma.classroomActivity.create({
      data: {
        teacherId: req.user.id,
        title,
        gradeGroup: gradeGroup || "Grade 7",
        due: due || null,
      },
    });
    res.status(201).json({ activity });
  } catch (err) {
    console.error("createActivity error:", err);
    res.status(500).json({ error: "Failed to create activity" });
  }
}

export async function deleteActivity(req, res) {
  try {
    const { count } = await prisma.classroomActivity.deleteMany({
      where: { id: req.params.id, teacherId: req.user.id },
    });
    if (count === 0) return res.status(404).json({ error: "Activity not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteActivity error:", err);
    res.status(500).json({ error: "Failed to delete activity" });
  }
}

// ─── Quiz Creation ───────────────────────────────────────────────

export async function createQuiz(req, res) {
  try {
    const { title, subject, grade, pointsPerQuestion, passMark, questions } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
    if (!questions?.length) return res.status(400).json({ error: "At least one question required" });

    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
      "-" + Date.now();

    const quiz = await prisma.quiz.create({
      data: {
        id,
        title,
        subject,
        grade: parseInt(grade) || 7,
        createdById: req.user.id,
        pointsPerQuestion: parseInt(pointsPerQuestion) || 10,
        passMark: parseInt(passMark) || 60,
        questions: {
          create: questions.map((q, i) => ({
            order: i + 1,
            text: q.text,
            options: q.options,
            correct: q.correct,
            explanation: q.explanation || null,
          })),
        },
      },
      include: { questions: true },
    });
    res.status(201).json({ quiz });
  } catch (err) {
    console.error("createQuiz error:", err);
    res.status(500).json({ error: "Failed to create quiz" });
  }
}

export async function listMyQuizzes(req, res) {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { createdById: req.user.id },
      include: { _count: { select: { questions: true, attempts: true } } },
      orderBy: { title: "asc" },
    });
    res.json({ quizzes });
  } catch (err) {
    console.error("listMyQuizzes error:", err);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
}
