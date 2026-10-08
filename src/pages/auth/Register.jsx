import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../features/auth/authThunks';
import { clearAuthError, clearSuccessMessage } from '../../features/auth/authSlice';

/* ---------- Shared Google SVG icon ---------- */
const GoogleIcon = () => (
  <svg className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [validationError, setValidationError] = useState('');
  
  const { isLoading, error, successMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearAuthError());
    dispatch(clearSuccessMessage());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return;
    }

    const resultAction = await dispatch(registerUser({ 
      name: formData.name, 
      email: formData.email, 
      password: formData.password 
    }));

    if (registerUser.fulfilled.match(resultAction)) {
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full">

        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold text-primary-600 tracking-tight">
            BigMart
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-gray-900">Create your BigMart account</h1>
          <p className="mt-1 text-sm text-gray-500">
            Shop products, manage your orders and save your favorites.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          {(error || validationError) && (
            <div className="mb-5 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
              <p className="text-sm text-red-700">{error || validationError}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
              <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {!successMessage && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed transition mt-6"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            id="google-register-btn"
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Links */}
          <div className="mt-6 space-y-2 text-center text-sm text-gray-500">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Seller CTA — below the card */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <p className="text-sm font-medium text-amber-900">
            Want to sell on BigMart?
          </p>
          <p className="text-xs text-amber-700 mt-1 mb-3">
            First create a buyer account, then apply to become a seller after verifying your email.
          </p>
          <Link
            to="/seller/register"
            className="inline-block text-sm font-semibold text-amber-800 border border-amber-400 bg-white rounded-lg px-4 py-2 hover:bg-amber-100 transition"
          >
            Become a Seller
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;

