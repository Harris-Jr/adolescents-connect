import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../utils/email.js";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

// POST /api/support/chat/start
export async function startChat(req, res) {
  try {
    const { guestName } = req.body;
    const userId = req.user?.id ?? null;

    const session = await prisma.chatSession.create({
      data: {
        userId,
        guestName: guestName ?? null,
        status: "pending",
        messages: {
          create: {
            from: "system",
            text: "Chat session started. A counsellor will be with you shortly.",
          },
        },
      },
      include: { messages: true },
    });

    // Email admin
    const userName = req.user
      ? `${req.user.firstName} ${req.user.lastName}`
      : (guestName ?? "Anonymous");

    await sendEmail({
      to: ADMIN_EMAIL,
      subject: "A-LINKS: New Live Chat Request",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#1a237e">New Live Chat Request</h2>
          <p><strong>From:</strong> ${userName}</p>
          <p><strong>Session ID:</strong> ${session.id}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p>
            <a href="${process.env.FRONTEND_URL || "http://localhost:8080"}/dashboard/admin?tab=chat&session=${session.id}"
               style="display:inline-block;padding:12px 24px;background:#1a237e;color:white;text-decoration:none;border-radius:8px">
              Open Chat
            </a>
          </p>
        </div>
      `,
      text: `New live chat request from ${userName}. Session ID: ${session.id}`,
    }).catch((err) => console.error("Chat notification email failed:", err));

    res.status(201).json({ session });
  } catch (err) {
    console.error("startChat error:", err);
    res.status(500).json({ error: "Failed to start chat session" });
  }
}

// POST /api/support/chat/:sessionId/message
export async function sendMessage(req, res) {
  try {
    const { text, from } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: "Message text is required" });

    const session = await prisma.chatSession.findUnique({
      where: { id: req.params.sessionId },
    });
    if (!session) return res.status(404).json({ error: "Session not found" });

    // Update status to active when counsellor replies
    const isAdmin = req.user?.role === "ADMIN" || req.user?.role === "PROGRAMME_ADMIN";
    if (isAdmin && session.status === "pending") {
      await prisma.chatSession.update({
        where: { id: session.id },
        data: { status: "active" },
      });
    }

    const message = await prisma.chatMessage.create({
      data: {
        sessionId: req.params.sessionId,
        from: isAdmin ? "counsellor" : "user",
        text: text.trim(),
      },
    });

    res.status(201).json({ message });
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
}

// GET /api/support/chat/:sessionId/messages
export async function getMessages(req, res) {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: req.params.sessionId },
      orderBy: { createdAt: "asc" },
    });
    res.json({ messages });
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
}

// GET /api/support/chat/sessions — admin only
export async function listSessions(req, res) {
  try {
    const sessions = await prisma.chatSession.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { firstName: true, lastName: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
        _count: { select: { messages: true } },
      },
    });
    res.json({ sessions });
  } catch (err) {
    console.error("listSessions error:", err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
}

// GET /api/support/services — referral directory (SRS §11)
// Optional filters: ?category=<title>&province=&district=&q=
export async function listReferralServices(req, res) {
  try {
    const { category, province, district, q } = req.query;

    const where = { isActive: true };
    if (province) where.province = province;
    if (district) where.district = district;
    if (category) where.category = { title: category };
    if (q?.trim()) {
      const term = q.trim();
      where.OR = [
        { name: { contains: term, mode: "insensitive" } },
        { location: { contains: term, mode: "insensitive" } },
        { category: { title: { contains: term, mode: "insensitive" } } },
      ];
    }

    const rows = await prisma.referralService.findMany({
      where,
      include: { category: { select: { title: true } } },
      orderBy: [{ is24Hours: "desc" }, { name: "asc" }],
    });

    const services = rows.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category.title,
      province: s.province,
      district: s.district,
      location: s.location,
      phone: s.phone,
      hours: s.hours,
      description: s.description,
      is24Hours: s.is24Hours,
    }));

    res.json({ services });
  } catch (err) {
    console.error("listReferralServices error:", err);
    res.status(500).json({ error: "Failed to fetch support services" });
  }
}

// GET /api/support/meta — categories + province/district options for filters
export async function listSupportMeta(_req, res) {
  try {
    const [categories, services] = await Promise.all([
      prisma.supportCategory.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, title: true, description: true },
      }),
      prisma.referralService.findMany({
        where: { isActive: true },
        select: { province: true, district: true },
      }),
    ]);

    // Build sorted province list + province→districts map from live data
    const districtsByProvince = {};
    for (const { province, district } of services) {
      if (!districtsByProvince[province]) districtsByProvince[province] = new Set();
      if (district) districtsByProvince[province].add(district);
    }
    const provinces = Object.keys(districtsByProvince).sort();
    const districts = {};
    for (const p of provinces) {
      districts[p] = [...districtsByProvince[p]].sort();
    }

    res.json({ categories, provinces, districts });
  } catch (err) {
    console.error("listSupportMeta error:", err);
    res.status(500).json({ error: "Failed to fetch support metadata" });
  }
}
