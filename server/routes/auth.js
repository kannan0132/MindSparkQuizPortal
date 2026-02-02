import express from 'express';
import jwt from 'jsonwebtoken';
import Account from '../models/Account.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Check if user exists
        const existingUser = await Account.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Create new account
        const account = new Account({
            username,
            password,
            email
        });

        await account.save();

        // Generate token
        const token = jwt.sign(
            { id: account._id, username: account.username },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: account._id,
                username: account.username
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const account = await Account.findOne({ username });
        if (!account) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await account.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: account._id, username: account.username },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: account._id,
                username: account.username
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
