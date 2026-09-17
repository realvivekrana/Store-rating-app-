import React from 'react';

export default function SortableHeader({
  label,
  field,
  sortBy,
  order,
  onSort,
}) {
  const active =
    sortBy === field;

  const indicator = !active
    ? '↕'
    : order === 'asc'
      ? '↑'
      : '↓';

  return (
    <button
      type="button"
      className="sortable-header"
      onClick={() =>
        onSort(field)
      }
      aria-label={`Sort by ${label}`}
    >
      <span>{label}</span>
      <span
        aria-hidden="true"
      >
        {indicator}
      </span>
    </button>
  );
}