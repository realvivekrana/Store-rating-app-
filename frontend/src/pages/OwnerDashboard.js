import React, {
  useEffect,
  useState,
} from 'react';

import api from '../api/axios';

import StarRating from '../components/StarRating';
import EmptyState from '../components/EmptyState';
import { Skeleton } from '../components/Skeleton';

export default function OwnerDashboard() {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await api.get(
        '/owner/dashboard'
      );

      setData(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load owner dashboard'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <Skeleton
          width="220px"
          height="2rem"
        />

        <div
          className="detail-card"
          style={{
            marginTop: '20px',
          }}
        >
          <Skeleton
            width="50%"
            style={{
              marginBottom: '15px',
            }}
          />

          <Skeleton
            width="80%"
            style={{
              marginBottom: '15px',
            }}
          />

          <Skeleton
            width="30%"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="error-banner">
          {error}

          <button
            type="button"
            className="btn-ghost"
            onClick={loadDashboard}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data?.store) {
    return (
      <div className="page">
        <EmptyState
          icon="▭"
          title="No store assigned"
          hint="Your administrator has not assigned a store to your account yet."
        />
      </div>
    );
  }

  const {
    store,
    averageRating,
    totalRatings,
    raters = [],
  } = data;

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            STORE OWNER
          </span>

          <h2>{store.name}</h2>
        </div>
      </div>

      <div className="owner-summary-grid">
        <div className="stat-card">
          <div className="stat-number">
            {averageRating ??
              '—'}
          </div>

          <div className="stat-label">
            Average Rating
          </div>

          {averageRating !==
            null &&
            averageRating !==
              undefined && (
              <StarRating
                value={Math.round(
                  averageRating
                )}
                size={18}
              />
            )}
        </div>

        <div className="stat-card">
          <div className="stat-number">
            {totalRatings}
          </div>

          <div className="stat-label">
            Total Ratings
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h3>Store Information</h3>

        <p>
          <strong>Email:</strong>{' '}
          {store.email}
        </p>

        <p>
          <strong>Address:</strong>{' '}
          {store.address}
        </p>
      </div>

      <section
        className="section-block"
        style={{
          marginTop: '28px',
        }}
      >
        <div className="page-heading">
          <div>
            <h3>
              Customers Who Rated
            </h3>

            <p className="muted">
              People who have submitted a
              rating for your store.
            </p>
          </div>
        </div>

        {raters.length === 0 ? (
          <EmptyState
            icon="★"
            title="No ratings yet"
            hint="Customer ratings will appear here."
          />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {raters.map(
                  (rater, index) => (
                    <tr
                      key={
                        rater.userId ||
                        `${rater.email}-${index}`
                      }
                    >
                      <td>
                        {rater.name}
                      </td>

                      <td>
                        {rater.email}
                      </td>

                      <td>
                        {rater.address}
                      </td>

                      <td>
                        <StarRating
                          value={
                            rater.rating
                          }
                          size={16}
                        />
                      </td>

                      <td>
                        {rater.ratedAt
                          ? new Date(
                              rater.ratedAt
                            ).toLocaleDateString()
                          : '—'}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}