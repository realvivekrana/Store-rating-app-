import React, { useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import PasswordField from '../components/PasswordField';
import { validatePassword } from '../utils/validators';

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const pwErr = validatePassword(newPassword);
    if (pwErr) return setError(pwErr);

    setLoading(true);
    try {
      const res = await api.put('/auth/update-password', { currentPassword, newPassword });
      toast.success(res.data.message || 'Password updated');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Change Password</h2>
        {error && <div className="error-banner">{error}</div>}

        <label htmlFor="current-password">Current Password</label>
        <PasswordField id="current-password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />

        <label htmlFor="new-password">New Password</label>
        <PasswordField id="new-password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="8-16 chars, 1 uppercase, 1 special char" required />

        <button type="submit" disabled={loading}>{loading ? 'Updating…' : 'Update Password'}</button>
      </form>
    </div>
  );
}