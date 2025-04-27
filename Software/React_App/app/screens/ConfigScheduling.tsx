import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Platform, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchDataFromFirebase, pushDataToFirebase } from '../services/firebaseService';  // Adjust the path accordingly


type RootStackParamList = {
  ChooseMode: {layer: number};
  More_Info: {tab_data: number};
  ConfigScheduling: {layer: number};
  // Add other screen names here if needed
};   

type ConfigSchedulingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ConfigScheduling'>;

// Define the props for the StartScreen component
interface ConfigSchedulingScreenProps {
  navigation: ConfigSchedulingScreenNavigationProp;
  route: any;
}
// Define the BasicStatusScreen component
const ConfigSchedulingScreen: React.FC<ConfigSchedulingScreenProps> = ({ navigation, route }) => { 
    const { layer } = route.params;
    console.log(layer)
    
    const [lighting_on_hours, setLightingOnHours] = useState('');
    const [lighting_off_hours, setLightingOffHours] = useState('');
    const [lighting_on_mins, setLightingOnMins] = useState('');
    const [lighting_off_mins, setLightingOffMins] = useState('');
    const [watering_days, setWateringDays] = useState('');
    const [watering_hours, setWateringHours] = useState('');
    const [watering_mins, setWateringMins] = useState('');
    const [watering_amount, setWateringAmount] = useState('');
    
    const handleSetSchedulePress = () => {
        if (layer == 1)
        {

          pushDataToFirebase("flags_test", [parseInt(lighting_off_hours),parseInt(lighting_off_mins),parseInt(lighting_on_hours),parseInt(lighting_on_mins), parseInt(watering_days), parseInt(watering_hours), parseInt(watering_mins), parseInt(watering_amount)], ["bottom_light_ref_off_hrs", "bottom_light_ref_off_mins", "bottom_light_ref_on_hrs", "bottom_light_ref_on_mins", "bottom_water_ref_days", "bottom_water_ref_hrs", "bottom_water_ref_mins", "bottom_water_amount"])
          pushDataToFirebase("flags_test", [true, true], ["bottom_mode_light_edit", "bottom_mode_water_edit"])
            //pushDataToFirebase("flags_test", ["watering_amount", "scheduling", true, true], ["bottom_mode", "bottom_mode_light_edit", "bottom_mode_water_edit"])
            pushDataToFirebase("flags_test", ["scheduling"], ["bottom_mode"]);
            
            

            
          
        }
        else
        {
          pushDataToFirebase("flags_test", [true], ["top_mode_light_edit"])
          pushDataToFirebase("flags_test", [true], ["top_mode_water_edit"])
          pushDataToFirebase("flags_test", [parseInt(lighting_off_hours),parseInt(lighting_off_mins),parseInt(lighting_on_hours),parseInt(lighting_on_mins),parseInt(watering_days), parseInt(watering_hours), parseInt(watering_mins), parseInt(watering_amount)], ["top_light_ref_off_hrs", "top_light_ref_off_mins", "top_light_ref_on_hrs", "top_light_ref_on_mins", "top_water_ref_days", "top_water_ref_hrs", "top_water_ref_mins", "top_water_amount"])
            //pushDataToFirebase("flags_test", ["watering_amount", "scheduling", true, true], ["bottom_mode", "bottom_mode_light_edit", "bottom_mode_water_edit"])
            pushDataToFirebase("flags_test", ["scheduling"], ["top_mode"])


         
        }
        setTimeout(() => {
          navigation.navigate('More_Info', { tab_data: layer });
      }, 3000);
        
  
      };


    return (
      <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
  >
        
      <View style={styles.container}>
        <Text style={styles.title_text}>Set Scheduling Parameters</Text>
        <Text style={styles.basic_status_title_text}>Watering Schedule</Text>
        <View style={styles.layer1_container}>
        <Text style={styles.basic_status_title_text}>Water Every</Text>
        <View style={styles.timeInputContainer2}>
        {/* Hours input */}
        <TextInput
          style={styles.textInput}
          value={watering_days}
          onChangeText={setWateringDays}
          placeholder="Days"
        />
        
        {/* Minutes input */}
        <TextInput
          style={styles.textInput}
          value={watering_hours}
          onChangeText={setWateringHours}
          placeholder="Hours"
        />

        <TextInput
          style={styles.textInput}
          value={watering_mins}
          onChangeText={setWateringMins}
          placeholder="Minutes"
        />
      </View>

      <Text style={styles.basic_status_title_text}>Water Amount</Text>
      <TextInput
          style={styles.textInput1}
          value={watering_amount}
          onChangeText={setWateringAmount}
        />
      </View>
      <Text style={styles.basic_status_title_text}>Lighting Schedule</Text>
        
        <View style={styles.layer1_container}>
        <Text style={styles.basic_status_title_text}>Lights On For</Text>
        <View style={styles.timeInputContainer}>
        {/* Hours input */}
        <TextInput
          style={styles.textInput}
          value={lighting_on_hours}
          onChangeText={setLightingOnHours}
          placeholder="Hours"
        />
        
        {/* Minutes input */}
        <TextInput
          style={styles.textInput}
          value={lighting_on_mins}
          onChangeText={setLightingOnMins}
          placeholder="Mins"
        />
      </View>
      <Text style={styles.basic_status_title_text}>Lights Off For</Text>
        <View style={styles.timeInputContainer}>
        {/* Hours input */}
        <TextInput
          style={styles.textInput}
          value={lighting_off_hours}
          onChangeText={setLightingOffHours}
          placeholder="Hours"
        />
        
        {/* Minutes input */}
        <TextInput
          style={styles.textInput}
          value={lighting_off_mins}
          onChangeText={setLightingOffMins}
          placeholder="Mins"
        />
      </View>
      </View>
      <TouchableOpacity style={styles.touchable} onPress={handleSetSchedulePress}>
              <Text style={styles.basic_status_title_text}>Set Schedule</Text>
        </TouchableOpacity>
    </View>
    </KeyboardAvoidingView>
  );
};

// Define some basic styles for the screen
const styles = StyleSheet.create({
    timeInputContainer: {
        flexDirection: 'row',   // Align inputs horizontally (side by side)
        justifyContent: 'space-between',
        width: '30%',           // Adjust the width of the container
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
        marginRight: 80,
      },
      timeInputContainer2: {
        flexDirection: 'row',   // Align inputs horizontally (side by side)
        justifyContent: 'space-between',
        width: '30%',           // Adjust the width of the container
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
        marginRight: 165,
      },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },

  layer1_container: {
    width: '80%',
    height: '35%',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '6b3e2e',
  },
  basic_status_title_text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '6b3e2e',
    },
    title_text: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'black',
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
  textInput: {
    width: '80%',
    height: 50,
    borderColor: '#6b3e2e',
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    marginRight: 6,
    marginLeft: 6,
    backgroundColor: '#ffffff',
  },
  textInput1: {
    width: '50%',
    height: 50,
    borderColor: '#6b3e2e',
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  
});

export default ConfigSchedulingScreen;