import React from 'react';
import { Link } from 'react-router-dom';

// Public landing page — shown at "/" to anyone who is not logged in.
// No auth required to view this. Login/Signup are just prominent buttons here.
export default function Landing() {
  return (
    <div className="landing">
      <section className="landing-hero">
        <h1>Rate Stores. Discover the Best Ones.</h1>
        <p>
          A simple platform where people rate stores from 1 to 5, store owners track
          their reputation, and admins keep everything running smoothly.
        </p>
        <div className="landing-cta">
          <Link to="/login" className="btn-special">Log in</Link>
          <Link to="/signup" className="btn-outline">Create an account</Link>
        </div>
      </section>

      <section className="landing-features">
        <div className="feature-card">
          <h3>🧑‍💼 Normal Users</h3>
          <p>Sign up, browse registered stores, search by name or address, and submit or update your 1-5 star rating anytime.</p>
        </div>
        <div className="feature-card">
          <h3>🏪 Store Owners</h3>
          <p>See your store's average rating at a glance and view exactly who rated you and when.</p>
        </div>
        <div className="feature-card">
          <h3>🛠️ Administrators</h3>
          <p>Add users and stores, monitor platform-wide stats, and manage everything from one dashboard.</p>
        </div>
      </section>
    </div>
  );
}