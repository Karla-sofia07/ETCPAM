import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@medical:darkMode');
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Error cargando tema:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    await AsyncStorage.setItem('@medical:darkMode', JSON.stringify(newTheme));
  };

  const colors = isDarkMode ? {
    background: '#121212',
    surface: '#1E1E1E',
    primary: '#86DFFF',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    border: '#333333',
    card: '#2C2C2C',
    error: '#CF6679',
    success: '#4CAF50',
  } : {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    primary: '#86DFFF',
    text: '#333333',
    textSecondary: '#666666',
    border: '#DDDDDD',
    card: '#FFFFFF',
    error: '#FF4444',
    success: '#4CAF50',
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};