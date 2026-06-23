import pool from '../config/db.js';

// GET /api/students?search=
export const getStudents = async (req, res) => {
    const { search } = req.query;

    try {
        let query  = `SELECT s.*, sch.name AS school_name
                      FROM students s
                      JOIN schools sch ON s.school_id = sch.id`;
        const params = [];

        if (search) {
            query += ' WHERE s.id LIKE ? OR s.name LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY s.created_at DESC';

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/students
export const createStudent = async (req, res) => {
    const { id, name, school_id } = req.body;

    if (!id || !name || !school_id) {
        return res.status(400).json({ message: 'ID, name, and school are required' });
    }

    try {
        await pool.query(
            'INSERT INTO students (id, name, school_id) VALUES (?, ?, ?)', [id, name, school_id]
        );
        res.status(201).json({ id, name, school_id });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: `Student ID "${id}" already exists` });
        }
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/students/:id
export const updateStudent = async (req, res) => {
    const { id } = req.params;
    const { name, school_id, status } = req.body;

    try {
        await pool.query(
            'UPDATE students SET name = ?, school_id = ?, status = ? WHERE id = ?',
            [name, school_id, status, id]
        );
        res.json({ id, name, school_id, status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/students/:id
export const deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM students WHERE id = ?', [id]);
        res.json({ message: 'Student removed successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Cannot delete student with existing transaction history' });
    }
};
