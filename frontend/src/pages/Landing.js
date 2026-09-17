import React from 'react';
import {
  Link,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  const dashboardPath =
    user?.role === 'admin'
      ? '/admin'
      : user?.role === 'owner'
        ? '/owner'
        : '/stores';

  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            STORE RATING PLATFORM
          </span>

          <h1>
            Discover stores.
            <br />
            Share your experience.
          </h1>

          <p>
            Find stores, check ratings and
            share your own experience with a
            simple and reliable rating platform.
          </p>

          <div className="hero-actions">
            {user ? (
              <Link
                to={dashboardPath}
                className="btn-primary"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="btn-secondary"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-card">
          <div className="feature-icon">
            ★
          </div>

          <h3>Rate Stores</h3>

          <p>
            Give stores a rating from one to
            five stars based on your experience.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            ⌕
          </div>

          <h3>Find Stores</h3>

          <p>
            Search stores by name or address
            and quickly find the information
            you need.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            ◈
          </div>

          <h3>Manage Everything</h3>

          <p>
            Dedicated dashboards provide
            useful tools for users, owners and
            administrators.
          </p>
        </div>
      </section>
    </div>
  );
}