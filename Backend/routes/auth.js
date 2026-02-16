const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, fullName, password } = req.body;
        console.log('Registration attempt:', { username, email, fullName });

        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            console.log('User already exists:', user.username === username ? 'username' : 'email');
            return res.status(400).json({ msg: 'User with this username or email already exists' });
        }

        user = new User({ username, email, fullName, password });
        await user.save();
        console.log('User registered successfully:', username);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email, fullName: user.fullName } });
    } catch (err) {
        console.error('Registration error:', err);
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Username or Email already exists' });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: 'Validation Error: ' + Object.values(err.errors).map(e => e.message).join(', ') });
        }
        res.status(500).send('Server Error: ' + err.message);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email, fullName: user.fullName } });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


module.exports = router;
