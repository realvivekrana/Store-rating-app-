import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import SortableHeader from '../components/SortableHeader';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { SkeletonRows } from '../components/Skeleton';
import useDebounce from '../hooks/useDebounce';
import { useToast } from '../context/ToastContext';

const PAGE_SIZE = 10;

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const toast = useToast();

  const debouncedFilters = useDebounce(filters);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stores', { params: { ...debouncedFilters, sortBy, order } });
      setStores(res.data.stores);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load stores.');
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters, sortBy, order, toast]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  useEffect(() => { setPage(1); }, [debouncedFilters, sortBy, order]);

  const handleSort = (field) => {
    if (sortBy === field) setOrder(order === 'asc' ? 'desc' : 'asc');
    else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const totalPages = Math.max(1, Math.ceil(stores.length / PAGE_SIZE));
  const pageStores = useMemo(
    () => stores.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [stores, page]
  );

  return (
    <div className="page">
      <div className="page-header">
        <h2>Stores</h2>
        <Link className="btn" to="/admin/stores/add">+ Add Store</Link>
      </div>

      <div className="filters">
        <input placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
      </div>

      {!loading && stores.length === 0 ? (
        <EmptyState icon="⌕" title="No stores found" hint="Try adjusting your filters, or add a new store." />
      ) : (
        <>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th><SortableHeader label="Name" field="name" sortBy={sortBy} order={order} onSort={handleSort} /></th>
                  <th><SortableHeader label="Email" field="email" sortBy={sortBy} order={order} onSort={handleSort} /></th>
                  <th><SortableHeader label="Address" field="address" sortBy={sortBy} order={order} onSort={handleSort} /></th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <SkeletonRows columns={4} rows={6} />
                ) : (
                  pageStores.map((s) => (
                    <tr key={s.id}>
                      <td data-label="Name">{s.name}</td>
                      <td data-label="Email">{s.email}</td>
                      <td data-label="Address">{s.address}</td>
                      <td data-label="Rating" className="rating-figure">{s.rating ? `${s.rating} / 5 (${s.ratingCount})` : 'No ratings yet'}</td>
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