import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import app from '../../index';
import User from '../../models/User';

dotenv.config();

let refreshToken: string;

beforeEach(async () => {
    await User.deleteMany({});

    await User.create({
        email: 'johndoe@gmail.com',
        username: 'johndoe',
        password: 'Pa$$w0rd!',
    });

    const user = await User.findOne({ email: 'johndoe@gmail.com' });
    refreshToken = jwt.sign(
        { id: user?._id },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: '5y' }
    );
});

describe('POST /api/refresh', () => {
    it('should return 403 if refresh token is not provided', async () => {
        const response = await request(app).post('/api/refresh');

        expect(response.status).toBe(403);
    });

    it('should return 403 if refresh token is invalid', async () => {
        const response = await request(app)
            .post('/api/refresh')
            .send({ token: 'invalid_token' });

        expect(response.status).toBe(403);
    });

    it('should return 200 with new access token if refresh token is valid', async () => {
        const response = await request(app)
            .post('/api/refresh')
            .send({ token: refreshToken });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });
});
