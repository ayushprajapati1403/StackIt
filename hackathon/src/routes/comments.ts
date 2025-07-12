import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/comments - Create a comment on an answer
router.post('/', authenticateToken, requireRole(['USER', 'ADMIN']), async (req: AuthRequest, res) => {
	const { content, answerId } = req.body;
	const userId = req.user!.userId;

	if (!content || !answerId) {
		return res.status(400).json({ error: 'Content and answerId are required' });
	}

	try {
		// Check if the answer exists
		const answer = await prisma.answer.findUnique({
			where: { id: answerId },
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

		if (!answer) {
			return res.status(404).json({ error: 'Answer not found' });
		}

		// Create the comment
		const comment = await prisma.comment.create({
			data: {
				content,
				authorId: userId,
				answerId
			},
			include: {
				author: {
					select: {
						id: true,
						username: true
					}
				},
				answer: {
					select: {
						id: true,
						content: true
					}
				}
			}
		});

		// Create notification for answer author (if not commenting on their own answer)
		if (answer.author.id !== userId) {
			await prisma.notification.create({
				data: {
					type: 'COMMENTED',
					message: `${comment.author.username} commented on your answer to: "${answer.question.title}"`,
					userId: answer.author.id
				}
			});
		}

		// Check for @mentions in the comment content and create MENTIONED notifications
		const contentString = JSON.stringify(comment.content);
		const mentionRegex = /@[\w]+/g;
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
							message: `You were mentioned in a comment by @${comment.author.username}`,
							userId: mentionedUser.id
						}
					});
				}
			}
		}

		res.status(201).json(comment);
	} catch (error) {
		console.error('Error creating comment:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// DELETE /api/comments/:id - Delete a comment (author only)
router.delete('/:id', authenticateToken, requireRole(['USER', 'ADMIN']), async (req: AuthRequest, res) => {
	const { id } = req.params;
	const userId = req.user!.userId;

	try {
		// Check if the comment exists and user is the author
		const comment = await prisma.comment.findUnique({
			where: { id },
			select: {
				id: true,
				content: true,
				authorId: true,
				answer: {
					select: {
						id: true,
						question: {
							select: {
								id: true,
								title: true
							}
						}
					}
				}
			}
		});

		if (!comment) {
			return res.status(404).json({ error: 'Comment not found' });
		}

		if (comment.authorId !== userId) {
			return res.status(403).json({ error: 'Only the comment author can delete the comment' });
		}

		// Delete the comment
		await prisma.comment.delete({
			where: { id }
		});

		res.json({
			message: 'Comment deleted successfully',
			deletedComment: {
				id: comment.id,
				questionId: comment.answer.question.id,
				questionTitle: comment.answer.question.title,
				answerId: comment.answer.id
			}
		});
	} catch (error) {
		console.error('Error deleting comment:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router; 