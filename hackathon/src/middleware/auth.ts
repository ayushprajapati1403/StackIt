import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export interface AuthRequest extends Request {
	user?: {
		userId: string;
		role: string;
	};
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
	const authHeader = req.headers['authorization'];
	console.log("hello");
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) {
		console.log("hello");
		return res.status(401).json({ error: 'No token provided ' });
	}
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
		req.user = { userId: decoded.userId, role: decoded.role };
		next();
	} catch (err) {
		return res.status(403).json({ error: 'Invalid or expired token' });
	}
} 