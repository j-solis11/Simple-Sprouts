// src/screens/Start.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';


// Define the type for your stack navigator's routes
type RootStackParamList = {
  Start: undefined;
  BasicStatus: undefined;
  // Add other screen names here if needed
};

type StartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Start'>;

// Define the props for the StartScreen component
interface StartScreenProps {
  navigation: StartScreenNavigationProp;
}

const StartScreen: React.FC<StartScreenProps> = ({ navigation }) => {
    const handlePress = () => {
      // Navigate to Main screen
      navigation.navigate('BasicStatus');
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.touchable} onPress={handlePress}>
          <Text style={styles.text}>Touch to Start!</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e3c099',
    },
    touchable: {
      paddingVertical: 20,
      paddingHorizontal: 40,
      backgroundColor: '#0066cc',
      borderRadius: 10,
    },
    text: {
      fontSize: 20,
      color: '#ffffff',
      fontWeight: 'bold',
    },
  });
  
  export default StartScreen;