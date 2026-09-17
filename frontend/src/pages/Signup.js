import React, {
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  useAuth,
} from '../context/AuthContext';

import PasswordField from '../components/PasswordField';

import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} from '../utils/validators';

export default function Signup() {
  const {
    signup,
  } = useAuth();

  const navigate =
    useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });

  const [errors, setErrors] =
    useState({});

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
      const user = await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        address: form.address.trim(),
      });

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
      const responseErrors =
        error.response?.data?.errors;

      if (responseErrors) {
        setErrors(responseErrors);
      }

      setServerError(
        error.response?.data?.message ||
          'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <span className="eyebrow">
            CREATE ACCOUNT
          </span>

          <h1>Sign up</h1>

          <p>
            Create your account to start
            rating stores.
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
          <label htmlFor="signup-name">
            Full Name
          </label>

          <input
            id="signup-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            maxLength={60}
            autoComplete="name"
            placeholder="Your full name"
          />

          {errors.name && (
            <span className="field-error">
              {errors.name}
            </span>
          )}

          <label htmlFor="signup-email">
            Email
          </label>

          <input
            id="signup-email"
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

          <label htmlFor="signup-password">
            Password
          </label>

          <PasswordField
            id="signup-password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="Create a password"
            disabled={loading}
          />

          {errors.password && (
            <span className="field-error">
              {errors.password}
            </span>
          )}

          <p className="hint">
            Use 8-16 characters with at
            least one uppercase letter and
            one special character.
          </p>

          <label htmlFor="signup-address">
            Address
          </label>

          <textarea
            id="signup-address"
            name="address"
            value={form.address}
            onChange={handleChange}
            maxLength={400}
            placeholder="Your address"
          />

          {errors.address && (
            <span className="field-error">
              {errors.address}
            </span>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Creating account...'
              : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}