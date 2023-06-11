import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        match: [
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
            'Please fill a valid email address',
        ],
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true },
});

userSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.updatedAt = new Date();
    }
    next();
});

export default mongoose.model('User', userSchema);
