import React from 'react';

function Dashboard({ user }) {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to your dashboard, {user.name}!</p>
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h3>Your Account Information</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
      
      {user.role === 'admin' && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '5px' }}>
          <h4>Admin Access</h4>
          <p>You have administrative privileges. Use the Admin link above to access admin features.</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;