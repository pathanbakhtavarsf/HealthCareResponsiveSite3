import { useState } from 'react';
import { Building2, Mail, Lock, User, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type LoginPageProps = {
  onNavigate: (page: string) => void;
};

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        setError(error.message || 'Invalid email or password');
      } else {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => onNavigate('profile'), 1000);
      }
    } else {
      if (!formData.name) {
        setError('Please enter your name');
        setLoading(false);
        return;
      }
      const { error } = await signUp(formData.email, formData.password, formData.name);
      if (error) {
        setError(error.message || 'Failed to create account');
      } else {
        setSuccess('Account created successfully! Please login.');
        setIsLogin(true);
        setFormData({ name: '', email: formData.email, password: '' });
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-lg">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">HealthCare+</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {isLogin
              ? 'Sign in to access your health portal'
              : 'Join us for better healthcare management'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-cyan-100">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  isLogin
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  !isLogin
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-white'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {error && (
            <div className="m-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="m-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {!isLogin && (
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Lock className="h-4 w-4 text-gray-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                </div>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="px-6 pb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Quick Actions</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('home')}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                Back to Home
              </button>
              <button
                onClick={() => onNavigate('appointments')}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
