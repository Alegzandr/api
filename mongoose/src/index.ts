import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connect } from 'mongoose';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const port: number = Number(process.env.SERVER_PORT) || 3000;

app.use(cors());
app.use(express.json());

connect(process.env.DATABASE_URL!, {});

app.use('/api', authRoutes);
app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
