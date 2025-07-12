import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/tags - Get all tags with question counts
router.get('/', async (req, res) => {
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

		const tagsWithCounts = tags.map(tag => ({
			id: tag.id,
			name: tag.name,
			questionCount: tag._count.questions
		}));

		res.json(tagsWithCounts);
	} catch (error) {
		console.error('Error fetching tags:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router; 