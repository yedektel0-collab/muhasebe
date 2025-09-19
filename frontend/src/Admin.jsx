import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3000';

function Admin({ token }) {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlan, setNewPlan] = useState({ name: '', price: '', speed: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [usersRes, ticketsRes, plansRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/users`, { headers }),
        fetch(`${API_BASE}/api/admin/tickets`, { headers }),
        fetch(`${API_BASE}/api/plans`, { headers })
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      if (ticketsRes.ok) {
        const ticketsData = await ticketsRes.json();
        setTickets(ticketsData);
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData);
      }
    } catch (error) {
      setError('Error fetching admin data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setSuccess('Ticket status updated successfully');
        setError('');
        fetchAdminData(); // Refresh data
      } else {
        const data = await response.json();
        setError(data.error || 'Error updating ticket');
      }
    } catch (error) {
      setError('Network error updating ticket');
    }
  };

  const createPlan = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/admin/plans`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPlan)
      });

      if (response.ok) {
        setSuccess('Plan created successfully');
        setError('');
        setNewPlan({ name: '', price: '', speed: '' });
        fetchAdminData(); // Refresh data
      } else {
        const data = await response.json();
        setError(data.error || 'Error creating plan');
      }
    } catch (error) {
      setError('Network error creating plan');
    }
  };

  if (loading) {
    return <div>Loading admin data...</div>;
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      
      {error && (
        <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffebee', border: '1px solid #f44336', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ color: 'green', padding: '10px', backgroundColor: '#e8f5e8', border: '1px solid #4caf50', borderRadius: '4px', marginBottom: '20px' }}>
          {success}
        </div>
      )}

      {/* Users Section */}
      <section style={{ marginBottom: '30px' }}>
        <h3>Users ({users.length})</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>ID</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Name</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Email</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{user.id}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{user.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{user.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: user.role === 'admin' ? '#ffc107' : '#28a745',
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Tickets Section */}
      <section style={{ marginBottom: '30px' }}>
        <h3>Tickets ({tickets.length})</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>ID</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Title</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>User Email</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Status</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{ticket.id}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{ticket.title}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{ticket.user_email}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: 
                      ticket.status === 'open' ? '#dc3545' :
                      ticket.status === 'in_progress' ? '#ffc107' : '#28a745',
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    {ticket.status}
                  </span>
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  <select
                    value={ticket.status}
                    onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                    style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px' }}
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
      </section>

      {/* Plans Section */}
      <section style={{ marginBottom: '30px' }}>
        <h3>Plans ({plans.length})</h3>
        
        {/* Create New Plan Form */}
        <form onSubmit={createPlan} style={{ 
          marginBottom: '20px', 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #dee2e6', 
          borderRadius: '4px' 
        }}>
          <h4>Create New Plan</h4>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
              <input
                type="text"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Price:</label>
              <input
                type="number"
                step="0.01"
                value={newPlan.price}
                onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Speed:</label>
              <input
                type="text"
                value={newPlan.speed}
                onChange={(e) => setNewPlan({ ...newPlan, speed: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Create Plan
            </button>
          </div>
        </form>

        {/* Plans Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>ID</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Name</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Price</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Speed</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan.id}>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{plan.id}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{plan.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>${plan.price}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{plan.speed}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  {new Date(plan.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Admin;