const express = require('express');
const connectDB = require('../database');

const router = express.Router();

// ✅ Route to fetch all products with category name
router.get('/products', async (req, res) => {
  let db;
  try {
    db = await connectDB();
    const [products] = await db.query(
      `SELECT 
         p.product_id, 
         p.product_name, 
         p.amount, 
         p.imageURL, 
         c.category_name 
       FROM product p
       LEFT JOIN category c ON p.category_id = c.category_id`
    );
    res.json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Route to fetch a single product by its product_id with category name
router.get('/products/:product_id', async (req, res) => {
  let db;
  try {
    const { product_id } = req.params;
    db = await connectDB();

    const [product] = await db.query(
      `SELECT 
         p.product_id, 
         p.product_name, 
         p.amount, 
         p.imageURL, 
         c.category_name 
       FROM product p
       LEFT JOIN category c ON p.category_id = c.category_id
       WHERE p.product_id = ?`,
      [product_id]
    );

    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Route to fetch products by category_id (with category name)
router.get('/products/category_id/:category_id', async (req, res) => {
  let db;
  try {
    const { category_id } = req.params;
    db = await connectDB();

    const [products] = await db.query(
      `SELECT 
         p.product_id, 
         p.product_name, 
         p.amount, 
         p.imageURL, 
         c.category_name 
       FROM product p
       LEFT JOIN category c ON p.category_id = c.category_id
       WHERE p.category_id = ?`,
      [category_id]
    );

    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
