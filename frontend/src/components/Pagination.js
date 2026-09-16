import React from 'react';

// Simple, touch-friendly pager. Purely presentational — the caller owns
// `page` state and slices its own data.
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const goTo = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    onChange(p);
  };

  // Keep it short on small screens: current page +/- 1, plus first/last.
  const pages = new Set([1, totalPages, page, page - 1, page + 1].filter((p) => p >= 1 && p <= totalPages));
  const sorted = [...pages].sort((a, b) => a - b);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="page-btn" onClick={() => goTo(page - 1)} disabled={page === 1} aria-label="Previous page">
        ‹
      </button>
      {sorted.map((p, i) => (
        <React.Fragment key={p}>
          {i > 0 && p - sorted[i - 1] > 1 && <span className="page-ellipsis">…</span>}
          <button
            className={`page-btn ${p === page ? 'active' : ''}`}
            onClick={() => goTo(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        </React.Fragment>
      ))}
      <button className="page-btn" onClick={() => goTo(page + 1)} disabled={page === totalPages} aria-label="Next page">
        ›
      </button>
    </nav>
  );
}