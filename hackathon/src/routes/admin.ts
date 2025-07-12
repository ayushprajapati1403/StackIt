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

// GET /api/admin/users - List all users (ADMIN only)
router.get('/users', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				username: true,
				email: true,
				role: true,
				createdAt: true
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

// GET /api/admin/users/:id - Get detailed user info (ADMIN only)
router.get('/users/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	const { id } = req.params;

	try {
		const user = await prisma.user.findUnique({
			where: { id },
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
						notifications: true,
						Vote: true,
						Comment: true
					}
				}
			}
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		res.json(user);
	} catch (error) {
		console.error('Error fetching user details:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// DELETE /api/admin/users/:id - Delete user and cascade delete all data (ADMIN only)
router.delete('/users/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	const { id } = req.params;
	const adminUserId = req.user!.userId;

	try {
		// Prevent admin from deleting themselves
		if (id === adminUserId) {
			return res.status(400).json({ error: 'Cannot delete your own account' });
		}

		// Check if user exists
		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				username: true,
				email: true,
				role: true
			}
		});

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Delete the user (cascade will handle all related data)
		await prisma.user.delete({
			where: { id }
		});

		res.json({
			message: 'User deleted successfully',
			deletedUser: {
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role
			}
		});
	} catch (error) {
		console.error('Error deleting user:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// GET /api/admin/questions - List all questions (ADMIN only)
router.get('/questions', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	try {
		const questions = await prisma.question.findMany({
			select: {
				id: true,
				title: true,
				acceptedId: true,
				createdAt: true,
				author: {
					select: {
						id: true,
						username: true,
						email: true
					}
				},
				tags: {
					select: {
						id: true,
						name: true
					}
				}
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		res.json(questions);
	} catch (error) {
		console.error('Error fetching questions:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// DELETE /api/admin/questions/:id - Delete question and all related data (ADMIN only)
router.delete('/questions/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	const { id } = req.params;

	try {
		// Check if question exists
		const question = await prisma.question.findUnique({
			where: { id },
			select: {
				id: true,
				title: true,
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

		// Delete the question (cascade will handle answers, comments, and votes)
		await prisma.question.delete({
			where: { id }
		});

		res.json({
			message: 'Question deleted successfully',
			deletedQuestion: {
				id: question.id,
				title: question.title,
				authorUsername: question.author.username
			}
		});
	} catch (error) {
		console.error('Error deleting question:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// PUT /api/admin/questions/:id - Edit question (ADMIN only)
router.put('/questions/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	const { id } = req.params;
	const { title, description, tags } = req.body;

	if (!title || !description) {
		return res.status(400).json({ error: 'Title and description are required' });
	}

	try {
		// Check if question exists
		const question = await prisma.question.findUnique({
			where: { id },
			include: {
				tags: true
			}
		});

		if (!question) {
			return res.status(404).json({ error: 'Question not found' });
		}

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

		// Update the question
		const updatedQuestion = await prisma.question.update({
			where: { id },
			data: {
				title,
				description,
				tags: {
					set: [], // Disconnect all existing tags
					connect: tagIds.map(id => ({ id })) // Connect new tags
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

		res.json(updatedQuestion);
	} catch (error) {
		console.error('Error updating question:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// GET /api/admin/answers - List all answers (ADMIN only)
router.get('/answers', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	try {
		const answers = await prisma.answer.findMany({
			select: {
				id: true,
				content: true,
				createdAt: true,
				updatedAt: true,
				author: {
					select: {
						id: true,
						username: true,
						email: true
					}
				},
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

		res.json(answers);
	} catch (error) {
		console.error('Error fetching answers:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// DELETE /api/admin/answers/:id - Delete answer and all related data (ADMIN only)
router.delete('/answers/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	const { id } = req.params;

	try {
		// Check if answer exists
		const answer = await prisma.answer.findUnique({
			where: { id },
			select: {
				id: true,
				content: true,
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

		// Delete the answer (cascade will handle comments and votes)
		await prisma.answer.delete({
			where: { id }
		});

		res.json({
			message: 'Answer deleted successfully',
			deletedAnswer: {
				id: answer.id,
				questionId: answer.question.id,
				questionTitle: answer.question.title,
				authorUsername: answer.author.username
			}
		});
	} catch (error) {
		console.error('Error deleting answer:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// PUT /api/admin/answers/:id - Update answer content (ADMIN only)
router.put('/answers/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	const { id } = req.params;
	const { content } = req.body;

	if (!content) {
		return res.status(400).json({ error: 'Content is required' });
	}

	try {
		// Check if answer exists
		const answer = await prisma.answer.findUnique({
			where: { id }
		});

		if (!answer) {
			return res.status(404).json({ error: 'Answer not found' });
		}

		// Update the answer
		const updatedAnswer = await prisma.answer.update({
			where: { id },
			data: {
				content
			},
			include: {
				author: {
					select: {
						id: true,
						username: true,
						email: true
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

		res.json(updatedAnswer);
	} catch (error) {
		console.error('Error updating answer:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// GET /api/admin/comments - List all comments (ADMIN only)
router.get('/comments', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	try {
		const comments = await prisma.comment.findMany({
			select: {
				id: true,
				content: true,
				createdAt: true,
				author: {
					select: {
						id: true,
						username: true,
						email: true
					}
				},
				answer: {
					select: {
						id: true,
						content: true,
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

		res.json(comments);
	} catch (error) {
		console.error('Error fetching comments:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// DELETE /api/admin/comments/:id - Delete comment (ADMIN only)
router.delete('/comments/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	const { id } = req.params;

	try {
		// Check if comment exists
		const comment = await prisma.comment.findUnique({
			where: { id },
			select: {
				id: true,
				content: true,
				author: {
					select: {
						id: true,
						username: true
					}
				},
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
				answerId: comment.answer.id,
				authorUsername: comment.author.username
			}
		});
	} catch (error) {
		console.error('Error deleting comment:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// GET /api/admin/stats - Get system statistics (ADMIN only)
router.get('/stats', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	try {
		const [
			userCount,
			questionCount,
			answerCount,
			commentCount,
			voteCount,
			tagCount,
			notificationCount
		] = await Promise.all([
			prisma.user.count(),
			prisma.question.count(),
			prisma.answer.count(),
			prisma.comment.count(),
			prisma.vote.count(),
			prisma.tag.count(),
			prisma.notification.count()
		]);

		const stats = {
			users: userCount,
			questions: questionCount,
			answers: answerCount,
			comments: commentCount,
			votes: voteCount,
			tags: tagCount,
			notifications: notificationCount,
			total: userCount + questionCount + answerCount + commentCount + voteCount + tagCount + notificationCount
		};

		res.json(stats);
	} catch (error) {
		console.error('Error fetching stats:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// GET /api/admin/recent-activity - Get latest activity (ADMIN only)
router.get('/recent-activity', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	try {
		const [recentQuestions, recentAnswers, recentComments] = await Promise.all([
			prisma.question.findMany({
				take: 10,
				select: {
					id: true,
					title: true,
					createdAt: true,
					author: {
						select: {
							username: true
						}
					}
				},
				orderBy: {
					createdAt: 'desc'
				}
			}),
			prisma.answer.findMany({
				take: 10,
				select: {
					id: true,
					content: true,
					createdAt: true,
					author: {
						select: {
							username: true
						}
					},
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
			}),
			prisma.comment.findMany({
				take: 10,
				select: {
					id: true,
					content: true,
					createdAt: true,
					author: {
						select: {
							username: true
						}
					},
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
				},
				orderBy: {
					createdAt: 'desc'
				}
			})
		]);

		const recentActivity = {
			questions: recentQuestions,
			answers: recentAnswers,
			comments: recentComments
		};

		res.json(recentActivity);
	} catch (error) {
		console.error('Error fetching recent activity:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// GET /api/admin/tags - List all tags with usage count (ADMIN only)
router.get('/tags', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	try {
		const tags = await prisma.tag.findMany({
			include: {
				_count: {
					select: {
						questions: true
					}
				}
			},
			orderBy: {
				name: 'asc'
			}
		});

		const tagsWithUsage = tags.map(tag => ({
			id: tag.id,
			name: tag.name,
			usageCount: tag._count.questions
		}));

		res.json(tagsWithUsage);
	} catch (error) {
		console.error('Error fetching tags:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// POST /api/admin/tags - Create a new tag (ADMIN only)
router.post('/tags', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	const { name } = req.body;

	if (!name || typeof name !== 'string' || name.trim().length === 0) {
		return res.status(400).json({ error: 'Tag name is required and must be a non-empty string' });
	}

	try {
		// Check if tag already exists
		const existingTag = await prisma.tag.findUnique({
			where: { name: name.trim() }
		});

		if (existingTag) {
			return res.status(409).json({ error: 'Tag already exists' });
		}

		const newTag = await prisma.tag.create({
			data: {
				name: name.trim()
			}
		});

		res.status(201).json(newTag);
	} catch (error) {
		console.error('Error creating tag:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// PUT /api/admin/tags/:id - Update tag name (ADMIN only)
router.put('/tags/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	const { id } = req.params;
	const { name } = req.body;

	if (!name || typeof name !== 'string' || name.trim().length === 0) {
		return res.status(400).json({ error: 'Tag name is required and must be a non-empty string' });
	}

	try {
		// Check if tag exists
		const existingTag = await prisma.tag.findUnique({
			where: { id }
		});

		if (!existingTag) {
			return res.status(404).json({ error: 'Tag not found' });
		}

		// Check if new name already exists (excluding current tag)
		const duplicateTag = await prisma.tag.findFirst({
			where: {
				name: name.trim(),
				id: { not: id }
			}
		});

		if (duplicateTag) {
			return res.status(409).json({ error: 'Tag name already exists' });
		}

		const updatedTag = await prisma.tag.update({
			where: { id },
			data: {
				name: name.trim()
			}
		});

		res.json(updatedTag);
	} catch (error) {
		console.error('Error updating tag:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// DELETE /api/admin/tags/:id - Delete tag (ADMIN only)
router.delete('/tags/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res) => {
	const { id } = req.params;

	try {
		// Check if tag exists
		const tag = await prisma.tag.findUnique({
			where: { id },
			include: {
				_count: {
					select: {
						questions: true
					}
				}
			}
		});

		if (!tag) {
			return res.status(404).json({ error: 'Tag not found' });
		}

		// Delete the tag (cascade will handle question relationships)
		await prisma.tag.delete({
			where: { id }
		});

		res.json({
			message: 'Tag deleted successfully',
			deletedTag: {
				id: tag.id,
				name: tag.name,
				usageCount: tag._count.questions
			}
		});
	} catch (error) {
		console.error('Error deleting tag:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router; 