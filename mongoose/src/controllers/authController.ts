import { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User';

dotenv.config();

const authController = {
    register: async (request: Request, response: Response) => {
        try {
            const existingUser = await User.findOne({
                email: request.body.email,
            });
            if (existingUser) {
                return response
                    .status(400)
                    .json({ error: 'User already exists' });
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
