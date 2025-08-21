// frontend/src/api/productsApi.js
import axios from 'axios';

// Define the base URL for your backend API
const API_URL = '/api/products'; // Adjust the URL if your backend is on a different port or domain

export const fetchProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error; // Re-throw the error to be handled by the caller (ProductsPage.jsx)
    }
};

export const fetchProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        throw error;
    }
};