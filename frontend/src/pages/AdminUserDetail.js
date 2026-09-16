import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import StarRating from '../components/StarRating';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get(`/admin/users/${id}`).then((res) => setUser(res.data.user));
  }, [id]);

  if (!user) return <p className="page">Loading...</p>;

  return (
    <div className="page">
      <Link to="/admin/users">&larr; Back to Users</Link>
      <h2>{user.name}</h2>
      <div className="detail-card">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Role:</strong> <span className={`role-badge role-${user.role}`}>{user.role}</span></p>
        {user.role === 'owner' && (
          <p>
            <strong>Store Rating:</strong>{' '}
            {user.rating ? (
              <>
                <StarRating value={Math.round(user.rating)} /> {user.rating} / 5
              </>
            ) : (
              'No ratings yet'
            )}
          </p>
        )}
      </div>
    </div>
  );
}
