import pool from '../config/db.js';

// GET /api/reports/metrics  — dashboard stat cards
export const getDashboardMetrics = async (req, res) => {
    try {
        const [[{ totalBooks }]]    = await pool.query('SELECT COUNT(*) AS totalBooks FROM books');
        const [[{ borrowedBooks }]] = await pool.query('SELECT COUNT(*) AS borrowedBooks FROM books WHERE status = "Borrowed"');
        const [[{ totalStudents }]] = await pool.query('SELECT COUNT(*) AS totalStudents FROM students');
        const [[{ totalSchools }]]  = await pool.query('SELECT COUNT(*) AS totalSchools FROM schools');

        const recoveryRate = totalBooks > 0
            ? Math.round(((totalBooks - borrowedBooks) / totalBooks) * 100)
            : 100;

        res.json({ totalBooks, borrowedBooks, totalStudents, totalSchools, recoveryRate });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/reports/data?type=outstanding|historical
export const getReportsData = async (req, res) => {
    const { type } = req.query;

    try {
        let query = '';

        if (type === 'outstanding') {
            // All books currently issued but not yet returned
            query = `
                SELECT
                    t.id,
                    b.id    AS book_id,
                    b.title,
                    s.name  AS student_name,
                    sch.name AS checkout_school
                FROM transactions t
                JOIN books   b   ON t.book_id           = b.id
                JOIN students s  ON t.student_id         = s.id
                JOIN schools  sch ON t.checkout_school_id = sch.id
                WHERE t.status = 'Issued'
                ORDER BY t.borrow_date ASC
            `;
        } else {
            // Full circulation history, most recent first, capped at 200 rows
            query = `
                SELECT
                    t.id,
                    b.title,
                    s.name      AS student_name,
                    c_sch.name  AS checkout_school,
                    r_sch.name  AS return_school,
                    t.borrow_date,
                    t.return_date,
                    t.status
                FROM transactions t
                JOIN books    b      ON t.book_id           = b.id
                JOIN students s      ON t.student_id         = s.id
                JOIN schools  c_sch  ON t.checkout_school_id = c_sch.id
                LEFT JOIN schools r_sch ON t.return_school_id = r_sch.id
                ORDER BY t.borrow_date DESC
                LIMIT 200
            `;
        }

        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
