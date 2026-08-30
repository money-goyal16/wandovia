
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(); 
 
const themes = {
  // Removed old vintage themes since we now use a unified modern aesthetic
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('travel-planner-theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedColorTheme = localStorage.getItem('travel-planner-color-theme');
    return savedColorTheme || 'brass';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Set dark/light mode
    if (isDarkMode) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    
    localStorage.setItem('travel-planner-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('travel-planner-color-theme', currentTheme);
  }, [isDarkMode, currentTheme]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  const setTheme = (themeId) => {
    setCurrentTheme(themeId);
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleTheme, 
      currentTheme, 
      setTheme, 
      themes 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
