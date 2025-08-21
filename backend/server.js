// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const port = process.env.PORT || 5014;

app.get('/', (req, res) => {
    res.send('Hello, e-commerce backend!');
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});