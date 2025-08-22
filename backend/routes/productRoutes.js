// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

// This module now exports a function that returns the router
module.exports = (io) => {
    // Public routes - They don't need 'io' passed to them
    router.get('/', productController.getProducts);
    router.get('/:id', productController.getProductById);

    // Admin-only routes - These might need 'io' to emit events
    router.post('/', auth, authorizeRole('admin'), productController.createProduct(io)); // Now passing 'io' to the controller
    router.put('/:id', auth, authorizeRole('admin'), productController.updateProduct(io)); // Now passing 'io' to the controller
    router.delete('/:id', auth, authorizeRole('admin'), productController.deleteProduct(io)); // Now passing 'io' to the controller
    
    return router;
};