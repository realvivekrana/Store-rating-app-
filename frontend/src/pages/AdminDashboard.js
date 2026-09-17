import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Skeleton } from '../components/Skeleton';
import { useToast } from '../context/ToastContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const toast = useToast();

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch((err) => toast.error(err.response?.data?.message || 'Could not load dashboard stats.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <h2>Admin Dashboard</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-card-icon">◔</span>
          <div className="stat-number">{stats ? stats.totalUsers : <Skeleton width="2.5em" height="1.6rem" />}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">▭</span>
          <div className="stat-number">{stats ? stats.totalStores : <Skeleton width="2.5em" height="1.6rem" />}</div>
          <div className="stat-label">Total Stores</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">★</span>
          <div className="stat-number">{stats ? stats.totalRatings : <Skeleton width="2.5em" height="1.6rem" />}</div>
          <div className="stat-label">Total Ratings Submitted</div>
        </div>
      </div>
    </div>
  );
}