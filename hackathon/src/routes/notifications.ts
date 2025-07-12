import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/notifications - Fetch unread notifications for the logged-in user
router.get('/', authenticateToken, requireRole(['USER', 'ADMIN']), async (req: AuthRequest, res) => {
	const userId = req.user!.userId;

	try {
		const notifications = await prisma.notification.findMany({
			where: {
				userId
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		res.json(notifications);
	} catch (error) {
		console.error('Error fetching notifications:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// POST /api/notifications/mark-read - Mark notifications as read
router.post('/mark-read', authenticateToken, requireRole(['USER', 'ADMIN']), async (req: AuthRequest, res) => {
	const userId = req.user!.userId;
	const { notificationIds } = req.body;

	if (!notificationIds || !Array.isArray(notificationIds)) {
		return res.status(400).json({ error: 'notificationIds array is required' });
	}

	try {
		// Mark specified notifications as read (only for the current user)
		const updatedNotifications = await prisma.notification.updateMany({
			where: {
				id: {
					in: notificationIds
				},
				userId // Ensure user can only mark their own notifications as read
			},
			data: {
				isRead: true
			}
		});

		res.json({
			message: 'Notifications marked as read',
			updatedCount: updatedNotifications.count
		});
	} catch (error) {
		console.error('Error marking notifications as read:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router; 