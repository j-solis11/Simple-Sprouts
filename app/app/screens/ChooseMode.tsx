import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchDataFromFirebase, pushDataToFirebase } from '../services/firebaseService';  // Adjust the path accordingly

// Define the type for your stack navigator's routes
type RootStackParamList = {
  BasicStatus: undefined;
  ChooseMode: {new_layer: number};
  More_Info: {tab_data: number};
  ConfigScheduling: {layer: number};
  // Add other screen names here if needed
};   

type ChooseModeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BasicStatus'>;

// Define the props for the StartScreen component
interface ChooseModeScreenProps {
  navigation: ChooseModeScreenNavigationProp;
  route: {params: {new_layer: number}};
}
// Define the BasicStatusScreen component
const ChooseModeScreen: React.FC<ChooseModeScreenProps> = ({ navigation, route }) => { 
    const { new_layer } = route.params;
    console.log(new_layer)
    const [growLightHours, setGrowLightHours] = useState<string>("");
    const handleManualModePress = () => {
      navigation.navigate('More_Info', { tab_data: new_layer });
      if (new_layer == 1)
      {
        pushDataToFirebase("flags_test", ["manual"], ["bottom_mode"])
        pushDataToFirebase("flags_test", [true], ["bottom_initialized"])
      }
      else
      {
        pushDataToFirebase("flags_test", ["manual"], ["top_mode"])
        pushDataToFirebase("flags_test", [true], ["top_initialized"])
      }
      

    };
  
    const handleSchedulingModePress = () => {
      
      navigation.navigate('ConfigScheduling', { layer: new_layer });
    };
  

        const handleAdaptiveModePress = () => {
          if (new_layer == 1)
          {
            pushDataToFirebase("flags_test", [true, true], ["bottom_mode_light_edit", "bottom_mode_water_edit"]);
              pushDataToFirebase("llm", [4], ["cmd_id"])
              pushDataToFirebase("llm", [true], ["query_flag"])
                
              // bot
          }
          else if (new_layer == 2)
          {
              //top
              pushDataToFirebase("flags_test", [true, true], ["top_mode_light_edit", "top_mode_water_edit"]);
              pushDataToFirebase("llm", [5], ["cmd_id"])
              pushDataToFirebase("llm", [true], ["query_flag"])
          }
          setTimeout(() => {
              fetchDataFromFirebase('llm/response', setGrowLightHours);
              const growInt = parseInt(growLightHours);
              if (new_layer == 1)
              {
                   pushDataToFirebase("flags_test", [growInt], ["adp_bottom_light_on_hours"]);
                   pushDataToFirebase("flags_test", ["adaptive"], ["bottom_mode"])
                  pushDataToFirebase("flags_test", [true], ["bottom_initialized"])
    
              }
              else if (new_layer == 2)
              {
                pushDataToFirebase("flags_test", [growInt], ["adp_top_light_on_hours"]);
                pushDataToFirebase("flags_test", ["adaptive"], ["top_mode"])
                pushDataToFirebase("flags_test", [true], ["top_initialized"])
              }
              navigation.navigate('More_Info', { tab_data: new_layer });
          }, 3000);
        };

    return (
    <View style={styles.container}>
        <Text style={styles.title_text}>Select One to Begin Care!</Text>
        <TouchableOpacity style={styles.touchable} onPress={handleManualModePress}>
            <Text style={styles.basic_status_title_text}>Manual Mode</Text>
            <Text style={styles.text}>Allows you to take full control of the care, controlling watering and lighting in real time.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchable} onPress={handleSchedulingModePress}>
        <Text style={styles.basic_status_title_text}>Scheduling Mode</Text>
        <Text style={styles.text}>Allows you to control the times of lighting and watering; for those with the greenest thumb!</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchable} onPress={handleAdaptiveModePress}>
        <Text style={styles.basic_status_title_text}>Adaptive Mode</Text>
        <Text style={styles.text}>Allows us to control the lighting and watering based on our sensors, keeping the hassle out of your hands!</Text>
        </TouchableOpacity>
    </View>
  );
};

// Define some basic styles for the screen
const styles = StyleSheet.create({
basic_status_title_text: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    },
    title_text: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'black',
        },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3c099',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  touchable: {
    width: '80%',
    paddingVertical: 20,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderColor: '6b3e2e',
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 15,
  },
});

export default ChooseModeScreen;