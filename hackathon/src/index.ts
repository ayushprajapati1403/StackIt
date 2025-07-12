import { configDotenv } from 'dotenv';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { authenticateToken } from './middleware/auth';
const app = express();

dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
	res.send('Server running');
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
}); 