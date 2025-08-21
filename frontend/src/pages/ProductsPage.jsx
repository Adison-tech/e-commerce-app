// frontend/src/pages/ProductsPage.jsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchProducts } from '../api/productsApi';
import ProductCard from '../components/ProductCard';
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar'; // Import the Sidebar component

// Custom hook for filtering and sorting products
const useFilteredProducts = (products, searchTerm, selectedCategories, minPrice, maxPrice, sortBy) => {
    const filteredProducts = useMemo(() => {
        let tempProducts = [...products];

        // Filtering by search term
        if (searchTerm) {
            tempProducts = tempProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtering by categories
        if (selectedCategories.length > 0) {
            tempProducts = tempProducts.filter(product =>
                selectedCategories.includes(product.category)
            );
        }

        // Filtering by price range
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);
        if (!isNaN(min)) {
            tempProducts = tempProducts.filter(product => product.price >= min);
        }
        if (!isNaN(max)) {
            tempProducts = tempProducts.filter(product => product.price <= max);
        }

        // Sorting Logic
        switch (sortBy) {
            case 'price-asc':
                tempProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                tempProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
            default:
                tempProducts.sort((a, b) => b.id - a.id);
                break;
        }

        return tempProducts;
    }, [products, searchTerm, selectedCategories, minPrice, maxPrice, sortBy]);

    return filteredProducts;
};

const ProductsPage = ({ searchTerm }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [displayCount, setDisplayCount] = useState(8);
    const productsPerPage = 8;

    const categories = useMemo(() => {
        const uniqueCategories = new Set(allProducts.map(product => product.category));
        return Array.from(uniqueCategories);
    }, [allProducts]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProducts();
                setAllProducts(data);
            } catch (err) {
                setError('Failed to fetch products. The server might be down.');
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    const filteredAndSortedProducts = useFilteredProducts(
        allProducts,
        searchTerm,
        selectedCategories,
        minPrice,
        maxPrice,
        sortBy
    );

    const handleCategoryToggle = useCallback((category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(cat => cat !== category)
                : [...prev, category]
        );
    }, []);

    const handleLoadMore = () => {
        setDisplayCount(prevCount => prevCount + productsPerPage);
    };

    const clearFilters = useCallback(() => {
        setSelectedCategories([]);
        setMinPrice('');
        setMaxPrice('');
    }, []);

    const areFiltersActive = useMemo(() => {
        return selectedCategories.length > 0 || minPrice !== '' || maxPrice !== '';
    }, [selectedCategories, minPrice, maxPrice]);

    const categoryCounts = useMemo(() => {
        const counts = {};
        allProducts.forEach(product => {
            counts[product.category] = (counts[product.category] || 0) + 1;
        });
        return counts;
    }, [allProducts]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-2 lg:px-2" aria-live="polite" aria-busy="true">
            <div className="container mx-auto flex flex-col md:flex-row gap-8">
                {/* Product Grid Loading Skeleton */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                            <div className="w-full h-56 bg-gray-200 rounded-md"></div>
                            <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="text-red-500 text-lg mb-4 text-center">{error}</div>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
                Retry
            </button>
        </div>
    );

    const productsToDisplay = filteredAndSortedProducts.slice(0, displayCount);

    return (
        <div className="min-h-screen bg-gray-50 py-1/4">
            <div className="container max-w-full sm:pr-2">
                <div className="sticky flex flex-col md:flex-row gap-2 ">
                    <Sidebar
                        selectedCategories={selectedCategories}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        handleCategoryToggle={handleCategoryToggle}
                        setMinPrice={setMinPrice}
                        setMaxPrice={setMaxPrice}
                        clearFilters={clearFilters}
                        areFiltersActive={areFiltersActive}
                        categories={categories}
                        categoryCounts={categoryCounts}
                    />

                    <div className="flex-1 mt-2">
                        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 mb-2">
                            <div className="flex items-center gap-2">
                                <label htmlFor="sort-by" className="text-gray-700 font-medium">Sort by:</label>
                                <select
                                    id="sort-by"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="p-1 border border-gray-300 rounded-md font-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {productsToDisplay.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                                {productsToDisplay.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="col-span-full flex flex-col items-center text-center text-gray-500 text-xl py-10" role="status">
                                <p className="mb-4 text-2xl font-semibold">No products found!</p>
                                <p className="mb-6">Your search or filter criteria did not match any products.</p>
                            </div>
                        )}

                        {displayCount < filteredAndSortedProducts.length && (
                            <div className="flex justify-center mt-12">
                                <button
                                    onClick={handleLoadMore}
                                    className="px-6 py-3 font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

ProductsPage.propTypes = {
    searchTerm: PropTypes.string,
};

export default ProductsPage;