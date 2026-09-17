import React from 'react';

export default function EmptyState({
  icon = '○',
  title = 'Nothing here',
  hint = '',
}) {
  return (
    <div className="empty-state">
      <div
        className="empty-state-icon"
        aria-hidden="true"
      >
        {icon}
      </div>

      <h3>{title}</h3>

      {hint && (
        <p>{hint}</p>
      )}
    </div>
  );
}