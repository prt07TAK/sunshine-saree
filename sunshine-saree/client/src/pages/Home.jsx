import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowRight, FiPhone, FiMail, FiMapPin, FiTruck, FiRefreshCw, FiShield, FiHeadphones } from 'react-icons/fi';
import API from '../utils/api';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState('');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/products/featured');
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      navigate(`/track-order?id=${orderId.trim()}`);
    } else {
      toast.error('Please enter a valid Order ID');
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const categories = [
    { name: 'Silk', label: 'Silk', desc: 'Lustrous Kanjeevaram & Tussar weaves', icon: '🥻', bg: 'from-amber-500/10 to-orange-500/10' },
    { name: 'Banarasi', label: 'Banarasi', desc: 'Royal golden zari work from Varanasi', icon: '✨', bg: 'from-maroon/10 to-golden/10' },
    { name: 'Chanderi', label: 'Chanderi', desc: 'Lightweight sheer cotton silk blend', icon: '🌸', bg: 'from-rose-500/10 to-pink-500/10' },
    { name: 'Cotton', label: 'Cotton', desc: 'Breathable block-prints for daily grace', icon: '🍃', bg: 'from-emerald-500/10 to-teal-500/10' },
    { name: 'Georgette', label: 'Georgette', desc: 'Flowy silhouettes with beautiful sequins', icon: '💎', bg: 'from-blue-500/10 to-indigo-500/10' },
    { name: 'Designer', label: 'Designer', desc: 'Modern organza & contemporary concepts', icon: '🎨', bg: 'from-purple-500/10 to-fuchsia-500/10' },
  ];

  const usps = [
    { icon: <FiShield className="w-8 h-8 text-maroon" />, title: 'Authentic Weaves', desc: 'Directly sourced from Indian master artisans.' },
    { icon: <FiTruck className="w-8 h-8 text-maroon" />, title: 'Free Shipping India', desc: 'Complimentary shipping across India on orders above ₹999.' },
    { icon: <FiRefreshCw className="w-8 h-8 text-maroon" />, title: '7-Day Easy Returns', desc: 'Hassle-free sizing exchanges or returns within a week.' },
    { icon: <FiHeadphones className="w-8 h-8 text-maroon" />, title: 'Personal Support', desc: 'Connect directly with our store team for personalized assistance.' },
  ];

  const testimonials = [
    { name: 'Priya Sharma', location: 'Jaipur', rating: 5, comment: 'The crimson Banarasi saree I ordered is drop-dead gorgeous! The golden Zari borders are exceptionally detailed. Will definitely buy again.' },
    { name: 'Meenakshi Iyer', location: 'Chennai', rating: 5, comment: 'I was hesitant about ordering Kanjeevaram silk online, but Sunshine Saree proved me wrong. Beautiful texture, authentic silk mark feel.' },
    { name: 'Ananya Goel', location: 'Delhi', rating: 5, comment: 'Extremely prompt delivery and very courteous customer support. The Mulmul cotton saree is soft as a cloud. Perfect for summer.' },
  ];

  return (
    <>
      <Helmet>
        <title>Sunshine Saree | Traditional Rajasthani & Indian Sarees</title>
        <meta name="description" content="Discover India's finest handpicked sarees delivered to your doorstep from Sujangarh, Rajasthan. Shop Banarasi, Silk, Chanderi, Cotton, and Designer Sarees." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-maroon-dark to-maroon text-white py-20 lg:py-32">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,160,23,0.15),transparent_45%)]"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-golden/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:w-2/3 space-y-6 animate-slide-up">
            <span className="inline-block px-4 py-1.5 bg-golden/20 text-golden-light rounded-full text-xs font-semibold tracking-widest uppercase">
              👑 Traditional Indian Elegance
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold leading-tight">
              Drape Yourself in <span className="shimmer-text">Elegance</span>
            </h1>
            <p className="text-lg text-white/80 max-w-xl font-light leading-relaxed">
              Discover India's finest handpicked sarees — delivered directly to your doorstep from the historic city of Sujangarh, Rajasthan.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/collections"
                className="px-8 py-3.5 bg-golden text-dark-brown rounded-full font-medium hover:bg-golden-light transition-all shadow-lg hover:shadow-golden/20 hover:scale-105"
              >
                Shop Collections
              </Link>
              <Link
                to="/track-order"
                className="px-8 py-3.5 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-all hover:scale-105"
              >
                Track Your Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-16 bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-3xl font-playfair font-bold text-maroon">Explore Our Collections</h2>
            <div className="w-24 h-1 bg-golden mx-auto"></div>
            <p className="text-gray-600 text-sm max-w-md mx-auto">Browse through our curated traditional weaves sourced from master artisans.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/collections?category=${cat.name}`}
                className="group flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-maroon/5 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${cat.bg} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="font-playfair font-bold text-gray-800 text-lg group-hover:text-maroon transition-colors">{cat.label}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-tight">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-3xl font-playfair font-bold text-maroon">Most Loved Sarees</h2>
              <div className="w-24 h-1 bg-golden mx-auto sm:mx-0"></div>
              <p className="text-gray-600 text-sm">Our highly-rated best sellers chosen by customers nationwide.</p>
            </div>
            <Link
              to="/collections"
              className="mt-4 sm:mt-0 inline-flex items-center space-x-2 text-maroon hover:text-maroon-light font-semibold transition-colors"
            >
              <span>View All Products</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <div key={product._id} className="group bg-[#FFF8F0] rounded-2xl overflow-hidden border border-maroon/5 premium-card">
                  <Link to={`/product/${product._id}`} className="block relative aspect-[4/5] overflow-hidden">
                    <img
                      src={product.images[0] || 'https://via.placeholder.com/400x500?text=Saree'}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.discountPrice > 0 && (
                      <span className="absolute top-4 left-4 bg-maroon text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        SALE
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
                          <span className="text-xs font-bold text-green-600">({Math.round((product.price - product.discountPrice)/product.price*100)}% Off)</span>
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
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {usps.map((usp, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-maroon/5">
                <div className="p-4 bg-maroon/5 rounded-full mb-4">{usp.icon}</div>
                <h3 className="font-playfair font-bold text-gray-800 text-lg mb-2">{usp.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{usp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-3xl font-playfair font-bold text-maroon">What Our Customers Say</h2>
            <div className="w-24 h-1 bg-golden mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="p-8 bg-[#FFF8F0] rounded-2xl border border-maroon/5 relative">
                <span className="text-5xl text-golden/30 font-serif absolute top-4 left-4">“</span>
                <div className="flex text-golden mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6 italic relative z-10">"{t.comment}"</p>
                <div>
                  <h4 className="font-bold text-gray-800">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.location}, India</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track Order Banner */}
      <section className="py-16 bg-gradient-to-r from-maroon to-maroon-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(212,160,23,0.1),transparent_35%)]"></div>
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold">Track Your Order in Real-Time</h2>
          <p className="text-white/80 text-sm sm:text-base max-w-md mx-auto">
            Check the status of your saree order as it travels from our store in Sujangarh to your home.
          </p>
          <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your Order ID (e.g. SS-20260603-1234)"
              className="flex-grow px-5 py-3.5 rounded-full bg-white text-gray-800 placeholder-gray-400 outline-none text-sm focus:ring-2 focus:ring-golden/50"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-golden hover:bg-golden-light text-dark-brown font-semibold rounded-full text-sm transition-all hover:scale-105"
            >
              Track Order
            </button>
          </form>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-3 text-gray-700">
              <FiMapPin className="w-5 h-5 text-maroon flex-shrink-0" />
              <span className="text-sm font-medium">Store: Near Ashok Circle, Sujangarh, Rajasthan</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="tel:+916203569455" className="flex items-center space-x-2 text-gray-700 hover:text-maroon text-sm font-medium transition-colors">
                <FiPhone className="w-5 h-5 text-maroon" />
                <span>+91 6203569455</span>
              </a>
              <a href="mailto:A.amansingh0143@gmail.com" className="flex items-center space-x-2 text-gray-700 hover:text-maroon text-sm font-medium transition-colors">
                <FiMail className="w-5 h-5 text-maroon" />
                <span>A.amansingh0143@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
