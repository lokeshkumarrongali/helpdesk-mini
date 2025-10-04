import { useState, useEffect } from 'react';
import api from '../services/api';

export default function NewTicket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sla, setSla] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.get('/users');
        setUsers(res.data);
      } catch {
        // Optionally handle error or fallback
        setUsers([]);
      }
    }
    fetchUsers();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title || !description || !sla) {
      setError('Please fill in all required fields.');
      return;
    }
    if (new Date(sla) <= new Date()) {
      setError('SLA deadline must be a future date/time.');
      return;
    }

    try {
      setLoading(true);
      await api.post('/tickets', {
        title,
        description,
        sla_deadline: sla,
        assignedTo: assignedTo || null,
        priority,
      });
      setSuccess('Ticket created successfully!');
      setTitle('');
      setDescription('');
      setSla('');
      setAssignedTo('');
      setPriority('Medium');
    } catch {
      setError('Failed to create ticket.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Ticket</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}

      <div>
        <label>Title *</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      <div>
        <label>Description *</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required />
      </div>

      <div>
        <label>SLA Deadline *</label>
        <input type="datetime-local" value={sla} onChange={e => setSla(e.target.value)} required />
      </div>

      <div>
        <label>Assign To</label>
        <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
          <option value="">Unassigned</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Priority *</label>
        <select value={priority} onChange={e => setPriority(e.target.value)} required>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Ticket'}</button>
    </form>
  );
}
