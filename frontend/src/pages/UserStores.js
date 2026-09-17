import React, { useEffect, useState, useCallback, useMemo } from 'react';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { SkeletonCards } from '../components/Skeleton';
import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';

const PAGE_SIZE = 9;

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [page, setPage] = useState(1);
  const toast = useToast();

  const debouncedName = useDebounce(name);
  const debouncedAddress = useDebounce(address);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/stores', { params: { name: debouncedName, address: debouncedAddress, sortBy, order } });
      setStores(res.data.stores);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load stores. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [debouncedName, debouncedAddress, sortBy, order, toast]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  useEffect(() => { setPage(1); }, [debouncedName, debouncedAddress, sortBy, order]);

  const handleRate = async (storeId, rating) => {
    setSavingId(storeId);
    try {
      await api.post(`/stores/${storeId}/rating`, { rating });
      setStores((prev) =>
        prev.map((s) => (s.id === storeId ? { ...s, userRating: rating } : s))
      );
      toast.success('Rating saved');
      fetchStores(); // refresh overall average
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save your rating');
    } finally {
      setSavingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(stores.length / PAGE_SIZE));
  const pageStores = useMemo(
    () => stores.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [stores, page]
  );

  return (
    <div className="page">
      <h2>Browse Stores</h2>

      <div className="filters">
        <input placeholder="Search by name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Search by address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort: Name</option>
          <option value="address">Sort: Address</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {loading ? (
        <SkeletonCards count={6} />
      ) : stores.length === 0 ? (
        <EmptyState icon="⌕" title="No stores found" hint="Try a different name or address." />
      ) : (
        <>
          <div className="store-grid">
            {pageStores.map((store) => (
              <div className={`store-card ${store.overallRating >= 4.5 ? 'top-rated' : ''}`} key={store.id}>
                <h3>{store.name}</h3>
                <p className="muted">{store.address}</p>

                <div className="store-rating-row">
                  <span>Overall Rating:</span>
                  <StarRating value={Math.round(store.overallRating || 0)} />
                  <span className="rating-figure">
                    {store.overallRating ? `${store.overallRating} / 5` : 'No ratings yet'}
                  </span>
                </div>

                <div className="store-rating-row">
                  <span>Your Rating:</span>
                  <StarRating
                    value={store.userRating || 0}
                    onChange={(val) => handleRate(store.id, val)}
                  />
                  {savingId === store.id && <span className="muted">saving…</span>}
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}