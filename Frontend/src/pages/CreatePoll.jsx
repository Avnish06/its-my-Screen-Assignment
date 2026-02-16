import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowLeft, Send, Vote, PlusCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api/config';

const CreatePoll = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => setOptions([...options, '']);
    const removeOption = (index) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (options.some(opt => !opt.trim())) return alert('All options must be filled');
        
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API_URL}/polls/create`, { 
                question, 
                options: options.map(opt => ({ text: opt, votes: 0 })) 
            });
            navigate(`/poll/${res.data._id}`);
        } catch (err) {
            console.error('Error creating poll:', err);
            setError(err.response?.data?.msg || 'Failed to create poll. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-16 relative">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
            
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-8 md:p-12 relative overflow-hidden"
            >
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Vote size={120} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="p-4 bg-gradient-primary rounded-2xl shadow-glow-primary"
                        >
                            <PlusCircle className="text-white" size={36} />
                        </motion.div>
                        <div>
                            <h2 className="text-4xl font-black gradient-text">New Poll</h2>
                            <p className="text-dark-secondary text-lg">Engage your audience in real-time</p>
                        </div>
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

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-lg font-bold text-white ml-1 flex items-center gap-2">
                                <Sparkles size={18} className="text-primary" />
                                The Question
                            </label>
                            <textarea
                                placeholder="What's on your mind? (e.g., Best JS framework in 2024?)"
                                className="input-field min-h-[120px] text-lg py-4 resize-none"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-lg font-bold text-white ml-1 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Vote size={18} className="text-accent" />
                                    Options
                                </span>
                                <span className="text-xs font-black uppercase text-dark-secondary tracking-widest bg-dark-bg px-3 py-1 rounded-full">
                                    {options.length} Choices
                                </span>
                            </label>
                            <div className="space-y-3">
                                <AnimatePresence mode='popLayout'>
                                    {options.map((option, index) => (
                                        <motion.div 
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="flex gap-3"
                                        >
                                            <div className="relative flex-1 group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-sm uppercase tracking-widest opacity-50 group-focus-within:opacity-100 transition-opacity">
                                                    #{index + 1}
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder={`Option ${index + 1}`}
                                                    className="input-field pl-14 h-14 text-base"
                                                    value={option}
                                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                                    required
                                                />
                                            </div>
                                            {options.length > 2 && (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    type="button"
                                                    onClick={() => removeOption(index)}
                                                    className="p-4 text-error hover:bg-error/10 rounded-xl transition-all border-2 border-transparent hover:border-error/30"
                                                >
                                                    <Trash2 size={20} />
                                                </motion.button>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="button"
                                onClick={addOption}
                                className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-dark-border rounded-2xl text-dark-secondary hover:text-primary hover:border-primary/50 transition-all font-bold bg-dark-bg/50"
                            >
                                <Plus size={20} />
                                Add Another Option
                            </motion.button>
                        </div>

                        <div className="pt-8 border-t-2 border-dark-border flex gap-4">
                            <Link 
                                to="/"
                                className="flex-1 py-4 border-2 border-dark-border rounded-2xl text-white text-center font-bold hover:bg-white/5 hover:border-white/20 transition-all"
                            >
                                Cancel
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="flex-[2] btn-primary py-4 text-lg flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Publishing...</span>
                                    </div>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Publish Poll
                                        <Sparkles size={18} />
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default CreatePoll;
