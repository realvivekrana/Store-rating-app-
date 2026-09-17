import React from 'react';

export default function StarRating({
  value = 0,
  onChange,
  size = 22,
}) {
  const currentValue =
    Number(value) || 0;

  return (
    <div
      className="star-rating"
      role={
        onChange
          ? 'radiogroup'
          : undefined
      }
      aria-label={
        onChange
          ? 'Select rating'
          : `Rating: ${currentValue} out of 5`
      }
      style={{
        fontSize: `${size}px`,
      }}
    >
      {[1, 2, 3, 4, 5].map(
        (star) => {
          const active =
            star <= currentValue;

          if (!onChange) {
            return (
              <span
                key={star}
                className={
                  active
                    ? 'star active'
                    : 'star'
                }
                aria-hidden="true"
              >
                ★
              </span>
            );
          }

          return (
            <button
              type="button"
              key={star}
              className={
                active
                  ? 'star-button active'
                  : 'star-button'
              }
              onClick={() =>
                onChange(star)
              }
              role="radio"
              aria-checked={
                currentValue === star
              }
              aria-label={`${star} star`}
            >
              ★
            </button>
          );
        }
      )}
    </div>
  );
}