// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin-only routes
router.post('/', auth, authorizeRole('admin'), productController.createProduct);
router.put('/:id', auth, authorizeRole('admin'), productController.updateProduct);
router.delete('/:id', auth, authorizeRole('admin'), productController.deleteProduct);

module.exports = router;