import React, {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../api/axios';
import { useToast } from '../context/ToastContext';

import {
  validateName,
  validateAddress,
  validateEmail,
} from '../utils/validators';

export default function AdminAddStore() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });

  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [ownersLoading, setOwnersLoading] =
    useState(true);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    let mounted = true;

    const loadOwners = async () => {
      try {
        setOwnersLoading(true);
        setServerError('');

        const res = await api.get(
          '/admin/users',
          {
            params: {
              role: 'owner',
            },
          }
        );

        if (mounted) {
          setOwners(
            Array.isArray(res.data.users)
              ? res.data.users
              : []
          );
        }
      } catch (err) {
        if (mounted) {
          setServerError(
            err.response?.data?.message ||
              'Failed to load store owners'
          );
        }
      } finally {
        if (mounted) {
          setOwnersLoading(false);
        }
      }
    };

    loadOwners();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validate = () => {
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
    };

    setErrors(newErrors);

    return Object.values(newErrors).every(
      (value) => !value
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await api.post('/admin/stores', {
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        ownerId:
          form.ownerId || undefined,
      });

      toast.success('Store created');

      navigate('/admin/stores');
    } catch (err) {
      const responseErrors =
        err.response?.data?.errors;

      if (responseErrors) {
        setErrors((prev) => ({
          ...prev,
          ...responseErrors,
        }));
      }

      setServerError(
        err.response?.data?.message ||
          'Failed to create store'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Add New Store</h2>

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

        <label htmlFor="add-store-name">
          Store Name
        </label>

        <input
          id="add-store-name"
          name="name"
          value={form.name}
          onChange={handleChange}
          maxLength={60}
          autoComplete="organization"
        />

        {errors.name && (
          <span className="field-error">
            {errors.name}
          </span>
        )}

        <label htmlFor="add-store-email">
          Store Email
        </label>

        <input
          id="add-store-email"
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

        <label htmlFor="add-store-address">
          Address
        </label>

        <textarea
          id="add-store-address"
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

        <label htmlFor="add-store-owner">
          Store Owner (optional)
        </label>

        <select
          id="add-store-owner"
          name="ownerId"
          value={form.ownerId}
          onChange={handleChange}
        >
          <option value="">
            -- No owner account linked --
          </option>

          {ownersLoading ? (
            <option disabled>
              Loading owners…
            </option>
          ) : (
            owners.map((owner) => (
              <option
                key={owner.id}
                value={owner.id}
              >
                {owner.name} ({owner.email})
              </option>
            ))
          )}
        </select>

        <p className="hint">
          Only users with the "Store Owner"
          role appear here. Create one first
          via Add User if needed.
        </p>

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Creating…'
            : 'Create Store'}
        </button>
      </form>
    </div>
  );
}