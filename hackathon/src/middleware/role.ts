import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';



export function requireRole(role: string) {
	return (req: AuthRequest, res: Response, next: NextFunction) => {
		if (!req.user || req.user.role !== role) {
			return res.status(403).json({ error: 'Forbidden: insufficient role' });
		}
		next();
	};
} 