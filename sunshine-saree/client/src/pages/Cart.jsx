import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cartItems, totalAmount, updateQuantity, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  const shippingCharges = totalAmount >= 999 || totalAmount === 0 ? 0 : 150;
  const grandTotal = totalAmount + shippingCharges;

  const handleQtyChange = async (productId, quantity, stock) => {
    if (quantity > stock) {
      return toast.warning('Cannot exceed available stock');
    }
    try {
      await updateQuantity(productId, quantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <>
      <Helmet>
        <title>Shopping Cart | Sunshine Saree</title>
        <meta name="description" content="View items in your Sunshine Saree shopping cart." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-playfair font-bold text-maroon mb-10">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-maroon/5 flex items-center justify-center text-4xl text-maroon">
              <FiShoppingBag />
            </div>
            <div className="space-y-2">
              <h3 className="font-playfair text-2xl font-bold text-gray-800">Your Cart is Empty</h3>
              <p className="text-gray-500 text-sm max-w-sm">It looks like you haven't added any elegant sarees to your cart yet.</p>
            </div>
            <Link
              to="/collections"
              className="px-8 py-3.5 bg-maroon hover:bg-maroon-dark text-white rounded-full font-semibold transition-all hover:scale-105 shadow-md"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Cart items list */}
            <div className="lg:col-span-8 space-y-6">
              {cartItems.map((item) => {
                const product = item.product;
                const id = product?._id || product;
                const img = product?.images?.[0] || 'https://via.placeholder.com/150?text=Saree';
                const name = product?.name || 'Traditional Saree';
                const stock = product?.stock || 5;

                return (
                  <div key={id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white rounded-2xl border border-maroon/5 shadow-sm space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <img src={img} alt={name} className="w-20 aspect-[4/5] object-cover rounded-lg border border-gray-100 flex-shrink-0" />
                      <div className="space-y-1">
                        <h4 className="font-playfair font-bold text-gray-800 text-base line-clamp-1">{name}</h4>
                        <p className="text-xs text-gray-400">Price: ₹{(product?.discountPrice || product?.price || item.price).toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-12">
                      {/* Qty Stepper */}
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                        <button
                          onClick={() => handleQtyChange(id, item.quantity - 1, stock)}
                          className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                        >
                          <FiMinus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => handleQtyChange(id, item.quantity + 1, stock)}
                          className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                        >
                          <FiPlus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className="font-semibold text-gray-800 text-sm w-24 text-right">
                        ₹{((product?.discountPrice || product?.price || item.price) * item.quantity).toLocaleString('en-IN')}
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemove(id)}
                        className="p-2.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                        title="Remove item"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              <Link to="/collections" className="inline-flex items-center space-x-2 text-maroon hover:text-maroon-dark font-semibold text-sm transition-colors">
                <FiArrowLeft />
                <span>Continue Shopping</span>
              </Link>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-maroon/5 p-6 shadow-sm space-y-6">
                <h3 className="font-playfair text-xl font-bold text-gray-800 border-b border-gray-100 pb-4">Order Summary</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} items)</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Charges</span>
                    {shippingCharges === 0 ? (
                      <span className="text-green-600 font-medium">Free Shipping</span>
                    ) : (
                      <span>₹{shippingCharges.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  {shippingCharges > 0 && (
                    <p className="text-[11px] text-golden font-medium">Add ₹{Math.max(0, 999 - totalAmount).toLocaleString('en-IN')} more for FREE shipping!</p>
                  )}
                  <hr className="border-gray-100 my-2" />
                  <div className="flex justify-between text-base font-bold text-gray-800">
                    <span>Total Amount</span>
                    <span className="text-maroon">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-3.5 bg-maroon hover:bg-maroon-dark text-white rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-maroon/10 text-center block"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
