// backend/controllers/productController.js
const productModel = require('../models/productModel');

// GET routes do not need access to 'io'
const getProducts = async (req, res) => {
    try {
        const products = await productModel.findAllProducts();
        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET routes do not need access to 'io'
const getProductById = async (req, res) => {
    try {
        const product = await productModel.findProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Functions that perform write operations need access to 'io'
const createProduct = (io) => async (req, res) => {
    try {
        const { name, description, price, categoryId } = req.body;
        const newProduct = await productModel.createProduct(name, description, price, categoryId);
        
        // After a successful operation, emit a real-time event
        io.emit('product:created', newProduct); 
        
        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProduct = (io) => async (req, res) => {
    try {
        const { name, description, price, categoryId } = req.body;
        const updatedProduct = await productModel.updateProduct(req.params.id, name, description, price, categoryId);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // After a successful operation, emit a real-time event
        io.emit('product:updated', updatedProduct);

        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProduct = (io) => async (req, res) => {
    try {
        const deletedProduct = await productModel.deleteProduct(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // After a successful operation, emit a real-time event
        io.emit('product:deleted', { id: req.params.id });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};