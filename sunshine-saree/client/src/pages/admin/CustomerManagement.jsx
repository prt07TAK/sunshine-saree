import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiChevronRight, FiTrash2, FiUser } from 'react-icons/fi';
import API from '../../utils/api';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const CustomerManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast.error('Failed to load customers list');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user account: ${name}?`)) {
      try {
        await API.delete(`/users/${id}`);
        setUsers(users.filter((u) => u._id !== id));
        toast.success('Customer deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete customer');
      }
    }
  };

  const adminMenu = [
    { label: 'Overview', path: '/admin' },
    { label: 'Manage Products', path: '/admin/products' },
    { label: 'Manage Orders', path: '/admin/orders' },
    { label: 'Customers', path: '/admin/customers', active: true },
    { label: 'Support Tickets', path: '/admin/tickets' },
  ];

  if (loading) return <Loader fullPage />;

  return (
    <>
      <Helmet>
        <title>Customers Management | Admin Sunshine Saree</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-maroon">Customers Directory</h1>
            <p className="text-gray-500 text-sm mt-1">View registered customers and manage system roles.</p>
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

          {/* Right Customers list table */}
          <main className="lg:col-span-9 bg-white rounded-2xl border border-maroon/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-xs">
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Join Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-maroon to-golden flex items-center justify-center text-white font-bold text-xs uppercase">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-bold text-gray-800">{u.name}</span>
                      </td>
                      <td className="p-4 font-medium">{u.email}</td>
                      <td className="p-4">{u.phone || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-maroon text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="p-4 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDelete(u._id, u.name)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default CustomerManagement;
