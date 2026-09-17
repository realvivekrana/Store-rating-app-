import React, {
  useState,
} from 'react';

export default function PasswordField({
  id,
  name,
  value,
  onChange,
  placeholder = 'Password',
  autoComplete,
  disabled = false,
}) {
  const [show, setShow] =
    useState(false);

  return (
    <div className="password-field">
      <input
        id={id}
        name={name}
        type={
          show
            ? 'text'
            : 'password'
        }
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={
          autoComplete
        }
        disabled={disabled}
      />

      <button
        type="button"
        className="password-toggle"
        onClick={() =>
          setShow(
            (current) => !current
          )
        }
        aria-label={
          show
            ? 'Hide password'
            : 'Show password'
        }
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}