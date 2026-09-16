import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import StarRating from '../components/StarRating';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/stores', { params: { name, address, sortBy, order } });
      setStores(res.data.stores);
    } finally {
      setLoading(false);
    }
  }, [name, address, sortBy, order]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleRate = async (storeId, rating) => {
    setSavingId(storeId);
    try {
      await api.post(`/stores/${storeId}/rating`, { rating });
      setStores((prev) =>
        prev.map((s) => (s.id === storeId ? { ...s, userRating: rating } : s))
      );
      fetchStores(); // refresh overall average
    } finally {
      setSavingId(null);
    }
  };

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
        <p>Loading stores...</p>
      ) : stores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <div className="store-grid">
          {stores.map((store) => (
            <div className="store-card" key={store.id}>
              <h3>{store.name}</h3>
              <p className="muted">{store.address}</p>

              <div className="store-rating-row">
                <span>Overall Rating:</span>
                <StarRating value={Math.round(store.overallRating || 0)} />
                <span className="muted">
                  {store.overallRating ? `${store.overallRating} / 5` : 'No ratings yet'}
                </span>
              </div>

              <div className="store-rating-row">
                <span>Your Rating:</span>
                <StarRating
                  value={store.userRating || 0}
                  onChange={(val) => handleRate(store.id, val)}
                />
                {savingId === store.id && <span className="muted"> saving...</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
