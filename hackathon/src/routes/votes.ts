import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/votes - Vote on an answer
router.post('/', authenticateToken, requireRole(['USER', 'ADMIN']), async (req: AuthRequest, res) => {
	const { answerId, value } = req.body;
	const userId = req.user!.userId;

	if (!answerId || (value !== 1 && value !== -1)) {
		return res.status(400).json({ error: 'answerId and value (1 or -1) are required' });
	}

	try {
		// Check if the answer exists
		const answer = await prisma.answer.findUnique({
			where: { id: answerId }
		});

		if (!answer) {
			return res.status(404).json({ error: 'Answer not found' });
		}

		// Use upsert to create or update the vote
		const vote = await prisma.vote.upsert({
			where: {
				answerId_userId: {
					answerId,
					userId
				}
			},
			update: {
				value
			},
			create: {
				answerId,
				userId,
				value
			},
			include: {
				answer: {
					select: {
						id: true,
						content: true
					}
				},
				user: {
					select: {
						id: true,
						username: true
					}
				}
			}
		});

		res.json(vote);
	} catch (error) {
		console.error('Error creating/updating vote:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router; 