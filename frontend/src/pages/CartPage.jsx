// frontend/src/pages/CartPage.jsx
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext'; 
import CartItem from '../components/CartItem'; // Import the new CartItem component

const CartPage = () => {
    const { user, token, cartItems, setCartItems, loading } = useContext(AuthContext); 
    const [error, setError] = useState(null);

    const handleRemoveItem = async (itemId) => {
        try {
            await axios.delete(`/api/cart/${itemId}`, {
                headers: { 'x-auth-token': token }
            });
            setCartItems(cartItems.filter(item => item.id !== itemId));
            setError(null);
        } catch (err) {
            setError('Failed to remove item.');
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            return handleRemoveItem(itemId);
        }
        
        try {
            const res = await axios.put(`/api/cart/${itemId}`, { quantity: newQuantity }, {
                headers: { 'x-auth-token': token }
            });
            // Update the global state with the new item data from the response
            setCartItems(cartItems.map(item => 
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            ));
            setError(null);
        } catch (err) {
            setError('Failed to update item quantity.');
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (loading) return <div className="text-center mt-8">Loading cart...</div>;
    if (!user) return <div className="text-center mt-8 text-red-500">Please log in to view your cart.</div>;
    if (cartItems.length === 0) return <div className="text-center mt-8 text-gray-500">Your cart is empty.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">Shopping Cart</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {cartItems.map(item => (
                        <CartItem 
                            key={item.id} 
                            item={item}
                            onRemove={handleRemoveItem}
                            onUpdateQuantity={handleUpdateQuantity}
                        />
                    ))}
                </ul>
                <div className="p-4 text-right">
                    <h2 className="text-2xl font-bold">Subtotal: ${subtotal.toFixed(2)}</h2>
                    <button className="mt-4 bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;