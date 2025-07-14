const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');


// Import all route files from the 'Controllers' folder
const userRoutes = require('./Controller/UserController');
const productRoutes = require('./Controller/ProductRoute');
const categoryRoutes = require('./Controller/CategoryRoute');
const cartRoutes = require('./Controller/CartRoute');
const orderRoutes = require('./Controller/OrderRoute');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static images from the 'public/images' directory
app.use('/api/images', express.static(path.join(__dirname, 'images')));
// Use the imported route files
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', cartRoutes); // This ensures the cart routes are active
app.use('/api', orderRoutes);

// Simple test route
app.get('/api/test', (req, res) => {
  res.send('API is working!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});