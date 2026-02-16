import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PlusCircle, LayoutDashboard, Vote } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-dark-bg/40 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-[100] shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-primary p-2.5 rounded-xl group-hover:rotate-12 transition-all duration-300 shadow-glow-primary">
              <Vote size={26} className="text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">POLL<span className="gradient-text">IO</span></span>
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/create" className="hidden sm:flex items-center gap-2 text-dark-secondary hover:text-white transition-all font-bold group">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <PlusCircle size={20} className="text-primary" />
                  </div>
                  <span>Create</span>
                </Link>
                <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-white text-sm font-black tracking-tight leading-none mb-1">{user.fullName || user.username}</span>
                  <div className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-md">
                    <span className="text-accent text-[8px] uppercase font-black tracking-widest leading-none">Pro Member</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-3 bg-error/10 text-error rounded-xl hover:bg-error hover:text-white transition-all duration-300 border border-error/20"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-6 py-3 text-dark-secondary hover:text-white transition-all font-black uppercase text-xs tracking-widest">Login</Link>
                <Link to="/register" className="btn-primary px-8 py-3 shadow-glow-primary text-xs font-black uppercase tracking-widest">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
