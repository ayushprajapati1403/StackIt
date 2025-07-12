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
						title: true,
						authorId: true
					}
				}
			}
		});

		// Create notification for question owner (if not answering their own question)
		if (answer.question.authorId !== userId) {
			await prisma.notification.create({
				data: {
					type: 'ANSWERED',
					message: `${answer.author.username} answered your question: "${answer.question.title}"`,
					userId: answer.question.authorId
				}
			});
		}

		// Check for @mentions in the answer content and create MENTIONED notifications
		const contentString = JSON.stringify(answer.content);
		const mentionRegex = /@(\w+)/g;
		const mentions = contentString.match(mentionRegex);

		if (mentions) {
			for (const mention of mentions) {
				const username = mention.substring(1); // Remove @ symbol

				// Find user by username
				const mentionedUser = await prisma.user.findUnique({
					where: { username }
				});

				if (mentionedUser && mentionedUser.id !== userId) {
					await prisma.notification.create({
						data: {
							type: 'MENTIONED',
							message: `${answer.author.username} mentioned you in an answer to: "${answer.question.title}"`,
							userId: mentionedUser.id
						}
					});
				}
			}
		}

		res.status(201).json(answer);
	} catch (error) {
		console.error('Error creating answer:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// DELETE /api/answers/:id - Delete an answer (author only)
router.delete('/:id', authenticateToken, requireRole(['USER', 'ADMIN']), async (req: AuthRequest, res) => {
	const { id } = req.params;
	const userId = req.user!.userId;

	try {
		// Check if the answer exists and user is the author
		const answer = await prisma.answer.findUnique({
			where: { id },
			select: {
				id: true,
				content: true,
				authorId: true,
				question: {
					select: {
						id: true,
						title: true
					}
				}
			}
		});

		if (!answer) {
			return res.status(404).json({ error: 'Answer not found' });
		}

		if (answer.authorId !== userId) {
			return res.status(403).json({ error: 'Only the answer author can delete the answer' });
		}

		// Delete the answer (cascade will handle votes)
		await prisma.answer.delete({
			where: { id }
		});

		res.json({
			message: 'Answer deleted successfully',
			deletedAnswer: {
				id: answer.id,
				questionId: answer.question.id,
				questionTitle: answer.question.title
			}
		});
	} catch (error) {
		console.error('Error deleting answer:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router; 