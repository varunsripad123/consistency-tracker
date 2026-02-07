import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
    const { theme, toggleTheme, colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={toggleTheme}
        >
            <Text style={styles.text}>
                {theme === 'light' ? '🌙' : '☀️'}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    text: {
        fontSize: 20,
    }
});
