import React from 'react';

// A single shimmering placeholder block/line.
export function Skeleton({ width, height = '1em', radius = 6, style }) {
  return (
    <span
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

// A grid of skeleton "cards" — used while store/user lists are loading so the
// layout doesn't jump once real content arrives.
export function SkeletonCards({ count = 6 }) {
  return (
    <div className="store-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="store-card skeleton-card" key={i}>
          <Skeleton width="60%" height="1.15em" />
          <Skeleton width="85%" style={{ marginTop: 8 }} />
          <Skeleton width="40%" style={{ marginTop: 18 }} />
          <Skeleton width="55%" style={{ marginTop: 10 }} />
        </div>
      ))}
    </div>
  );
}

// Skeleton rows for a data table while it loads.
export function SkeletonRows({ columns = 4, rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} aria-hidden="true">
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c}><Skeleton width={c === 0 ? '70%' : '50%'} /></td>
          ))}
        </tr>
      ))}
    </>
  );
}