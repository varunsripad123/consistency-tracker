import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths, isSameMonth } from 'date-fns';
import { TaskMatrix } from './components/TaskMatrix';
import { AddTaskModal } from './components/AddTaskModal';
import { DatePickerModal } from './components/DatePickerModal';
import { TokenDisplay } from './components/TokenDisplay';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';

import { useTrackerData } from './hooks/useTrackerData';

const MainApp = () => {
  const { tasks, completions, loading, addTask, toggleCompletion, getMetrics, hideTaskForMonth } = useTrackerData();
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Month View State
  const [currentDate, setCurrentDate] = useState(new Date());

  const { colors } = useTheme();

  // Filter tasks for the current month view
  // Visible if:
  // 1. Created At <= End of Month (Existed during this month)
  // 2. Deleted At is NULL OR Deleted At > End of This Month (Only hide if deleted BEFORE or DURING this view? 
  //    Wait, if I delete on Feb 15, and I view Feb (End Feb 28), deletedAt < End. So it hides.
  //    That implies deleting removes it from the *current* month view immediately.
  const currentMonthStart = startOfMonth(currentDate);
  const currentMonthEnd = endOfMonth(currentDate);

  const currentMonthStr = format(currentDate, 'yyyy-MM');

  const visibleTasks = tasks.filter(task => {
    const createdAt = task.createdAt ? new Date(task.createdAt) : new Date(0);
    const hiddenMonths = task.hiddenMonths || [];

    // 1. Must exist by end of this month
    const createdBeforeEndOfMonth = createdAt <= currentMonthEnd;

    // 2. Must NOT be hidden for this specific month
    const isHiddenForThisMonth = hiddenMonths.includes(currentMonthStr);

    return createdBeforeEndOfMonth && !isHiddenForThisMonth;
  });

  // Generate dates for the selected month
  const dates = useMemo(() => {
    return eachDayOfInterval({ start: currentMonthStart, end: currentMonthEnd }).map(date => format(date, 'yyyy-MM-dd'));
  }, [currentDate]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
    setDatePickerVisible(false);
  };

  const handleAddTask = (title) => {
    // Use the start of the currently viewed month as the creation date
    // This ensures it appears in this month, but not previous months
    const creationDate = startOfMonth(currentDate).toISOString();
    addTask(title, creationDate);
    setModalVisible(false);
  };

  const metrics = getMetrics(dates, visibleTasks);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <StatusBar style="auto" />

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Consistency Tracker</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={() => setModalVisible(true)}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            <ThemeToggle />
          </View>
        </View>

        {/* Month Navigation */}
        <View style={[styles.monthNav, { backgroundColor: colors.navButtonBg }]}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
            <Text style={[styles.navButtonText, { color: colors.textSecondary }]}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
            <Text style={[styles.monthTitle, { color: colors.text }]}>{format(currentDate, 'MMMM yyyy')} ▼</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <Text style={[styles.navButtonText, { color: colors.textSecondary }]}>→</Text>
          </TouchableOpacity>
        </View>

        <TokenDisplay metrics={metrics} />

        <View style={styles.content}>
          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No tasks yet.</Text>
              <Text style={styles.emptyTextSub}>Tap + to add a habit to track!</Text>
            </View>
          ) : (
            <TaskMatrix
              tasks={visibleTasks}
              dates={dates}
              completions={completions}
              onToggle={toggleCompletion}
              onDeleteTask={(taskId) => hideTaskForMonth(taskId, currentMonthStr)}
            />
          )}
        </View>

        <AddTaskModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={handleAddTask}
        />

        <DatePickerModal
          visible={datePickerVisible}
          onClose={() => setDatePickerVisible(false)}
          currentDate={currentDate}
          onDateChange={handleDateChange}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: -2, // visual alignment
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  emptyTextSub: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    width: 150,
    textAlign: 'center',
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
