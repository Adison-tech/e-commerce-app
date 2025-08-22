// backend/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middlewares/authMiddleware');

// Wrap your routes in a function that accepts the io instance
module.exports = (io) => {
    // Now you can pass 'io' to your controller functions
    router.get('/', auth, cartController.getCart);
    router.post('/', auth, cartController.addItemToCart(io));
    router.put('/:itemId', auth, cartController.updateItemQuantity(io));
    router.delete('/:itemId', auth, cartController.removeItemFromCart(io));
    
    return router;
};