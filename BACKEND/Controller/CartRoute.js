const express = require('express');
const connectDB = require('../database');
const router = express.Router();

//Get user's cart
router.get('/cart/:user_id', async (req, res) => {
  let db;
  try {
    const { user_id } = req.params;
    db = await connectDB();

    const [cartResult] = await db.query('SELECT cart_id FROM cart WHERE user_id = ?', [user_id]);

    if (cartResult.length === 0) {
      return res.json({ success: true, data: { cart_id: null, cart_items: [] } });
    }

    const cart_id = cartResult[0].cart_id;

    const [cartItems] = await db.query(
      `SELECT ci.product_id, p.product_name, p.amount AS price, p.imageURL 
       FROM cart_items ci 
       JOIN product p ON ci.product_id = p.product_id 
       WHERE ci.cart_id = ?`,
      [cart_id]
    );

    res.json({ success: true, data: { cart_id, cart_items: cartItems } });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//Add product to cart
router.post('/cart/add/:product_id', async (req, res) => {
  let db;
  try {
    const { product_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    db = await connectDB();
    await db.beginTransaction();

    let [cartResult] = await db.query('SELECT * FROM cart WHERE user_id = ?', [user_id]);
    let cart_id;

    if (cartResult.length === 0) {
      const [newCart] = await db.query('INSERT INTO cart (user_id) VALUES (?)', [user_id]);
      cart_id = newCart.insertId;
    } else {
      cart_id = cartResult[0].cart_id;
    }

    const [existingItem] = await db.query(
      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cart_id, product_id]
    );

    if (existingItem.length === 0) {
      await db.query('INSERT INTO cart_items (cart_id, product_id) VALUES (?, ?)', [cart_id, product_id]);
    }

    await db.commit();
    res.json({ success: true, message: 'Product added to cart successfully' });
  } catch (error) {
    if (db) await db.rollback();
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

//Remove product from cart
router.delete('/cart/remove/:product_id', async (req, res) => {
  let db;
  try {
    const { product_id } = req.params;
    const { user_id } = req.body;

    db = await connectDB();
    await db.beginTransaction();

    const [cartResult] = await db.query('SELECT cart_id FROM cart WHERE user_id = ?', [user_id]);
    if (cartResult.length === 0) {
      await db.rollback();
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const cart_id = cartResult[0].cart_id;

    await db.query('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [cart_id, product_id]);

    await db.commit();
    res.json({ success: true, message: 'Product removed from cart successfully' });
  } catch (error) {
    if (db) await db.rollback();
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Place order from cart
router.post('/cart/placeorder/:user_id', async (req, res) => {
  let db;
  try {
    const { user_id } = req.params;
    db = await connectDB();
    await db.beginTransaction();

    const [cartResult] = await db.query('SELECT cart_id FROM cart WHERE user_id = ?', [user_id]);
    if (cartResult.length === 0) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const cart_id = cartResult[0].cart_id;

    const [cartItems] = await db.query(
      `SELECT ci.product_id, p.amount 
       FROM cart_items ci 
       JOIN product p ON ci.product_id = p.product_id 
       WHERE ci.cart_id = ?`,
      [cart_id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.amount, 0);

    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, amount, order_date) VALUES (?, ?, NOW())',
      [user_id, totalAmount]
    );
    const order_id = orderResult.insertId;

    for (const item of cartItems) {
      await db.query('INSERT INTO order_item (order_id, product_id) VALUES (?, ?)', [order_id, item.product_id]);
    }

    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cart_id]);

    await db.commit();
    res.json({ success: true, message: 'Order placed successfully', order_id });
  } catch (error) {
    if (db) await db.rollback();
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
