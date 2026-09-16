import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import PasswordField from '../components/PasswordField';
import { validateName, validateAddress, validateEmail, validatePassword } from '../utils/validators';

export default function AdminAddUser() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      password: validatePassword(form.password),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/admin/users', form);
      toast.success('User created');
      navigate('/admin/users');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Add New User</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        {serverError && <div className="error-banner">{serverError}</div>}

        <label htmlFor="add-user-name">Full Name</label>
        <input id="add-user-name" name="name" value={form.name} onChange={handleChange} placeholder="3-60 characters" />
        {errors.name && <span className="field-error">{errors.name}</span>}

        <label htmlFor="add-user-email">Email</label>
        <input id="add-user-email" name="email" type="email" value={form.email} onChange={handleChange} />
        {errors.email && <span className="field-error">{errors.email}</span>}

        <label htmlFor="add-user-address">Address</label>
        <textarea id="add-user-address" name="address" value={form.address} onChange={handleChange} maxLength={400} />
        {errors.address && <span className="field-error">{errors.address}</span>}

        <label htmlFor="add-user-password">Password</label>
        <PasswordField id="add-user-password" name="password" value={form.password} onChange={handleChange} placeholder="8-16 chars, 1 uppercase, 1 special char" />
        {errors.password && <span className="field-error">{errors.password}</span>}

        <label htmlFor="add-user-role">Role</label>
        <select id="add-user-role" name="role" value={form.role} onChange={handleChange}>
          <option value="user">Normal User</option>
          <option value="admin">System Administrator</option>
          <option value="owner">Store Owner</option>
        </select>

        <button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create User'}</button>
      </form>
    </div>
  );
}