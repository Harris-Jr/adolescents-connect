import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Shared helper — call this from other controllers to create notifications
export async function createNotification(userId, type, message) {
  try {
    await prisma.notification.create({ data: { userId, type, message } });
  } catch (err) {
    console.error("createNotification error:", err);
  }
}

// GET /api/notifications
export async function listNotifications(req, res) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const unreadCount = notifications.filter((n) => !n.read).length;
    res.json({ notifications, unreadCount });
  } catch (err) {
    console.error("listNotifications error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}

// PATCH /api/notifications/:id/read
export async function markRead(req, res) {
  try {
    await prisma.notification.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (err) {
    console.error("markRead error:", err);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
}

// PATCH /api/notifications/read-all
export async function markAllRead(req, res) {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, read: false },
      data: { read: true },
    });
    res.json({ success: true });
  } catch (err) {
    console.error("markAllRead error:", err);
    res.status(500).json({ error: "Failed to mark all as read" });
  }
}
