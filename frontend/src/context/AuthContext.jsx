// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // The token is a stable value from local storage for the effect dependency
    const token = localStorage.getItem('token'); 

    // Memoize the data fetching function
    const fetchUserData = useCallback(async () => {
        if (!token) {
            setUser(null);
            setLoading(false);
            setCartItems([]);
            setWishlistItems([]);
            return;
        }

        try {
            const [profileRes, cartRes, wishlistRes] = await Promise.all([
                axios.get('/api/auth/profile', { headers: { 'x-auth-token': token } }),
                axios.get('/api/cart', { headers: { 'x-auth-token': token } }),
                axios.get('/api/wishlist', { headers: { 'x-auth-token': token } }),
            ]);

            setUser(profileRes.data);
            setCartItems(cartRes.data);
            setWishlistItems(wishlistRes.data);

        } catch (err) {
            console.error('Failed to fetch user data:', err);
            localStorage.removeItem('token');
            setUser(null);
            setCartItems([]);
            setWishlistItems([]);
        } finally {
            setLoading(false);
        }
    }, [token]); // The token is the only dependency that changes the behavior

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setCartItems([]);
        setWishlistItems([]);
        setLoading(false); // Make sure to update loading state on logout
    };

    // Single useEffect to handle all initial data fetching and token changes
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const value = {
        user,
        token,
        cartItems,
        wishlistItems,
        logout,
        fetchUserData, // Expose fetchUserData if other components need to manually trigger a refresh
        loading,
        setCartItems, // Expose the setter function for real-time updates
        setWishlistItems, // Expose the setter function for real-time updates
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};