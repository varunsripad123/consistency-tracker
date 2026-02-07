import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = '@consistency_tracker_data';

export const useTrackerData = () => {
    const [tasks, setTasks] = useState([]);
    // completions: { "YYYY-MM-DD_taskId": true }
    const [completions, setCompletions] = useState({});
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            if (jsonValue != null) {
                const data = JSON.parse(jsonValue);
                setTasks(data.tasks || []);
                setCompletions(data.completions || {});
            }
        } catch (e) {
            console.error("Failed to load data", e);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveData = async (newTasks, newCompletions) => {
        try {
            const data = {
                tasks: newTasks,
                completions: newCompletions
            };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Failed to save data", e);
        }
    };

    useEffect(() => {
        loadData();
    }, [loadData]);

    const addTask = (title, referenceDate = null) => {
        const createdAt = referenceDate ? new Date(referenceDate).toISOString() : new Date().toISOString();
        const newTask = {
            id: uuidv4(),
            title,
            createdAt: createdAt,
            hiddenMonths: []
        };
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        saveData(updatedTasks, completions);
    };

    const hideTaskForMonth = (taskId, monthStr) => {
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                const currentHidden = task.hiddenMonths || [];
                if (!currentHidden.includes(monthStr)) {
                    return { ...task, hiddenMonths: [...currentHidden, monthStr] };
                }
            }
            return task;
        });
        setTasks(updatedTasks);
        saveData(updatedTasks, completions);
    };

    const toggleCompletion = (taskId, dateStr) => {
        const key = `${dateStr}_${taskId}`;
        const newCompletions = { ...completions };
        if (newCompletions[key]) {
            delete newCompletions[key];
        } else {
            newCompletions[key] = true;
        }
        setCompletions(newCompletions);
        saveData(tasks, newCompletions);
    };

    const getMetrics = (dateList) => {
        if (!dateList || !Array.isArray(dateList) || dateList.length === 0) {
            return { completedCount: 0, totalPossible: 0, coins: 0 };
        }

        let completedCount = 0;
        const totalPossible = tasks.length * dateList.length;

        // Iterate through valid dates and tasks to count actual completions in this range
        dateList.forEach(date => {
            tasks.forEach(task => {
                const key = `${date}_${task.id}`;
                if (completions[key]) {
                    completedCount++;
                }
            });
        });

        return {
            completedCount,
            totalPossible,
            coins: totalPossible > 0 ? (completedCount / totalPossible) * 100 : 0
        };
    };

    return {
        tasks,
        completions,
        loading,
        addTask,
        hideTaskForMonth,
        toggleCompletion,
        getMetrics
    };
};
