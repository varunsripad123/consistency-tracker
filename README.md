# Consistency Tracker

An offline-first **Habit & Consistency Tracker** built with **React Native** and **Expo**.

This app helps you build streaks and maintain consistency by visualizing your daily habits in a contribution-graph style matrix. It features a modern, adaptive UI with Dark Mode support and smart data management.

## 🌟 Features

-   **Visual Consistency Matrix**: View your monthly progress at a glance with a GitHub-style activity grid.
-   **Smart Task Management**:
    -   **Context-Aware Creation**: Tasks added in a specific month start tracking from that month onwards.
    -   **Per-Month Hiding**: "Deleting" a task only hides it from the current month view, preserving your history in previous months.
-   **Dark Mode**: Fully adaptive UI with a toggle for Light/Dark themes.
-   **Gamification**: Earn "Consistency Tokens" based on your completion rates for each month.
-   **Offline First**: All data is persisted locally using `AsyncStorage`.
-   **Responsive Design**: Works seamlessly on iOS and Android.

## 🛠 Tech Stack

-   **Framework**: React Native (Expo)
-   **Language**: JavaScript
-   **Storage**: AsyncStorage
-   **Styling**: StyleSheet API, React Native Safe Area Context
-   **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/)
-   [Expo Go](https://expo.dev/client) app on your mobile device (iOS/Android).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/consistency-tracker.git
    cd consistency-tracker
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the app:
    ```bash
    npx expo start
    ```

4.  Scan the QR code with your phone using the **Expo Go** app.

## 📱 Usage

-   **Add a Task**: Tap the `+` button to create a new habit. It will appear for the currently viewed month.
-   **Track Progress**: Tap a grid cell to mark a task as completed for that day.
-   **Switch Months**: Use the arrows or month name to navigate between months.
-   **Delete/Hide**: Long-press a task name to remove it from the current month's view.
-   **Toggle Theme**: Tap the 🌙 / ☀️ icon in the header to switch themes.

## 📦 Deployment

To build the app for production (APK/IPA), refer to the [DEPLOYMENT.md](DEPLOYMENT.md) guide included in this repository.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
