const express = require('express');
const DBConnect = require('../database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

const router = express.Router();

// Validate JWT_SECRET exists
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const BCRYPT_ROUNDS = 10; 

// Helper to find or create user for Google OAuth
router.findOrCreateGoogleUser = async (profile) => {
  const emailID = profile.emails[0].value;
  const fullname = profile.displayName;
  const db = await DBConnect();

  try {
    // Check if user exists
    const [existing] = await db.query('SELECT * FROM user WHERE emailID = ?', [emailID]);

    if (existing.length > 0) {
      return existing[0];
    }

    // Hash OAuth placeholder password
    const hashedPassword = await bcrypt.hash('OAUTH_USER_NO_PASSWORD', BCRYPT_ROUNDS);

    // Create user
    const [result] = await db.query(
      'INSERT INTO user (fullname, emailID, password, phonenumber) VALUES (?, ?, ?, ?)',
      [fullname, emailID, hashedPassword, '0000000000']
    );

    return { user_id: result.insertId, emailID, fullname };
  } catch (error) {
    console.error('Database Error in OAuth:', error);
    throw error;
  }
};

// Existing Registration
router.post('/user', async (req, res) => {
  const { fullname, phonenumber, emailID, password } = req.body;
  
  // Input validation
  if (!fullname || !phonenumber || !emailID || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailID)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  // Validate password strength (min 8 chars)
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const db = await DBConnect();
    
    // Check if user already exists
    const [existing] = await db.query('SELECT * FROM user WHERE emailID = ?', [emailID]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Insert user with hashed password
    await db.query(
      'INSERT INTO user (fullname, phonenumber, emailID, password) VALUES (?, ?, ?, ?)',
      [fullname, phonenumber, emailID, hashedPassword]
    );
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Manual Login with JWT (POST method)
router.post('/userlogin', async (req, res) => {
  const { emailID, password } = req.body;
  
  // Input validation
  if (!emailID || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  
  try {
    const db = await DBConnect();
    
    // Find user by email
    const [result] = await db.query(
      'SELECT user_id, emailID, fullname, password FROM user WHERE emailID = ?',
      [emailID]
    );

    if (result.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = result[0];
    
    // Compare password with stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id, emailID: user.emailID }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      token: token,
      user: { user_id: user.user_id, emailID: user.emailID, fullname: user.fullname }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// GET current user profile (requires authentication)
router.get('/userprofile', auth, async (req, res) => {
  try {
    const db = await DBConnect();
    const user_id = req.user.user_id;

    const [result] = await db.query(
      'SELECT user_id, fullname, emailID, phonenumber FROM user WHERE user_id = ?',
      [user_id]
    );

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;