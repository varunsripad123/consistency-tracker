import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '../context/ThemeContext';

export const TokenDisplay = ({ metrics }) => {
    const { colors } = useTheme();
    const { completedCount, totalPossible } = metrics;
    // Requirement formula example: (100/150 coins)
    // If 30 days * 5 tasks = 150.
    // We can display: "Coins: X / Y"

    return (
        <View style={[styles.container, { backgroundColor: colors.headerBackground }]}>
            <Text style={[styles.text, { color: colors.text }]}>
                Earned Tokens: {completedCount} / {totalPossible}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
