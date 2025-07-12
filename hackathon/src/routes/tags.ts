import express from 'express';
import { PrismaClient } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();
const prisma = new PrismaClient();

const GEMINI_API_KEY = 'AIzaSyCn8BNZHiFGntqbm6zsglzVyaJFfv7tkHw';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY, httpOptions: { apiVersion: 'v1alpha' } });

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

// POST /api/tags/suggest - Suggest tags using Gemini API
router.post('/suggest', async (req, res) => {
	const { title, description, filterExisting } = req.body;
	if (!title || !description) {
		return res.status(400).json({ error: 'title and description are required' });
	}

	try {
		const prompt = `Extract 3-5 relevant tags as a JSON array of strings for the following question.\nTitle: ${title}\nDescription: ${typeof description === 'string' ? description : JSON.stringify(description)}`;

		const response = await ai.models.generateContent({
			model: 'gemini-2.0-flash',
			contents: prompt
		});

		let tags: string[] = [];
		try {
			let text = response.text ?? '[]';
			text = text.replace(/```json|```/gi, '').trim();
			tags = JSON.parse(text);
		} catch (e) {
			return res.status(500).json({ error: 'Failed to parse tags from Gemini response', geminiData: response });
		}

		// Fetch all tags from DB
		const allDbTags = await prisma.tag.findMany({ select: { name: true } });
		const dbTagNames = allDbTags.map(t => t.name);

		// Filter Gemini tags to only those present in DB (case-insensitive)
		const filteredTags = tags.filter(tag =>
			dbTagNames.some(dbTag => dbTag.toLowerCase() === tag.toLowerCase())
		);

		// Optionally, return the DB's original casing for the matched tags
		const matchedTags = dbTagNames.filter(dbTag =>
			tags.some(tag => dbTag.toLowerCase() === tag.toLowerCase())
		);

		res.json({ tags: matchedTags });
	} catch (error) {
		console.error('Error suggesting tags:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

export default router; 