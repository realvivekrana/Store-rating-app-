import React from 'react';

// Clickable <th> that toggles asc/desc sort and shows an arrow for the active column.
export default function SortableHeader({ label, field, sortBy, order, onSort }) {
  const active = sortBy === field;
  const arrow = active ? (order === 'asc' ? '▲' : '▼') : '';
  return (
    <th onClick={() => onSort(field)} className="sortable-th">
      {label} {arrow}
    </th>
  );
}
