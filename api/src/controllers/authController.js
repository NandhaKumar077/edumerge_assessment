const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'edumerge_secret_2026';

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: 'Email already registered' });

        const user = await User.create({ name, email, password, role });
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid email or password' });

        const match = await user.matchPassword(password);
        if (!match) return res.status(401).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get current user (me)
exports.me = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
};
