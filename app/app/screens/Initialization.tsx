import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchDataFromFirebase, pushDataToFirebase } from '../services/firebaseService';  // Adjust the path accordingly

// Define the type for your stack navigator's routes
type RootStackParamList = {
  BasicStatus: undefined;
  Initialization: {layer: number};
  ChooseMode: {new_layer: number};
  // Add other screen names here if needed
};   

type InitializationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BasicStatus'>;

// Define the props for the StartScreen component
interface InitializationScreenProps {
  navigation: InitializationScreenNavigationProp;
  route: any;  // Access route params to get 'layer'
}
// Define the BasicStatusScreen component
const InitializationScreen: React.FC<InitializationScreenProps> = ({ navigation, route }) => { 
    const [text, setText] = useState(''); // State to manage plant input
    const [text2, setText2] = useState(''); // State to manage plant stage input
    const [flag, setFlag] = useState(false);
    

    const { layer } = route.params;
    console.log(layer);

    const handlePlantInitializationPress = () => {
        pushDataToFirebase("pages/initialization/plant_valid_query", [true], ["query_flag"])
        pushDataToFirebase("pages/initialization", [text], ["plant"])
      
        setTimeout(() => {
            console.log("test");
            fetchDataFromFirebase("pages/initialization/plant_valid/Is_plantable_indoors", (data) => {
              // Assuming the fetched data contains "Yes" or "No" and we check for "Yes"
              if (JSON.stringify(data).includes("Yes")) {
                console.log(layer)
                navigation.navigate('ChooseMode', { new_layer: layer });
                
                if (layer == 1)
                {
                    pushDataToFirebase("levels/bottom", [text, "seedling", true, text2], ["crop", "stage", "initialized", "stage"]) 
                }
                else
                {
                    pushDataToFirebase("levels/top", [text, "seedling", true, text2], ["crop", "stage", "initialized", "stage"]) 
                }


                
              } else {
                setFlag(true); 
              }
            });
          }, 2000);
    };
    
    return (
    <View style={styles.container}>
        <View style = {styles.container_box}>
        <Text style={styles.label}>Enter Your Plant:</Text>
        <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={setText}
        />

<Text style={styles.label}>Enter Your Plant Stage:</Text>
        <Text style={styles.label}>Stages: Germination, Seedling, Vegetative, Flowering, Senescance </Text>
        <TextInput
        style={styles.textInput}
        value={text2}
        onChangeText={setText2}
        />

        <TouchableOpacity style={styles.touchable} onPress={handlePlantInitializationPress}>
            <Text style={styles.text}>Initialize Plant</Text>
        </TouchableOpacity>
        </View>

      
    </View>
  );
};

// Define some basic styles for the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  textInput: {
    width: '80%',
    height: 50,
    borderColor: '#6b3e2e',
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  container_box: {
    width: '80%',
    height: '50%',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '6b3e2e',
  },
  touchable: {
    width: '80%',
    paddingVertical: 20,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6b3e2e',
    borderRadius: 10,
  },
});

export default InitializationScreen;