import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { format } from 'date-fns';
import { useTheme } from '../context/ThemeContext';

const CELL_SIZE = 50;
const HEADER_HEIGHT = 40;
const COL_WIDTH = 60;

export const TaskMatrix = ({ tasks, dates, completions, onToggle, onDeleteTask }) => {
    const { colors } = useTheme();

    const handleLongPress = (task) => {
        Alert.alert(
            "Delete Task",
            `Are you sure you want to delete "${task.title}"? \n\nIt will be removed from this month onwards, but kept in history.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => onDeleteTask(task.id)
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Left Column: Task Titles */}
            <View style={[styles.leftColumn, { borderRightColor: colors.border, backgroundColor: colors.surface }]}>
                <View style={[styles.headerCell, { height: HEADER_HEIGHT, backgroundColor: colors.headerBackground }]}>
                    <Text style={[styles.headerText, { color: colors.text }]}>Tasks</Text>
                </View>
                {tasks.map((task) => (
                    <View key={task.id} style={[styles.rowCell, { height: CELL_SIZE, borderBottomColor: colors.border }]}>
                        <TouchableOpacity onLongPress={() => handleLongPress(task)}>
                            <Text style={[styles.taskText, { color: colors.text }]} numberOfLines={2}>{task.title}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* Right Side: Scrollable Matrix */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rightSide}>
                <View>
                    {/* Header Row: Dates */}
                    <View style={styles.headerRow}>
                        {dates.map((date) => (
                            <View key={date} style={[styles.headerCell, { width: COL_WIDTH, height: HEADER_HEIGHT, backgroundColor: colors.headerBackground }]}>
                                <Text style={[styles.dateValidation, { color: colors.text }]}>{format(new Date(date), 'MMM dd')}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Completion Grid */}
                    {tasks.map((task) => (
                        <View key={task.id} style={styles.gridRow}>
                            {dates.map((date) => {
                                const isCompleted = completions[`${date}_${task.id}`];
                                return (
                                    <TouchableOpacity
                                        key={date}
                                        style={[styles.gridCell, {
                                            width: COL_WIDTH,
                                            height: CELL_SIZE,
                                            borderRightColor: colors.border,
                                            borderBottomColor: colors.border
                                        }]}
                                        onPress={() => onToggle(task.id, date)}
                                    >
                                        <View style={[
                                            styles.checkbox,
                                            { borderColor: colors.primary, backgroundColor: colors.surface },
                                            isCompleted && { backgroundColor: colors.success, borderColor: colors.success }
                                        ]}>
                                            {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    leftColumn: {
        width: 100,
        borderRightWidth: 1,
        zIndex: 10,
    },
    rightSide: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerCell: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    dateValidation: {
        fontSize: 12,
        textAlign: 'center',
    },
    rowCell: {
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 1,
    },
    taskText: {
        fontSize: 14,
        fontWeight: '500',
    },
    gridRow: {
        flexDirection: 'row',
    },
    gridCell: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderBottomWidth: 1,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderRadius: 12, // Circle for softer look
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
