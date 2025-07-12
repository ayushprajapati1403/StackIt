import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Signup route
router.post('/signup', async (req, res) => {
	const { username, email, password, role = 'USER' } = req.body;

	if (!username || !email || !password) {
		return res.status(400).json({ error: 'Username, email and password are required' });
	}
	try {
		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [
					{ email },
					{ username }
				]
			}
		});
		if (existingUser) {
			return res.status(409).json({ error: 'User already exists' });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				username,
				email,
				passwordHash: hashedPassword,
				role
			},
		});
		const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
		res.status(201).json({ token: `Bearer ${token}` });
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Login route
router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: 'Email and password are required' });
	}
	try {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		const isMatch = await bcrypt.compare(password, user.passwordHash);
		if (!isMatch) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
		res.json({ token: `Bearer ${token}` });
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Logout route (stateless, frontend should clear token)
router.post('/logout', (req, res) => {
	// Optionally, you could implement token blacklisting here
	res.json({ message: 'Logged out successfully' });
});

export default router; 