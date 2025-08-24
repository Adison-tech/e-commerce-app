// frontend/src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaShoppingCart, FaHeart } from 'react-icons/fa'; // Import FaHeart for wishlist

const ProductCard = ({ product, onAddToCart }) => {
    // Calculate final price with discount, defaulting discount to 0 if not provided
    const finalPrice = product.price - (product.price * (product.discount || 0) / 100);

    // Ensure price is a number before calling toFixed()
    const displayPrice = parseFloat(product.price);
    const displayInitialPrice = parseFloat(product.initialPrice); // For crossed-out price
    const imageUrlBase = '/images/';

    const unitsLeft = product.stock || 0; // Default to 0 if stock is not provided
    const totalStock = product.initialStock || 100; // Assuming an initial stock for progress bar, or get from product
    const stockPercentage = (unitsLeft / totalStock) * 100;

    // Determine the image source: use direct URL if it's an absolute path, otherwise prepend imageUrlBase
    const imageSrc = product.image.startsWith('http') ? product.image : imageUrlBase + product.image;

    return (
        <div className="group bg-white rounded-2xl shadow-xl overflow-hidden transform transition-transform hover:scale-102 hover:shadow-2xl duration-300 ease-in-out relative">
            {/* Existing badge display */}
            {product.badge && (
                <span className={`absolute top-1 left-1 px-2 py-1 rounded-full text-xs font-semibold z-10
                    ${product.badge === 'Sale' ? 'bg-red-500 text-white' :
                      product.badge === 'New' ? 'bg-green-500 text-white' :
                      product.badge === 'Low Stock' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-white'
                    }`
                }>
                    {product.badge}
                </span>
            )}
            
            {/* NEW: Discount percentage badge */}
            {product.discount > 0 && (
                <span className="absolute top-1 right-1 px-2 py-1 rounded-full text-xs font-bold z-10 bg-red-600 text-white">
                    -{product.discount}%
                </span>
            )}

            <div className="relative overflow-hidden">
                <Link to={`/products/${product.id}`} className="block">
                    <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-full h-48 object-contain group-hover:opacity-90 transition-opacity duration-300"
                    />
                </Link>
                {/* NEW: Interactive overlay with Add to Cart and Wishlist buttons */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-4">
                        <button
                            aria-label="Add to cart"
                            onClick={() => onAddToCart(product)}
                            className="bg-white p-3 rounded-full text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                        >
                            <FaShoppingCart />
                        </button>
                        <button aria-label="Add to wishlist" className="bg-white p-3 rounded-full text-gray-700 hover:text-red-500 transition-colors duration-200">
                            <FaHeart />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-3">
                <h3 className="font-semibold text-lg mb-2 text-gray-900 truncate" title={product.name}>
                    {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                    Category: <span className="font-medium">{product.category}</span>
                </p>

                {/* Combined Price, Discount, Rating, and Reviews Display */}
                <div className="flex items-baseline justify-between mb-2">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-bold text-indigo-700"> {/* Updated color */}
                            Kes {isNaN(finalPrice) ? 'N/A' : finalPrice.toFixed(2)}
                        </span>
                        {product.discount > 0 && !isNaN(displayPrice) && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                                Kes {displayPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center text-amber-400 text-xs">
                        {'★'.repeat(product.rating || 0)}{'☆'.repeat(5 - (product.rating || 0))}
                    </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">({product.reviews || 0} Reviews)</p>

                {product.stock !== undefined && ( // Only show units left if stock is provided
                    <div className="mb-4">
                        <p className="text-xs text-gray-700 mb-1">Units Left: {unitsLeft}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-indigo-500 h-2 rounded-full" // Updated color
                                style={{ width: `${stockPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Updated Add to Cart Button */}
                <button
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    <FaShoppingCart className="inline-block mr-2" />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        image: PropTypes.string.isRequired,
        category: PropTypes.string, // Made optional as not always present in dummy data
        discount: PropTypes.number,
        rating: PropTypes.number,
        reviews: PropTypes.number,
        stock: PropTypes.number,
        initialStock: PropTypes.number,
        badge: PropTypes.string,
        initialPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }).isRequired,
    onAddToCart: PropTypes.func.isRequired,
};

export default React.memo(ProductCard);