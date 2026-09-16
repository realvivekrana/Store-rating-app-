import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import { Skeleton } from '../components/Skeleton';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get(`/admin/users/${id}`).then((res) => setUser(res.data.user));
  }, [id]);

  return (
    <div className="page">
      <Link to="/admin/users">&larr; Back to Users</Link>
      {!user ? (
        <div style={{ marginTop: 16 }}>
          <Skeleton width="40%" height="1.6rem" />
          <div className="detail-card" style={{ marginTop: 16 }}>
            <Skeleton width="80%" style={{ margin: '12px 0' }} />
            <Skeleton width="60%" style={{ margin: '12px 0' }} />
            <Skeleton width="30%" style={{ margin: '12px 0' }} />
          </div>
        </div>
      ) : (
        <>
          <h2>{user.name}</h2>
          <div className="detail-card">
            <p><strong>Email</strong> <span>{user.email}</span></p>
            <p><strong>Address</strong> <span>{user.address}</span></p>
            <p><strong>Role</strong> <span className={`role-badge role-${user.role}`}>{user.role}</span></p>
            {user.role === 'owner' && (
              <p>
                <strong>Store Rating</strong>{' '}
                <span>
                  {user.rating ? (
                    <>
                      <StarRating value={Math.round(user.rating)} size={16} /> {user.rating} / 5
                    </>
                  ) : (
                    'No ratings yet'
                  )}
                </span>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}