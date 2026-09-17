import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Link } from 'react-router-dom';

import api from '../api/axios';

import SortableHeader from '../components/SortableHeader';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { Skeleton } from '../components/Skeleton';

import useDebounce from '../hooks/useDebounce';

const PAGE_SIZE = 10;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');

  const [sortBy, setSortBy] =
    useState('createdAt');

  const [order, setOrder] =
    useState('desc');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [page, setPage] =
    useState(1);

  const debouncedName =
    useDebounce(name);

  const debouncedEmail =
    useDebounce(email);

  const debouncedAddress =
    useDebounce(address);

  const fetchUsers = useCallback(
    async () => {
      setLoading(true);
      setError('');

      try {
        const res = await api.get(
          '/admin/users',
          {
            params: {
              name: debouncedName,
              email: debouncedEmail,
              address: debouncedAddress,
              role,
              sortBy,
              order,
            },
          }
        );

        setUsers(
          Array.isArray(res.data.users)
            ? res.data.users
            : []
        );
      } catch (err) {
        setUsers([]);

        setError(
          err.response?.data?.message ||
            'Failed to load users'
        );
      } finally {
        setLoading(false);
      }
    },
    [
      debouncedName,
      debouncedEmail,
      debouncedAddress,
      role,
      sortBy,
      order,
    ]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedName,
    debouncedEmail,
    debouncedAddress,
    role,
    sortBy,
    order,
  ]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((current) =>
        current === 'asc'
          ? 'desc'
          : 'asc'
      );
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(
      users.length / PAGE_SIZE
    )
  );

  const pageUsers = users.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            ADMINISTRATION
          </span>

          <h2>Users</h2>
        </div>

        <Link
          to="/admin/users/add"
          className="btn-primary"
        >
          + Add User
        </Link>
      </div>

      <div className="filters">
        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Search name"
        />

        <input
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="Search email"
        />

        <input
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
          placeholder="Search address"
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
        >
          <option value="">
            All Roles
          </option>

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
      </div>

      {loading ? (
        <div className="table-wrapper">
          <Skeleton
            width="100%"
            height="320px"
          />
        </div>
      ) : error ? (
        <div className="error-banner">
          {error}

          <button
            type="button"
            className="btn-ghost"
            onClick={fetchUsers}
          >
            Retry
          </button>
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon="⌕"
          title="No users found"
          hint="Try changing your filters."
        />
      ) : (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>
                    <SortableHeader
                      label="Name"
                      field="name"
                      sortBy={sortBy}
                      order={order}
                      onSort={handleSort}
                    />
                  </th>

                  <th>
                    <SortableHeader
                      label="Email"
                      field="email"
                      sortBy={sortBy}
                      order={order}
                      onSort={handleSort}
                    />
                  </th>

                  <th>
                    <SortableHeader
                      label="Address"
                      field="address"
                      sortBy={sortBy}
                      order={order}
                      onSort={handleSort}
                    />
                  </th>

                  <th>
                    <SortableHeader
                      label="Role"
                      field="role"
                      sortBy={sortBy}
                      order={order}
                      onSort={handleSort}
                    />
                  </th>

                  <th>Rating</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {pageUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      {user.name}
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      {user.address}
                    </td>

                    <td>
                      <span
                        className={`role-badge role-${user.role}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {user.role ===
                      'owner'
                        ? user.rating ??
                          'No rating'
                        : '—'}
                    </td>

                    <td>
                      <Link
                        to={`/admin/users/${user.id}`}
                        className="table-link"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}