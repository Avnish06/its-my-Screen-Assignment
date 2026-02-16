import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, ArrowLeft, CheckCircle2, Users, Clock, Vote } from 'lucide-react';
import { API_URL, SOCKET_URL } from '../api/config';
import Toast from '../components/Toast';

const PollDetail = () => {
    const { id } = useParams();
    const [poll, setPoll] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [voting, setVoting] = useState(false);
    const [votedOption, setVotedOption] = useState(null);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);

    useEffect(() => {
        // Check if user has already voted in this session/browser
        const votedState = localStorage.getItem(`voted_${id}`);
        if (votedState) {
            setHasVoted(true);
            setVotedOption(parseInt(votedState));
        }

        const fetchPoll = async () => {
            try {
                const res = await axios.get(`${API_URL}/polls/${id}`);
                setPoll(res.data);
            } catch (err) {
                console.error(err);
                setError('Poll not found or server error');
            } finally {
                setLoading(false);
            }
        };

        fetchPoll();

        const socket = io(SOCKET_URL);
        socket.emit('joinPoll', id);

        socket.on('pollUpdate', (updatedPoll) => {
            setPoll(updatedPoll);
        });

        return () => socket.disconnect();
    }, [id]);

    const handleVote = async (optionIndex) => {
        if (hasVoted) return;
        setVoting(true);
        setError('');
        try {
            const res = await axios.post(`${API_URL}/polls/${id}/vote`, { optionIndex });
            setPoll(res.data);
            setHasVoted(true);
            setVotedOption(optionIndex);
            
            // Persist voted state locally
            localStorage.setItem(`voted_${id}`, optionIndex.toString());
        } catch (err) {
            setError(err.response?.data?.msg || 'Error casting vote');
        } finally {
            setVoting(false);
        }
    };

    const totalVotes = poll ? poll.options.reduce((acc, curr) => acc + curr.votes, 0) : 0;

    const sharePoll = () => {
        navigator.clipboard.writeText(window.location.href);
        setToast({ message: 'Link copied to clipboard!', type: 'success' });
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="rounded-full h-12 w-12 border-t-4 border-b-4 border-primary shadow-glow-primary"
            />
        </div>
    );
    
    if (error && !poll) return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-error/10 rounded-full blur-3xl" />
            <h2 className="text-4xl font-black text-white mb-8 relative z-10">Oops! {error}</h2>
            <Link to="/" className="btn-primary inline-flex items-center gap-3 px-8 py-4 relative z-10">
                <ArrowLeft size={20} />
                Return to all polls
            </Link>
        </div>
    );

    if (!poll) return <div className="text-center py-20 text-white text-xl font-bold">Poll not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 relative">
            {/* Background Glow */}
            <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
            <div className="absolute bottom-0 -right-20 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '3s' }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-8 md:p-14 relative overflow-hidden z-10 backdrop-blur-3xl"
            >
                {/* Decorative Background Icon */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                    <Vote size={200} />
                </div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
                        <div className="flex-1 w-full">
                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <Link to="/" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 group hover:border-primary/30">
                                    <ArrowLeft size={20} className="text-dark-secondary group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                                </Link>
                                <div className="flex items-center gap-2 px-4 py-1.5 bg-green-500/10 text-green-400 rounded-full text-[11px] font-black uppercase tracking-widest ring-1 ring-green-500/20 shadow-glow-primary shadow-[0_0_15px_rgba(0,255,136,0.1)]">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    Live Updates
                                </div>
                                <div className="px-4 py-1.5 bg-white/5 text-dark-secondary rounded-full text-[11px] font-black uppercase tracking-widest ring-1 ring-white/10 border border-white/5">
                                    {totalVotes} Total Responses
                                </div>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                                {poll.question}
                            </h2>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={sharePoll}
                            className="p-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all flex items-center gap-3 font-bold border border-white/10 hover:border-primary/30 shadow-lg group"
                        >
                            <Share2 size={24} className="text-primary group-hover:rotate-12 transition-transform" />
                            <span className="md:hidden lg:inline">Share Poll</span>
                        </motion.button>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-error/10 border-2 border-error/20 text-error p-6 rounded-2xl mb-10 flex items-center gap-4 shadow-glow-error"
                        >
                            <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
                            <span className="font-bold">{error}</span>
                        </motion.div>
                    )}

                    <div className="grid gap-6">
                        {poll.options.map((option, index) => {
                            const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
                            const isVoted = votedOption === index;

                            return (
                                <motion.button
                                    key={index}
                                    disabled={hasVoted || voting}
                                    onClick={() => handleVote(index)}
                                    className={`relative w-full text-left p-8 rounded-[2rem] transition-all group overflow-hidden border-2 ${
                                        hasVoted 
                                        ? isVoted ? 'border-primary/50' : 'border-white/5 cursor-default' 
                                        : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-primary/50'
                                    }`}
                                    whileHover={!hasVoted ? { x: 12 } : {}}
                                >
                                    {/* Progress Bar Background */}
                                    {hasVoted && (
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1.2, ease: "circOut" }}
                                            className={`absolute inset-0 h-full opacity-10 ${isVoted ? 'bg-primary' : 'bg-white'}`}
                                        />
                                    )}

                                    <div className="relative z-10 flex justify-between items-center">
                                        <div className="flex items-center gap-6 flex-1">
                                            <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black transition-all border-2 ${
                                                isVoted ? 'bg-primary text-black border-primary' : 'bg-dark-bg text-dark-secondary border-white/10 group-hover:border-primary/50'
                                            }`}>
                                                <span className="text-xl leading-none">{percentage}</span>
                                                <span className="text-[10px] uppercase leading-none mt-1">%</span>
                                            </div>
                                            <span className={`text-2xl font-bold transition-all ${isVoted ? 'text-primary' : 'text-white'}`}>
                                                {option.text}
                                            </span>
                                        </div>
                                        
                                        {hasVoted && (
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-black uppercase tracking-widest ${isVoted ? 'text-primary' : 'text-dark-secondary'}`}>
                                                        {option.votes}
                                                    </span>
                                                    <Users size={14} className={isVoted ? 'text-primary' : 'text-dark-secondary'} />
                                                </div>
                                                {isVoted && (
                                                    <div className="flex items-center gap-2 text-[10px] text-primary font-black tracking-widest uppercase mt-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                                        Your Choice
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>

                    {hasVoted && (
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-16 p-10 bg-gradient-to-br from-primary/10 to-accent/5 rounded-[2.5rem] border border-primary/20 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden"
                        >
                            {/* Decorative Orbs */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                            
                            <div className="text-center lg:text-left flex items-center gap-6 relative z-10">
                                <motion.div 
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="p-5 bg-gradient-primary rounded-[1.5rem] text-white shadow-glow-primary"
                                >
                                    <CheckCircle2 size={40} />
                                </motion.div>
                                <div>
                                    <p className="text-white font-black text-2xl tracking-tight">Vote Recorded!</p>
                                    <p className="text-dark-secondary font-medium text-lg">Your voice has been added in real-time.</p>
                                </div>
                            </div>
                            <Link to="/" className="text-white font-black uppercase tracking-widest text-xs px-10 py-5 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border-2 border-white/5 hover:border-white/20 relative z-10 w-full lg:w-auto text-center shadow-lg">
                                Explore More Polls
                            </Link>
                        </motion.div>
                    )}
                </div>
            </motion.div>
            {/* Toasts */}
            <AnimatePresence>
                {toast && (
                    <Toast 
                        message={toast.message} 
                        type={toast.type} 
                        onClose={() => setToast(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PollDetail;
