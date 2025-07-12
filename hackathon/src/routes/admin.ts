import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/admin/users - Get all users (ADMIN only)
router.get('/users', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				username: true,
				email: true,
				role: true,
				createdAt: true,
				updatedAt: true,
				_count: {
					select: {
						questions: true,
						answers: true,
						notifications: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		res.json(users);
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router; 