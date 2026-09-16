import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateName, validateAddress, validateEmail, validatePassword } from '../utils/validators';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
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
    setLoading(true);
    try {
      await signup(form);
      navigate('/stores');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create your account</h2>
        {serverError && <div className="error-banner">{serverError}</div>}

        <label>Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="3-60 characters" />
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

        <button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Sign up'}</button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}