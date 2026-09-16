import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../components/StarRating';

// Public landing page — shown at "/" to anyone who is not logged in.
// No auth required to view this. Login/Signup are just prominent buttons here.
export default function Landing() {
  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-copy">
          <h1>Know which stores actually earn their stars.</h1>
          <p>
            Rate any store from 1 to 5, see what other people think before you go, and
            keep a running record store owners and admins can trust.
          </p>
          <div className="landing-cta">
            <Link to="/signup" className="btn">Create an account</Link>
            <Link to="/login" className="btn-outline">Log in</Link>
          </div>
        </div>

        <div className="hero-preview" aria-hidden="true">
          <div className="hero-preview-card">
            <span className="hero-preview-tag">SAMPLE LISTING</span>
            <h3>Riverside Hardware</h3>
            <p className="muted">4 Canal Street</p>
            <div className="store-rating-row">
              <span className="hero-preview-avg">4.6</span>
              <StarRating value={5} />
            </div>
            <p className="muted" style={{ marginTop: 4 }}>128 ratings</p>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section className="landing-features">
        <div className="feature-card for-user">
          <h3>Normal users</h3>
          <p>Sign up, browse registered stores, search by name or address, and submit or update your 1-5 star rating anytime.</p>
        </div>
        <div className="feature-card for-owner">
          <h3>Store owners</h3>
          <p>See your store's average rating at a glance and view exactly who rated you and when.</p>
        </div>
        <div className="feature-card for-admin">
          <h3>Administrators</h3>
          <p>Add users and stores, monitor platform-wide stats, and manage everything from one dashboard.</p>
        </div>
      </section>
    </div>
  );
}