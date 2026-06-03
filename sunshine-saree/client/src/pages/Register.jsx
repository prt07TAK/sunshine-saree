import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password || !confirmPassword) {
      return toast.error('Please fill in all registration fields');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }

    setLoading(true);
    try {
      await register(name, email, password, phone);
      toast.success('Registration successful! Welcome to the family! 🌸');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register | Sunshine Saree</title>
      </Helmet>

      <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF8F0]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-golden/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-maroon/5 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-maroon/5 shadow-xl">
          <div className="text-center space-y-2">
            <span className="text-4xl">☀️</span>
            <h2 className="text-3xl font-playfair font-bold text-maroon">Create Account</h2>
            <p className="text-sm text-gray-500">Sign up to buy authentic sarees online</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FiUser className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aman Singh"
                    className="pl-10 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-gray-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FiMail className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. A.amansingh0143@gmail.com"
                    className="pl-10 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-gray-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FiPhone className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 6203569455"
                    className="pl-10 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-gray-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FiLock className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-gray-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FiLock className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-gray-50/50"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-maroon hover:bg-maroon-dark text-white rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-maroon/10 flex items-center justify-center space-x-2 disabled:bg-gray-300"
            >
              <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
              {!loading && <FiArrowRight />}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-gray-100 text-xs">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/login" className="text-maroon font-bold hover:underline">Login Here</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
