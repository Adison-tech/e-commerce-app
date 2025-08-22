// backend/controllers/cartController.js
const cartModel = require('../models/cartModel');

const getCart = async (req, res) => {
    try {
        const cartItems = await cartModel.getCartItemsByUserId(req.user.id);
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const addItemToCart = (io) => async (req, res) => {
    try {
        const { productId, quantity, variantId } = req.body;
        const userId = req.user.id;
        const newItem = await cartModel.addToCart(userId, productId, quantity, variantId);

        // Fetch the updated cart to send back to the client
        const updatedCart = await cartModel.getCartItemsByUserId(userId);
        
        // Use the 'io' instance to emit a real-time update
        io.emit('cart:update', updatedCart);

        res.status(201).json(newItem);
    } catch (err) {
        console.error('Error adding item to cart:', err);
        res.status(500).json({ error: 'Failed to add item to cart.' });
    }
};

const updateItemQuantity = (io) => async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const userId = req.user.id;
        const updatedItem = await cartModel.updateCartItemQuantity(userId, itemId, quantity);

        const updatedCart = await cartModel.getCartItemsByUserId(userId);
        io.emit('cart:update', updatedCart);

        res.status(200).json(updatedItem);
    } catch (err) {
        console.error('Error updating cart item quantity:', err);
        res.status(500).json({ error: 'Failed to update item quantity.' });
    }
};

const removeItemFromCart = (io) => async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user.id;
        const removedItem = await cartModel.removeCartItem(userId, itemId);
        
        const updatedCart = await cartModel.getCartItemsByUserId(userId);
        io.emit('cart:update', updatedCart);

        res.status(200).json(removedItem);
    } catch (err) {
        console.error('Error removing cart item:', err);
        res.status(500).json({ error: 'Failed to remove item from cart.' });
    }
};

module.exports = {
    getCart,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
};