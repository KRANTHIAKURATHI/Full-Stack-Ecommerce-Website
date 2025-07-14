const express = require('express');
const connectDB = require('../database');

const router = express.Router();

// ✅ Get all grouped orders for a user
router.get('/orders/:user_id', async (req, res) => {
  let db;
  try {
    const { user_id } = req.params;
    db = await connectDB();

    const [orders] = await db.query(
      'SELECT order_id, amount, order_date FROM orders WHERE user_id = ? ORDER BY order_date DESC',
      [user_id]
    );

    if (orders.length === 0) return res.json([]);

    const order_ids = orders.map(o => o.order_id);
    const placeholders = order_ids.map(() => '?').join(', ');

    const [items] = await db.query(
      `SELECT oi.order_id, p.product_id, p.product_name, p.imageURL
       FROM order_item oi
       JOIN product p ON oi.product_id = p.product_id
       WHERE oi.order_id IN (${placeholders})`,
      order_ids
    );

    const itemsByOrder = {};
    items.forEach(item => {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push({
        product_id: item.product_id,
        name: item.product_name,
        image: item.imageURL
      });
    });

    const result = orders.map(order => ({
      order_id: order.order_id,
      amount: order.amount,
      order_date: order.order_date,
      products: itemsByOrder[order.order_id] || []
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Buy Now (Single Product Order)
router.post('/orders/buy_now', async (req, res) => {
  let db;
  try {
    const { user_id, product_id, amount } = req.body;
    db = await connectDB();
    await db.beginTransaction();

    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, amount, order_date) VALUES (?, ?, NOW())',
      [user_id, amount]
    );
    const order_id = orderResult.insertId;

    await db.query(
      'INSERT INTO order_item (order_id, product_id) VALUES (?, ?)',
      [order_id, product_id]
    );

    await db.commit();
    res.json({ success: true, message: 'Order placed successfully', order_id });
  } catch (error) {
    if (db) await db.rollback();
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Place Order From Cart
router.post('/orders/place_from_cart/:user_id', async (req, res) => {
  let db;
  try {
    const { user_id } = req.params;
    console.log("Placing order from cart for user:", user_id);
    db = await connectDB();
    await db.beginTransaction();

    const [cartResult] = await db.query('SELECT cart_id FROM cart WHERE user_id = ?', [user_id]);
    if (cartResult.length === 0) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    const cart_id = cartResult[0].cart_id;

    const [cartItems] = await db.query(
      `SELECT p.product_id, p.amount 
       FROM cart_items ci 
       JOIN product p ON ci.product_id = p.product_id 
       WHERE ci.cart_id = ?`,
      [cart_id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, amount, order_date) VALUES (?, ?, NOW())',
      [user_id, totalAmount]
    );
    const order_id = orderResult.insertId;

    for (const item of cartItems) {
      await db.query(
        'INSERT INTO order_item (order_id, product_id) VALUES (?, ?)',
        [order_id, item.product_id]
      );
    }

    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cart_id]);
    // 🔥 Removed: await db.query('UPDATE cart SET amount = 0 WHERE cart_id = ?', [cart_id]);

    await db.commit();
    res.json({ success: true, message: 'Order placed successfully', order_id });
  } catch (error) {
    if (db) await db.rollback();
    console.error('Error placing order from cart:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
