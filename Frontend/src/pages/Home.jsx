import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, BarChart3, Clock, Users, Sparkles } from 'lucide-react';
import { API_URL } from '../api/config';

const Home = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const res = await axios.get(`${API_URL}/polls`);
                setPolls(res.data);
            } catch (err) {
                console.error('Error fetching polls:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPolls();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="rounded-full h-12 w-12 border-t-4 border-b-4 border-primary shadow-glow-primary"
            />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8 relative z-10"
            >
                <div className="text-center md:text-left">
                    <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight">
                        Voice of the <span className="gradient-text italic">People</span>
                    </h1>
                    <p className="text-dark-secondary text-xl max-w-xl font-medium leading-relaxed">
                        Discover trending topics, share your opinion, and see results unfold in <span className="text-accent font-bold">real-time</span>.
                    </p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/create" className="btn-primary flex items-center gap-3 px-10 py-5 text-xl font-bold shadow-glow-primary group">
                        <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
                        Launch New Poll
                    </Link>
                </motion.div>
            </motion.div>

            {polls.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="card text-center py-32 relative z-10 bg-white/5 border-dashed border-2 border-white/10 rounded-[3rem]"
                >
                    <div className="bg-gradient-primary w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow-primary">
                        <BarChart3 size={48} className="text-white" />
                    </div>
                    <p className="text-dark-secondary text-2xl font-bold tracking-tight">No active polls yet. Be the first to start the conversation!</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
                    {polls.map((poll, index) => (
                        <motion.div
                            key={poll._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link to={`/poll/${poll._id}`} className="card block hover:ring-2 hover:ring-primary/50 transition-all h-full group overflow-hidden relative p-8 group">
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100" />
                                
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-white/5 p-2 rounded-lg border border-white/10 group-hover:border-primary/30 transition-colors">
                                        <Sparkles size={18} className="text-primary" />
                                    </div>
                                    <div className="px-3 py-1 bg-accent/10 rounded-full text-[10px] font-black uppercase tracking-widest text-accent border border-accent/20">
                                        Active
                                    </div>
                                </div>
                                
                                <h3 className="text-2xl font-bold text-white mb-8 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                                    {poll.question}
                                </h3>
                                
                                <div className="space-y-5 mb-10">
                                    {poll.options.slice(0, 2).map((opt, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                                <span className="text-dark-secondary truncate max-w-[70%]">{opt.text}</span>
                                                <span className="text-primary">{opt.votes} Votes</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, (opt.votes / Math.max(1, poll.options.reduce((a, b) => a + b.votes, 0))) * 100)}%` }}
                                                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full" 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {poll.options.length > 2 && (
                                        <div className="text-[10px] text-dark-secondary font-black uppercase tracking-widest text-center pt-2">
                                            + {poll.options.length - 2} more options
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tighter text-dark-secondary mt-auto pt-8 border-t border-white/5 group-hover:border-primary/20 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-accent" />
                                        {new Date(poll.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                        <Users size={16} className="text-primary" />
                                        {poll.options.reduce((acc, curr) => acc + curr.votes, 0)} <span className="hidden sm:inline">Responses</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
