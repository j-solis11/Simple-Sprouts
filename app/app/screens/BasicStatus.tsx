import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchDataFromFirebase, pushDataToFirebase } from '../services/firebaseService';  // Adjust the path accordingly
import ProgressBar from 'react-bootstrap/ProgressBar';
import * as Progress from 'react-native-progress';


// Define the type for your stack navigator's routes
type RootStackParamList = {
  BasicStatus: undefined;
  More_Info: { tab_data: number };
  Initialization: {layer: number};
  // Add other screen names here if needed
};   

type BasicStatusScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BasicStatus'>;

// Define the props for the StartScreen component
interface BasicStatusScreenProps {
  navigation: BasicStatusScreenNavigationProp;
}


// Define the BasicStatusScreen component
const BasicStatusScreen: React.FC<BasicStatusScreenProps> = ({ navigation }) => { 
  
  const [bottomInitialized, setBottomInitialized] = useState<any>(null);
  const [bottomCrop, setBottomCrop] = useState<any>(null);
  const [bottomStage, setBottomStage] = useState<any>(null);
  const [bottomMode, setBottomMode] = useState<any>(null);
  
  const [topInitialized, setTopInitialized] = useState<any>(null);
  const [topCrop, setTopCrop] = useState<any>(null);
  const [topStage, setTopStage] = useState<any>(null);
  const [topMode, setTopMode] = useState<any>(null); 

       const [expectedTopHarvest, setExpectedTopHarvest] = useState(false);

       const [expectedBotHarvest, setExpectedBotHarvest] = useState(false);
  


  // Fetch data from Firebase when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        //await fetchDataFromFirebase('levels/bottom/initialized', setBottomInitialized);
        await fetchDataFromFirebase('flags_test/bottom_initialized', setBottomInitialized);
        await fetchDataFromFirebase('levels/bottom/crop', setBottomCrop);
        await fetchDataFromFirebase('levels/bottom/stage', setBottomStage);
        //await fetchDataFromFirebase('levels/bottom/mode', setBottomMode);
        await fetchDataFromFirebase('flags_test/bottom_mode', setBottomMode);
        //await fetchDataFromFirebase('levels/top/initialized', setTopInitialized);
        await fetchDataFromFirebase('flags_test/top_initialized', setTopInitialized);
        await fetchDataFromFirebase('levels/top/crop', setTopCrop);
        await fetchDataFromFirebase('levels/top/stage', setTopStage);
        //await fetchDataFromFirebase('levels/top/mode', setTopMode);
        await fetchDataFromFirebase('flags_test/top_mode', setTopMode);
       await fetchDataFromFirebase('levels/top/expected_harvest', setExpectedTopHarvest);
       await fetchDataFromFirebase('levels/bottom/expected_harvest', setExpectedBotHarvest);
        await fetchDataFromFirebase('levels/top/stage', setTopStage);

      } catch (error) {
        Alert.alert('Error fetching data from Firebase');
      }
    };
    fetchData();
  }, []); // Empty dependency array ensures this runs only once wh`en the component mounts
  
  const handleLayer1MoreInfoPress = () => {
    navigation.navigate('More_Info', { tab_data: 1 });
    pushDataToFirebase("general_info", [1], ["level_under_test"])
    pushDataToFirebase("flags_test", [1], ["level_under_test"])
  };



  

  const handleLayer2MoreInfoPress = () => {
    navigation.navigate('More_Info', { tab_data: 2 });
    pushDataToFirebase("flags_test", [2], ["level_under_test"])
  };

  const handleLayer1InitializationPress = () => {
    navigation.navigate('Initialization', { layer: 1 });
    pushDataToFirebase("flags_test", [1], ["level_under_test"])
    pushDataToFirebase("flags_test", [false], ["bottom_initialized"])
  };

  const handleLayer2InitializationPress = () => {
    navigation.navigate('Initialization', { layer: 2 });
    pushDataToFirebase("flags_test", [2], ["level_under_test"])
    pushDataToFirebase("flags_test", [false], ["top_initialized"])
  };

  const MyComponent = () => (
    <View style={styles.container}>
      <Progress.Bar progress={0.5} width={200} />
    </View>
  );

  //{topInitialized ? ()}
  if ((topCrop != null) && (topMode != null) && (topStage != null) && (bottomCrop != null) && (bottomMode != null) && (bottomStage != null))
  {

  return (
    <View style={styles.container}>
      <Text style={styles.dark_green_text }>Top Layer</Text>
      <View style={styles.container_divider}>
      {topInitialized ? (
        <View>  

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={styles.ctrl_panel_text}>Plant: </Text>
                  <Text style={styles.ctrl_panel_text_unbolded}>{topCrop.charAt(0).toUpperCase() + topCrop.slice(1)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={styles.ctrl_panel_text}>Control Mode: </Text>
                  <Text style={styles.ctrl_panel_text_unbolded}>{topMode.charAt(0).toUpperCase() + topMode.slice(1)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.ctrl_panel_text}>Stage: </Text>
                <Text style={styles.ctrl_panel_text_unbolded}>{topStage.charAt(0).toUpperCase() + topStage.slice(1)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.ctrl_panel_text}>Expected Harvest: </Text>
                <Text style={styles.ctrl_panel_text_unbolded}>{expectedTopHarvest}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity style={styles.touchable} onPress={handleLayer2MoreInfoPress}>
            <Text style={styles.text}>More Info</Text>
            
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchable} onPress={handleLayer2InitializationPress}>
          <Text style={styles.text}>New Care</Text>
        </TouchableOpacity>
        </View>
  
            </View>
        ) : (
          <View>
              <TouchableOpacity style={styles.touchable2} onPress={handleLayer2InitializationPress}>
            <Text style={styles.text}>Initialize Plant</Text>
          </TouchableOpacity>
  
          </View>
        )}
      </View>


      <Text style={styles.dark_green_text }>Bottom Layer</Text>
      <View style={styles.container_divider}>
      {bottomInitialized ? (
        <View>  

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.ctrl_panel_text}>Plant: </Text>
                <Text style={styles.ctrl_panel_text_unbolded}>{bottomCrop.charAt(0).toUpperCase() + bottomCrop.slice(1)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.ctrl_panel_text}>Control Mode: </Text>
                <Text style={styles.ctrl_panel_text_unbolded}>{bottomMode.charAt(0).toUpperCase() + bottomMode.slice(1)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.ctrl_panel_text}>Stage: </Text>
              <Text style={styles.ctrl_panel_text_unbolded}>{bottomStage.charAt(0).toUpperCase() + bottomStage.slice(1)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.ctrl_panel_text}>Expected Harvest: </Text>
              <Text style={styles.ctrl_panel_text_unbolded}>{expectedBotHarvest}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={styles.touchable} onPress={handleLayer1MoreInfoPress}>
          <Text style={styles.text}>More Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchable} onPress={handleLayer1InitializationPress}>
          <Text style={styles.text}>New Care</Text>
        </TouchableOpacity>
        </View>
          </View>
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={styles.touchable2} onPress={handleLayer1InitializationPress}>
          <Text style={styles.text}>Initialize Plant</Text>
        </TouchableOpacity>

        </View>
      )}

      </View>
      
    </View>
  );}
};

