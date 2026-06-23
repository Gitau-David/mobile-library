import express      from 'express';
import cors         from 'cors';
import dotenv       from 'dotenv';

import authRoutes        from './routes/authRoutes.js';
import schoolRoutes      from './routes/schoolRoutes.js';
import studentRoutes     from './routes/studentRoutes.js';
import bookRoutes        from './routes/bookRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import reportRoutes      from './routes/reportRoutes.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────
app.use(cors({ origin: '*' }));          // tighten in production
app.use(express.json());

// ── Health check ────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// ── API Routes ──────────────────────────────────────
app.use('/api/auth',         authRoutes);
app.use('/api/schools',      schoolRoutes);
app.use('/api/students',     studentRoutes);
app.use('/api/books',        bookRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports',      reportRoutes);

// ── 404 fallback ────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Global error handler ────────────────────────────
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// ── Start ────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀  Mobile Library API running on http://localhost:${PORT}`);
    console.log(`📋  Routes:`);
    console.log(`    POST   /api/auth/login`);
    console.log(`    GET    /api/auth/session`);
    console.log(`    GET    /api/schools          POST   /api/schools`);
    console.log(`    GET    /api/students          POST   /api/students`);
    console.log(`    GET    /api/books             POST   /api/books`);
    console.log(`    POST   /api/transactions/checkout`);
    console.log(`    POST   /api/transactions/return`);
    console.log(`    GET    /api/reports/metrics`);
    console.log(`    GET    /api/reports/data?type=outstanding|historical\n`);
});
