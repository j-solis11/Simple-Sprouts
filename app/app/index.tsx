// App.tsx
import React, { useEffect } from 'react';
import { AppState } from 'react-native'; // Import AppState to track app state changes
import AppNavigator from './navigation/AppNavigator'; // Import AppNavigator
import { pushDataToFirebase } from './services/firebaseService';  // Adjust the path accordingly


export default function App() {
  useEffect(() => {
    pushDataToFirebase("general_info", [true], ["app_open"])
    const handleAppStateChange = (nextAppState: string) => {
      if ((nextAppState === 'background') || (nextAppState === 'inactive')){
        pushDataToFirebase("general_info", [false], ["app_open"])
        pushDataToFirebase("flags_test", [false], ["app_open"])
      }
      if (nextAppState === 'active') {
        pushDataToFirebase("general_info", [true], ["app_open"])
        pushDataToFirebase("flags_test", [true], ["app_open"])
      }
    };

    // Add event listener for app state changes
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      appStateSubscription.remove(); // Correct way to remove the listener
    };
  }, []);

  return (
    <AppNavigator /> // Your navigation container
  );
}