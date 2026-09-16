import React from 'react';

// Interactive 1-5 star picker. Pass `value` and `onChange` for interactive use,
// or just `value` with no `onChange` for a read-only display.
export default function StarRating({ value = 0, onChange, size = 22 }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className="star-rating" style={{ fontSize: size }}>
      {stars.map((s) => (
        <span
          key={s}
          className={s <= value ? 'star filled' : 'star'}
          onClick={onChange ? () => onChange(s) : undefined}
          role={onChange ? 'button' : undefined}
          aria-label={`${s} star`}
        >
          ★
        </span>
      ))}
    </span>
  );
}
