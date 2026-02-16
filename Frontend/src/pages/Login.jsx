import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User as UserIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// Google login imports removed

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Google success handler removed

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="card max-w-md w-full p-10 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-glow-primary"
          >
            <Sparkles className="text-white" size={32} />
          </motion.div>
          <h2 className="text-5xl font-extrabold mb-3 gradient-text">
            Welcome Back
          </h2>
          <p className="text-dark-secondary text-lg">Login to manage your polls and see real-time results</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-error/10 border-2 border-error/30 text-error p-4 rounded-xl mb-6 flex items-center gap-3 shadow-glow-error"
          >
            <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-white ml-1 flex items-center gap-2">
              <UserIcon size={16} className="text-primary" />
              Username
            </label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-4 text-dark-secondary group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Enter your username"
                className="input-field pl-12"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-white ml-1 flex items-center gap-2">
              <Lock size={16} className="text-primary" />
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-4 text-dark-secondary group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="password"
                placeholder="Enter your password"
                className="input-field pl-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-4 mt-6 text-lg font-bold"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing In...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In
                <Sparkles size={18} />
              </span>
            )}
          </motion.button>
        </form>

        {/* Google Login removed */}

        {/* Sign Up Link */}
        <p className="text-center text-dark-secondary mt-8 text-base">
          Don't have an account? {' '}
          <Link to="/register" className="text-primary hover:text-primary-light transition-colors font-bold gradient-text">
            Sign up now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
