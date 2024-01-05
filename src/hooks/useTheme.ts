import { useEffect, useState } from 'react';

export const useTheme = (storageKey = 'vite-ui-theme') => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storageKeyValue = localStorage.getItem(storageKey);

    const initialThemeMode = storageKeyValue
      ? storageKeyValue === 'true'
      : window.matchMedia('(prefers-color-theme: dark)').matches;

    return initialThemeMode;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    root.classList.add(isDarkMode ? 'dark' : 'light');

    localStorage.setItem(storageKey, isDarkMode.toString());
  }, [isDarkMode, storageKey]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return { isDarkMode, toggleDarkMode };
};
