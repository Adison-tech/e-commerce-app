// frontend/src/pages/ProductsPage.jsx

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api/productsApi';
import ProductCard from '../components/ProductCard';
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';
import { Toaster, toast } from 'react-hot-toast';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';
import Countdown from '../components/Countdown'; // Import the Countdown component

// -----------------------------------------------------------
// NEW: Sort Dropdown Component
// -----------------------------------------------------------
const SortDropdown = ({ sort, onSortChange }) => {
    const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Rating: High to Low'];

    return (
        <div className="relative group w-full md:w-48">
            <button className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200">
                <span>Sort by: {sort}</span>
                <FaChevronDown className="ml-2 w-3 h-3 text-gray-500 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            <div className="absolute right-0 mt-1 w-full md:w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-200 invisible">
                {sortOptions.map(option => (
                    <button
                        key={option}
                        onClick={() => onSortChange(option)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

SortDropdown.propTypes = {
    sort: PropTypes.string.isRequired,
    onSortChange: PropTypes.func.isRequired,
};

// -----------------------------------------------------------
// NEW: Standalone Sorting Logic Function
// -----------------------------------------------------------
const sortProducts = (products, sortType) => {
    const sortedProducts = [...products];

    switch (sortType) {
        case 'Price: Low to High':
            sortedProducts.sort((a, b) => (a.price - (a.price * a.discount / 100 || 0)) - (b.price - (b.price * b.discount / 100 || 0)));
            break;
        case 'Price: High to Low':
            sortedProducts.sort((a, b) => (b.price - (b.price * b.discount / 100 || 0)) - (a.price - (a.price * a.discount / 100 || 0)));
            break;
        case 'Rating: High to Low':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            break;
    }

    return sortedProducts;
};

// Component for a horizontal scrollable product section
const ProductSection = ({ title, products, showCountdown, onAddToCart, targetDate }) => {
    if (products.length === 0) {
        return null;
    }

    return (
        <div className="bg-white p-2 sm:p-3 rounded-xl shadow-lg my-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
                    {showCountdown && (
                        <Countdown targetDate={targetDate} />
                    )}
                </div>
                {/* Updated the Link to point to a general products page */}
                <Link to="/products" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
                    <span className="font-semibold text-sm">See all</span>
                    <FaChevronRight className="ml-1 text-sm" />
                </Link>
            </div>
            <div className="relative overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 pb-4">
                    {products.map(product => (
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
    onAddToCart: PropTypes.func.isRequired,
    targetDate: PropTypes.instanceOf(Date),
};

// Component for a horizontal scrollable categories section
const CategorySection = ({ categories }) => {
    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg my-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <div className="relative overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 pb-4">
                    {categories.map(category => (
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
};

// Component for a single category product list
const CategoryProductsSection = ({ categoryName, products, onAddToCart }) => {
    const categoryProducts = useMemo(() => {
        return products.filter(product => product.category === categoryName);
    }, [products, categoryName]);

    if (categoryProducts.length === 0) {
        return null;
    }

    const categoryPath = `/category/${encodeURIComponent(categoryName.toLowerCase().replace(/\s/g, '-'))}`;

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg my-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{categoryName}</h2>
                <Link
                    to={categoryPath} // Dynamically generate the link based on categoryName
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                    <span className="font-semibold text-sm">See all</span>
                    <FaChevronRight className="ml-1 text-sm" />
                </Link>
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
    const [sort, setSort] = useState('Featured'); // NEW: State for sorting

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

    // Memoized filtered and sorted list of products
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products;

        // Filter by selected categories
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product =>
                selectedCategories.includes(product.category)
            );
        }

        // Filter by price range
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);
        if (!isNaN(min) && minPrice !== '') {
            filtered = filtered.filter(product => product.price >= min);
        }
        if (!isNaN(max) && maxPrice !== '') {
            filtered = filtered.filter(product => product.price <= max);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // NEW: Apply sorting after filtering
        return sortProducts(filtered, sort);
    }, [products, searchTerm, selectedCategories, minPrice, maxPrice, sort]);

    // Memoized lists of products for each section to avoid re-calculating on every render
    const flashSales = useMemo(() => filteredAndSortedProducts.slice(0, 10).map(p => ({ ...p, badge: 'Sale', initialPrice: (p.price * 1.5).toFixed(2), unitsLeft: Math.floor(Math.random() * 50) + 1 })), [filteredAndSortedProducts]);
    const topSelling = useMemo(() => filteredAndSortedProducts.slice(10, 20).map(p => ({ ...p, badge: 'Popular', initialPrice: (p.price * 1.1).toFixed(2), unitsLeft: Math.floor(Math.random() * 100) + 1 })), [filteredAndSortedProducts]);
    const discountedDeals = useMemo(() => filteredAndSortedProducts.slice(20, 30).map(p => ({ ...p, badge: 'Discount', initialPrice: (p.price * 1.3).toFixed(2), unitsLeft: Math.floor(Math.random() * 75) + 1 })), [filteredAndSortedProducts]);
    const topPicks = useMemo(() => filteredAndSortedProducts.slice(30, 40).map(p => ({ ...p, initialPrice: (p.price * 1.2).toFixed(2), unitsLeft: Math.floor(Math.random() * 60) + 1 })), [filteredAndSortedProducts]);

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

    // Set a target date for the countdown
    const flashSaleTargetDate = useMemo(() => {
        const now = new Date();
        const target = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        return target;
    }, []);

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
        setSearchTerm('');
    }, []);

    const areFiltersActive = useMemo(() => {
        return selectedCategories.length > 0 || minPrice !== '' || maxPrice !== '' || searchTerm !== '';
    }, [selectedCategories, minPrice, maxPrice, searchTerm]);

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
            <div className="flex lg:flex-row">
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

                    {/* NEW: Sort Dropdown for the product sections */}
                    <div className="mb-4 flex justify-end">
                        <SortDropdown sort={sort} onSortChange={setSort} />
                    </div>

                    {/* 2) Flash Sales Section */}
                    <ProductSection
                        title="Flash Sales"
                        products={flashSales}
                        showCountdown={true}
                        onAddToCart={handleAddToCart}
                        targetDate={flashSaleTargetDate}
                    />

                    {/* 3) Top Selling Items Section */}
                    <ProductSection
                        title="Top Selling Items"
                        products={topSelling}
                        onAddToCart={handleAddToCart}
                    />

                    {/* 4) Discounted Deals Section */}
                    <ProductSection
                        title="Discounted Deals"
                        products={discountedDeals}
                        onAddToCart={handleAddToCart}
                    />

                    {/* 5) Top Picks For you Section */}
                    <ProductSection
                        title="Top Picks For You"
                        products={topPicks}
                        onAddToCart={handleAddToCart}
                    />

                    {/* 6) All Categories Section */}
                    <CategorySection
                        categories={uniqueCategories.map(cat => ({
                            id: cat,
                            name: cat,
                            image: `/images/category${uniqueCategories.indexOf(cat) + 1}.png`
                        }))}
                    />

                    {/* Dynamically create sections for other categories */}
                    {uniqueCategories.map(category => (
                        <CategoryProductsSection
                            key={category}
                            categoryName={category}
                            products={filteredAndSortedProducts}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;