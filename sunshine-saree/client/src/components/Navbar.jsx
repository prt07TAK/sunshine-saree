import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  FiSearch, FiShoppingCart, FiUser, FiMenu, FiX,
  FiChevronDown, FiLogOut, FiPackage, FiSettings, FiHeart
} from 'react-icons/fi';
import logoUrl from '../assets/logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img src={logoUrl} alt="Sunshine Saree Logo" className="h-10 w-10 object-contain group-hover:scale-110 transition-transform duration-300 rounded-full bg-white shadow-sm" />
            <span className="font-playfair text-xl lg:text-2xl font-bold text-maroon tracking-tight">
              Sunshine Saree
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative text-sm font-medium tracking-wide transition-colors duration-200 pb-1 ${
                  location.pathname === link.path
                    ? 'text-maroon'
                    : 'text-gray-700 hover:text-maroon'
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-golden transition-all duration-300 ${
                    location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-maroon/10 transition-colors"
                id="search-toggle"
              >
                <FiSearch className="w-5 h-5 text-gray-700" />
              </button>
              {isSearchOpen && (
                <form
                  onSubmit={handleSearch}
                  className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-3 animate-fade-in"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sarees..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-maroon focus:ring-2 focus:ring-maroon/20 outline-none text-sm"
                    autoFocus
                  />
                </form>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-maroon/10 transition-colors"
              id="cart-icon"
            >
              <FiShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-maroon text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-maroon/10 transition-colors"
                  id="user-menu-toggle"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-maroon to-golden flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <FiChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-maroon/5 hover:text-maroon transition-colors">
                      <FiUser className="w-4 h-4" /> <span>My Profile</span>
                    </Link>
                    <Link to="/orders" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-maroon/5 hover:text-maroon transition-colors">
                      <FiPackage className="w-4 h-4" /> <span>My Orders</span>
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-maroon/5 hover:text-maroon transition-colors">
                        <FiSettings className="w-4 h-4" /> <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" /> <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center space-x-2 px-5 py-2 bg-maroon text-white rounded-full text-sm font-medium hover:bg-maroon-dark transition-all shadow-md hover:shadow-lg"
              >
                <FiUser className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-maroon/10 transition-colors"
              id="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6 text-gray-700" />
              ) : (
                <FiMenu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-maroon/10 text-maroon'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/track-order"
              className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Track Order
            </Link>
            <Link
              to="/support"
              className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Support
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="block px-4 py-3 mt-2 bg-maroon text-white rounded-lg text-sm font-medium text-center"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