// Define some basic styles for the screen
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff4e9',
    width: "100%"
  },
  long_text: {
    flexWrap: 'wrap', // Allows the text to wrap onto multiple lines
    textAlign: 'center', // Centers the text within the container
    fontSize: 16, // Adjust this to fit the text size you want
    color: '#9eab9a',
    paddingTop: 5,
    paddingBottom: 5
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',       // works here
    justifyContent: 'center',   // also works here
  },
  testContainer: {
    backgroundColor: '#bbbbbb',
    
  },
  background: {
    alignItems: 'center',
    backgroundColor: '#fff4e9',

  },
  heading: {
    color: "#6b5a48",
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '30%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#e7d8c9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: "#6b5a48",
    color:"#6b5a48",
    marginBottom: 5,

  },
  buttonText: {
    color: '#6b5a48',
    fontSize: 16,
  },
  chart: {
    borderRadius: 16,
  },
  container2: {
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#fff4e9',
    width: "100%",
    height: "100%"
  },
  container_divider: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff4e9',
    borderColor: "#6b5a48",
    borderRadius: 10,
    borderWidth: 4,
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 5,
    marginTop: 5,
    marginBottom: 20
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff4e9'
  },
  man_mode_ctrl_panel: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff4e9',
    borderColor: "#6b5a48",
    borderRadius: 10,
    borderWidth: 4,
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 5,
  },
  layer1_container: {
    width: '100%',
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
  layer2_container: {
    width: '80%',
    height: '35%',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginTop: 50,
    borderWidth: 2,
    borderColor: '6b3e2e',
  },
  basic_status_title_text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  touchable: {
    width: '40%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e7d8c9',
    borderColor: "#6b5a48",
    borderWidth: 2,
    borderRadius: 10,
    textAlign: 'center',
  },
  touchable2: {
    width: '80%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e7d8c9',
    borderColor: "#6b5a48",
    borderWidth: 2,
    borderRadius: 10,
    textAlign: 'center',
  },
  touchable_scheduling: {
    width: '60%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e7d8c9',
    borderColor: "#6b5a48",
    borderWidth: 2,
    borderRadius: 10,
    textAlign: 'center',
  },
  touchable_bigger: {
    width: '90%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e7d8c9',
    borderColor: "#6b5a48",
    borderWidth: 2,
    borderRadius: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    color: '#9eab9a',
    alignItems: 'center',
    textAlign: 'center',
    
  },
  water_button_text: {
    fontSize: 20,
    color: '#6b5a48',
    textAlign: 'center',
  },
  ml_text: {
    fontSize: 20,
    color: '#9eab9a',
    paddingLeft: 10
  },
  ctrl_panel_text: {
    fontSize: 20,
    color: '#9eab9a',
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 5
  },
  ctrl_panel_text_unbolded: {
    fontSize: 20,
    color: '#9eab9a',
    paddingTop: 5,
    paddingBottom: 5
  },
  dark_green_text: {
    paddingTop: 10,
    fontSize: 20,
    color: '#879183',
    fontWeight: 'bold',
  },
  layer_title_text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b3e2e',
  },
  textInput1: {
    width: '40%',
    height: 50,
    borderColor: '#6b5a48',
    borderWidth: 2,
    borderRadius: 5,
    //marginBottom: 20,
    backgroundColor: '#ffffff',
    color: '#6b5a48',
    textAlign: 'center',
  },
  textInput2: {
    width: '20%',
    height: 50,
    borderColor: '#6b5a48',
    borderWidth: 2,
    borderRadius: 5,
    //marginBottom: 20,
    backgroundColor: '#ffffff',
    color: '#6b5a48',
    textAlign: 'center',
    marginLeft: 5
  },
  textInput3: {
    width: '15%',
    height: 50,
    borderColor: '#6b5a48',
    borderWidth: 2,
    borderRadius: 5,
    //marginBottom: 20,
    backgroundColor: '#ffffff',
    color: '#6b5a48',
    textAlign: 'center',
    marginLeft: 7,
    marginRight: -4
  },
 
  switch: {
    width: 100,
    height: 40,
    marginTop: 5,
    marginBottom: 15
  },
});

export default BasicStatusScreen;