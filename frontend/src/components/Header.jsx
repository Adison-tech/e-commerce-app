// frontend/src/components/Header.jsx
import { Link } from 'react-router-dom';
import { FaRegUser, FaQuestionCircle, FaShoppingCart, FaSearch } from 'react-icons/fa';
import PropTypes from 'prop-types';

const Header = ({ setSearchTerm }) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container max-w-full px-5 py-3 flex items-center justify-between">
                {/* Logo */}
                <div className="text-2xl font-bold text-gray-800">
                    <Link to="/">E-Shop</Link>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-lg mx-6 md:flex">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search for products, brands, or categories"
                            className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 text-white rounded-full">
                            <FaSearch />
                        </div>
                    </div>
                </div>

                {/* Account, Help, and Cart Links */}
                <nav className="flex items-center space-x-6 text-gray-600">
                    <Link to="/profile" className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                        <FaRegUser className="text-xl" />
                        <span className="hidden sm:inline">Account</span>
                    </Link>
                    <Link to="/help" className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                        <FaQuestionCircle className="text-xl" />
                        <span className="hidden sm:inline">Help</span>
                    </Link>
                    <Link to="/cart" className="relative flex items-center space-x-1 hover:text-blue-500 transition-colors">
                        <FaShoppingCart className="text-xl" />
                        <span className="hidden sm:inline">Cart</span>
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">0</span>
                    </Link>
                </nav>
            </div>

            {/* Mobile Search Bar (hidden on large screens) */}

        </header>
    );
};

Header.propTypes = {
    setSearchTerm: PropTypes.func.isRequired,
};

export default Header;