// frontend/src/pages/WishlistPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaShoppingCart } from 'react-icons/fa';

const imageUrlBase = '/images/';

const WishlistPage = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    const fetchWishlist = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await axios.get('/api/wishlist', {
                headers: { 'x-auth-token': token }
            });
            setWishlistItems(res.data);
        } catch (err) {
            setError('Failed to fetch wishlist items.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [token]);

    const handleRemoveItem = async (itemId) => {
        try {
            await axios.delete(`/api/wishlist/${itemId}`, {
                headers: { 'x-auth-token': token }
            });
            setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
        } catch (err) {
            alert('Failed to remove item.');
        }
    };

    if (loading) return <div className="text-center mt-8">Loading wishlist...</div>;
    if (!token) return <div className="text-center mt-8 text-red-500">Please log in to view your wishlist.</div>;
    if (wishlistItems.length === 0) return <div className="text-center mt-8 text-gray-500">Your wishlist is empty.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">My Wishlist</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                        <Link to={`/products/${item.product_id}`}>
                            <img
                                src={item.image_url ? imageUrlBase + item.image_url : 'https://via.placeholder.com/150'}
                                alt={item.name}
                                className="w-full h-48 object-contain rounded-t-lg"
                            />
                        </Link>
                        <div className="p-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                <p className="text-gray-600">${item.price}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => handleRemoveItem(item.id)} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
                                    <FaTrashAlt />
                                </button>
                                <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                                    <FaShoppingCart />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;