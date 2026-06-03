import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiCheck, FiTruck, FiCreditCard, FiCompass, FiInfo } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Form States
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address?.line || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });
  const [saveAddress, setSaveAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const shippingCharges = totalAmount >= 999 ? 0 : 150;
  const grandTotal = totalAmount + shippingCharges;

  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cartItems, orderSuccess, navigate]);

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const validateAddress = () => {
    const { name, phone, address, city, state, pincode } = shippingAddress;
    if (!name || !phone || !address || !city || !state || !pincode) {
      toast.error('Please fill in all shipping fields');
      return false;
    }
    if (phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    if (pincode.length < 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateAddress()) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // 1. Optionally save profile info
      if (saveAddress) {
        await updateProfile({
          phone: shippingAddress.phone,
          address: {
            line: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pincode: shippingAddress.pincode,
          },
        });
      }

      // 2. Prepare items for payload
      const orderItems = cartItems.map((item) => ({
        product: item.product._id || item.product,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        image: item.product.images[0] || '',
      }));

      // 3. Create Order
      const { data } = await API.post('/orders', {
        orderItems,
        shippingAddress,
        paymentMethod,
      });

      // 4. Update local context & state
      await clearCart();
      setOrderSuccess(data);
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullPage />;

  if (orderSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <Helmet>
          <title>Order Placed Successfully | Sunshine Saree</title>
        </Helmet>
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto animate-bounce-in shadow-lg">
          <FiCheck />
        </div>
        <div className="space-y-2">
          <h2 className="font-playfair text-3xl font-bold text-gray-800">Thank You For Your Order!</h2>
          <p className="text-gray-500 text-sm">Your order has been placed and is currently being processed by our store in Sujangarh.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-maroon/5 text-left text-sm space-y-4 shadow-sm">
          <div><strong className="text-gray-700">Order ID:</strong> <span className="font-mono text-maroon font-bold select-all">{orderSuccess.orderId}</span></div>
          <div><strong className="text-gray-700">Payment Status:</strong> <span className="font-semibold text-amber-600">{orderSuccess.paymentStatus}</span></div>
          <div><strong className="text-gray-700">Payment Method:</strong> <span className="font-semibold">{orderSuccess.paymentMethod}</span></div>
          <div><strong className="text-gray-700">Estimated Delivery:</strong> <span className="font-semibold">{new Date(orderSuccess.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => navigate(`/track-order?id=${orderSuccess.orderId}`)}
            className="px-6 py-3 bg-maroon hover:bg-maroon-dark text-white rounded-full font-semibold text-sm transition-all hover:scale-105"
          >
            Track Real-Time Status
          </button>
          <button
            onClick={() => navigate('/collections')}
            className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full font-semibold text-sm transition-all hover:scale-105"
          >
            Keep Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Sunshine Saree</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-playfair font-bold text-maroon mb-10">Checkout</h1>

        {/* Step Progress bar */}
        <div className="flex items-center justify-center max-w-lg mx-auto mb-12">
          {[
            { num: 1, label: 'Shipping', icon: <FiTruck /> },
            { num: 2, label: 'Payment', icon: <FiCreditCard /> },
            { num: 3, label: 'Review', icon: <FiCompass /> },
          ].map((s) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center space-y-1 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  step >= s.num ? 'bg-maroon text-white font-bold' : 'bg-gray-200 text-gray-500'
                }`}>
                  {s.icon}
                </div>
                <span className="text-xs font-semibold text-gray-600">{s.label}</span>
              </div>
              {s.num < 3 && (
                <div className={`flex-grow h-1 mx-4 transition-colors ${step > s.num ? 'bg-maroon' : 'bg-gray-200'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Step Panels */}
          <div className="lg:col-span-8 bg-white p-8 rounded-2xl border border-maroon/5 shadow-sm">
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="font-playfair text-xl font-bold text-gray-800">Shipping Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recipient's Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={shippingAddress.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Aman Singh"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mobile Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 6203569455"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Complete Address (House #, Street, Locality)</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      placeholder="e.g. Near Ashok Circle, Sujangarh"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Sujangarh"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Rajasthan"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingAddress.pincode}
                      onChange={handleInputChange}
                      placeholder="e.g. 331507"
                      maxLength="6"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm"
                    />
                  </div>
                </div>
                <label className="flex items-center space-x-3 text-sm text-gray-600 cursor-pointer pt-4 border-t border-gray-100">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="w-4 h-4 rounded text-maroon focus:ring-maroon/20"
                  />
                  <span>Save this address to my user profile</span>
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="font-playfair text-xl font-bold text-gray-800">Select Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'COD', label: 'Cash on Delivery (COD)', desc: 'Pay when your saree arrives' },
                    { id: 'UPI', label: 'UPI / QR Code', desc: 'Scan and pay instantly' },
                    { id: 'Bank Transfer', label: 'Bank Transfer', desc: 'Pay via IMPS/NEFT transfer' },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-5 rounded-2xl text-left border-2 flex flex-col justify-between transition-all ${
                        paymentMethod === pm.id
                          ? 'border-maroon bg-maroon/5 shadow-md scale-[1.02]'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-bold text-gray-800 text-sm mb-1">{pm.label}</span>
                      <span className="text-xs text-gray-500 leading-tight">{pm.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Display payment guides based on choice */}
                {paymentMethod === 'UPI' && (
                  <div className="bg-[#FFF8F0] p-6 rounded-2xl border border-maroon/5 space-y-4 max-w-md mx-auto text-center">
                    <h4 className="font-bold text-gray-800">Scan & Pay securely via UPI</h4>
                    {/* Simulated QR code box */}
                    <div className="w-44 h-44 bg-white border border-gray-200 mx-auto flex items-center justify-center p-3 rounded-xl shadow-inner">
                      <div className="w-full h-full bg-gradient-to-br from-dark-brown via-maroon to-golden rounded-lg opacity-85 flex items-center justify-center text-white font-bold text-xs">
                        [ MOCK QR CODE ]
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><strong>Merchant UPI ID:</strong> <span className="font-mono text-maroon font-bold">A.amansingh0143@okaxis</span></p>
                      <p>After transferring, place your order. Our team in Sujangarh will verify and confirm your order payment.</p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Bank Transfer' && (
                  <div className="bg-[#FFF8F0] p-6 rounded-2xl border border-maroon/5 space-y-3 max-w-md mx-auto">
                    <h4 className="font-bold text-gray-800 text-center flex items-center justify-center space-x-2">
                      <FiInfo className="text-maroon" />
                      <span>Bank Account Details</span>
                    </h4>
                    <div className="text-xs text-gray-700 space-y-2">
                      <div className="flex justify-between"><strong>Account Holder Name:</strong> <span>Sunshine Saree</span></div>
                      <div className="flex justify-between"><strong>Account Number:</strong> <span className="font-semibold">6203569455</span></div>
                      <div className="flex justify-between"><strong>IFSC Code:</strong> <span className="font-mono text-maroon">SBIN0001234</span></div>
                      <div className="flex justify-between"><strong>Bank / Branch:</strong> <span>State Bank of India / Sujangarh</span></div>
                    </div>
                    <p className="text-[11px] text-gray-500 text-center mt-3">Once transfer is done, place your order. Our staff will confirm receipt.</p>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="font-playfair text-xl font-bold text-gray-800">Review Your Order</h3>
                
                {/* Shipping info */}
                <div className="p-4 bg-gray-50 rounded-xl space-y-1 text-sm border border-gray-100">
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider text-gray-400 mb-2">Shipping Information</h4>
                  <p><strong>Name:</strong> {shippingAddress.name}</p>
                  <p><strong>Phone:</strong> {shippingAddress.phone}</p>
                  <p><strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                </div>

                {/* Payment info */}
                <div className="p-4 bg-gray-50 rounded-xl space-y-1 text-sm border border-gray-100">
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider text-gray-400 mb-2">Payment Details</h4>
                  <p><strong>Method:</strong> {paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : paymentMethod}</p>
                  <p><strong>Amount Payable:</strong> ₹{grandTotal.toLocaleString('en-IN')}</p>
                </div>

                {/* Cart items check */}
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider text-gray-400">Items Ordered</h4>
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="flex justify-between items-center text-sm py-2 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-500">({item.quantity}x)</span>
                        <span className="font-medium text-gray-800 line-clamp-1">{item.product.name}</span>
                      </div>
                      <span className="font-semibold text-gray-700">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stepper Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-100 mt-8">
              {step > 1 ? (
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-maroon hover:bg-maroon-dark text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  className="px-8 py-3 bg-maroon hover:bg-maroon-dark text-white rounded-lg text-sm font-semibold transition-colors shadow-md hover:scale-[1.02]"
                >
                  Place Order (₹{grandTotal.toLocaleString('en-IN')})
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Mini Order Summary Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-maroon/5 p-6 shadow-sm space-y-4 sticky top-24">
              <h3 className="font-playfair text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Review Price</h3>
              <div className="space-y-2 text-xs">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="flex justify-between text-gray-500">
                    <span className="line-clamp-1">{item.product.name} (x{item.quantity})</span>
                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <hr className="border-gray-100 my-2" />
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Charges</span>
                  <span>{shippingCharges === 0 ? 'Free' : `₹${shippingCharges}`}</span>
                </div>
                <hr className="border-gray-100 my-2" />
                <div className="flex justify-between text-sm font-bold text-gray-800">
                  <span>Total Amount</span>
                  <span className="text-maroon">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
