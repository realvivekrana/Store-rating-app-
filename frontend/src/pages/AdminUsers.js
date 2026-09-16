import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import SortableHeader from '../components/SortableHeader';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { SkeletonRows } from '../components/Skeleton';
import useDebounce from '../hooks/useDebounce';

const PAGE_SIZE = 10;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const debouncedFilters = useDebounce(filters);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', { params: { ...debouncedFilters, sortBy, order } });
      setUsers(res.data.users);
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters, sortBy, order]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => { setPage(1); }, [debouncedFilters, sortBy, order]);

  const handleSort = (field) => {
    if (sortBy === field) setOrder(order === 'asc' ? 'desc' : 'asc');
    else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const pageUsers = useMemo(
    () => users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [users, page]
  );

  return (
    <div className="page">
      <div className="page-header">
        <h2>Users</h2>
        <Link className="btn" to="/admin/users/new">+ Add User</Link>
      </div>

      <div className="filters">
        <input placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">Normal User</option>
          <option value="owner">Store Owner</option>
        </select>
      </div>

      {!loading && users.length === 0 ? (
        <EmptyState icon="⌕" title="No users found" hint="Try adjusting your filters." />
      ) : (
        <>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <SortableHeader label="Name" field="name" sortBy={sortBy} order={order} onSort={handleSort} />
                  <SortableHeader label="Email" field="email" sortBy={sortBy} order={order} onSort={handleSort} />
                  <SortableHeader label="Address" field="address" sortBy={sortBy} order={order} onSort={handleSort} />
                  <SortableHeader label="Role" field="role" sortBy={sortBy} order={order} onSort={handleSort} />
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <SkeletonRows columns={5} rows={6} />
                ) : (
                  pageUsers.map((u) => (
                    <tr key={u.id}>
                      <td data-label="Name">{u.name}</td>
                      <td data-label="Email">{u.email}</td>
                      <td data-label="Address">{u.address}</td>
                      <td data-label="Role"><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                      <td data-label=""><Link to={`/admin/users/${u.id}`}>View</Link></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!loading && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
        </>
      )}
    </div>
  );
}