import React, {
  useState,
} from 'react';

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  useAuth,
} from '../context/AuthContext';

import {
  validateEmail,
} from '../utils/validators';

import PasswordField from '../components/PasswordField';

export default function Login() {
  const {
    login,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

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

    const emailError =
      validateEmail(form.email);

    if (emailError) {
      nextErrors.email = emailError;
    }

    if (!form.password) {
      nextErrors.password =
        'Password is required';
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
      const user = await login(
        form.email.trim(),
        form.password
      );

      const from =
        location.state?.from;

      if (
        typeof from === 'string' &&
        from.startsWith('/')
      ) {
        navigate(from, {
          replace: true,
        });

        return;
      }

      if (user.role === 'admin') {
        navigate('/admin', {
          replace: true,
        });
      } else if (
        user.role === 'owner'
      ) {
        navigate('/owner', {
          replace: true,
        });
      } else {
        navigate('/stores', {
          replace: true,
        });
      }
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          'Login failed. Please check your credentials.'
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
            WELCOME BACK
          </span>

          <h1>Sign in</h1>

          <p>
            Sign in to continue to your
            StoreRating account.
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
          <label htmlFor="login-email">
            Email
          </label>

          <input
            id="login-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="you@example.com"
          />

          {errors.email && (
            <span className="field-error">
              {errors.email}
            </span>
          )}

          <label htmlFor="login-password">
            Password
          </label>

          <PasswordField
            id="login-password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            placeholder="Enter your password"
            disabled={loading}
          />

          {errors.password && (
            <span className="field-error">
              {errors.password}
            </span>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Signing in...'
              : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}