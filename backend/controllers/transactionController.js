import pool from '../config/db.js';

/**
 * POST /api/transactions/checkout
 *
 * Issues a book to a student at a school node.
 * Uses a DB transaction + FOR UPDATE row lock to prevent
 * double-checkout under concurrent requests.
 */
export const checkoutAsset = async (req, res) => {
    const { student_id, book_id, school_id } = req.body;

    if (!student_id || !book_id || !school_id) {
        return res.status(400).json({ message: 'student_id, book_id, and school_id are required' });
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Lock the book row to prevent concurrent double-issue
        const [bRows] = await conn.query(
            'SELECT * FROM books WHERE id = ? FOR UPDATE', [book_id]
        );
        if (bRows.length === 0) {
            throw new Error('Book not found in inventory');
        }
        if (bRows[0].status === 'Borrowed') {
            throw new Error('This book is already borrowed by another student');
        }

        // Confirm the student exists
        const [sRows] = await conn.query(
            'SELECT * FROM students WHERE id = ?', [student_id]
        );
        if (sRows.length === 0) {
            throw new Error('Student ID not found');
        }
        if (sRows[0].status === 'Suspended') {
            throw new Error('Student account is suspended');
        }

        // Create transaction record and update book status atomically
        await conn.query(
            'INSERT INTO transactions (book_id, student_id, checkout_school_id) VALUES (?, ?, ?)',
            [book_id, student_id, school_id]
        );
        await conn.query(
            'UPDATE books SET status = "Borrowed" WHERE id = ?', [book_id]
        );

        await conn.commit();
        res.json({ message: `Book "${bRows[0].title}" issued to ${sRows[0].name} successfully` });
    } catch (error) {
        await conn.rollback();
        res.status(400).json({ message: error.message });
    } finally {
        conn.release();
    }
};

/**
 * POST /api/transactions/return
 *
 * Distributed cross-node return — the book can be handed back
 * at any school, not just where it was borrowed from.
 * Uses FOR UPDATE to prevent race conditions on the transaction row.
 */
export const distributedReturnAsset = async (req, res) => {
    const { book_id, return_school_id } = req.body;

    if (!book_id || !return_school_id) {
        return res.status(400).json({ message: 'book_id and return_school_id are required' });
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Find and lock the active (Issued) transaction for this book
        const [tRows] = await conn.query(
            `SELECT * FROM transactions
             WHERE book_id = ? AND status = 'Issued'
             FOR UPDATE`,
            [book_id]
        );
        if (tRows.length === 0) {
            throw new Error('No active loan found for this book barcode');
        }

        // Confirm the receiving school exists
        const [schRows] = await conn.query(
            'SELECT id, name FROM schools WHERE id = ?', [return_school_id]
        );
        if (schRows.length === 0) {
            throw new Error('Receiving school not found');
        }

        // Mark the transaction as Recovered, record return details
        await conn.query(
            `UPDATE transactions
             SET return_school_id = ?, return_date = NOW(), status = 'Recovered'
             WHERE id = ?`,
            [return_school_id, tRows[0].id]
        );

        // Make the book available again
        await conn.query(
            'UPDATE books SET status = "Available" WHERE id = ?', [book_id]
        );

        await conn.commit();
        res.json({
            message: `Book returned successfully at ${schRows[0].name}`,
        });
    } catch (error) {
        await conn.rollback();
        res.status(400).json({ message: error.message });
    } finally {
        conn.release();
    }
};
