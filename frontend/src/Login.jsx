import React, { useState } from 'react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // For demo purposes, allow mock login
    if (email === 'admin@example.com' && password === 'adminpassword') {
      const mockUser = { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' };
      const mockToken = 'demo-token';
      onLogin(mockUser, mockToken);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user, data.token);
      } else {
        // If API fails, check for demo credentials
        if (email === 'admin@example.com' && password === 'adminpassword') {
          const mockUser = { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' };
          const mockToken = 'demo-token';
          onLogin(mockUser, mockToken);
        } else {
          setError(data.error || 'Login failed');
        }
      }
    } catch (error) {
      // If network error, allow demo login
      if (email === 'admin@example.com' && password === 'adminpassword') {
        const mockUser = { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' };
        const mockToken = 'demo-token';
        onLogin(mockUser, mockToken);
      } else {
        setError('Network error. Try demo credentials: admin@example.com / adminpassword');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>Demo credentials:</p>
        <p>Email: admin@example.com</p>
        <p>Password: adminpassword</p>
      </div>
    </div>
  );
}

export default Login;