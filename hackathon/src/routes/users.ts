import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/users/me/questions - Get current user's questions
router.get('/me/questions', authenticateToken, requireRole(['USER', 'ADMIN']), async (req: AuthRequest, res) => {
	const userId = req.user!.userId;

	try {
		const questions = await prisma.question.findMany({
			where: {
				authorId: userId
			},
			include: {
				tags: true,
				answers: {
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
			createdAt: question.createdAt,
			tags: question.tags,
			answerCount: question.answers.length,
			description: question.description
		}));

		res.json(questionsWithCounts);
	} catch (error) {
		console.error('Error fetching user questions:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// GET /api/users/me/answers - Get current user's answers
router.get('/me/answers', authenticateToken, requireRole(['USER', 'ADMIN']), async (req: AuthRequest, res) => {
	const userId = req.user!.userId;

	try {
		const answers = await prisma.answer.findMany({
			where: {
				authorId: userId
			},
			include: {
				votes: true,
				question: {
					select: {
						id: true,
						title: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		const answersWithVoteCounts = answers.map(answer => ({
			id: answer.id,
			content: answer.content,
			questionId: answer.questionId,
			questionTitle: answer.question.title,
			voteCount: answer.votes.reduce((sum, vote) => sum + vote.value, 0),
			createdAt: answer.createdAt
		}));

		res.json(answersWithVoteCounts);
	} catch (error) {
		console.error('Error fetching user answers:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// GET /api/users/me/comments - Get current user's comments
router.get('/me/comments', authenticateToken, requireRole(['USER', 'ADMIN']), async (req: AuthRequest, res) => {
	const userId = req.user!.userId;

	try {
		const comments = await prisma.comment.findMany({
			where: {
				authorId: userId
			},
			include: {
				answer: {
					include: {
						question: {
							select: {
								id: true,
								title: true
							}
						}
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		const commentsWithQuestionInfo = comments.map(comment => ({
			id: comment.id,
			content: comment.content,
			createdAt: comment.createdAt,
			questionId: comment.answer.question.id,
			questionTitle: comment.answer.question.title,
			answerId: comment.answerId
		}));

		res.json(commentsWithQuestionInfo);
	} catch (error) {
		console.error('Error fetching user comments:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// GET /api/users/me - Get current user's profile
router.get('/me', authenticateToken, requireRole(['USER', 'ADMIN']), async (req: AuthRequest, res) => {
	const userId = req.user!.userId;

	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				username: true,
				email: true,
				role: true,
				createdAt: true,
				_count: {
					select: {
						questions: true,
						answers: true
					}
				}
			}
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		const userProfile = {
			id: user.id,
			username: user.username,
			email: user.email,
			role: user.role,
			createdAt: user.createdAt,
			totalQuestions: user._count.questions,
			totalAnswers: user._count.answers
		};

		res.json(userProfile);
	} catch (error) {
		console.error('Error fetching user profile:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router; 