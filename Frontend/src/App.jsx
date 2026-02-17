import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePoll from './pages/CreatePoll';
import PollDetail from './pages/PollDetail';

function App() {
  console.log('--- ANTIGRAVITY_DEPLOYMENT_V3 ---');
  console.log('API_URL:', import.meta.env.VITE_API_URL || 'NOT_SET');
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-dark-bg text-white selection:bg-primary/30">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/poll/:id" element={<PollDetail />} />
              <Route 
                path="/create" 
                element={
                  <ProtectedRoute>
                    <CreatePoll />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
