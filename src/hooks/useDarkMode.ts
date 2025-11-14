import { useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';

export const useDarkMode = () => {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return isDarkMode;
};