import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/questions - Create a new question
router.post('/', authenticateToken, requireRole(['USER', 'ADMIN']), async (req: AuthRequest, res) => {
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

// GET /api/questions/:id - Get specific question with full details
router.get('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const question = await prisma.question.findUnique({
			where: { id },
			include: {
				author: {
					select: {
						id: true,
						username: true,
						email: true
					}
				},
				tags: true,
				answers: {
					include: {
						author: {
							select: {
								id: true,
								username: true
							}
						},
						votes: true
					},
					orderBy: {
						createdAt: 'desc'
					}
				},
				accepted: {
					select: {
						id: true
					}
				}
			}
		});

		if (!question) {
			return res.status(404).json({ error: 'Question not found' });
		}

		// Calculate vote counts for each answer
		const questionWithVoteCounts = {
			...question,
			answers: question.answers.map(answer => ({
				...answer,
				voteCount: answer.votes.reduce((sum, vote) => sum + vote.value, 0)
			}))
		};

		res.json(questionWithVoteCounts);
	} catch (error) {
		console.error('Error fetching question:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// POST /api/questions/:id/accept - Accept an answer (question author only)
router.post('/:id/accept', authenticateToken, requireRole(['USER', 'ADMIN']), async (req: AuthRequest, res) => {
	const { id } = req.params;
	const { answerId } = req.body;
	const userId = req.user!.userId;

	if (!answerId) {
		return res.status(400).json({ error: 'answerId is required' });
	}

	try {
		// Check if the question exists and user is the author
		const question = await prisma.question.findUnique({
			where: { id },
			include: {
				author: {
					select: {
						id: true,
						username: true
					}
				}
			}
		});

		if (!question) {
			return res.status(404).json({ error: 'Question not found' });
		}

		if (question.author.id !== userId) {
			return res.status(403).json({ error: 'Only the question author can accept answers' });
		}

		// Check if the answer exists and belongs to this question
		const answer = await prisma.answer.findFirst({
			where: {
				id: answerId,
				questionId: id
			}
		});

		if (!answer) {
			return res.status(404).json({ error: 'Answer not found or does not belong to this question' });
		}

		// Update the question with the accepted answer
		const updatedQuestion = await prisma.question.update({
			where: { id },
			data: {
				acceptedId: answerId
			},
			include: {
				author: {
					select: {
						id: true,
						username: true,
						email: true
					}
				},
				tags: true,
				accepted: {
					select: {
						id: true,
						content: true,
						author: {
							select: {
								id: true,
								username: true
							}
						}
					}
				}
			}
		});

		res.json(updatedQuestion);
	} catch (error) {
		console.error('Error accepting answer:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router; 