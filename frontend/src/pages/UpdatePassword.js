import React, { useState } from 'react';
import api from '../api/axios';
import { validatePassword } from '../utils/validators';

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const pwErr = validatePassword(newPassword);
    if (pwErr) return setError(pwErr);

    try {
      const res = await api.put('/auth/update-password', { currentPassword, newPassword });
      setMessage(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Change Password</h2>
        {message && <div className="success-banner">{message}</div>}
        {error && <div className="error-banner">{error}</div>}

        <label>Current Password</label>
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />

        <label>New Password</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="8-16 chars, 1 uppercase, 1 special char" required />

        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}
