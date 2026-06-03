import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
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
    if (!email || !password) {
      return toast.error('Please enter email and password');
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back to Sunshine Saree! ☀️');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Sunshine Saree</title>
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF8F0]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-golden/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-maroon/5 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-maroon/5 shadow-xl">
          <div className="text-center space-y-2">
            <span className="text-4xl">☀️</span>
            <h2 className="text-3xl font-playfair font-bold text-maroon">Welcome Back</h2>
            <p className="text-sm text-gray-500">Sign in to your Sunshine Saree account</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FiMail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. A.amansingh0143@gmail.com"
                    className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-gray-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FiLock className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-maroon focus:ring-1 focus:ring-maroon/20 outline-none text-sm bg-gray-50/50"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-maroon hover:bg-maroon-dark text-white rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-maroon/10 flex items-center justify-center space-x-2 disabled:bg-gray-300"
            >
              <span>{loading ? 'Logging in...' : 'Sign In'}</span>
              {!loading && <FiArrowRight />}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-gray-100 text-xs">
            <span className="text-gray-500">Don't have an account? </span>
            <Link to="/register" className="text-maroon font-bold hover:underline">Register Here</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
