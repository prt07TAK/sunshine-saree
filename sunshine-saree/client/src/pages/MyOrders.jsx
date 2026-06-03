import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiEye, FiSearch, FiShoppingBag, FiTruck } from 'react-icons/fi';
import API from '../utils/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/my-orders');
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load your orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    if (filter === 'All') {
      setFilteredOrders(orders);
    } else if (filter === 'Active') {
      setFilteredOrders(orders.filter((o) => ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery'].includes(o.orderStatus)));
    } else if (filter === 'Delivered') {
      setFilteredOrders(orders.filter((o) => o.orderStatus === 'Delivered'));
    } else if (filter === 'Cancelled') {
      setFilteredOrders(orders.filter((o) => o.orderStatus === 'Cancelled'));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <>
      <Helmet>
        <title>My Orders | Sunshine Saree</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-5 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-maroon">My Saree Orders</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and track your ongoing purchases.</p>
          </div>

          {/* Filter Pill List */}
          <div className="flex bg-gray-100 p-1.5 rounded-full text-xs font-semibold text-gray-600">
            {['All', 'Active', 'Delivered', 'Cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => handleFilter(f)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeFilter === f ? 'bg-maroon text-white shadow-sm' : 'hover:text-gray-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-white rounded-2xl border border-maroon/5 p-8">
            <div className="w-20 h-20 rounded-full bg-maroon/5 flex items-center justify-center text-3xl text-maroon">
              <FiShoppingBag />
            </div>
            <div className="space-y-2">
              <h3 className="font-playfair text-xl font-bold text-gray-800">No Orders Found</h3>
              <p className="text-gray-500 text-sm max-w-sm">No purchases match this filter currently.</p>
            </div>
            <Link
              to="/collections"
              className="px-6 py-2.5 bg-maroon text-white rounded-full text-sm font-semibold hover:bg-maroon-dark transition-colors"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-maroon/5 shadow-sm overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-5">Order ID</th>
                    <th className="p-5">Placed Date</th>
                    <th className="p-5">Items Summary</th>
                    <th className="p-5">Total Paid</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-5 font-mono font-bold text-maroon">{order.orderId}</td>
                      <td className="p-5 text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="p-5 text-gray-600">
                        {order.orderItems.length > 0 ? (
                          <span>
                            {order.orderItems[0].name}
                            {order.orderItems.length > 1 && ` + ${order.orderItems.length - 1} more`}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="p-5 font-bold text-gray-800">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-5 text-right space-x-2">
                        <button
                          onClick={() => navigate(`/track-order?id=${order.orderId}`)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-maroon/10 text-maroon hover:bg-maroon hover:text-white rounded-lg text-xs font-semibold transition-colors"
                          title="Track Saree"
                        >
                          <FiTruck className="w-3.5 h-3.5" />
                          <span>Track</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards View */}
            <div className="block md:hidden divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <div key={order._id} className="p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-maroon text-sm">{order.orderId}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><strong>Date Placed:</strong> {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    <p><strong>Item:</strong> {order.orderItems[0]?.name} {order.orderItems.length > 1 && `(${order.orderItems.length} items)`}</p>
                    <p><strong>Grand Total:</strong> ₹{order.totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/track-order?id=${order.orderId}`)}
                    className="w-full py-2 bg-maroon text-white rounded-lg text-xs font-semibold hover:bg-maroon-dark transition-colors flex items-center justify-center space-x-1"
                  >
                    <FiTruck className="w-3.5 h-3.5" />
                    <span>Track Order Status</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrders;
