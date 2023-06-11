import express from 'express';
import dotenv from 'dotenv';
import { connect } from 'mongoose';

dotenv.config();

const app = express();
const port: number = Number(process.env.SERVER_PORT) || 3000;

app.use(express.json());

connect(process.env.DATABASE_URL!, {});

app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
