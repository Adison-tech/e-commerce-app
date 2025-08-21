// backend/controllers/productController.js
const productModel = require('../models/productModel');

const createProduct = async (req, res) => {
    try {
        const { name, description, price, categoryId } = req.body;
        const newProduct = await productModel.createProduct(name, description, price, categoryId);
        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await productModel.findAllProducts();
        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

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

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, categoryId } = req.body;
        const updatedProduct = await productModel.updateProduct(req.params.id, name, description, price, categoryId);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await productModel.deleteProduct(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
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