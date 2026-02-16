import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle2 className="text-green-400" size={20} />,
        error: <AlertCircle className="text-red-400" size={20} />,
        info: <Info className="text-blue-400" size={20} />
    };

    const colors = {
        success: 'border-green-500/20 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.1)]',
        error: 'border-red-500/20 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.1)]',
        info: 'border-blue-500/20 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-xl ${colors[type]}`}
        >
            {icons[type]}
            <span className="text-white font-bold text-sm tracking-tight">{message}</span>
            <button 
                onClick={onClose}
                className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default Toast;
