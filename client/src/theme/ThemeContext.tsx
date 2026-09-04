import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { lightTheme, darkTheme, AppTheme } from './theme';
import { GlobalStyles } from './GlobalStyles';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
  theme: AppTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('swenetix_theme_mode') || localStorage.getItem('melodyhub_theme_mode');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark'; // Default matches Starting Page obsidian & crimson studio aesthetic
  });

  const toggleTheme = () => {
    setModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  useEffect(() => {
    localStorage.setItem('swenetix_theme_mode', mode);
  }, [mode]);

  const activeTheme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setMode, theme: activeTheme }}>
      <EmotionThemeProvider theme={activeTheme}>
        <GlobalStyles />
        {children}
      </EmotionThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a CustomThemeProvider');
  }
  return context;
};
