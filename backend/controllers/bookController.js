import pool from '../config/db.js';

// GET /api/books?search=
export const getBooks = async (req, res) => {
    const { search } = req.query;

    try {
        let query    = 'SELECT * FROM books';
        const params = [];

        if (search) {
            query += ' WHERE id LIKE ? OR title LIKE ? OR author LIKE ?';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/books
export const createBook = async (req, res) => {
    const { id, title, author } = req.body;

    if (!id || !title || !author) {
        return res.status(400).json({ message: 'Barcode, title, and author are required' });
    }

    try {
        await pool.query(
            'INSERT INTO books (id, title, author) VALUES (?, ?, ?)', [id, title, author]
        );
        res.status(201).json({ id, title, author, status: 'Available' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: `Book barcode "${id}" already exists` });
        }
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/books/:id
export const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, status } = req.body;

    try {
        await pool.query(
            'UPDATE books SET title = ?, author = ?, status = ? WHERE id = ?',
            [title, author, status, id]
        );
        res.json({ id, title, author, status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/books/:id
export const deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM books WHERE id = ?', [id]);
        res.json({ message: 'Book removed from inventory' });
    } catch (error) {
        res.status(400).json({ message: 'Cannot delete book with existing transaction history' });
    }
};
