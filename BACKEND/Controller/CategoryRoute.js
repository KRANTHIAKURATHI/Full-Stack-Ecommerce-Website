const express = require('express');
const connectDB = require('../database');
const router = express.Router();

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.query('SELECT * FROM category');

    const categories = rows.map(category => ({
      ...category,
      imageURL: category.imageURL
    }));

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific category by ID
router.get('/categories/:category_id', async (req, res) => {
  const { category_id } = req.params;

  if (!category_id || isNaN(category_id)) {
    return res.status(400).json({ error: 'Valid category ID is required' });
  }

  try {
    const db = await connectDB();
    const [rows] = await db.query('SELECT * FROM category WHERE category_id = ?', [category_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;