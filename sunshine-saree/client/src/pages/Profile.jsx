import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMapPin, FiKey, FiMessageSquare, FiSave, FiCheckCircle } from 'react-icons/fi';
import API from '../utils/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  // Address Form State
  const [addressData, setAddressData] = useState({
    line: user?.address?.line || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchMyTickets();
    }
  }, [activeTab]);

  const fetchMyTickets = async () => {
    setTicketsLoading(true);
    try {
      const { data } = await API.get('/support/my-tickets');
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setTicketsLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name) return toast.error('Name is required');
    setLoading(true);
    try {
      await updateProfile(profileData);
      toast.success('Profile details updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ address: addressData });
      toast.success('Shipping address saved successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update address');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = passwordData;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return toast.error('All fields are required');
    }
    if (newPassword !== confirmNewPassword) {
      return toast.error('New passwords do not match');
    }
    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await updateProfile({ password: newPassword });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const getTicketStatusBadge = (status) => {
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

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <FiUser className="w-4.5 h-4.5" /> },
    { id: 'address', label: 'Saved Addresses', icon: <FiMapPin className="w-4.5 h-4.5" /> },
    { id: 'password', label: 'Change Password', icon: <FiKey className="w-4.5 h-4.5" /> },
    { id: 'tickets', label: 'Support Tickets', icon: <FiMessageSquare className="w-4.5 h-4.5" /> },
  ];

  return (
    <>
      <Helmet>
        <title>My Profile | Sunshine Saree</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-playfair font-bold text-maroon mb-10">User Account Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Sidebar Menu */}
          <aside className="lg:col-span-3 space-y-2">
            {/* Header info */}
            <div className="p-6 bg-gradient-to-r from-maroon to-maroon-dark text-white rounded-2xl flex items-center space-x-4 mb-6 shadow-sm">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-playfair font-bold text-base leading-tight">{user?.name}</h4>
                <p className="text-xs text-white/70">{user?.role === 'admin' ? 'Administrator' : 'Valued Customer'}</p>
              </div>
            </div>

            {/* Nav list */}
            <nav className="space-y-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === t.id
                      ? 'bg-maroon text-white shadow-md'
                      : 'bg-white hover:bg-maroon/5 text-gray-700 hover:text-maroon border border-maroon/5'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Main Panel */}
          <main className="lg:col-span-9 bg-white p-8 rounded-2xl border border-maroon/5 shadow-sm min-h-[450px]">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <h3 className="font-playfair text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">Personal Profile Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Registered Email Address</label>
                    <input
                      type="text"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed text-sm outline-none"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Email cannot be modified once registered.</p>
                  </div>
                  <div></div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="e.g. Aman Singh"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mobile Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="e.g. 6203569455"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-maroon hover:bg-maroon-dark text-white rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all disabled:bg-gray-300 shadow-sm"
                >
                  <FiSave />
                  <span>Save Changes</span>
                </button>
              </form>
            )}

            {activeTab === 'address' && (
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                <h3 className="font-playfair text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">Default Delivery Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Complete Address (House #, Street, Locality)</label>
                    <input
                      type="text"
                      value={addressData.line}
                      onChange={(e) => setAddressData({ ...addressData, line: e.target.value })}
                      placeholder="e.g. Near Ashok Circle"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">City</label>
                    <input
                      type="text"
                      value={addressData.city}
                      onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                      placeholder="e.g. Sujangarh"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">State</label>
                    <input
                      type="text"
                      value={addressData.state}
                      onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                      placeholder="e.g. Rajasthan"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Pincode</label>
                    <input
                      type="text"
                      value={addressData.pincode}
                      onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                      placeholder="e.g. 331507"
                      maxLength="6"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-maroon hover:bg-maroon-dark text-white rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all disabled:bg-gray-300 shadow-sm"
                >
                  <FiSave />
                  <span>Save Shipping Address</span>
                </button>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <h3 className="font-playfair text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">Update Account Password</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-white"
                    />
                  </div>
                  <div></div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmNewPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-maroon hover:bg-maroon-dark text-white rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all disabled:bg-gray-300 shadow-sm"
                >
                  <FiKey />
                  <span>Update Password</span>
                </button>
              </form>
            )}

            {activeTab === 'tickets' && (
              <div className="space-y-6">
                <h3 className="font-playfair text-xl font-bold text-gray-800 border-b border-gray-100 pb-3">My Support Tickets</h3>
                
                {ticketsLoading ? (
                  <Loader />
                ) : tickets.length === 0 ? (
                  <p className="text-gray-500 text-sm">You haven't opened any support tickets yet.</p>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket._id} className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getTicketStatusBadge(ticket.status)}`}>
                              {ticket.status}
                            </span>
                            <h4 className="font-bold text-gray-800 text-sm mt-1.5">{ticket.subject}</h4>
                            <span className="text-[10px] text-gray-400 block">{new Date(ticket.createdAt).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed bg-white p-3 rounded-lg border border-gray-100">
                          <strong>My Query:</strong> {ticket.message}
                        </p>
                        {ticket.adminReply && (
                          <div className="p-3 bg-maroon/5 rounded-lg border border-maroon/10 text-xs text-gray-700 space-y-1">
                            <p className="font-bold text-maroon flex items-center space-x-1">
                              <FiCheckCircle className="inline" />
                              <span>Admin Response:</span>
                            </p>
                            <p>{ticket.adminReply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Profile;
