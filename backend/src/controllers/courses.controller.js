import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listCourses(req, res) {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "asc" },
      include: { lessons: { orderBy: { order: "asc" } } },
    });
    res.json({ courses });
  } catch (err) {
    console.error("listCourses error:", err);
    res.status(500).json({ error: "Failed to load courses" });
  }
}

export async function getCourseById(req, res) {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: { lessons: { orderBy: { order: "asc" } } },
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ course });
  } catch (err) {
    console.error("getCourseById error:", err);
    res.status(500).json({ error: "Failed to load course" });
  }
}

export async function getQuizById(req, res) {
  try {
    const { id } = req.params;
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: "asc" } } },
    });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.json({ quiz });
  } catch (err) {
    console.error("getQuizById error:", err);
    res.status(500).json({ error: "Failed to load quiz" });
  }
}

export async function createCourse(req, res) {
  try {
    const { id, title, description, subject, grade, lessons } = req.body;
    const course = await prisma.course.create({
      data: {
        id,
        title,
        description,
        subject,
        grade,
        lessons: {
          create: (lessons || []).map((lesson, index) => ({
            order: index,
            title: lesson.title,
            type: lesson.type,
            duration: lesson.duration ?? null,
            videoUrl: lesson.videoUrl ?? null,
            body: lesson.body ?? null,
            quizId: lesson.quizId ?? null,
          })),
        },
      },
      include: { lessons: true },
    });
    res.status(201).json({ course });
  } catch (err) {
    console.error("createCourse error:", err);
    res.status(500).json({ error: "Failed to create course" });
  }
}

export async function deleteCourse(req, res) {
  try {
    const { id } = req.params;
    await prisma.course.delete({ where: { id } });
    res.json({ message: "Course deleted" });
  } catch (err) {
    console.error("deleteCourse error:", err);
    res.status(500).json({ error: "Failed to delete course" });
  }
}

export async function submitQuizAttempt(req, res) {
  try {
    const { score, total, pointsEarned } = req.body;
    if (score === undefined || total === undefined || pointsEarned === undefined) {
      return res.status(400).json({ error: "score, total and pointsEarned are required" });
    }
    const quiz = await prisma.quiz.findUnique({ where: { id: req.params.id } });
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user.id,
        quizId: req.params.id,
        score,
        pointsEarned,
      },
    });
    const passed = Math.round((score / total) * 100) >= (quiz.passMark ?? 60);
    await createNotification(req.user.id, "quiz", passed ? `You passed the ${quiz.title} quiz! +${pointsEarned} points` : `You completed the ${quiz.title} quiz. Keep practising!`);
    res.status(201).json({ attempt });
  } catch (err) {
    console.error("submitQuizAttempt error:", err);
    res.status(500).json({ error: "Failed to save quiz attempt" });
  }
}
