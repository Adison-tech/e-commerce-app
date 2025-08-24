// frontend/src/pages/CategoryPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaTh, FaList, FaShoppingCart, FaHeart, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { Toaster, toast } from 'react-hot-toast'; // Import for toast notifications

// ---------------------------------------------------------------------------------------
//  ProductCard Component (Remains the same as your version)
// ---------------------------------------------------------------------------------------
const ProductCard = React.memo(({ product, onAddToCart }) => {
  const displayPrice = parseFloat(product.price);
  const displayInitialPrice = parseFloat(product.initialPrice);
  const imageUrlBase = '/images/';

  const unitsLeft = product.stock || 0;
  const totalStock = product.initialStock || 100;
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
          Brand: <span className="font-medium">{product.brand}</span>
        </p>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xl font-bold text-blue-700">
            ${isNaN(displayPrice) ? 'N/A' : displayPrice.toFixed(2)}
          </span>
          {product.initialPrice && !isNaN(displayInitialPrice) && displayInitialPrice > displayPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">
              ${displayInitialPrice.toFixed(2)}
            </span>
          )}
        </div>

        {product.stock !== undefined && (
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
        <div className="flex items-center text-amber-400 text-xs mb-2">
          {'★'.repeat(product.rating)}{'☆'.repeat(5 - product.rating)}
          <span className="text-gray-500 ml-2">({product.reviews} Reviews)</span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <FaShoppingCart className="inline mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
});

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    initialPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    image: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    reviews: PropTypes.number.isRequired,
    stock: PropTypes.number,
    initialStock: PropTypes.number,
    badge: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

const ITEMS_PER_PAGE = 12;

const FilterPanel = React.memo(({ filters, setFilters, availableBrands }) => {
  const [openSections, setOpenSections] = useState({
    price: true,
    brand: true,
    rating: true,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePriceChange = useCallback((e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: parseInt(e.target.value)
    }));
  }, [setFilters]);

  const handleBrandChange = useCallback((brand) => {
    setFilters(prev => {
      const newBrands = prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: newBrands };
    });
  }, [setFilters]);

  const handleRatingChange = useCallback((rating) => {
    setFilters(prev => ({ ...prev, rating }));
  }, [setFilters]);

  return (
    <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm h-fit sticky top-8">
      <h3 className="text-lg font-bold mb-4 border-b pb-2 text-gray-800">Filters</h3>
      <div className="mb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full cursor-pointer"
          aria-expanded={openSections.price}
          aria-controls="price-filter-panel"
        >
          <h4 className="font-semibold text-gray-700">Price</h4>
          {openSections.price ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </button>
        {openSections.price && (
          <div id="price-filter-panel" className="mt-4">
            <div className="flex justify-between text-xs text-gray-500">
              <span>${filters.minPrice}</span>
              <span>${filters.maxPrice}</span>
            </div>
            <input
              type="range"
              name="minPrice"
              min="0"
              max="500"
              value={filters.minPrice}
              onChange={handlePriceChange}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm accent-indigo-600"
            />
            <input
              type="range"
              name="maxPrice"
              min="0"
              max="500"
              value={filters.maxPrice}
              onChange={handlePriceChange}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm accent-indigo-600"
            />
          </div>
        )}
      </div>

      <div className="mb-6">
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full cursor-pointer"
          aria-expanded={openSections.brand}
          aria-controls="brand-filter-panel"
        >
          <h4 className="font-semibold text-gray-700">Brand</h4>
          {openSections.brand ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </button>
        {openSections.brand && (
          <div id="brand-filter-panel" className="mt-2 text-sm space-y-2">
            {availableBrands.map(brand => (
              <label key={brand} className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="form-checkbox h-4 w-4 text-indigo-600 rounded-sm focus:ring-0"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="mb-6">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full cursor-pointer"
          aria-expanded={openSections.rating}
          aria-controls="rating-filter-panel"
        >
          <h4 className="font-semibold text-gray-700">Rating</h4>
          {openSections.rating ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </button>
        {openSections.rating && (
          <div id="rating-filter-panel" className="mt-2 text-sm space-y-2">
            {[5, 4, 3, 2, 1].map(rating => (
              <label key={rating} className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.rating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span>
                  {'★'.repeat(rating)}{'☆'.repeat(5 - rating)} & up
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
});

const Pagination = React.memo(({ currentPage, totalPages, onPageChange }) => {
  const pages = useMemo(() => {
    const pageButtons = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pageButtons.push(<span key="start-ellipsis" className="text-gray-500 mx-1">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-4 py-2 border rounded-full text-sm font-semibold transition-colors duration-200 ${
            currentPage === i ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-indigo-100'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      pageButtons.push(<span key="end-ellipsis" className="text-gray-500 mx-1">...</span>);
    }

    return pageButtons;
  }, [totalPages, currentPage, onPageChange]);

  return (
    <div className="flex justify-center items-center mt-12 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Previous
      </button>
      {pages}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Next
      </button>
    </div>
  );
});

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    brands: [],
    minPrice: 0,
    maxPrice: 500,
    rating: 0,
  });
  const [sort, setSort] = useState('Featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all products from your backend API
        const response = await fetch('api/products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const allProducts = await response.json();

        // Filter products based on the dynamic category from the URL
        const categoryProducts = allProducts.filter(
          product => product.category === decodeURIComponent(categoryName)
        );

        setProducts(categoryProducts);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        toast.error('Failed to load products.');
        console.error("Fetching error: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
    // Re-fetch data whenever the categoryName in the URL changes
  }, [categoryName]);

  const availableBrands = useMemo(() => {
    return [...new Set(products.map(p => p.brand))];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(product => {
      const finalPrice = product.price - (product.price * (product.discount / 100 || 0));
      const isPriceMatch = finalPrice >= filters.minPrice && finalPrice <= filters.maxPrice;
      const isBrandMatch = filters.brands.length === 0 || filters.brands.includes(product.brand);
      const isRatingMatch = product.rating >= filters.rating;
      return isPriceMatch && isBrandMatch && isRatingMatch;
    });

    switch (sort) {
      case 'Price: Low to High':
        result.sort((a, b) => (a.price - (a.price * (a.discount / 100 || 0))) - (b.price - (b.price * (b.discount / 100 || 0))));
        break;
      case 'Price: High to Low':
        result.sort((a, b) => (b.price - (b.price * (b.discount / 100 || 0))) - (a.price - (a.price * (a.discount / 100 || 0))));
        break;
      case 'Rating: High to Low':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [products, filters, sort]);

  const totalFilteredProducts = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalFilteredProducts / ITEMS_PER_PAGE);

  const displayedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, filteredAndSortedProducts]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFilterOrSortChange = useCallback((newFilters, newSort) => {
    setFilters(newFilters);
    setSort(newSort);
    setCurrentPage(1);
  }, []);

  const handleSetFilters = useCallback((newFilters) => handleFilterOrSortChange(newFilters, sort), [handleFilterOrSortChange, sort]);
  const handleSetSort = useCallback((newSort) => handleFilterOrSortChange(filters, newSort), [handleFilterOrSortChange, filters]);

  const handleAddToCart = useCallback((product) => {
    toast.success(`${product.name} added to cart!`);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-center" aria-live="polite" aria-busy="true">
        <Toaster />
        <div className="text-center">
          <p className="text-xl text-gray-700">Loading products...</p>
          <div className="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Toaster />
        <div className="text-red-500 text-lg mb-4 text-center">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <nav className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:underline hover:text-indigo-600">Home</Link> &gt; <span className="font-semibold text-gray-700">{decodeURIComponent(categoryName)}</span>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">{decodeURIComponent(categoryName)}</h1>
            <p className="text-sm text-gray-500">
              Showing {Math.min(ITEMS_PER_PAGE * (currentPage - 1) + 1, totalFilteredProducts)}–{Math.min(ITEMS_PER_PAGE * currentPage, totalFilteredProducts)} of {totalFilteredProducts} Products
            </p>
          </div>

          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative group w-full">
              <button className="flex items-center justify-between w-full md:w-48 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200">
                <span>Sort by: {sort}</span>
                <FaChevronDown className="ml-2 w-3 h-3 text-gray-500 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute right-0 mt-1 w-full md:w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-200 invisible">
                {['Featured', 'Price: Low to High', 'Price: High to Low', 'Rating: High to Low'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleSetSort(option)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-2 hidden md:flex">
              <button
                aria-label="Grid view"
                onClick={() => setViewMode('grid')}
                className={`p-2 border rounded-md shadow ${viewMode === 'grid' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-300 hover:text-indigo-600'}`}
              >
                <FaTh />
              </button>
              <button
                aria-label="List view"
                onClick={() => setViewMode('list')}
                className={`p-2 border rounded-md shadow ${viewMode === 'list' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-300 hover:text-indigo-600'}`}
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <FilterPanel filters={filters} setFilters={handleSetFilters} availableBrands={availableBrands} />

          <div className="lg:col-span-3">
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
              {displayedProducts.length > 0 ? (
                displayedProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  <p>No products found for this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {totalFilteredProducts > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryPage;