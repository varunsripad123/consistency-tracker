import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

export const AddTaskModal = ({ visible, onClose, onAdd }) => {
    const [title, setTitle] = useState('');

    const handleAdd = () => {
        if (title.trim()) {
            onAdd(title.trim());
            setTitle('');
            onClose();
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalView}
                >
                    <Text style={styles.modalText}>Add New Task</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Task Name (e.g., Workout)"
                        value={title}
                        onChangeText={setTitle}
                        autoFocus
                    />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={onClose}>
                            <Text style={styles.textStyle}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonAdd]} onPress={handleAdd}>
                            <Text style={styles.textStyle}>Add Task</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        width: '100%',
        margin: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 10,
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginHorizontal: 10,
        minWidth: 80,
    },
    buttonClose: {
        backgroundColor: '#ff6b6b',
    },
    buttonAdd: {
        backgroundColor: '#4ecdc4',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
