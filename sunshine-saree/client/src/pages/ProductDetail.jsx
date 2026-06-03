import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiShoppingCart, FiCreditCard, FiCheck, FiTruck, FiRefreshCw, FiAlertTriangle, FiPlus, FiMinus } from 'react-icons/fi';
import API from '../utils/api';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.product);
        setReviews(data.reviews || []);
        setActiveImage(data.product.images[0] || 'https://via.placeholder.com/600x750?text=Saree');

        // Fetch related products (matching category)
        const resRelated = await API.get(`/products?category=${data.product.category}&limit=4`);
        setRelatedProducts(resRelated.data.products.filter((p) => p._id !== id));
      } catch (error) {
        console.error('Error fetching product details:', error);
        toast.error('Product not found');
        navigate('/collections');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, navigate]);

  const handleQuantityChange = (type) => {
    if (type === 'inc') {
      if (quantity < (product?.stock || 1)) {
        setQuantity(quantity + 1);
      } else {
        toast.warning('Max available stock reached');
      }
    } else {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(product, quantity);
      navigate('/checkout');
    } catch (error) {
      toast.error('Failed to initiate checkout');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      return toast.error('Please enter a review comment');
    }

    setSubmittingReview(true);
    try {
      const { data } = await API.post(`/products/${id}/reviews`, { rating, comment });
      setReviews([data, ...reviews]);
      setComment('');
      setRating(5);
      toast.success('Thank you for your review!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review. You can only review once.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader fullPage />;
  if (!product) return null;

  return (
    <>
      <Helmet>
        <title>{product.name} | Sunshine Saree</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-maroon">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/collections" className="hover:text-maroon">Collections</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-semibold">{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Image Showcase (Sticky) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden border border-maroon/5 bg-white">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnail strip */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 aspect-[4/5] rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImage === img ? 'border-maroon scale-95 shadow-md' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Purchase */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-maroon/10 text-maroon rounded-full text-xs font-semibold uppercase tracking-wider">
                {product.category} Saree
              </span>
              <h1 className="text-3xl font-playfair font-bold text-gray-800">{product.name}</h1>
              {/* Rating Summary */}
              <div className="flex items-center space-x-3">
                <div className="flex text-golden text-sm">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < Math.round(product.ratings) ? '★' : '☆'}</span>
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">{product.ratings.toFixed(1)} / 5.0</span>
                <span className="text-xs text-gray-400">({reviews.length} reviews)</span>
              </div>
            </div>

            {/* Price section */}
            <div className="p-4 bg-[#FFF8F0] rounded-2xl border border-maroon/5 flex items-center space-x-4">
              {product.discountPrice > 0 ? (
                <>
                  <span className="text-3xl font-bold text-maroon">₹{product.discountPrice.toLocaleString('en-IN')}</span>
                  <span className="text-lg text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    {Math.round((product.price - product.discountPrice)/product.price*100)}% Off
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-maroon">₹{product.price.toLocaleString('en-IN')}</span>
              )}
            </div>

            {/* Quick specifications */}
            <div className="grid grid-cols-2 gap-4 text-sm border-y border-gray-100 py-4">
              <div><strong className="text-gray-700">Fabric:</strong> <span className="text-gray-600">{product.fabric || 'N/A'}</span></div>
              <div><strong className="text-gray-700">Color:</strong> <span className="text-gray-600">{product.color || 'N/A'}</span></div>
              <div><strong className="text-gray-700">Blouse:</strong> <span className="text-gray-600">80cm Unstitched (Included)</span></div>
              <div><strong className="text-gray-700">Length:</strong> <span className="text-gray-600">5.5 Meters + Blouse</span></div>
            </div>

            {/* Stock status & quantity selector */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-semibold text-gray-700">Stock Availability:</span>
                {product.stock > 0 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <FiCheck className="mr-1" /> {product.stock} units available
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <FiAlertTriangle className="mr-1" /> Out of stock
                  </span>
                )}
              </div>

              {product.stock > 0 && (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                    <button onClick={() => handleQuantityChange('dec')} className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"><FiMinus /></button>
                    <span className="px-4 text-sm font-bold text-gray-800">{quantity}</span>
                    <button onClick={() => handleQuantityChange('inc')} className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"><FiPlus /></button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {product.stock > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className="py-3.5 bg-white border-2 border-maroon text-maroon rounded-xl font-semibold hover:bg-maroon/5 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
                >
                  <FiShoppingCart />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3.5 bg-maroon hover:bg-maroon-dark text-white rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] shadow-lg shadow-maroon/10"
                >
                  <FiCreditCard />
                  <span>Buy Now</span>
                </button>
              </div>
            ) : (
              <button disabled className="w-full py-3.5 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed">
                Out of Stock
              </button>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-100">
                <FiTruck className="w-5 h-5 text-maroon" />
                <span className="text-xs text-gray-600 font-medium">Pan-India Courier Service (4-7 Days)</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-100">
                <FiRefreshCw className="w-5 h-5 text-maroon" />
                <span className="text-xs text-gray-600 font-medium">7-Day Hassle-Free Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info Section */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <div className="flex space-x-8 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 font-semibold text-sm tracking-wide border-b-2 transition-all ${
                activeTab === 'details' ? 'border-maroon text-maroon' : 'border-transparent text-gray-500'
              }`}
            >
              Description & Craft
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 font-semibold text-sm tracking-wide border-b-2 transition-all ${
                activeTab === 'reviews' ? 'border-maroon text-maroon' : 'border-transparent text-gray-500'
              }`}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === 'details' ? (
            <div className="space-y-4 max-w-3xl leading-relaxed text-gray-700">
              <p>{product.description}</p>
              <h4 className="font-playfair text-lg font-bold text-gray-800 pt-4">Care Instructions</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Dry clean only to maintain silk finish.</li>
                <li>Store in cold, dry place wrapped in cotton muslin.</li>
                <li>Iron on medium-low silk setting using a press cloth.</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Review Input */}
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-2xl border border-maroon/5 space-y-4 max-w-xl">
                  <h4 className="font-playfair text-lg font-bold text-maroon">Write a Product Review</h4>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-semibold text-gray-700">Your Rating:</span>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white"
                    >
                      <option value="5">5 Stars (Excellent)</option>
                      <option value="4">4 Stars (Very Good)</option>
                      <option value="3">3 Stars (Good)</option>
                      <option value="2">2 Stars (Average)</option>
                      <option value="1">1 Star (Poor)</option>
                    </select>
                  </div>
                  <textarea
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you loved about this saree..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none text-sm focus:border-maroon focus:ring-1 focus:ring-maroon/20"
                  ></textarea>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 bg-maroon text-white font-semibold rounded-lg text-sm hover:bg-maroon-dark transition-colors disabled:bg-gray-300"
                  >
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm max-w-xl">
                  Please <Link to="/login" className="text-maroon font-bold hover:underline">login</Link> to submit a product review.
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product!</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r._id} className="border-b border-gray-100 pb-6 max-w-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-maroon to-golden flex items-center justify-center text-white font-bold text-xs uppercase">
                            {r.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <h5 className="font-bold text-gray-800 text-sm">{r.user?.name || 'Customer'}</h5>
                            <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex text-golden text-sm">
                          {[...Array(5)].map((_, idx) => (
                            <span key={idx}>{idx < r.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed pl-11">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-gray-100 pt-16">
            <h2 className="text-2xl font-playfair font-bold text-maroon mb-8">Related Masterpieces</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <div key={p._id} className="group bg-white rounded-2xl overflow-hidden border border-maroon/5 premium-card">
                  <Link to={`/product/${p._id}`} className="block relative aspect-[4/5] overflow-hidden">
                    <img
                      src={p.images[0] || 'https://via.placeholder.com/400x500?text=Saree'}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <div className="p-4 space-y-2">
                    <span className="text-xs font-semibold text-golden uppercase tracking-wider">{p.category}</span>
                    <Link to={`/product/${p._id}`}>
                      <h3 className="font-playfair font-bold text-gray-800 text-base group-hover:text-maroon transition-colors line-clamp-1">{p.name}</h3>
                    </Link>
                    <p className="text-lg font-bold text-maroon">₹{p.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
