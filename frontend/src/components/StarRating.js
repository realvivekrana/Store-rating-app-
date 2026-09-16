import React, { useState } from 'react';

// Interactive 1-5 star picker. Pass `value` and `onChange` for interactive use,
// or just `value` with no `onChange` for a read-only display.
export default function StarRating({ value = 0, onChange, size = 22 }) {
  const [hover, setHover] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  const shown = onChange && hover ? hover : value;

  return (
    <span
      className={`star-rating ${onChange ? 'interactive' : ''}`}
      style={{ fontSize: size }}
      onMouseLeave={onChange ? () => setHover(0) : undefined}
    >
      {stars.map((s) => (
        <span
          key={s}
          className={s <= shown ? 'star filled' : 'star'}
          onClick={onChange ? () => onChange(s) : undefined}
          onMouseEnter={onChange ? () => setHover(s) : undefined}
          role={onChange ? 'button' : undefined}
          tabIndex={onChange ? 0 : undefined}
          onKeyDown={onChange ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(s); } } : undefined}
          aria-label={`${s} star${s > 1 ? 's' : ''}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}