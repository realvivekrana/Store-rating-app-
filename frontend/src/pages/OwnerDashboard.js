import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import EmptyState from '../components/EmptyState';
import { Skeleton } from '../components/Skeleton';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/owner/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  if (error) return <p className="page error-banner">{error}</p>;

  if (!data) {
    return (
      <div className="page">
        <Skeleton width="40%" height="1.6rem" />
        <Skeleton width="25%" style={{ marginTop: 10 }} />
        <div className="stat-grid" style={{ marginTop: 24 }}>
          <div className="stat-card"><Skeleton width="50%" height="2rem" /></div>
          <div className="stat-card"><Skeleton width="50%" height="2rem" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>{data.store.name}</h2>
      <p className="muted">{data.store.address}</p>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-card-icon">★</span>
          <div className="stat-number">
            {data.averageRating ? data.averageRating : '–'}
          </div>
          <div className="stat-label">Average Rating</div>
          {data.averageRating && <div style={{ marginTop: 8 }}><StarRating value={Math.round(data.averageRating)} /></div>}
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">#</span>
          <div className="stat-number">{data.totalRatings}</div>
          <div className="stat-label">Total Ratings</div>
        </div>
      </div>

      <h3>Users who rated this store</h3>
      {data.raters.length === 0 ? (
        <EmptyState icon="☆" title="No ratings yet" hint="Once customers start rating your store, they'll show up here." />
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.raters.map((r) => (
                <tr key={r.userId}>
                  <td data-label="Name">{r.name}</td>
                  <td data-label="Email">{r.email}</td>
                  <td data-label="Rating"><StarRating value={r.rating} size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}