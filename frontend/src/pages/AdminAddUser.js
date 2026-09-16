import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { validateName, validateAddress, validateEmail, validatePassword } from '../utils/validators';

export default function AdminAddUser() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

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
    try {
      await api.post('/admin/users', form);
      navigate('/admin/users');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div className="page">
      <h2>Add New User</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        {serverError && <div className="error-banner">{serverError}</div>}

        <label>Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="20-60 characters" />
        {errors.name && <span className="field-error">{errors.name}</span>}

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} />
        {errors.email && <span className="field-error">{errors.email}</span>}

        <label>Address</label>
        <textarea name="address" value={form.address} onChange={handleChange} maxLength={400} />
        {errors.address && <span className="field-error">{errors.address}</span>}

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="8-16 chars, 1 uppercase, 1 special char" />
        {errors.password && <span className="field-error">{errors.password}</span>}

        <label>Role</label>
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">Normal User</option>
          <option value="admin">System Administrator</option>
          <option value="owner">Store Owner</option>
        </select>

        <button type="submit">Create User</button>
      </form>
    </div>
  );
}
