import { Request, Response } from 'express';
import User from '../models/User';

const userController = {
    createUser: async (request: Request, response: Response) => {
        try {
            const user = new User(request.body);
            await user.save();
            response.status(201).json(user);
        } catch (error: any) {
            response.status(500).json({ error: error.message });
        }
    },

    getAllUsers: async (request: Request, response: Response) => {
        try {
            const users = await User.find();
            response.status(200).json(users);
        } catch (error: any) {
            response.status(500).json({ error: error.message });
        }
    },

    getUserById: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const user = await User.findById(id);

            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }
            response.status(200).json(user);
        } catch (error: any) {
            response.status(500).json({ error: error.message });
        }
    },

    updateUser: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const user = await User.findByIdAndUpdate(id, request.body, {
                new: true,
            });

            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }
            response.status(200).json(user);
        } catch (error: any) {
            response.status(500).json({ error: error.message });
        }
    },

    deleteUser: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;
            const user = await User.findByIdAndDelete(id);

            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }

            response.status(200).json({ message: 'User deleted successfully' });
        } catch (error: any) {
            response.status(500).json({ error: error.message });
        }
    },
};

export default userController;
