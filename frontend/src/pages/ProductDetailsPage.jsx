// frontend/src/pages/ProductDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast'; // For notifications

// A separate component for the Quantity Selector
const QuantitySelector = ({ quantity, onQuantityChange }) => (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
        <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 transition"
            aria-label="Decrease quantity"
        >
            -
        </button>
        <span className="px-4 py-2 text-gray-800 font-medium">{quantity}</span>
        <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 transition"
            aria-label="Increase quantity"
        >
            +
        </button>
    </div>
);

// Main component starts here
const ProductDetailsPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [specifications, setSpecifications] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1); // State for quantity

    const imageUrlBase = '/images/';

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/products/${id}`);

                if (response.data.product && response.data.specifications) {
                    setProduct(response.data.product);
                    const groupedSpecs = response.data.specifications.reduce((acc, spec) => {
                        if (!acc[spec.title]) {
                            acc[spec.title] = [];
                        }
                        acc[spec.title].push(spec);
                        return acc;
                    }, {});
                    setSpecifications(groupedSpecs);
                } else {
                    setError('Invalid product data received.');
                }
            } catch (err) {
                setError('Failed to fetch product details. The product may not exist.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        // Here you would add the product to a global state or cart context
        // For now, we'll just show a notification
        toast.success(`${quantity} x ${product.name} added to cart!`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-xl font-medium text-gray-600 animate-pulse">Loading product details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-red-50">
                <div className="text-xl font-medium text-red-600">
                    <span role="img" aria-label="error icon">⚠️</span> Error: {error}
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-xl font-medium text-gray-600">Product not found.</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-full md:p-2 min-h-screen">
            <Toaster /> {/* Toast notification container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-2">
                {/* Product Image Gallery */}
                <div className="lg:col-span-2 flex flex-col items-center p-2">
                    <img
                        src={`${imageUrlBase}${product.image}`}
                        alt={product.name}
                        className="w-full max-h-[600px] object-contain rounded-xl shadow-lg"
                    />
                    {/* Placeholder for small gallery images */}
                    <div className="flex mt-4 space-x-2">
                        {/* You would map over product.images here */}
                        <div className="w-20 h-20 bg-gray-200 rounded-lg cursor-pointer hover:ring-2 ring-blue-500 transition-all"></div>
                        <div className="w-20 h-20 bg-gray-200 rounded-lg cursor-pointer hover:ring-2 ring-blue-500 transition-all"></div>
                    </div>
                </div>

                {/* Product Information and Actions */}
                <div className="lg:col-span-1 flex flex-col p-4 bg-gray-50 rounded-lg shadow-inner">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">{product.name}</h1>
                    <p className="text-lg text-gray-600 mb-4">
                        Brand: <span className="font-semibold text-gray-800">{product.brand}</span>
                    </p>

                    <div className="flex items-baseline mb-4">
                        <span className="text-4xl font-black text-blue-700">
                            KSh {parseFloat(product.price).toLocaleString()}
                        </span>
                        {product.original_price && (
                            <span className="ml-4 text-2xl text-gray-500 line-through">
                                KSh {parseFloat(product.original_price).toLocaleString()}
                            </span>
                        )}
                    </div>

                    {product.stock_status && (
                        <div className="mb-4 text-lg font-semibold text-green-600 bg-green-100 py-1 px-3 rounded-full self-start">
                            {product.stock_status}
                        </div>
                    )}
                    
                    <hr className="my-4 border-gray-200" />
                    
                    {/* Add to Cart Section */}
                    <div className="flex items-center space-x-4 mb-6">
                        <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
                        >
                            <span role="img" aria-label="shopping cart">🛒</span> Add to Cart
                        </button>
                    </div>

                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <h2 className="text-xl font-bold mb-2 text-gray-800">Product Details</h2>
                        <p className="text-gray-700 leading-relaxed">{product.short_description}</p>
                    </div>
                </div>
            </div>

            <hr className="my-10 border-gray-300" />

            {/* Specifications Section */}
            <div className="mt-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Full Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.keys(specifications).map(title => (
                        <div key={title} className="bg-gray-100 p-6 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                            <ul className="list-none space-y-2 text-gray-700">
                                {specifications[title].map(spec => (
                                    <li key={spec.spec_id} className="flex justify-between border-b border-gray-200 last:border-b-0 py-1">
                                        <span className="font-medium text-gray-600">{spec.key}:</span>
                                        <span className="ml-2 text-right">{spec.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            
            <hr className="my-10 border-gray-300" />

            {/* Seller and Delivery Information Section */}
            <div className="mt-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Delivery & Seller Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Seller Info */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Seller Information</h3>
                        <p className="text-gray-700">
                            <span className="font-medium text-gray-600">Seller:</span> {product.seller}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium text-gray-600">Seller Score:</span> {product.seller_score}%
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Verified Seller</p>
                    </div>

                    {/* Delivery & Warranty */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Delivery & Warranty</h3>
                        <p className="text-gray-700">
                            <span className="font-medium text-gray-600">Return Policy:</span> Easy Return, Quick Refund.
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium text-gray-600">Warranty:</span> {product.warranty}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-medium text-gray-600">Delivery Fees:</span> Varies by location
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;