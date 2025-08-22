// backend/models/wishlistModel.js
const { query } = require('../config/db');

const getWishlistItemsByUserId = async (userId) => {
    try {
        const res = await query(
            `
            SELECT 
                w.*, 
                COALESCE(pv.name, p.name) AS name, 
                COALESCE(pv.price, p.price) AS price, 
                p.image AS image_url,
                pv.name AS variant_name
            FROM wishlist_items w 
            JOIN products p ON w.product_id = p.id 
            LEFT JOIN product_variants pv ON w.variant_id = pv.id
            WHERE w.user_id = $1
            `,
            [userId]
        );
        return res.rows;
    } catch (err) {
        console.error('Error fetching wishlist items:', err);
        throw new Error('Failed to retrieve wishlist items.');
    }
};

const addItemToWishlist = async (userId, productId, variantId = null) => {
    try {
        const res = await query(
            'INSERT INTO wishlist_items (user_id, product_id, variant_id) VALUES ($1, $2, $3) ON CONFLICT (user_id, product_id, variant_id) DO NOTHING RETURNING *',
            [userId, productId, variantId]
        );
        return res.rows[0];
    } catch (err) {
        console.error('Error adding item to wishlist:', err);
        throw new Error('Failed to add item to wishlist.');
    }
};

const removeItemFromWishlist = async (userId, itemId) => {
    try {
        const res = await query(
            'DELETE FROM wishlist_items WHERE id = $1 AND user_id = $2 RETURNING *',
            [itemId, userId]
        );
        return res.rows[0];
    } catch (err) {
        console.error('Error removing item from wishlist:', err);
        throw new Error('Failed to remove item from wishlist.');
    }
};

module.exports = {
    getWishlistItemsByUserId,
    addItemToWishlist,
    removeItemFromWishlist,
};