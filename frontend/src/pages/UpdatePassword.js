import React, {
  useState,
} from 'react';

import {
  useNavigate,
} from 'react-router-dom';

import api from '../api/axios';

import PasswordField from '../components/PasswordField';

import {
  validatePassword,
} from '../utils/validators';

import {
  useToast,
} from '../context/ToastContext';

export default function UpdatePassword() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] =
    useState({});

  const [serverError, setServerError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const toast = useToast();
  const navigate =
    useNavigate();

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!form.currentPassword) {
      nextErrors.currentPassword =
        'Current password is required';
    }

    const passwordError =
      validatePassword(
        form.newPassword
      );

    if (passwordError) {
      nextErrors.newPassword =
        passwordError;
    }

    if (
      form.newPassword !==
      form.confirmPassword
    ) {
      nextErrors.confirmPassword =
        'Passwords do not match';
    }

    setErrors(nextErrors);

    if (
      Object.keys(nextErrors).length > 0
    ) {
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      await api.put(
        '/auth/update-password',
        {
          currentPassword:
            form.currentPassword,
          newPassword:
            form.newPassword,
        }
      );

      toast.success(
        'Password updated successfully'
      );

      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      navigate(-1);
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
          'Failed to update password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="eyebrow">
            ACCOUNT SECURITY
          </span>

          <h1>
            Update password
          </h1>

          <p>
            Choose a new password for your
            account.
          </p>
        </div>

        {serverError && (
          <div className="error-banner">
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
        >
          <label htmlFor="current-password">
            Current Password
          </label>

          <PasswordField
            id="current-password"
            name="currentPassword"
            value={
              form.currentPassword
            }
            onChange={handleChange}
            autoComplete="current-password"
            disabled={loading}
          />

          {errors.currentPassword && (
            <span className="field-error">
              {errors.currentPassword}
            </span>
          )}

          <label htmlFor="new-password">
            New Password
          </label>

          <PasswordField
            id="new-password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            autoComplete="new-password"
            disabled={loading}
          />

          {errors.newPassword && (
            <span className="field-error">
              {errors.newPassword}
            </span>
          )}

          <label htmlFor="confirm-password">
            Confirm New Password
          </label>

          <PasswordField
            id="confirm-password"
            name="confirmPassword"
            value={
              form.confirmPassword
            }
            onChange={handleChange}
            autoComplete="new-password"
            disabled={loading}
          />

          {errors.confirmPassword && (
            <span className="field-error">
              {errors.confirmPassword}
            </span>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Updating...'
              : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}