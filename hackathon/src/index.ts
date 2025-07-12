import { configDotenv } from 'dotenv';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import questionsRoutes from './routes/questions';
import answersRoutes from './routes/answers';
import votesRoutes from './routes/votes';
import tagsRoutes from './routes/tags';
import notificationsRoutes from './routes/notifications';
import usersRoutes from './routes/users';
import adminRoutes from './routes/admin';
import { authenticateToken } from './middleware/auth';
import { requireRole } from './middleware/role';
const app = express();

dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/answers', answersRoutes);
app.use('/api/votes', votesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
	res.send('Server running');
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
}); 