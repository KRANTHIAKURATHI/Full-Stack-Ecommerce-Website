const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./Controller/UserController');
const productRoutes = require('./Controller/ProductRoute');
const categoryRoutes = require('./Controller/CategoryRoute');
const cartRoutes = require('./Controller/CartRoute');
const orderRoutes = require('./Controller/OrderRoute');
const reviewRoutes = require('./Controller/ReviewRoute');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// ENV VARIABLES
// ======================

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('CRITICAL: JWT_SECRET is not defined in .env file');
}

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// ======================
// CORS
// ======================

const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS origin not allowed: ${origin}`)
      );
    },
    credentials: true
  })
);

// ======================
// SECURITY
// ======================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    }
  })
);

// ======================
// STATIC FILES
// ======================

app.use(
  '/api/images',
  express.static(path.join(__dirname, 'images'))
);

// ======================
// RATE LIMITING
// ======================

// Apply limiter ONLY to auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    error: 'Too many authentication requests. Try again later.'
  }
});

// ======================
// BODY PARSER
// ======================

app.use(bodyParser.json({ limit: '10mb' }));

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '10mb'
  })
);

// ======================
// PASSPORT
// ======================

app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await userRoutes.findOrCreateGoogleUser(profile);

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ======================
// GOOGLE AUTH ROUTES
// ======================

app.get(
  '/api/auth/google',
  authLimiter,
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

app.get(
  '/api/auth/google/callback',
  authLimiter,
  passport.authenticate('google', {
    session: false
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        user_id: req.user.user_id,
        emailID: req.user.emailID
      },
      JWT_SECRET,
      {
        expiresIn: '24h'
      }
    );

    res.redirect(
      `${FRONTEND_URL}/login-success?token=${token}&userID=${req.user.user_id}`
    );
  }
);

// ======================
// API ROUTES
// ======================

app.use('/api', userRoutes);

app.use('/api', productRoutes);

app.use('/api', categoryRoutes);

app.use('/api', cartRoutes);

app.use('/api', orderRoutes);

app.use('/api', reviewRoutes);

// ======================
// TEST ROUTE
// ======================

app.get('/api/test', (req, res) => {
  res.send('API is working!');
});

// ======================
// ERROR HANDLER
// ======================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    error: 'Something went wrong!'
  });
});

// ======================
// START SERVER
// ======================

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});