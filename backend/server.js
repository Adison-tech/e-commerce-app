// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5014;

app.get('/', (req, res) => {
    res.send('Hello, e-commerce backend!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});