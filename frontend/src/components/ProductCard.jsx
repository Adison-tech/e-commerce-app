// frontend/src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductCard = ({ product, onAddToCart }) => {
    // Ensure price is a number before calling toFixed()
    const displayPrice = parseFloat(product.price);
    const imageUrlBase = '/images/';

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
                <p className="text-gray-600 text-sm mb-4">
                    Category: <span className="font-medium">{product.category}</span>
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-700">
                        Kes {isNaN(displayPrice) ? 'N/A' : displayPrice.toFixed(2)}
                    </span>
                    <button
                        // Use the onAddToCart prop to trigger the toast in the parent component
                        onClick={() => onAddToCart(product)}
                        className="bg-blue-600 text-white px-2 py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        image: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        stock: PropTypes.number,
        badge: PropTypes.string,
    }).isRequired,
    // Add the new onAddToCart prop to propTypes
    onAddToCart: PropTypes.func.isRequired,
};

export default React.memo(ProductCard);