import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Pill, History, Upload, LogOut, User } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ padding: '1.5rem 0', marginBottom: '2rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Pill size={32} color="#00d2ff" />
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>MedScript</h2>
        </Link>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/upload" className={`nav-link ${isActive('/upload') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Upload size={18} /> Upload
              </Link>
              <Link to="/history" className={`nav-link ${isActive('/history') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <History size={18} /> History
              </Link>
              <div className="glass" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{user}</span>
                <button 
                  onClick={handleLogout} 
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn-primary" style={{ padding: '8px 20px' }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
