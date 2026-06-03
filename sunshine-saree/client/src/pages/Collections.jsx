import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiSliders, FiX, FiCheck, FiShoppingCart, FiSearch } from 'react-icons/fi';
import API from '../utils/api';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Filter States
  const [categories, setCategories] = useState(searchParams.get('category')?.split(',') || []);
  const [priceRange, setPriceRange] = useState(Number(searchParams.get('maxPrice')) || 50000);
  const [occasions, setOccasions] = useState(searchParams.get('occasion')?.split(',') || []);
  const [color, setColor] = useState(searchParams.get('color') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const availableCategories = ['Silk', 'Cotton', 'Banarasi', 'Chanderi', 'Georgette', 'Designer'];
  const availableOccasions = ['Wedding', 'Festival', 'Casual', 'Party', 'Office', 'Traditional'];
  const colors = [
    { name: 'Red', hex: '#E11D48' },
    { name: 'Blue', hex: '#2563EB' },
    { name: 'Green', hex: '#16A34A' },
    { name: 'Yellow', hex: '#CA8A04' },
    { name: 'Pink', hex: '#DB2777' },
    { name: 'Orange', hex: '#EA580C' },
    { name: 'Black', hex: '#09090B' },
  ];

  // Sync state with query parameters
  useEffect(() => {
    setCategories(searchParams.get('category')?.split(',') || []);
    setPriceRange(Number(searchParams.get('maxPrice')) || 50000);
    setOccasions(searchParams.get('occasion')?.split(',') || []);
    setColor(searchParams.get('color') || '');
    setSort(searchParams.get('sort') || 'newest');
    setPage(Number(searchParams.get('page')) || 1);
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  // Fetch products based on filters
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (categories.length > 0) queryParams.set('category', categories.join(','));
        if (priceRange < 50000) queryParams.set('maxPrice', priceRange.toString());
        if (occasions.length > 0) queryParams.set('occasion', occasions.join(','));
        if (color) queryParams.set('color', color);
        if (sort) queryParams.set('sort', sort);
        if (search) queryParams.set('search', search);
        queryParams.set('page', page.toString());
        queryParams.set('limit', '9'); // 9 items per page

        const { data } = await API.get(`/products?${queryParams.toString()}`);
        setProducts(data.products);
        setTotalPages(data.pages);
        setTotalResults(data.total);
      } catch (error) {
        console.error('Error fetching filtered products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredProducts();
  }, [categories, priceRange, occasions, color, sort, page, search]);

  const updateQueryParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else {
        params.set(key, Array.isArray(value) ? value.join(',') : value.toString());
      }
    });
    setSearchParams(params);
  };

  const handleCategoryChange = (catName) => {
    const isAlreadyChecked = categories.includes(catName);
    const updated = isAlreadyChecked
      ? categories.filter((c) => c !== catName)
      : [...categories, catName];
    setPage(1);
    updateQueryParams({ category: updated, page: 1 });
  };

  const handleOccasionChange = (occName) => {
    const isAlreadyChecked = occasions.includes(occName);
    const updated = isAlreadyChecked
      ? occasions.filter((o) => o !== occName)
      : [...occasions, occName];
    setPage(1);
    updateQueryParams({ occasion: updated, page: 1 });
  };

  const handlePriceChange = (e) => {
    const val = Number(e.target.value);
    setPriceRange(val);
  };

  const handlePriceMouseUp = () => {
    setPage(1);
    updateQueryParams({ maxPrice: priceRange, page: 1 });
  };

  const handleColorChange = (colorName) => {
    const updated = color === colorName ? '' : colorName;
    setPage(1);
    updateQueryParams({ color: updated, page: 1 });
  };

  const handleSortChange = (e) => {
    setPage(1);
    updateQueryParams({ sort: e.target.value, page: 1 });
  };

  const handlePageChange = (p) => {
    setPage(p);
    updateQueryParams({ page: p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setCategories([]);
    setPriceRange(50000);
    setOccasions([]);
    setColor('');
    setSort('newest');
    setPage(1);
    setSearch('');
  };

  return (
    <>
      <Helmet>
        <title>Saree Collections | Sunshine Saree</title>
        <meta name="description" content="Browse our elegant saree collections: Banarasi, Kanjeevaram, Cotton, Chanderi, Georgette, and designer selections." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between border-b border-gray-200 pb-5 mb-8">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-maroon">Our Saree Collections</h1>
            <p className="text-gray-500 text-sm mt-1">Showing {products.length} of {totalResults} beautiful weaves</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:block">Sort By</label>
              <select
                id="sort"
                value={sort}
                onChange={handleSortChange}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20"
              >
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Customer Favorites</option>
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors"
            >
              <FiSliders className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Desktop Sidebar Filters */}
          <aside className="w-64 hidden lg:block flex-shrink-0 space-y-8 self-start sticky top-24">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-800">Filters</h2>
              {(categories.length > 0 || priceRange < 50000 || occasions.length > 0 || color || search) && (
                <button onClick={clearAllFilters} className="text-xs font-semibold text-maroon hover:underline">
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Saree Type</h3>
              <div className="space-y-2">
                {availableCategories.map((cat) => (
                  <label key={cat} className="flex items-center space-x-3 text-sm text-gray-600 cursor-pointer hover:text-maroon">
                    <input
                      type="checkbox"
                      checked={categories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                      className="w-4 h-4 rounded text-maroon border-gray-300 focus:ring-maroon/20"
                    />
                    <span>{cat} Saree</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span>Max Price</span>
                <span className="text-maroon">₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50000"
                step="500"
                value={priceRange}
                onChange={handlePriceChange}
                onMouseUp={handlePriceMouseUp}
                onTouchEnd={handlePriceMouseUp}
                className="w-full accent-maroon"
              />
            </div>

            {/* Color Filter */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleColorChange(c.name)}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center border ${
                      color === c.name ? 'scale-110 ring-2 ring-maroon/35' : 'border-gray-200'
                    }`}
                  >
                    {color === c.name && <FiCheck className={`w-3.5 h-3.5 ${c.name === 'Black' || c.name === 'Blue' ? 'text-white' : 'text-gray-900'}`} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion Filter */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Occasion</h3>
              <div className="space-y-2">
                {availableOccasions.map((occ) => (
                  <label key={occ} className="flex items-center space-x-3 text-sm text-gray-600 cursor-pointer hover:text-maroon">
                    <input
                      type="checkbox"
                      checked={occasions.includes(occ)}
                      onChange={() => handleOccasionChange(occ)}
                      className="w-4 h-4 rounded text-maroon border-gray-300 focus:ring-maroon/20"
                    />
                    <span>{occ} Wear</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-grow">
            {loading ? (
              <Loader />
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <span className="text-5xl">🥻</span>
                <h3 className="font-playfair text-xl font-bold text-gray-800">No Sarees Found</h3>
                <p className="text-gray-500 text-sm max-w-xs">We couldn't find any sarees matching your active filters. Try clearing some selections.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-maroon text-white rounded-full text-sm font-semibold hover:bg-maroon-dark transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <div key={product._id} className="group bg-white rounded-2xl overflow-hidden border border-maroon/5 premium-card">
                      <Link to={`/product/${product._id}`} className="block relative aspect-[4/5] overflow-hidden">
                        <img
                          src={product.images[0] || 'https://via.placeholder.com/400x500?text=Saree'}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.discountPrice > 0 && (
                          <span className="absolute top-4 left-4 bg-maroon text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            {Math.round((product.price - product.discountPrice)/product.price*100)}% OFF
                          </span>
                        )}
                        {product.stock === 0 && (
                          <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold tracking-wider text-sm">
                            OUT OF STOCK
                          </span>
                        )}
                      </Link>
                      <div className="p-5 space-y-3">
                        <span className="text-xs font-semibold text-golden uppercase tracking-wider">{product.category}</span>
                        <Link to={`/product/${product._id}`}>
                          <h3 className="font-playfair font-bold text-gray-800 text-lg group-hover:text-maroon transition-colors line-clamp-1">{product.name}</h3>
                        </Link>
                        <p className="text-xs text-gray-500 line-clamp-1">{product.fabric} • {product.color}</p>
                        <div className="flex items-center space-x-2">
                          {product.discountPrice > 0 ? (
                            <>
                              <span className="text-lg font-bold text-maroon">₹{product.discountPrice.toLocaleString('en-IN')}</span>
                              <span className="text-sm text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-maroon">₹{product.price.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className="w-full py-2.5 bg-maroon text-white rounded-xl text-sm font-medium hover:bg-maroon-dark transition-colors shadow-sm disabled:bg-gray-300 disabled:text-gray-500"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 pt-6">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                          page === i + 1
                            ? 'bg-maroon text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div onClick={() => setIsFilterDrawerOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>

          {/* Drawer Panel */}
          <div className="relative w-80 max-w-xs bg-[#FFF8F0] h-full flex flex-col p-6 shadow-2xl animate-slide-right overflow-y-auto ml-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                <FiSliders className="w-5 h-5 text-maroon" />
                <span>Filters</span>
              </h2>
              <button onClick={() => setIsFilterDrawerOpen(false)} className="p-1 rounded-full hover:bg-gray-200">
                <FiX className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Drawer Filter Content */}
            <div className="flex-grow space-y-8">
              {/* Category */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Saree Type</h3>
                <div className="space-y-2">
                  {availableCategories.map((cat) => (
                    <label key={cat} className="flex items-center space-x-3 text-sm text-gray-600 cursor-pointer hover:text-maroon">
                      <input
                        type="checkbox"
                        checked={categories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                        className="w-4 h-4 rounded text-maroon border-gray-300"
                      />
                      <span>{cat} Saree</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <span>Max Price</span>
                  <span className="text-maroon">₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={priceRange}
                  onChange={handlePriceChange}
                  onMouseUp={handlePriceMouseUp}
                  onTouchEnd={handlePriceMouseUp}
                  className="w-full accent-maroon"
                />
              </div>

              {/* Color */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleColorChange(c.name)}
                      style={{ backgroundColor: c.hex }}
                      className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center border ${
                        color === c.name ? 'scale-110 ring-2 ring-maroon/35' : 'border-gray-200'
                      }`}
                    >
                      {color === c.name && <FiCheck className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Occasion</h3>
                <div className="space-y-2">
                  {availableOccasions.map((occ) => (
                    <label key={occ} className="flex items-center space-x-3 text-sm text-gray-600 cursor-pointer hover:text-maroon">
                      <input
                        type="checkbox"
                        checked={occasions.includes(occ)}
                        onChange={() => handleOccasionChange(occ)}
                        className="w-4 h-4 rounded text-maroon border-gray-300"
                      />
                      <span>{occ} Wear</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-6">
              <button
                onClick={clearAllFilters}
                className="w-full py-2.5 border border-maroon text-maroon hover:bg-maroon hover:text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Collections;
