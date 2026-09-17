import React, {
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import api from '../api/axios';

import PasswordField from '../components/PasswordField';

import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} from '../utils/validators';

import {
  useToast,
} from '../context/ToastContext';

export default function AdminAddUser() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user',
  });

  const [errors, setErrors] =
    useState({});

  const [serverError, setServerError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  const toast =
    useToast();

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: '',
    }));

    setServerError('');
  };

  const validate = () => {
    const nextErrors = {};

    const nameError =
      validateName(form.name);

    if (nameError) {
      nextErrors.name = nameError;
    }

    const emailError =
      validateEmail(form.email);

    if (emailError) {
      nextErrors.email = emailError;
    }

    const passwordError =
      validatePassword(form.password);

    if (passwordError) {
      nextErrors.password =
        passwordError;
    }

    const addressError =
      validateAddress(form.address);

    if (addressError) {
      nextErrors.address =
        addressError;
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      await api.post(
        '/admin/users',
        {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          address: form.address.trim(),
          role: form.role,
        }
      );

      toast.success(
        'User created successfully'
      );

      navigate('/admin/users');
    } catch (error) {
      const responseErrors =
        error.response?.data?.errors;

      if (responseErrors) {
        setErrors((current) => ({
          ...current,
          ...responseErrors,
        }));
      }

      setServerError(
        error.response?.data?.message ||
          'Failed to create user'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Add User</h2>

      <form
        className="form-card"
        onSubmit={handleSubmit}
        noValidate
      >
        {serverError && (
          <div className="error-banner">
            {serverError}
          </div>
        )}

        <label htmlFor="admin-user-name">
          Name
        </label>

        <input
          id="admin-user-name"
          name="name"
          value={form.name}
          onChange={handleChange}
          maxLength={60}
          autoComplete="name"
        />

        {errors.name && (
          <span className="field-error">
            {errors.name}
          </span>
        )}

        <label htmlFor="admin-user-email">
          Email
        </label>

        <input
          id="admin-user-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />

        {errors.email && (
          <span className="field-error">
            {errors.email}
          </span>
        )}

        <label htmlFor="admin-user-password">
          Password
        </label>

        <PasswordField
          id="admin-user-password"
          name="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          disabled={loading}
        />

        {errors.password && (
          <span className="field-error">
            {errors.password}
          </span>
        )}

        <label htmlFor="admin-user-address">
          Address
        </label>

        <textarea
          id="admin-user-address"
          name="address"
          value={form.address}
          onChange={handleChange}
          maxLength={400}
        />

        {errors.address && (
          <span className="field-error">
            {errors.address}
          </span>
        )}

        <label htmlFor="admin-user-role">
          Role
        </label>

        <select
          id="admin-user-role"
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="user">
            User
          </option>

          <option value="owner">
            Store Owner
          </option>

          <option value="admin">
            Admin
          </option>
        </select>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Creating...'
            : 'Create User'}
        </button>
      </form>
    </div>
  );
}