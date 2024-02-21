// File: backend/routes/railways.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Example endpoint for fetching all railway lines
router.get('/railways', async (req, res) => {
    try {
        const allRailways = await pool.query('SELECT * FROM railways');
        res.json(allRailways.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// Add more endpoints as needed...

// POST - Add a new railway line
router.post('/railways', async (req, res) => {
    try {
        const { name, coordinates } = req.body;
        const newRailway = await pool.query(
            'INSERT INTO railways (name, coordinates) VALUES ($1, $2) RETURNING *',
            [name, coordinates]
        );
        res.json(newRailway.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUT - Update a railway line
router.put('/railways/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, coordinates } = req.body;
        const updateRailway = await pool.query(
            'UPDATE railways SET name = $1, coordinates = $2 WHERE id = $3 RETURNING *',
            [name, coordinates, id]
        );
        if (updateRailway.rows.length === 0) {
            return res.status(404).send('Railway not found');
        }
        res.json(updateRailway.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE - Delete a railway line
router.delete('/railways/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteRailway = await pool.query(
            'DELETE FROM railways WHERE id = $1 RETURNING *',
            [id]
        );
        if (deleteRailway.rows.length === 0) {
            return res.status(404).send('Railway not found');
        }
        res.json({ message: 'Railway deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
