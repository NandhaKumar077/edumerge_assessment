const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const JWT_SECRET = process.env.JWT_SECRET || 'edumerge_secret_2026';

// Verify JWT token
exports.protect = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        logger.warn(`Unauthorized Access attempt at ${req.originalUrl} from ${req.ip}`, 'Security');
        return res.status(401).json({ error: 'Not authenticated. Please login.' });
    }

    try {
        const token = auth.split(' ')[1];
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        logger.error(`Token verification failed for IP: ${req.ip}`, 'Security');
        res.status(401).json({ error: 'Token invalid or expired. Please login again.' });
    }
};

// Allow only specific roles
exports.allow = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        logger.error(`Access Denied! User: ${req.user.email} (Role: ${req.user.role}) attempted to access ${req.originalUrl}. Required: ${roles.join(' or ')}`, 'Security');
        return res.status(403).json({ error: `Access denied. Required role: ${roles.join(' or ')}` });
    }
    next();
};
