import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { validateName, validateAddress, validateEmail } from '../utils/validators';

export default function AdminAddStore() {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/users', { params: { role: 'owner' } }).then((res) => setOwners(res.data.users));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((v) => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    try {
      await api.post('/admin/stores', { ...form, ownerId: form.ownerId || undefined });
      navigate('/admin/stores');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create store');
    }
  };

  return (
    <div className="page">
      <h2>Add New Store</h2>
      <form className="form-card" onSubmit={handleSubmit}>
        {serverError && <div className="error-banner">{serverError}</div>}

        <label>Store Name</label>
        <input name="name" value={form.name} onChange={handleChange} maxLength={60} />
        {errors.name && <span className="field-error">{errors.name}</span>}

        <label>Store Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} />
        {errors.email && <span className="field-error">{errors.email}</span>}

        <label>Address</label>
        <textarea name="address" value={form.address} onChange={handleChange} maxLength={400} />
        {errors.address && <span className="field-error">{errors.address}</span>}

        <label>Store Owner (optional)</label>
        <select name="ownerId" value={form.ownerId} onChange={handleChange}>
          <option value="">-- No owner account linked --</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
          ))}
        </select>
        <p className="hint">
          Only users with the "Store Owner" role appear here. Create one first via Add User if needed.
        </p>

        <button type="submit">Create Store</button>
      </form>
    </div>
  );
}
