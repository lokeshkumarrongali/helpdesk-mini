import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Use proxy: just '/auth/register' or direct 'http://localhost:4000/auth/register'
      const res = await axios.post('/auth/register', form);
      setMessage(res.data.message || 'Signup successful! You can now log in.');
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || 'Signup failed'));
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
