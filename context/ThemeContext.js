import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();
const THEME_KEY = '@consistency_tracker_theme';

export const lightColors = {
    background: '#e0f7fa',
    headerBackground: '#b3e5fc', // Matches date headers
    surface: '#ffffff',
    text: '#01579b',
    textSecondary: '#0277bd',
    border: '#b3e5fc',
    primary: '#81d4fa',
    accent: '#4fc3f7',
    modalOverlay: 'rgba(0,0,0,0.5)',
    success: '#4fc3f7', // Checkbox checked
    navButtonBg: 'rgba(255, 255, 255, 0.6)',
    modalDetails: '#e1f5fe' // Scroll columns
};

export const darkColors = {
    background: '#121212',
    headerBackground: '#1e1e1e',
    surface: '#1e1e1e',
    text: '#e0f7fa',
    textSecondary: '#b3e5fc',
    border: '#333333',
    primary: '#0277bd', // Darker blue for buttons
    accent: '#039be5',
    modalOverlay: 'rgba(255,255,255,0.1)',
    success: '#039be5',
    navButtonBg: 'rgba(255, 255, 255, 0.1)',
    modalDetails: '#2c2c2c'
};

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme();
    const [theme, setTheme] = useState(systemScheme || 'light');

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem(THEME_KEY);
                if (savedTheme) {
                    setTheme(savedTheme);
                }
            } catch (e) {
                console.error('Failed to load theme', e);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem(THEME_KEY, newTheme);
        } catch (e) {
            console.error('Failed to save theme', e);
        }
    };

    const colors = theme === 'light' ? lightColors : darkColors;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
