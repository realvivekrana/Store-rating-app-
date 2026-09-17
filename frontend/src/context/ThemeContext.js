import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const ThemeContext =
  createContext(null);

export function ThemeProvider({
  children,
}) {
  const [theme, setTheme] =
    useState(() => {
      const stored =
        localStorage.getItem(
          'theme'
        );

      if (
        stored === 'light' ||
        stored === 'dark'
      ) {
        return stored;
      }

      return window.matchMedia &&
        window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
        ? 'dark'
        : 'light';
    });

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;

    localStorage.setItem(
      'theme',
      theme
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme(
      (current) =>
        current === 'dark'
          ? 'light'
          : 'dark'
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(
    ThemeContext
  );
}