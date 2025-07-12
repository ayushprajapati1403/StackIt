import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';



export function requireRole(roles: string | string[]) {
	return (req: AuthRequest, res: Response, next: NextFunction) => {
		const allowedRoles = Array.isArray(roles) ? roles : [roles];

		if (!req.user || !allowedRoles.includes(req.user.role)) {
			return res.status(403).json({ error: 'Forbidden: insufficient role' });
		}
		next();
	};
} 