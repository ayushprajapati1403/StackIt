import { configDotenv } from 'dotenv';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import questionsRoutes from './routes/questions';
import answersRoutes from './routes/answers';
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
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
	res.send('Server running');
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
}); 