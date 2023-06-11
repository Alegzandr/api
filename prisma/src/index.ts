import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
dotenv.config();

const app = express();
const port: number = Number(process.env.SERVER_PORT) || 3000;

app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
