import { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User';

dotenv.config();

const authController = {
    register: async (request: Request, response: Response) => {
        try {
            if (
                !request.body.email ||
                !request.body.username ||
                !request.body.password
            ) {
                return response
                    .status(400)
                    .json({ error: 'Please fill all required fields' });
            }

            const existingUser =
                (await User.findOne({
                    email: request.body.email,
                })) ||
                (await User.findOne({ username: request.body.username }));
            if (existingUser) {
                return response
                    .status(400)
                    .json({ error: 'User already exists' });
            }

            const emailRegex = new RegExp(
                /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
            );
            if (!emailRegex.test(request.body.email)) {
                return response
                    .status(400)
                    .json({ error: 'Please enter a valid email' });
            }

            const usernameRegex = new RegExp(/^[a-zA-Z0-9]+$/);
            if (!usernameRegex.test(request.body.username)) {
                return response.status(400).json({
                    error: 'Username must contain only alphanumeric characters',
                });
            }

            const passwordRegex = new RegExp(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
            );
            if (!passwordRegex.test(request.body.password)) {
                return response.status(400).json({
                    error: 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character',
                });
            }

            const hashedPassword = await bcrypt.hash(request.body.password, 10);
            const user = new User({
                ...request.body,
                password: hashedPassword,
            });
            await user.save();
            response.status(201).json(user);
        } catch (error: any) {
            response.status(500).json({ error: error.message });
        }
    },
    login: async (request: Request, response: Response) => {
        try {
            const { email, password } = request.body;

            if (!email || !password) {
                return response
                    .status(400)
                    .json({ error: 'Please fill all required fields' });
            }

            const emailRegex = new RegExp(
                /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
            );
            if (!emailRegex.test(email)) {
                return response
                    .status(400)
                    .json({ error: 'Please enter a valid email' });
            }

            const passwordRegex = new RegExp(
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
            );
            if (!passwordRegex.test(password)) {
                return response.status(400).json({
                    error: 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character',
                });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return response
                    .status(400)
                    .json({ error: 'User does not exist' });
            }

            const isValidPassword = await bcrypt.compare(
                password,
                user.password
            );
            if (!isValidPassword) {
                return response.status(400).json({ error: 'Invalid password' });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
                expiresIn: '1h',
            });

            const refreshToken = jwt.sign(
                { id: user._id },
                process.env.REFRESH_TOKEN_SECRET!,
                {
                    expiresIn: '5y',
                }
            );

            return response
                .status(200)
                .json({ token, refreshToken, userId: user._id });
        } catch (error: any) {
            response.status(500).json({ error: error.message });
        }
    },

    refresh: async (request: Request, response: Response) => {
        try {
            const refreshToken = request.body.token;
            if (!refreshToken) {
                return response.sendStatus(403);
            }
            jwt.verify(
                refreshToken,
                process.env.JWT_SECRET!,
                (error: any, user: any) => {
                    if (error) {
                        return response.sendStatus(403);
                    }
                    const token = jwt.sign(
                        { user: user.id },
                        process.env.JWT_SECRET!,
                        { expiresIn: '1h' }
                    );
                    response.json({ token: token });
                }
            );
        } catch (error: any) {
            response.status(500).json({ error: error.message });
        }
    },
};

export default authController;
