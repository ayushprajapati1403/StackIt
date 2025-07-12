import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/answers - Submit an answer to a question
router.post('/', authenticateToken, requireRole(['USER', 'ADMIN']), async (req: AuthRequest, res) => {
	const { content, questionId } = req.body;
	const userId = req.user!.userId;

	if (!content || !questionId) {
		return res.status(400).json({ error: 'Content and questionId are required' });
	}

	try {
		// Check if the question exists
		const question = await prisma.question.findUnique({
			where: { id: questionId }
		});

		if (!question) {
			return res.status(404).json({ error: 'Question not found' });
		}

		// Create the answer
		const answer = await prisma.answer.create({
			data: {
				content,
				authorId: userId,
				questionId
			},
			include: {
				author: {
					select: {
						id: true,
						username: true
					}
				},
				question: {
					select: {
						id: true,
						title: true
					}
				}
			}
		});

		res.status(201).json(answer);
	} catch (error) {
		console.error('Error creating answer:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router; 