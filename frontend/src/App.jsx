import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard.jsx';
import Login from './Login.jsx';
import Admin from './Admin.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchMe = async () => {
    try {
      const response = await fetch('/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setCurrentPage('dashboard');
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h1>Muhasebe System</h1>
        <p>Welcome, {user.name} ({user.role})</p>
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={() => setCurrentPage('dashboard')}
            style={{ marginRight: '10px', padding: '5px 10px' }}
          >
            Dashboard
          </button>
          {user.role === 'admin' && (
            <button 
              onClick={() => setCurrentPage('admin')}
              style={{ marginRight: '10px', padding: '5px 10px' }}
            >
              Admin
            </button>
          )}
          <button 
            onClick={handleLogout}
            style={{ padding: '5px 10px' }}
          >
            Logout
          </button>
        </div>
      </div>

      {currentPage === 'dashboard' && <Dashboard user={user} />}
      {currentPage === 'admin' && user.role === 'admin' && <Admin token={token} />}
    </div>
  );
}

export default App;