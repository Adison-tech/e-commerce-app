// backend/models/productModel.js
const { query } = require('../config/db');

const createProduct = async (name, description, price, categoryId) => {
    const res = await query(
        'INSERT INTO products (name, description, price, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, description, price, categoryId]
    );
    return res.rows[0];
};

const findProductById = async (id) => {
    // This query fetches the main product details
    const productQuery = await query(`
        SELECT
            p.*,
            c.category_name AS category,
            b.brand_name AS brand
        FROM products AS p
        JOIN categories AS c ON p.category_id = c.category_id
        JOIN brands AS b ON p.brand_id = b.brand_id
        WHERE p.id = $1
    `, [id]);

    const product = productQuery.rows[0];

    if (!product) {
        return null;
    }

    // This query fetches the specifications for that product
    const specsQuery = await query(
        'SELECT spec_id, title, key, value FROM specifications WHERE product_id = $1 ORDER BY title',
        [id]
    );

    // Return both the product and its specifications
    return {
        product: product,
        specifications: specsQuery.rows,
    };
};

const findAllProducts = async () => {
    const res = await query(`
        SELECT
            p.id, p.name, p.price, p.image, p.color, p.stock, p.badge,
            c.category_name AS category,
            b.brand_name AS brand
        FROM products AS p
        JOIN categories AS c ON p.category_id = c.category_id
        JOIN brands AS b ON p.brand_id = b.brand_id
    `);
    return res.rows;
};

const updateProduct = async (id, name, description, price, categoryId) => {
    const res = await query(
        'UPDATE products SET name = $1, description = $2, price = $3, category_id = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
        [name, description, price, categoryId, id]
    );
    return res.rows[0];
};

const deleteProduct = async (id) => {
    const res = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
};

module.exports = {
    createProduct,
    findProductById,
    findAllProducts,
    updateProduct,
    deleteProduct,
};