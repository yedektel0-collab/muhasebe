import React, { useState } from 'react';
import Admin from './Admin.jsx';

function Dashboard({ user, token, onLogout }) {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'admin':
        return <Admin token={token} />;
      case 'dashboard':
      default:
        return (
          <div>
            <h2>Dashboard</h2>
            <p>Welcome to your dashboard!</p>
            <p>Here you can manage your account and view your data.</p>
          </div>
        );
    }
  };

  return (
    <div>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '10px 0', 
        borderBottom: '1px solid #ccc',
        marginBottom: '20px'
      }}>
        <div>
          <h1>Muhasebe App</h1>
          <p>Hello, {user.name} ({user.role})</p>
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </header>

      <nav style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentView('dashboard')}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            backgroundColor: currentView === 'dashboard' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Dashboard
        </button>
        
        {user.role === 'admin' && (
          <button
            onClick={() => setCurrentView('admin')}
            style={{
              padding: '8px 16px',
              backgroundColor: currentView === 'admin' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Admin
          </button>
        )}
      </nav>

      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;