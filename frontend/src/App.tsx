import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.tsx';
import Projects from './components/Projects.tsx';
import ProjectDetail from './components/ProjectDetail.tsx';
import CreateProject from './components/CreateProject.tsx';
import type { User } from './types.js';
import './App.css';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // In a real app, you'd verify the token with the backend
    if (token) {
      // For demo, set a dummy user
      setUser({ id: 1, name: 'Demo User', email: 'demo@test.com', role: 'member' });
    }
  }, []);

  const handleLogin = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <div className="app">
        {user && (
          <header className="navbar">
            <div className="navbar-container">
              <div className="navbar-brand">
                <div className="brand-logo">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="brand-text">
                  <span className="brand-name">NovaVantix</span>
                  <span className="brand-tagline">Project Management</span>
                </div>
              </div>
              

              
              <div className="navbar-user">
                <div className="user-menu">
                  <div className="user-info-dropdown">
                    <span className="user-name">{user.name}</span>
                    <span className="user-role-badge">{user.role}</span>
                  </div>
                  <div className="user-avatar" title="User Profile">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button 
                    className="logout-btn" 
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <svg className="logout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>
        )}

        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/projects" />} 
          />
          <Route 
            path="/projects" 
            element={user ? <Projects /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/create-project" 
            element={user ? <CreateProject /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/projects/:id" 
            element={user ? <ProjectDetail user={user} /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/projects" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;