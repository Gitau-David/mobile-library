import pool   from '../config/db.js';
import bcrypt  from 'bcrypt';
import jwt     from 'jsonwebtoken';

const DEMO_USER = {
    id: 1,
    username: 'librarian',
    name: 'Demo Librarian',
    role: 'admin',
    password: '$2b$10$0zC0u0Zb6YVNN4K5x5vD2eM0P4M6Q8V5f2h9a1cV4d7M3x7Y0VfI2',
};

// POST /api/auth/login
export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        if (username === DEMO_USER.username && password === 'password123') {
            const token = jwt.sign(
                { id: DEMO_USER.id, role: DEMO_USER.role },
                process.env.JWT_SECRET || 'fallback_secret',
                { expiresIn: '12h' }
            );

            return res.json({
                token,
                user: {
                    id: DEMO_USER.id,
                    username: DEMO_USER.username,
                    name: DEMO_USER.name,
                    role: DEMO_USER.role,
                },
            });
        }

        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ?', [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user    = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '12h' }
        );

        return res.json({
            token,
            user: { id: user.id, username: user.username, name: user.name, role: user.role },
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET /api/auth/session  (protected)
export const verifySession = async (req, res) => {
    try {
        if (req.user?.id === DEMO_USER.id) {
            return res.json({
                id: DEMO_USER.id,
                username: DEMO_USER.username,
                name: DEMO_USER.name,
                role: DEMO_USER.role,
            });
        }

        const [rows] = await pool.query(
            'SELECT id, username, name, role FROM users WHERE id = ?', [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
