import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import StarRating from '../components/StarRating';

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
  if (!data) return <p className="page">Loading...</p>;

  return (
    <div className="page">
      <h2>{data.store.name}</h2>
      <p className="muted">{data.store.address}</p>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-number">
            {data.averageRating ? data.averageRating : '–'}
          </div>
          <div className="stat-label">Average Rating</div>
          {data.averageRating && <StarRating value={Math.round(data.averageRating)} />}
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.totalRatings}</div>
          <div className="stat-label">Total Ratings</div>
        </div>
      </div>

      <h3>Users who rated this store</h3>
      {data.raters.length === 0 ? (
        <p>No ratings submitted yet.</p>
      ) : (
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
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td><StarRating value={r.rating} size={16} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
