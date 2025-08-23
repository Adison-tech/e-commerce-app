// frontend/src/pages/CartPage.jsx
import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import visa from '../assets/visa.webp';
import mastercard from '../assets/mastercard.webp';
import paypal from '../assets/paypal.webp';

const CartPage = () => {
    const { user, token, cartItems = [], setCartItems, loading } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const getGroupedCartItems = (items) => {
        const groupedItems = {};
        items.forEach(item => {
            const key = item.product_id + (item.variant_id ? `-${item.variant_id}` : '');
            if (groupedItems[key]) {
                groupedItems[key].quantity += item.quantity;
            } else {
                groupedItems[key] = { ...item };
            }
        });
        return Object.values(groupedItems);
    };

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
            await axios.put(`/api/cart/${itemId}`, { quantity: newQuantity }, {
                headers: { 'x-auth-token': token }
            });
            setCartItems(cartItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            ));
            setError(null);
        } catch (err) {
            setError('Failed to update item quantity.');
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleApplyPromoCode = async () => {
        if (promoCode === 'SAVE10') {
            setDiscount(subtotal * 0.1);
            alert('Promo code applied!');
        } else {
            setDiscount(0);
            alert('Invalid promo code.');
        }
    };

    const FREE_SHIPPING_THRESHOLD = 100;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 5.00;
    const taxRate = 0.08;
    const estimatedTax = (subtotal - discount) * taxRate;
    const orderTotal = subtotal - discount + shipping + estimatedTax;

    if (loading) return <div className="text-center mt-8">Loading cart...</div>;
    if (!user) return <div className="text-center mt-8 text-red-500">Please log in to view your cart.</div>;
    if (cartItems.length === 0) return <div className="text-center mt-8 text-gray-500">Your cart is empty.</div>;

    const groupedCartItems = getGroupedCartItems(cartItems);
    const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
    const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">Shopping Cart</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Card: Cart Items */}
                <div className="flex-1 space-y-4">
                    {groupedCartItems.map(item => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onRemove={handleRemoveItem}
                            onUpdateQuantity={handleUpdateQuantity}
                        />
                    ))}
                </div>

                {/* Right Card: Subtotal & Checkout */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-lg shadow-xl p-6 sticky top-24">
                        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                        
                        {/* Free Shipping Progress Bar */}
                        <div className="mb-4">
                            {subtotal < FREE_SHIPPING_THRESHOLD ? (
                                <>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Spend <span className="font-bold text-blue-600">Kes{remainingForFreeShipping.toFixed(2)}</span> more to get FREE Shipping!
                                    </p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${shippingProgress}%` }}></div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-green-600 font-bold">You qualify for FREE Shipping! 🎉</p>
                            )}
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-dashed">
                            <span className="text-gray-700">Subtotal</span>
                            <span className="text-lg font-semibold text-gray-900">Kes {subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between items-center py-2 border-b border-dashed">
                                <span className="text-green-600">Discount</span>
                                <span className="text-green-600 font-semibold">-Kes {discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center py-2 border-b border-dashed">
                            <span className="text-gray-700">Shipping</span>
                            <span className="text-lg font-semibold text-gray-900">
                                {shipping === 0 ? <span className="text-green-600">FREE</span> : `Kes ${shipping.toFixed(2)}`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-4 mb-4 border-b">
                            <span className="text-gray-700">Estimated Tax</span>
                            <span className="text-lg font-semibold text-gray-900">Kes {estimatedTax.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center mb-6 pt-4">
                            <span className="text-xl font-bold text-gray-900">Order Total</span>
                            <span className="text-2xl font-bold text-blue-600">Kes {orderTotal.toFixed(2)}</span>
                        </div>

                        {/* Promo Code Input */}
                        <div className="mb-6">
                            <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700">Have a promo code?</label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <input
                                    type="text"
                                    id="promoCode"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    placeholder="Enter code"
                                    className="block w-full rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                                <button
                                    onClick={handleApplyPromoCode}
                                    className="bg-gray-200 text-gray-700 rounded-r-md px-4 py-2 text-sm font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>

                        <button className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105">
                            Proceed to Checkout
                        </button>

                        {/* Trust Badges */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500 mb-2">Secure Checkout Provided By:</p>
                            <div className="flex justify-center space-x-4">
                                <img src={visa} alt="Visa" className="h-6" />
                                <img src={mastercard} alt="Mastercard" className="h-6" />
                                <img src={paypal} alt="PayPal" className="h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;