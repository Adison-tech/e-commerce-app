// backend/models/userModel.js
const { query } = require('../config/db');

const findUserByEmail = async (email) => {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

const createUser = async (username, email, hashedPassword) => {
    const result = await query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, hashedPassword]
    );
    return result.rows[0];
};

module.exports = {
    findUserByEmail,
    createUser
};