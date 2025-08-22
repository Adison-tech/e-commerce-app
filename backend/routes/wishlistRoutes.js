// backend/routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const auth = require('../middlewares/authMiddleware');

// This module now exports a function that returns the router
module.exports = (io) => {
    router.get('/', auth, wishlistController.getWishlist);
    // You should also update your controllers to accept 'io'
    router.post('/', auth, wishlistController.addItem(io));
    router.delete('/:itemId', auth, wishlistController.removeItem(io));

    return router;
};