import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { format, setMonth, setYear } from 'date-fns';
import { useTheme } from '../context/ThemeContext';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const YEARS = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i); // 5 years back, 5 years forward

export const DatePickerModal = ({ visible, onClose, currentDate, onDateChange }) => {
    const { colors } = useTheme();
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

    const handleSave = () => {
        const newDate = setMonth(setYear(currentDate, selectedYear), selectedMonth);
        onDateChange(newDate);
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={[styles.centeredView, { backgroundColor: colors.modalOverlay }]}>
                <View style={[styles.modalView, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>Select Date</Text>

                    <View style={styles.pickerContainer}>
                        {/* Month Column */}
                        <View style={styles.column}>
                            <Text style={[styles.columnHeader, { color: colors.textSecondary }]}>Month</Text>
                            <ScrollView style={[styles.scrollColumn, { backgroundColor: colors.modalDetails }]}>
                                {MONTHS.map((month, index) => (
                                    <TouchableOpacity
                                        key={month}
                                        style={[
                                            styles.item,
                                            selectedMonth === index && styles.selectedItem
                                        ]}
                                        onPress={() => setSelectedMonth(index)}
                                    >
                                        <Text style={[
                                            styles.itemText,
                                            selectedMonth === index && styles.selectedItemText
                                        ]}>{month}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Year Column */}
                        <View style={styles.column}>
                            <Text style={styles.columnHeader}>Year</Text>
                            <ScrollView style={styles.scrollColumn}>
                                {YEARS.map((year) => (
                                    <TouchableOpacity
                                        key={year}
                                        style={[
                                            styles.item,
                                            selectedYear === year && styles.selectedItem
                                        ]}
                                        onPress={() => setSelectedYear(year)}
                                    >
                                        <Text style={[
                                            styles.itemText,
                                            selectedYear === year && styles.selectedItemText
                                        ]}>{year}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={onClose}>
                            <Text style={styles.textStyle}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonSave]} onPress={handleSave}>
                            <Text style={styles.textStyle}>Select</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    pickerContainer: {
        flexDirection: 'row',
        height: 200,
        marginBottom: 20,
        width: '100%',
    },
    column: {
        flex: 1,
        marginHorizontal: 5,
    },
    columnHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlign: 'center',
        marginBottom: 10,
    },
    scrollColumn: {
        borderRadius: 10,
    },
    item: {
        padding: 12,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedItem: {
        backgroundColor: 'rgba(78, 205, 196, 0.2)',
    },
    itemText: {
        fontSize: 16,
    },
    selectedItemText: {
        fontWeight: 'bold',
        color: '#4ecdc4',
    },
    buttonRow: {
        flexDirection: 'row',
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginHorizontal: 10,
        marginHorizontal: 10,
        minWidth: 100,
    },
    buttonClose: {
        backgroundColor: '#ff6b6b',
    },
    buttonSave: {
        backgroundColor: '#4ecdc4',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
