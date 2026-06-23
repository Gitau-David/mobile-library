import jwt from 'jsonwebtoken';

/**
 * Protect middleware — validates the Bearer JWT on every protected route.
 * Attaches decoded payload to req.user on success.
 */
export const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized — no token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized — token is invalid or expired' });
    }
};
