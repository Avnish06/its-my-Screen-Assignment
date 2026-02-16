import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, Sparkles, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData.username, formData.email, formData.fullName, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Glow */}
            <div className="absolute inset-0 bg-gradient-glow opacity-50" />
            <div className="absolute top-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="card max-w-2xl w-full p-10 relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-glow-primary"
                    >
                        <UserPlus className="text-white" size={32} />
                    </motion.div>
                    <h2 className="text-5xl font-extrabold mb-3 gradient-text">
                        Create Account
                    </h2>
                    <p className="text-dark-secondary text-lg">Join the best real-time polling community</p>
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

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white ml-1 flex items-center gap-2">
                                <UserIcon size={16} className="text-primary" />
                                Full Name
                            </label>
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-4 text-dark-secondary group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="John Doe"
                                    className="input-field pl-12"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-white ml-1 flex items-center gap-2">
                                <UserIcon size={16} className="text-accent" />
                                Username
                            </label>
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-4 text-dark-secondary group-focus-within:text-accent transition-colors" size={20} />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="johndoe123"
                                    className="input-field pl-12"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-white ml-1 flex items-center gap-2">
                            <Mail size={16} className="text-primary" />
                            Email Address
                        </label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-4 text-dark-secondary group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                className="input-field pl-12"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                placeholder="Create a strong password"
                                className="input-field pl-12"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                        </div>
                        <p className="text-xs text-dark-secondary ml-1 mt-1">Must be at least 6 characters</p>
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
                                <span>Creating Account...</span>
                            </div>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Create Your Account
                                <Sparkles size={18} />
                            </span>
                        )}
                    </motion.button>
                </form>

                {/* Login Link */}
                <p className="text-center text-dark-secondary mt-8 text-base">
                    Already have an account? {' '}
                    <Link to="/login" className="text-primary hover:text-primary-light transition-colors font-bold gradient-text">
                        Login here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
