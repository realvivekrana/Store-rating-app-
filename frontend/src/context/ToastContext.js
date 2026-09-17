import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );
  }, []);

  const showToast = useCallback(
    (message, type = 'info') => {
      const id = `${Date.now()}-${Math.random()}`;

      setToasts((current) => [
        ...current,
        {
          id,
          message,
          type,
        },
      ]);

      window.setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    [removeToast]
  );

  const success = useCallback(
    (message) => showToast(message, 'success'),
    [showToast]
  );

  const error = useCallback(
    (message) => showToast(message, 'error'),
    [showToast]
  );

  const info = useCallback(
    (message) => showToast(message, 'info'),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        success,
        error,
        info,
        removeToast,
      }}
    >
      {children}

      <div
        className="toast-container"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
          >
            <span>{toast.message}</span>

            <button
              type="button"
              onClick={() =>
                removeToast(toast.id)
              }
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      'useToast must be used inside ToastProvider'
    );
  }

  return context;
}