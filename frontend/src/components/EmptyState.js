import React from 'react';

// Shown instead of an empty list/table. `icon` is a single character/emoji
// kept small and muted so it reads as a mark, not clip-art.
export default function EmptyState({ icon = '—', title, hint, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">{icon}</div>
      <p className="empty-title">{title}</p>
      {hint && <p className="empty-hint">{hint}</p>}
      {action}
    </div>
  );
}