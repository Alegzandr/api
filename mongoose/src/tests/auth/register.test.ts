import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../index';
import User from '../../models/User';

beforeEach(async () => {
    await User.deleteMany({});
});

describe('POST /api/register', () => {
    it('should return 400 if email is not provided', async () => {
        const response = await request(app).post('/api/register').send({
            email: '',
            username: 'johndoe',
            password: 'Pa$$w0rd!',
        });

        expect(response.status).toBe(400);
    });

    it('should return 400 if username is not provided', async () => {
        const response = await request(app).post('/api/register').send({
            email: 'johndoe@gmail.com',
            username: '',
            password: 'Pa$$w0rd!',
        });

        expect(response.status).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
        const response = await request(app).post('/api/register').send({
            email: 'johndoe@gmail.com',
            username: 'johndoe',
            password: '',
        });

        expect(response.status).toBe(400);
    });

    it('should return 400 if email is invalid', async () => {
        const response = await request(app).post('/api/register').send({
            email: 'johndoegmail.com',
            username: 'johndoe',
            password: 'Pa$$w0rd!',
        });

        expect(response.status).toBe(400);
    });

    it('should return 400 if username is invalid', async () => {
        const response = await request(app).post('/api/register').send({
            email: 'johndoe@gmail.com',
            username: 'johndoe!',
            password: 'Pa$$w0rd!',
        });

        expect(response.status).toBe(400);
    });

    it('should return 400 if password is invalid', async () => {
        const response = await request(app).post('/api/register').send({
            email: 'johndoe@gmail.com',
            username: 'johndoe',
            password: 'p',
        });

        expect(response.status).toBe(400);
    });

    it('should return 400 if email is already taken', async () => {
        await User.create({
            email: 'johndoe@gmail.com',
            username: 'johndoe',
            password: 'Pa$$w0rd!',
        });

        const response = await request(app).post('/api/register').send({
            email: 'johndoe@gmail.com',
            username: 'johndoe2',
            password: 'Pa$$w0rd!',
        });

        expect(response.status).toBe(400);
    });

    it('should return 400 if username is already taken', async () => {
        await User.create({
            email: 'johndoe@gmail.com',
            username: 'johndoe',
            password: 'Pa$$w0rd!',
        });

        const response = await request(app).post('/api/register').send({
            email: 'johndoe2@gmail.com',
            username: 'johndoe',
            password: 'Pa$$w0rd!',
        });

        expect(response.status).toBe(400);
    });

    it('should return 201 if user is created', async () => {
        const response = await request(app).post('/api/register').send({
            email: 'johndoe@gmail.com',
            username: 'johndoe',
            password: 'Pa$$w0rd!',
        });

        expect(response.status).toBe(201);
    });
});
