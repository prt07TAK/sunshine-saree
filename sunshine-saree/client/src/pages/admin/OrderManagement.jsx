import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiChevronRight, FiX, FiCheck, FiTruck, FiInfo } from 'react-icons/fi';
import API from '../../utils/api';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Status Change Forms
  const [newStatus, setNewStatus] = useState('Pending');
  const [statusDescription, setStatusDescription] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const statusOptions = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const query = statusFilter ? `?status=${statusFilter}` : '';
      const { data } = await API.get(`/orders${query}`);
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setStatusDescription('');
    setTrackingNumber(order.trackingNumber || '');
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      const { data } = await API.put(`/orders/${selectedOrder._id}/status`, {
        status: newStatus,
        description: statusDescription || `Order status updated to ${newStatus}`,
      });
      setSelectedOrder(data);
      // Sync list state
      setOrders(orders.map((o) => (o._id === selectedOrder._id ? { ...o, orderStatus: data.orderStatus } : o)));
      toast.success('Order status updated successfully');
      setStatusDescription('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleTrackingUpdate = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      const { data } = await API.put(`/orders/${selectedOrder._id}/tracking`, { trackingNumber });
      setSelectedOrder({ ...selectedOrder, trackingNumber: data.trackingNumber });
      toast.success('Tracking number updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update tracking');
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

  const adminMenu = [
    { label: 'Overview', path: '/admin' },
    { label: 'Manage Products', path: '/admin/products' },
    { label: 'Manage Orders', path: '/admin/orders', active: true },
    { label: 'Customers', path: '/admin/customers' },
    { label: 'Support Tickets', path: '/admin/tickets' },
  ];

  if (loading && orders.length === 0) return <Loader fullPage />;

  return (
    <>
      <Helmet>
        <title>Manage Orders | Admin Sunshine Saree</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-maroon">Order Management Console</h1>
            <p className="text-gray-500 text-sm mt-1">Track payments, status changes, and configure couriers.</p>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="filter" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filter</label>
            <select
              id="filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20"
            >
              <option value="">All Orders</option>
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Menu Sidebar */}
          <aside className="lg:col-span-3 space-y-1.5 self-start">
            {adminMenu.map((m, i) => (
              <Link
                key={i}
                to={m.path}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  m.active
                    ? 'bg-maroon text-white shadow-md'
                    : 'bg-white hover:bg-maroon/5 text-gray-700 hover:text-maroon border border-maroon/5'
                }`}
              >
                <span>{m.label}</span>
                <FiChevronRight className={m.active ? 'text-white' : 'text-gray-400'} />
              </Link>
            ))}
          </aside>

          {/* Right Orders table */}
          <main className="lg:col-span-9 bg-white rounded-2xl border border-maroon/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-xs">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Placed Date</th>
                    <th className="p-4">Total Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-maroon">{order.orderId}</td>
                      <td className="p-4 font-medium text-gray-800">
                        <p>{order.shippingAddress?.name || 'Customer'}</p>
                        <p className="text-[10px] text-gray-400 font-normal">{order.shippingAddress?.phone}</p>
                      </td>
                      <td className="p-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="p-4 font-bold text-gray-800">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleOrderClick(order)}
                          className="px-3 py-1.5 bg-maroon/10 text-maroon hover:bg-maroon hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ml-auto"
                        >
                          <FiInfo />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {/* View Details / Status Change Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>

          <div className="relative bg-[#FFF8F0] rounded-2xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h3 className="font-playfair text-xl font-bold text-maroon">Order Details Information</h3>
                <span className="text-xs text-gray-400">ID: <span className="font-mono text-gray-600 font-bold">{selectedOrder.orderId}</span></span>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-gray-200">
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {/* Order breakdown */}
              <div className="space-y-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                <h4 className="font-bold text-gray-800 border-b border-gray-50 pb-2">Purchased Items</h4>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-gray-400">Qty: {item.quantity} x ₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                      <span className="font-bold text-gray-700">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <hr className="border-gray-100 my-2" />
                  <div className="flex justify-between font-bold text-gray-800 text-sm">
                    <span>Grand Total:</span>
                    <span className="text-maroon">₹{selectedOrder.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="space-y-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                <h4 className="font-bold text-gray-800 border-b border-gray-50 pb-2">Delivery & Customer</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <p><strong>Name:</strong> {selectedOrder.shippingAddress?.name}</p>
                  <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                  <p><strong>Address:</strong> {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}</p>
                  <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</p>
                </div>
              </div>
            </div>

            {/* Admin Management Forms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              {/* Status Update */}
              <form onSubmit={handleStatusUpdate} className="space-y-4 bg-white p-5 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-maroon flex items-center space-x-1"><FiCheck /> <span>Update Status</span></h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-500 font-medium mb-1">Select Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white outline-none focus:border-maroon text-xs"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-500 font-medium mb-1">Status Description / Log message</label>
                    <input
                      type="text"
                      value={statusDescription}
                      onChange={(e) => setStatusDescription(e.target.value)}
                      placeholder="e.g. Package arrived at Jaipur hub"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-maroon text-xs bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-maroon text-white font-semibold rounded-lg text-xs hover:bg-maroon-dark transition-colors"
                  >
                    Save Status Update
                  </button>
                </div>
              </form>

              {/* Courier Tracking */}
              <form onSubmit={handleTrackingUpdate} className="space-y-4 bg-white p-5 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-maroon flex items-center space-x-1"><FiTruck /> <span>Configure Tracking</span></h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-500 font-medium mb-1">Courier Tracking ID</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. DELHIVERY-12345678"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-maroon text-xs bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-maroon text-white font-semibold rounded-lg text-xs hover:bg-maroon-dark transition-colors"
                  >
                    Save Tracking Number
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderManagement;
