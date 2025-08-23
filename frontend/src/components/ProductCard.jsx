// frontend/src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductCard = ({ product, onAddToCart }) => {
    // Ensure price is a number before calling toFixed()
    const displayPrice = parseFloat(product.price);
    const displayInitialPrice = parseFloat(product.initialPrice); // For crossed-out price
    const imageUrlBase = '/images/';

    const unitsLeft = product.stock || 0; // Default to 0 if stock is not provided
    const totalStock = product.initialStock || 100; // Assuming an initial stock for progress bar, or get from product
    const stockPercentage = (unitsLeft / totalStock) * 100;

    return (
        <div className="group bg-white rounded-2xl shadow-xl overflow-hidden transform transition-transform hover:scale-102 hover:shadow-2xl duration-300 ease-in-out relative">
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
            <Link to={`/products/${product.id}`} className="block">
                <img
                    src={imageUrlBase + product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain group-hover:opacity-90 transition-opacity duration-300"
                />
            </Link>
            <div className="p-3">
                <h3 className="font-semibold text-lg mb-2 text-gray-900 truncate" title={product.name}>
                    {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                    Category: <span className="font-medium">{product.category}</span>
                </p>
                <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xl font-bold text-blue-700">
                        Kes {isNaN(displayPrice) ? 'N/A' : displayPrice.toFixed(2)}
                    </span>
                    {product.initialPrice && !isNaN(displayInitialPrice) && displayInitialPrice > displayPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                            Kes {displayInitialPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                {product.stock !== undefined && ( // Only show units left if stock is provided
                    <div className="mb-4">
                        <p className="text-xs text-gray-700 mb-1">Units Left: {unitsLeft}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${stockPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => onAddToCart(product)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        initialPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Added
        image: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        stock: PropTypes.number, // Added
        initialStock: PropTypes.number, // Added for progress bar calculation
        badge: PropTypes.string,
    }).isRequired,
    onAddToCart: PropTypes.func.isRequired,
};

export default React.memo(ProductCard);
