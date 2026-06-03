import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiSearch, FiCheck, FiTruck, FiBox, FiClipboard, FiClock, FiMapPin, FiExternalLink } from 'react-icons/fi';
import API from '../utils/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');

  const [orderId, setOrderId] = useState(queryId || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (queryId) {
      handleTrack(queryId);
    }
  }, [queryId]);

  const handleTrack = async (idToTrack) => {
    if (!idToTrack.trim()) return;
    setLoading(true);
    try {
      const { data } = await API.get(`/orders/track/${idToTrack.trim()}`);
      setOrder(data);
    } catch (error) {
      console.error('Error tracking order:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch tracking data');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (orderId.trim()) {
      handleTrack(orderId);
    } else {
      toast.error('Please enter a valid Order ID');
    }
  };

  // Status mapping to helper indices
  const statusSteps = [
    { status: 'Pending', label: 'Order Placed', desc: 'Your order has been submitted' },
    { status: 'Confirmed', label: 'Confirmed', desc: 'Order confirmed by Sunshine Saree' },
    { status: 'Processing', label: 'Processing', desc: 'Saree is being packaged and prepared' },
    { status: 'Shipped', label: 'Shipped', desc: 'Handed over to courier partner' },
    { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Courier agent is near your area' },
    { status: 'Delivered', label: 'Delivered', desc: 'Order delivered successfully!' },
  ];

  const getStepIndex = (status) => {
    return statusSteps.findIndex((s) => s.status === status);
  };

  const currentStepIdx = order ? getStepIndex(order.orderStatus) : -1;

  return (
    <>
      <Helmet>
        <title>Track Saree Order | Sunshine Saree</title>
        <meta name="description" content="Track your traditional saree order status in real time from Sujangarh." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-3xl font-playfair font-bold text-maroon">Order Tracking System</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Enter your order tracking ID below to check the real-time status of your parcel.
          </p>

          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-4">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. SS-20260603-1234"
              className="flex-grow px-5 py-3 rounded-full border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-maroon hover:bg-maroon-dark text-white rounded-full font-semibold text-sm transition-all"
            >
              Search Status
            </button>
          </form>
        </div>

        {loading ? (
          <Loader />
        ) : order ? (
          <div className="space-y-8 animate-fade-in">
            {/* Visual Stepper */}
            <div className="bg-white p-8 rounded-2xl border border-maroon/5 shadow-sm space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-gray-800">Tracking Status</h3>
                  <p className="text-xs text-gray-400">Order ID: <span className="font-mono text-gray-600 font-semibold">{order.orderId}</span></p>
                </div>
                {order.orderStatus === 'Cancelled' ? (
                  <span className="mt-2 sm:mt-0 px-4 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                    ORDER CANCELLED
                  </span>
                ) : (
                  <span className="mt-2 sm:mt-0 px-4 py-1.5 bg-maroon/10 text-maroon text-xs font-bold rounded-full">
                    Current: {order.orderStatus}
                  </span>
                )}
              </div>

              {order.orderStatus !== 'Cancelled' ? (
                /* Stepper Line */
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 pt-4">
                  {statusSteps.map((s, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    const isActive = idx === currentStepIdx;

                    return (
                      <div key={idx} className="flex md:flex-col items-center md:text-center space-x-4 md:space-x-0 md:space-y-2 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                          isActive
                            ? 'bg-golden border-golden text-dark-brown ring-4 ring-golden/20 scale-110'
                            : isCompleted
                            ? 'bg-maroon border-maroon text-white'
                            : 'bg-white border-gray-200 text-gray-400'
                        }`}>
                          {isCompleted ? <FiCheck /> : idx + 1}
                        </div>
                        <div className="text-left md:text-center">
                          <h4 className={`text-xs font-bold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>{s.label}</h4>
                          <p className="text-[10px] text-gray-400 hidden md:block leading-tight mt-0.5">{s.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center text-xs text-red-700">
                  This order was cancelled. Restored stock items are back in collection.
                </div>
              )}
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Order Info Panel */}
              <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-maroon/5 shadow-sm space-y-6">
                <h3 className="font-playfair text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Items Ordered</h3>
                <div className="space-y-4">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image || 'https://via.placeholder.com/80?text=Saree'}
                          alt={item.name}
                          className="w-12 h-15 object-cover rounded-md border border-gray-100 flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} x ₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-800 text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                {/* Tracking updates timeline list */}
                {order.statusHistory && order.statusHistory.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h4 className="font-playfair text-base font-bold text-gray-800">Status History Logs</h4>
                    <div className="relative border-l border-gray-100 pl-6 ml-3 space-y-6">
                      {order.statusHistory.map((h, i) => (
                        <div key={i} className="relative">
                          {/* Dot indicator */}
                          <span className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-maroon ring-4 ring-white"></span>
                          <span className="text-[10px] text-gray-400 block font-medium">{new Date(h.timestamp).toLocaleString('en-IN')}</span>
                          <span className="text-xs font-bold text-gray-800">{h.status}</span>
                          <p className="text-xs text-gray-500 mt-0.5">{h.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery / Shipping details Panel */}
              <div className="md:col-span-4 bg-white p-6 rounded-2xl border border-maroon/5 shadow-sm space-y-6 self-start">
                <h3 className="font-playfair text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Delivery Details</h3>

                <div className="space-y-4 text-xs">
                  {/* Delivery address */}
                  <div className="space-y-1">
                    <span className="text-gray-400 font-bold uppercase tracking-wider block">Shipping Address</span>
                    <p className="font-semibold text-gray-800">{order.shippingAddress.name}</p>
                    <p className="text-gray-600">{order.shippingAddress.address}</p>
                    <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                    <p className="text-gray-600">Tel: {order.shippingAddress.phone}</p>
                  </div>

                  {/* Payment details */}
                  <div className="space-y-1">
                    <span className="text-gray-400 font-bold uppercase tracking-wider block">Payment Details</span>
                    <p className="text-gray-700"><strong>Method:</strong> {order.paymentMethod}</p>
                    <p className="text-gray-700"><strong>Status:</strong> {order.paymentStatus}</p>
                    <p className="text-gray-700"><strong>Total Paid:</strong> ₹{order.totalPrice.toLocaleString('en-IN')}</p>
                  </div>

                  {/* Courier details */}
                  {order.trackingNumber && (
                    <div className="space-y-1 p-3 bg-golden/10 rounded-xl border border-golden/20">
                      <span className="text-maroon font-bold uppercase tracking-wider block text-[10px]">Courier Tracking ID</span>
                      <p className="font-mono text-gray-800 font-semibold text-xs">{order.trackingNumber}</p>
                      <a
                        href="https://www.delhivery.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-maroon hover:underline font-bold flex items-center space-x-1 mt-1"
                      >
                        <span>Courier Website</span>
                        <FiExternalLink />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : queryId ? (
          <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center space-y-2 text-sm text-red-700">
            Order ID <strong>{queryId}</strong> was not found. Please verify the ID format and try again.
          </div>
        ) : null}
      </div>
    </>
  );
};

export default TrackOrder;
