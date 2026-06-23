import pool from '../config/db.js';

// GET /api/schools
export const getSchools = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM schools ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/schools
export const createSchool = async (req, res) => {
    const { name, location } = req.body;

    if (!name || !location) {
        return res.status(400).json({ message: 'Name and location are required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO schools (name, location) VALUES (?, ?)', [name, location]
        );
        res.status(201).json({ id: result.insertId, name, location });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/schools/:id
export const updateSchool = async (req, res) => {
    const { id } = req.params;
    const { name, location } = req.body;

    try {
        await pool.query(
            'UPDATE schools SET name = ?, location = ? WHERE id = ?', [name, location, id]
        );
        res.json({ id, name, location });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/schools/:id
export const deleteSchool = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM schools WHERE id = ?', [id]);
        res.json({ message: 'School removed successfully' });
    } catch (error) {
        // FK constraint fires when students or transactions still reference this school
        res.status(400).json({ message: 'Cannot delete school with existing students or transactions' });
    }
};
