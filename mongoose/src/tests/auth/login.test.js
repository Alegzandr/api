import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../index';
import User from '../../models/User';

beforeAll(async () => {
    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash('Pa$$w0rd!', 10);
    await User.create({
        email: 'johndoe@gmail.com',
        username: 'johndoe',
        password: hashedPassword,
    });
});

describe('POST /api/login', () => {
    it('should return 400 if email is not provided', async () => {
        const response = await request(app).post('/api/login').send({
            email: '',
            password: 'Pa$$w0rd!',
        });

        expect(response.status).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
        const response = await request(app).post('/api/login').send({
            email: 'johndoe@gmail.com',
            password: '',
        });

        expect(response.status).toBe(400);
    });

    it('should return 400 if email is invalid', async () => {
        const response = await request(app).post('/api/login').send({
            email: 'johndoegmail.com',
            password: 'Pa$$w0rd!',
        });

        expect(response.status).toBe(400);
    });

    it('should return 400 if password is invalid', async () => {
        const response = await request(app).post('/api/login').send({
            email: 'johndoe@gmail.com',
            password: 'p',
        });

        expect(response.status).toBe(400);
    });

    it('should return 400 if email does not exist', async () => {
        const response = await request(app).post('/api/login').send({
            email: 'johndoe2@gmail.com',
            password: 'Pa$$w0rd!',
        });

        expect(response.status).toBe(400);
    });

    it('should return 400 if password is incorrect', async () => {
        const response = await request(app).post('/api/login').send({
            email: 'johndoe@gmail.com',
            password: 'pa$$w0rD!',
        });

        expect(response.status).toBe(400);
    });

    it('should return 200 with valid email and password', async () => {
        const response = await request(app).post('/api/login').send({
            email: 'johndoe@gmail.com',
            password: 'Pa$$w0rd!',
        });

        expect(response.status).toBe(200);
    });
});
