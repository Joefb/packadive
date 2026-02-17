import { useAuth } from "../contexts/AuthContext";
import { useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    user_name: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(formData.user_name, formData.password);
      setFormData({
        user_name: '',
        password: '',
      });
      navigate('/userhome');

    } catch (error) {
      console.error("Login failed:", error);
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-950 dark:to-gray-900 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to continue to Packadive
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="user_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  Don't have an account?
                </span>
              </div>
            </div>

            {/* Register Link */}
            <Link to="/register">
              <button
                type="button"
                className="w-full py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Create New Account
              </button>
            </Link>
          </form>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default UserLogin
