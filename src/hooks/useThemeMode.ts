'use client';
import { useState, useEffect } from 'react';

export function useThemeMode() {
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('muneri-theme') as 'dark' | 'light';
      if (savedTheme) {
        setTimeout(() => setThemeMode(savedTheme), 0);
      }
    }
  }, []);

  const toggleThemeMode = () => {
    const newTheme = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('muneri-theme', newTheme);
    }
  };

  return { themeMode, toggleThemeMode };
}
