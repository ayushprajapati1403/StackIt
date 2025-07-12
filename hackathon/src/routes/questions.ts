import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/questions - Create a new question
router.post('/', authenticateToken, requireRole('USER'), async (req: AuthRequest, res) => {
	const { title, description, tags } = req.body;
	const userId = req.user!.userId;

	if (!title || !description) {
		return res.status(400).json({ error: 'Title and description are required' });
	}

	try {
		// Handle tags - create new ones if they don't exist
		const tagIds: string[] = [];

		if (tags && Array.isArray(tags)) {
			for (const tagName of tags) {
				let tag = await prisma.tag.findUnique({
					where: { name: tagName }
				});

				if (!tag) {
					tag = await prisma.tag.create({
						data: { name: tagName }
					});
				}

				tagIds.push(tag.id);
			}
		}

		// Create the question with tags
		const question = await prisma.question.create({
			data: {
				title,
				description,
				authorId: userId,
				tags: {
					connect: tagIds.map(id => ({ id }))
				}
			},
			include: {
				author: {
					select: {
						id: true,
						username: true,
						email: true
					}
				},
				tags: true
			}
		});

		res.status(201).json(question);
	} catch (error) {
		console.error('Error creating question:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// GET /api/questions - Fetch all questions
router.get('/', async (req, res) => {
	try {
		const questions = await prisma.question.findMany({
			include: {
				author: {
					select: {
						username: true
					}
				},
				tags: true,
				answers: {
					select: {
						id: true
					}
				},
				accepted: {
					select: {
						id: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		const questionsWithCounts = questions.map(question => ({
			id: question.id,
			title: question.title,
			description: question.description,
			authorUsername: question.author.username,
			tags: question.tags,
			createdAt: question.createdAt,
			totalAnswers: question.answers.length,
			acceptedAnswerId: question.accepted?.id || null
		}));

		res.json(questionsWithCounts);
	} catch (error) {
		console.error('Error fetching questions:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router; 