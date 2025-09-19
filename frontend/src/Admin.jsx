import React, { useState, useEffect } from 'react';

// Mock data for demonstration
const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: 2, name: 'Test User', email: 'user@example.com', role: 'user' },
  { id: 3, name: 'John Doe', email: 'john@example.com', role: 'user' }
];

const mockTickets = [
  { 
    id: 1, 
    title: 'Login Issue', 
    description: 'Cannot login to the system',
    status: 'open', 
    user_email: 'user@example.com',
    user_name: 'Test User',
    created_at: new Date().toISOString()
  },
  { 
    id: 2, 
    title: 'Billing Question', 
    description: 'Need help with my bill',
    status: 'closed', 
    user_email: 'john@example.com',
    user_name: 'John Doe',
    created_at: new Date().toISOString()
  },
  { 
    id: 3, 
    title: 'Feature Request', 
    description: 'Request for new feature',
    status: 'in_progress', 
    user_email: 'user@example.com',
    user_name: 'Test User',
    created_at: new Date().toISOString()
  }
];

const mockPlans = [
  { id: 1, name: 'Basic', price: '9.99', speed: '10 Mbps', created_at: new Date().toISOString() },
  { id: 2, name: 'Pro', price: '19.99', speed: '50 Mbps', created_at: new Date().toISOString() },
  { id: 3, name: 'Enterprise', price: '49.99', speed: '100 Mbps', created_at: new Date().toISOString() }
];

function Admin({ token }) {
  const [users, setUsers] = useState(mockUsers);
  const [tickets, setTickets] = useState(mockTickets);
  const [plans, setPlans] = useState(mockPlans);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newPlan, setNewPlan] = useState({ name: '', price: '', speed: '' });
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    if (token) {
      // Try to fetch real data first
      fetchData();
    } else {
      // For demo mode when no token
      setLoading(false);
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [usersRes, ticketsRes, plansRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/tickets', { headers }),
        fetch('/api/plans', { headers: { 'Content-Type': 'application/json' } })
      ]);

      if (usersRes.ok && ticketsRes.ok && plansRes.ok) {
        const [usersData, ticketsData, plansData] = await Promise.all([
          usersRes.json(),
          ticketsRes.json(),
          plansRes.json()
        ]);
        
        setUsers(usersData);
        setTickets(ticketsData);
        setPlans(plansData);
        setDemoMode(false);
      } else {
        // If API calls fail, use mock data
        setError('API unavailable - showing demo data');
        setDemoMode(true);
      }
    } catch (error) {
      setError('API unavailable - showing demo data');
      setDemoMode(true);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    if (demoMode) {
      // Update mock data
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
      return;
    }
    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedTicket = await response.json();
        setTickets(tickets.map(ticket => 
          ticket.id === ticketId ? { ...ticket, status: updatedTicket.status } : ticket
        ));
      } else {
        setError('Failed to update ticket status');
      }
    } catch (error) {
      setError('Error updating ticket status');
      console.error('Error:', error);
    }
  };

  const createPlan = async (e) => {
    e.preventDefault();
    
    if (demoMode) {
      // Add to mock data
      const newPlanData = {
        id: plans.length + 1,
        ...newPlan,
        created_at: new Date().toISOString()
      };
      setPlans([...plans, newPlanData]);
      setNewPlan({ name: '', price: '', speed: '' });
      return;
    }
    try {
      const response = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPlan)
      });

      if (response.ok) {
        const createdPlan = await response.json();
        setPlans([...plans, createdPlan]);
        setNewPlan({ name: '', price: '', speed: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create plan');
      }
    } catch (error) {
      setError('Error creating plan');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div>Loading admin data...</div>;
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      {demoMode && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '5px', 
          marginBottom: '20px' 
        }}>
          <strong>Demo Mode:</strong> Database not connected. Showing sample data for demonstration.
        </div>
      )}
      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      {/* Users Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Users</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.id}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.name}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.email}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tickets Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Tickets</h3>
        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Title</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>User Email</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{ticket.id}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{ticket.title}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{ticket.user_email}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '3px',
                      backgroundColor: ticket.status === 'open' ? '#fff3cd' : 
                                     ticket.status === 'closed' ? '#d4edda' : '#cce5ff'
                    }}>
                      {ticket.status}
                    </span>
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    <select 
                      value={ticket.status} 
                      onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                      style={{ padding: '4px' }}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Plans Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Plans</h3>
        
        {/* Create Plan Form */}
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
          <h4>Create New Plan</h4>
          <form onSubmit={createPlan} style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                required
                style={{ padding: '8px', marginTop: '5px', display: 'block' }}
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="number"
                step="0.01"
                value={newPlan.price}
                onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                required
                style={{ padding: '8px', marginTop: '5px', display: 'block' }}
              />
            </div>
            <div>
              <label>Speed:</label>
              <input
                type="text"
                value={newPlan.speed}
                onChange={(e) => setNewPlan({ ...newPlan, speed: e.target.value })}
                required
                style={{ padding: '8px', marginTop: '5px', display: 'block' }}
              />
            </div>
            <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#28a745', color: 'white', border: 'none' }}>
              Create Plan
            </button>
          </form>
        </div>

        {/* Plans Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Price</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Speed</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{plan.id}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{plan.name}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>${plan.price}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{plan.speed}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {new Date(plan.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;