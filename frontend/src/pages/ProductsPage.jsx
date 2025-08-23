// frontend/src/pages/ProductsPage.jsx

import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchProducts } from '../api/productsApi';
import ProductCard from '../components/ProductCard';
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';
import { Toaster, toast } from 'react-hot-toast';
import { FaChevronRight } from 'react-icons/fa';
import axios from 'axios'; // Import axios for API calls

// Component for a horizontal scrollable product section
const ProductSection = ({ title, products, showCountdown, searchTerm, onAddToCart }) => {
    // Filter products based on searchTerm, case-insensitive
    const filteredProducts = useMemo(() => {
        if (!searchTerm) {
            return products;
        }
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    // Render nothing if no products match the search
    if (filteredProducts.length === 0) {
        return null;
    }

    return (
        <div className="bg-white p-2 sm:p-3 rounded-xl shadow-lg my-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
                    {showCountdown && (
                        // A placeholder for the countdown timer
                        <div className="flex items-center space-x-2 text-red-500 font-bold">
                            <span className="text-sm md:text-base">Ends in:</span>
                            <div className="flex space-x-1 text-base">
                                <span className="bg-red-500 text-white px-2 py-1 rounded-md">12h</span>
                                <span className="bg-red-500 text-white px-2 py-1 rounded-md">34m</span>
                                <span className="bg-red-500 text-white px-2 py-1 rounded-md">56s</span>
                            </div>
                        </div>
                    )}
                </div>
                <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
                    <span className="font-semibold text-sm">See all</span>
                    <FaChevronRight className="ml-1 text-sm" />
                </button>
            </div>
            <div className="relative overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 pb-4">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="min-w-[200px] max-w-[200px] flex-shrink-0 snap-center">
                            <ProductCard product={product} onAddToCart={onAddToCart} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

ProductSection.propTypes = {
    title: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(PropTypes.object).isRequired,
    showCountdown: PropTypes.bool,
    searchTerm: PropTypes.string,
    onAddToCart: PropTypes.func.isRequired,
};

// Component for a horizontal scrollable categories section
const CategorySection = ({ categories, searchTerm }) => {
    // Filter categories based on searchTerm, case-insensitive
    const filteredCategories = useMemo(() => {
        if (!searchTerm) {
            return categories;
        }
        return categories.filter(category =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categories, searchTerm]);

    // Render nothing if no categories match the search
    if (filteredCategories.length === 0) {
        return null;
    }

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg my-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <div className="relative overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 pb-4">
                    {filteredCategories.map(category => (
                        <div key={category.id} className="flex-shrink-0 snap-center">
                            <div className="flex flex-col items-center w-[120px] h-[140px] bg-gray-100 rounded-lg p-3 hover:bg-gray-200 transition-colors duration-200">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-24 h-24 object-contain"
                                />
                                <span className="mt-2 text-sm font-semibold text-gray-700 text-center truncate w-full">
                                    {category.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

CategorySection.propTypes = {
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            image: PropTypes.string.isRequired,
        })
    ).isRequired,
    searchTerm: PropTypes.string,
};

// Component for a single category product list
const CategoryProductsSection = ({ categoryName, products, searchTerm, onAddToCart }) => {
    // Filter products for the specific category and based on the search term
    const categoryProducts = useMemo(() => {
        const filteredByCategory = products.filter(product => product.category === categoryName);
        if (!searchTerm) {
            return filteredByCategory;
        }
        return filteredByCategory.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, categoryName, searchTerm]);

    // Render nothing if no products match
    if (categoryProducts.length === 0) {
        return null;
    }

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg my-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{categoryName}</h2>
                <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
                    <span className="font-semibold text-sm">See all</span>
                    <FaChevronRight className="ml-1 text-sm" />
                </button>
            </div>
            <div className="relative overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 pb-4">
                    {categoryProducts.map(product => (
                        <div key={product.id} className="min-w-[200px] max-w-[200px] flex-shrink-0 snap-center">
                            <ProductCard product={product} onAddToCart={onAddToCart} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

CategoryProductsSection.propTypes = {
    categoryName: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(PropTypes.object).isRequired,
    searchTerm: PropTypes.string,
    onAddToCart: PropTypes.func.isRequired,
};

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (err) {
                setError('Failed to fetch products. Please try again later.');
                toast.error('Failed to load products.');
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    // Memoized lists of products for each section to avoid re-calculating on every render
    const flashSales = useMemo(() => products.slice(0, 10).map(p => ({ ...p, badge: 'Sale', initialPrice: (p.price * 1.5).toFixed(2), unitsLeft: Math.floor(Math.random() * 50) + 1 })), [products]);
    const topSelling = useMemo(() => products.slice(10, 20).map(p => ({ ...p, badge: 'Popular', initialPrice: (p.price * 1.1).toFixed(2), unitsLeft: Math.floor(Math.random() * 100) + 1 })), [products]);
    const discountedDeals = useMemo(() => products.slice(20, 30).map(p => ({ ...p, badge: 'Discount', initialPrice: (p.price * 1.3).toFixed(2), unitsLeft: Math.floor(Math.random() * 75) + 1 })), [products]);
    const topPicks = useMemo(() => products.slice(30, 40).map(p => ({ ...p, initialPrice: (p.price * 1.2).toFixed(2), unitsLeft: Math.floor(Math.random() * 60) + 1 })), [products]);
    
    // Memoized product categories for the categories section
    const uniqueCategories = useMemo(() => {
        const categories = [...new Set(products.map(p => p.category))];
        return categories;
    }, [products]);
    
    const categoryCounts = useMemo(() => {
        return products.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});
    }, [products]);

    // Function to handle adding a product to the cart (placeholder)
    const handleAddToCart = useCallback(async (product, quantity = 1) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to add items to your cart.');
            return;
        }

        try {
            await axios.post('/api/cart', {
                productId: product.id,
                quantity: quantity
            }, {
                headers: { 'x-auth-token': token }
            });
            toast.success(`${quantity} x ${product.name} added to cart!`);
        } catch (err) {
            toast.error('Failed to add item to cart. Please try again.');
        }
    }, []);

    const handleCategoryToggle = useCallback((category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((cat) => cat !== category)
                : [...prev, category]
        );
    }, []);

    const clearFilters = useCallback(() => {
        setSelectedCategories([]);
        setMinPrice('');
        setMaxPrice('');
    }, []);

    const areFiltersActive = useMemo(() => {
        return selectedCategories.length > 0 || minPrice !== '' || maxPrice !== '';
    }, [selectedCategories, minPrice, maxPrice]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-2xl font-semibold text-gray-600">Loading products...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-2xl font-semibold text-red-600">{error}</div>;
    }

    // A placeholder for the main hero banner
    const heroBanner = (
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8 md:p-12 rounded-xl shadow-lg mb-6 flex items-center justify-between">
            <div className="max-w-xl">
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-2">
                    Discover Amazing Deals
                </h1>
                <p className="text-base md:text-lg mb-4 opacity-90">
                    Explore a wide range of products at unbeatable prices.
                </p>
                <button className="bg-white text-blue-700 font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300">
                    Shop Now
                </button>
            </div>
            <div className="hidden md:block">
                {/* Placeholder for an image or graphic */}
                <svg className="w-32 h-32 md:w-48 md:h-48 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20H4a2 2 0 01-2-2V4a2 2 0 012-2h6a2 2 0 012 2v14a2 2 0 01-2 2zm10-2h-6a2 2 0 01-2-2V4a2 2 0 012-2h6a2 2 0 012 2v14a2 2 0 01-2 2z" />
                </svg>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-100 min-h-screen">
            <Toaster position="top-right" />
            <div className="flex flex-col lg:flex-row">
                {/* Sidebar section */}
                <div>
                    <Sidebar 
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        minPrice={minPrice}
                        setMinPrice={setMinPrice}
                        maxPrice={maxPrice}
                        setMaxPrice={setMaxPrice}
                        handleCategoryToggle={handleCategoryToggle}
                        clearFilters={clearFilters}
                        areFiltersActive={areFiltersActive}
                        categories={uniqueCategories}
                        categoryCounts={categoryCounts}
                    />
                </div>

                {/* Main content area */}
                <div className="w-full lg:w-3/4 xl:w-10/12 p-4 md:p-4 lg:p-2">
                    {/* 1) Horizontal card extending to the full width of the screen */}
                    {heroBanner}

                    {/* 2) Flash Sales Section */}
                    <ProductSection
                        title="Flash Sales"
                        products={flashSales}
                        showCountdown={true}
                        searchTerm={searchTerm}
                        onAddToCart={handleAddToCart}
                    />
                    
                    {/* 3) Top Selling Items Section */}
                    <ProductSection
                        title="Top Selling Items"
                        products={topSelling}
                        searchTerm={searchTerm}
                        onAddToCart={handleAddToCart}
                    />

                    {/* 4) Discounted Deals Section */}
                    <ProductSection
                        title="Discounted Deals"
                        products={discountedDeals}
                        searchTerm={searchTerm}
                        onAddToCart={handleAddToCart}
                    />
                    
                    {/* 5) Top Picks For you Section */}
                    <ProductSection
                        title="Top Picks For You"
                        products={topPicks}
                        searchTerm={searchTerm}
                        onAddToCart={handleAddToCart}
                    />

                    {/* 6) All Categories Section */}
                    <CategorySection
                        categories={uniqueCategories.map(cat => ({
                            id: cat,
                            name: cat,
                            image: `/images/category${uniqueCategories.indexOf(cat) + 1}.png`
                        }))}
                        searchTerm={searchTerm}
                    />

                    {/* Dynamically create sections for other categories */}
                    {uniqueCategories.map(category => (
                        <CategoryProductsSection
                            key={category}
                            categoryName={category}
                            products={products}
                            searchTerm={searchTerm}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;