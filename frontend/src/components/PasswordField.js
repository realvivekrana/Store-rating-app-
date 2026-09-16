import React, { useState } from 'react';

// A password <input> with a show/hide toggle. Spreads any extra props
// (name, value, onChange, placeholder, required...) straight onto the input.
export default function PasswordField({ id, ...inputProps }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-field">
      <input id={id} type={visible ? 'text' : 'password'} {...inputProps} />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {visible ? '🙈' : '👁'}
      </button>
    </div>
  );
}