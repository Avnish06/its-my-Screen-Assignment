const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const auth = require('../middleware/auth');

// Create Poll
router.post('/create', auth, async (req, res) => {
    try {
        const { question, options } = req.body;
        const newPoll = new Poll({
            question,
            options, // Frontend already sends [{ text, votes: 0 }, ...]
            creator: req.user.id
        });
        await newPoll.save();
        res.json(newPoll);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get all polls
router.get('/', async (req, res) => {
    try {
        const polls = await Poll.find().sort({ createdAt: -1 });
        res.json(polls);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get poll by ID
router.get('/:id', async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ msg: 'Poll not found' });
        res.json(poll);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Vote
router.post('/:id/vote', async (req, res) => {
    try {
        const { optionIndex } = req.body;
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ msg: 'Poll not found' });

        // Anti-abuse: Check if IP has already voted
        if (poll.votedIPs.includes(ip)) {
            return res.status(400).json({ msg: 'You have already voted on this poll' });
        }

        if (optionIndex < 0 || optionIndex >= poll.options.length) {
            return res.status(400).json({ msg: 'Invalid option' });
        }

        poll.options[optionIndex].votes += 1;
        poll.votedIPs.push(ip);
        await poll.save();

        // Emit update via Socket.io
        const io = req.app.get('io');
        io.to(poll._id.toString()).emit('pollUpdate', poll);

        res.json(poll);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
