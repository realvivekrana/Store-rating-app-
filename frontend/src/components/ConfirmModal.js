import React, { useEffect } from 'react';

// Small centered confirmation dialog. Controlled entirely by the parent via
// `open`; renders nothing when closed.
export default function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title" onClick={(e) => e.stopPropagation()}>
        <h3 id="confirm-modal-title">{title}</h3>
        <p className="muted">{message}</p>
        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}