// frontend/src/components/Sidebar.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Sidebar = ({
    selectedCategories,
    minPrice,
    maxPrice,
    handleCategoryToggle,
    setMinPrice,
    setMaxPrice,
    clearFilters,
    areFiltersActive,
    categories,
    categoryCounts
}) => {
    return (
        <div className="hidden sm:block md:block bg-white w-48 px-4 py-3 rounded-x shadow-lg min-h-screen max-h-screen sticky md:top-16">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Filters</h4>
            {areFiltersActive && (
               <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800 mb-4 font-medium">
                    Clear all filters
               </button>
            )}

            <div className="mb-2">
                <h5 className="font-semibold text-gray-800 mb-2">Price Range</h5>
                <div className="flex gap-1">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none font-sm focus:ring-1 focus:ring-blue-500"
                        aria-label="Minimum Price"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none font-sm focus:ring-1 focus:ring-blue-500"
                        aria-label="Maximum Price"
                    />
                </div>
            </div>

            <div className="mb-6">
                <h5 className="font-semibold text-gray-800 mb-2">Categories</h5>
                {categories.map((category) => (
                    // Add the 'key' prop here
                    <div key={category} className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id={`cat-${category}`}
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryToggle(category)}
                                className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={`cat-${category}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                                {category}
                            </label>
                        </div>
                        <span className="text-xs text-gray-500 font-semibold">{categoryCounts[category] || 0}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

Sidebar.propTypes = {
    selectedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
    minPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    maxPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    handleCategoryToggle: PropTypes.func.isRequired,
    setMinPrice: PropTypes.func.isRequired,
    setMaxPrice: PropTypes.func.isRequired,
    clearFilters: PropTypes.func.isRequired,
    areFiltersActive: PropTypes.bool.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    categoryCounts: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default Sidebar;