// backend/controllers/wishlistController.js
const wishlistModel = require('../models/wishlistModel');

// This function does not perform a write operation, so it doesn't need 'io'
const getWishlist = async (req, res) => {
    try {
        const items = await wishlistModel.getWishlistItemsByUserId(req.user.id);
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// This function now accepts 'io' and returns an async middleware
const addItem = (io) => async (req, res) => {
    try {
        const { productId } = req.body;
        const item = await wishlistModel.addItemToWishlist(req.user.id, productId);
        if (!item) return res.status(200).json({ message: 'Item already in wishlist' });
        
        // Fetch the updated wishlist and emit a real-time event
        const updatedWishlist = await wishlistModel.getWishlistItemsByUserId(req.user.id);
        io.emit('wishlist:update', updatedWishlist);

        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// This function now accepts 'io' and returns an async middleware
const removeItem = (io) => async (req, res) => {
    try {
        const removedItem = await wishlistModel.removeItemFromWishlist(req.user.id, req.params.itemId);
        if (!removedItem) return res.status(404).json({ message: 'Item not found in wishlist' });

        // Fetch the updated wishlist and emit a real-time event
        const updatedWishlist = await wishlistModel.getWishlistItemsByUserId(req.user.id);
        io.emit('wishlist:update', updatedWishlist);
        
        res.status(200).json({ message: 'Item removed from wishlist' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getWishlist,
    addItem,
    removeItem,
};