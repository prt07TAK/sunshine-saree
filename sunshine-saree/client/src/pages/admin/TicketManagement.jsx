import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiChevronRight, FiX, FiCheckCircle, FiSend, FiMessageSquare } from 'react-icons/fi';
import API from '../../utils/api';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Admin Response Fields
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState('Open');

  const ticketStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const query = statusFilter ? `?status=${statusFilter}` : '';
      const { data } = await API.get(`/support${query}`);
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching admin tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setReplyText(ticket.adminReply || '');
    setNewStatus(ticket.status);
    setIsModalOpen(true);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return toast.error('Reply text cannot be empty');
    try {
      const { data } = await API.put(`/support/${selectedTicket._id}/reply`, { reply: replyText });
      setSelectedTicket(data);
      // Sync list
      setTickets(tickets.map((t) => (t._id === selectedTicket._id ? { ...t, adminReply: data.adminReply, status: data.status } : t)));
      toast.success('Reply submitted successfully');
    } catch (error) {
      toast.error('Failed to submit reply');
    }
  };

  const handleStatusChange = async (statusVal) => {
    try {
      const { data } = await API.put(`/support/${selectedTicket._id}/status`, { status: statusVal });
      setNewStatus(data.status);
      setSelectedTicket({ ...selectedTicket, status: data.status });
      setTickets(tickets.map((t) => (t._id === selectedTicket._id ? { ...t, status: data.status } : t)));
      toast.success(`Status updated to ${statusVal}`);
    } catch (error) {
      toast.error('Failed to change status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const adminMenu = [
    { label: 'Overview', path: '/admin' },
    { label: 'Manage Products', path: '/admin/products' },
    { label: 'Manage Orders', path: '/admin/orders' },
    { label: 'Customers', path: '/admin/customers' },
    { label: 'Support Tickets', path: '/admin/tickets', active: true },
  ];

  if (loading && tickets.length === 0) return <Loader fullPage />;

  return (
    <>
      <Helmet>
        <title>Manage Tickets | Admin Sunshine Saree</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-maroon">Customer Support Tickets</h1>
            <p className="text-gray-500 text-sm mt-1">Review and reply to customer inquiries and concerns.</p>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="filter" className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filter</label>
            <select
              id="filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20"
            >
              <option value="">All Tickets</option>
              {ticketStatuses.map((opt) => (
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

          {/* Right Support Tickets table */}
          <main className="lg:col-span-9 bg-white rounded-2xl border border-maroon/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-xs">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {tickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-bold text-gray-800">
                        <p>{ticket.name}</p>
                        <p className="text-[10px] text-gray-400 font-normal">{ticket.email}</p>
                      </td>
                      <td className="p-4 font-medium">{ticket.subject}</td>
                      <td className="p-4 text-gray-600">{new Date(ticket.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleTicketClick(ticket)}
                          className="px-3 py-1.5 bg-maroon/10 text-maroon hover:bg-maroon hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ml-auto"
                        >
                          <FiMessageSquare />
                          <span>Reply</span>
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

      {/* Ticket Reply Modal */}
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>

          <div className="relative bg-[#FFF8F0] rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h3 className="font-playfair text-xl font-bold text-maroon">Support Ticket Details</h3>
                <span className="text-xs text-gray-400">Subject: <span className="text-gray-600 font-bold">{selectedTicket.subject}</span></span>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-gray-200">
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Customer Query */}
            <div className="space-y-2 text-sm">
              <h4 className="font-bold text-gray-800">Customer Details</h4>
              <div className="p-4 bg-white rounded-xl border border-gray-100 text-xs text-gray-600 space-y-1">
                <p><strong>Name:</strong> {selectedTicket.name}</p>
                <p><strong>Email:</strong> {selectedTicket.email}</p>
                <p><strong>Phone:</strong> {selectedTicket.phone || 'N/A'}</p>
              </div>

              <h4 className="font-bold text-gray-800 pt-2">Message Query</h4>
              <p className="p-4 bg-white rounded-xl border border-gray-100 text-xs leading-relaxed text-gray-700 italic">
                "{selectedTicket.message}"
              </p>
            </div>

            {/* Ticket actions */}
            <div className="pt-4 border-t border-gray-200 space-y-6">
              {/* Change status */}
              <div className="flex items-center space-x-4 text-sm">
                <span className="font-bold text-gray-800">Change Status:</span>
                <div className="flex space-x-2">
                  {ticketStatuses.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleStatusChange(opt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        newStatus === opt
                          ? 'bg-maroon text-white border-maroon shadow-xs'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleReplySubmit} className="space-y-4">
                <h4 className="font-bold text-maroon flex items-center space-x-1.5 text-sm">
                  <FiMessageSquare />
                  <span>Admin Reply Response</span>
                </h4>
                <textarea
                  rows="4"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Enter response message to customer query..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none text-xs focus:border-maroon focus:ring-1 focus:ring-maroon/20 bg-white"
                ></textarea>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-maroon hover:bg-maroon-dark text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
                >
                  <FiSend />
                  <span>Send Response</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketManagement;
