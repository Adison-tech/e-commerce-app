// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http'); 

// Correctly import the initSocketIO function
const initSocketIO = require('./websocket/socket'); 
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

const app = express();
const server = http.createServer(app); 
const io = initSocketIO(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// All route modules must now be called as functions
app.use('/api/auth', authRoutes(io)); // FIX: Call the function with `io`
app.use('/api/products', productRoutes(io)); // FIX: Call the function with `io`
app.use('/api/cart', cartRoutes(io)); 
app.use('/api/wishlist', wishlistRoutes(io)); 

app.get('/', (req, res) => {
    res.send('Hello, e-commerce backend!');
});

const port = process.env.PORT || 5014;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});