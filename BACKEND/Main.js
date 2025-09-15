const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');


const userRoutes = require('./Controller/UserController');
const productRoutes = require('./Controller/ProductRoute');
const categoryRoutes = require('./Controller/CategoryRoute');
const cartRoutes = require('./Controller/CartRoute');
const orderRoutes = require('./Controller/OrderRoute');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/images', express.static(path.join(__dirname, 'images')));
app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', cartRoutes); 
app.use('/api', orderRoutes);

app.get('/api/test', (req, res) => {
  res.send('API is working!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
