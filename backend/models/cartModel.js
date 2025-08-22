// backend/models/cartModel.js
const { query } = require('../config/db');

const getCartItemsByUserId = async (userId) => {
    try {
        const res = await query(
            `
            SELECT 
                ci.*, 
                COALESCE(pv.name, p.name) AS name, 
                COALESCE(pv.price, p.price) AS price, 
                p.image AS image_url,
                pv.name AS variant_name
            FROM cart_items ci 
            JOIN products p ON ci.product_id = p.id 
            LEFT JOIN product_variants pv ON ci.variant_id = pv.id
            WHERE ci.user_id = $1
            `,
            [userId]
        );
        return res.rows;
    } catch (err) {
        console.error('Error fetching cart items:', err);
        throw new Error('Failed to retrieve cart items.');
    }
};

const addToCart = async (userId, productId, quantity, variantId = null) => {
    try {
        const res = await query(
            'INSERT INTO cart_items (user_id, product_id, quantity, variant_id) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, product_id, variant_id) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity RETURNING *',
            [userId, productId, quantity, variantId]
        );
        return res.rows[0];
    } catch (err) {
        console.error('Error adding to cart:', err);
        throw new Error('Failed to add item to cart.');
    }
};

const updateCartItemQuantity = async (userId, itemId, quantity) => {
    try {
        const res = await query(
            'UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [quantity, itemId, userId]
        );
        return res.rows[0];
    } catch (err) {
        console.error('Error updating cart item quantity:', err);
        throw new Error('Failed to update cart item quantity.');
    }
};

const removeCartItem = async (userId, itemId) => {
    try {
        const res = await query(
            'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *',
            [itemId, userId]
        );
        return res.rows[0];
    } catch (err) {
        console.error('Error removing cart item:', err);
        throw new Error('Failed to remove item from cart.');
    }
};

module.exports = {
    getCartItemsByUserId,
    addToCart,
    updateCartItemQuantity,
    removeCartItem,
};