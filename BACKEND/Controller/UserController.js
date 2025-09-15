const express = require('express');
const DBConnect = require('../database');

const router = express.Router();

//User Registration
router.post('/user', async (req, res) => {
  const { fullname, phonenumber, emailID, password } = req.body;

  if (!fullname || !phonenumber || !emailID || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const db = await DBConnect();
    const [existing] = await db.query(
      'SELECT * FROM user WHERE emailID = ?', 
      [emailID]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    await db.query(
      'INSERT INTO user (fullname, phonenumber, emailID, password) VALUES (?, ?, ?, ?)',
      [fullname, phonenumber, emailID, password]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//User Login
router.get('/userlogin', async (req, res) => {
  const { emailID, password } = req.query;

  if (!emailID || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  let db;
  try {
    db = await DBConnect();
    const [result] = await db.query(
      'SELECT * FROM user WHERE emailID = ? AND password = ?',
      [emailID, password]
    );

    if (result.length > 0) {
      const user = result[0];
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          user_id: user.user_id,
          emailID: user.emailID
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (db && typeof db.close === 'function') {
      db.close();
    }
  }
});

module.exports = router;
