import React, { useState, useEffect } from 'react';
import { Platform, View, Text, TextInput,ScrollView, Keyboard, TouchableWithoutFeedback, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchDataFromFirebase, pushDataToFirebase } from '../../services/firebaseService';  // Adjust the path accordingly
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';


type RootStackParamList = {
  ChooseMode: {layer: number};
  ModeInfo: {tab_data: number};
  HealthInfo: {tab_data: number};
  PlantInfo: {tab_data: number};
  More_Info: {layer: number};
  ConfigScheduling: {layer: number};
  BasicStatus: undefined;
  // Add other screen names here if needed
};   


interface HealthInfoScreenProps {
  navigation: RootStackParamList;  // Define this if you need navigation props
  route: {params: {tab_data: number}};       // This will provide access to the route params
}

// Define the BasicStatusScreen component
const HealthInfoScreen: React.FC<HealthInfoScreenProps> = ({ navigation, route }) => { 
  
  const { tab_data } = route.params;

  const [modelQuery, setmodelQuery] = useState<any>(null);
  const [modelResponse, setmodelResponse] = useState<any>(null);
  const [isModelQueried, setIsMOdelQueried] = useState<any>(null);

  const [rawbase64Image, setRawBase64Image] = useState<any>(null);
  const [rawbase64ImageNVDI, setRawBase64ImageNVDI] = useState<any>(null);



  const [bottomMode, setBottomMode] = useState<any>(null);
      const [bottomCrop, setBottomCrop] = useState<any>(null);
      const [isHealthReportVisible, setIsHealthReportVisible] = useState(false);
      const [isNVDIImageVisible, setIsNVDIImageVisible] = useState(false);
      const [topMode, setTopMode] = useState<any>(null);
      const [topCrop, setTopCrop] = useState<any>(null);

      const [bottomStage, setBottomStage] = useState<any>(null);
      const [topStage, setTopStage] = useState<any>(null);
    
      const [mode, setMode] = useState<any>(null);
      const [stage, setStage] = useState<any>(null);
      const [crop, setCrop] = useState<any>(null);
      const [expectedHarvest, setExpectedHarvest] = useState<any>(null);

      const [blightFlag, setBlightFlag] = useState<any>(null);
      const [healthyImageFlag, setHealthyImageFlag] = useState<any>(null);
      const [leggingFlag, setLeggingFlag] = useState<any>(null);
      const [pestsFlag, setPestsFlag] = useState<any>(null);
      const [leafDiscoloredFlag, setLeafDiscoloredFlag] = useState<any>(null);

      const ImageComponent = ({rawBase64Image}: { rawBase64Image: string }) => {
        console.log('Base64 image length:', rawBase64Image?.length);
        if (Platform.OS === 'web') 
        {
            return (
                <Image
                  source={{ uri: `data:image/png;base64,${rawBase64Image}` }}
                  style={ { width: '800px', height: '400px'}}
                />
    
            )
        }
        else {
            return (
                <Image
                  source={{ uri: `data:image/png;base64,${rawBase64Image}` }}
                  style={ {width: '400', height: '200'}}
                />
    
            )
        }

        
      }

      const fetchTopGeneralData = async() => {
        await fetchDataFromFirebase('flags_test/top_mode', setMode);
        await fetchDataFromFirebase('levels/top/crop', setCrop);
        await fetchDataFromFirebase('levels/top/expected_harvest', setExpectedHarvest);
        await fetchDataFromFirebase('levels/top/stage', setStage);
      }

      const fetchBottomGeneralData = async () => {
        await fetchDataFromFirebase('flags_test/bottom_mode', setMode);
        await fetchDataFromFirebase('levels/bottom/crop', setCrop);
        await fetchDataFromFirebase('levels/bottom/expected_harvest', setExpectedHarvest);
        await fetchDataFromFirebase('levels/bottom/stage', setStage);
      }

      const fetchHealthReportData = async (layer: number) => {
        if (layer == 1)
        {
            pushDataToFirebase("llm", [2], ["cmd_id"])
            pushDataToFirebase("llm", [true], ["query_flag"])
            
            // bot
        }
        else if (layer == 2)
        {
            //top
            pushDataToFirebase("llm", [3], ["cmd_id"])
            pushDataToFirebase("llm", [true], ["query_flag"])
        }
        setTimeout(() => {
            fetchDataFromFirebase('health_report/blight', setBlightFlag);
            fetchDataFromFirebase('health_report/healthy_image', setHealthyImageFlag);
            fetchDataFromFirebase('health_report/leaf_discolor', setLeafDiscoloredFlag);
            fetchDataFromFirebase('health_report/legging', setLeggingFlag);
            fetchDataFromFirebase('health_report/pests', setPestsFlag);
            if (layer == 1)
            {
                fetchDataFromFirebase('images/Image_in_base64_original_1', setRawBase64Image);
                fetchDataFromFirebase('images/Image_in_base64_color_mapped_1', setRawBase64ImageNVDI);

            }
            else if (layer == 2)
            {
                fetchDataFromFirebase('images/Image_in_base64_original_0', setRawBase64Image);
                fetchDataFromFirebase('images/Image_in_base64_color_mapped_0', setRawBase64ImageNVDI);
            }
            setIsHealthReportVisible(true);
        }, 2000);
      };


      const SwitchImages = () => {
        const nextState = !isNVDIImageVisible;
        setIsNVDIImageVisible(nextState);
      }

      const SendModelQuery = (query: string, layer: number) => {
        pushDataToFirebase("User_query", [query], ["Question"])
        if (layer == 1)
            {
                
                pushDataToFirebase("llm", [10], ["cmd_id"])
                pushDataToFirebase("llm", [true], ["query_flag"])
                
                // bot
            }
            else if (layer == 2)
            {
                //top
                pushDataToFirebase("llm", [11], ["cmd_id"])
                pushDataToFirebase("llm", [true], ["query_flag"])
            }
            setTimeout(() => {
                fetchDataFromFirebase('llm/response', setmodelResponse);

                setIsMOdelQueried(true);
            }, 7000);
      }

      const GetNewQuery = () => {
        setIsMOdelQueried(false);
      }
      
    const renderView = () => {
      if (tab_data == 1)
      {
        fetchBottomGeneralData();
      }
    else if (tab_data == 2)
    {
        fetchTopGeneralData();
    }
        if (mode != null)
        {
          return (
                  
                  <ScrollView style={styles.container2} contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.dark_green_text }>General Plant Info</Text>
                        <View style={styles.container_divider}>
                          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={styles.ctrl_panel_text}>Level: </Text>
                            <Text style={styles.ctrl_panel_text_unbolded}>{tab_data}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>Plant Type: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{crop}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>Plant Stage: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{stage}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.ctrl_panel_text}>Expected Harvest: </Text>
                        <Text style={styles.ctrl_panel_text_unbolded}>{expectedHarvest}</Text>
                    </View>
                        </View>
                        


                        <Text style={styles.dark_green_text }>Plant Health Analysis</Text>
                        {!isHealthReportVisible && (
                            <View style={styles.container_divider}>
                            
                            <TouchableOpacity style={styles.button} onPress={() => fetchHealthReportData(tab_data)}>
                            <Text style={styles.buttonText}>Plant Health Analysis</Text>
                          </TouchableOpacity>
                          </View>
                        )}
                
        
                        {/* Conditionally render additional content based on the state */}
                        {isHealthReportVisible && (
                            <View style={styles.container_divider}>
                            {!isNVDIImageVisible && (
                            <View style={styles.background}>
                                <Text style={styles.ctrl_panel_text}>Plant Image Test </Text>
                            
                            
                            <View style={styles.testContainer}>
                                <ImageComponent rawBase64Image={rawbase64Image}/>
                </View>

                            <TouchableOpacity style={styles.button} onPress={() => SwitchImages()}>
                            <Text style={styles.buttonText}>See NVDI Image</Text>
                          </TouchableOpacity>

                            </View>)}

                            {isNVDIImageVisible && (
                            <View style={styles.background}>
                                <Text style={styles.ctrl_panel_text}>NVDI Plant Image </Text>
                                <View style={styles.testContainer}>
                                <ImageComponent rawBase64Image={rawbase64ImageNVDI}/>
                </View>

                            <TouchableOpacity style={styles.button} onPress={() => SwitchImages()}>
                            <Text style={styles.buttonText}>See Base Image</Text>
                          </TouchableOpacity>
                          </View>)}

                          <Text style={styles.ctrl_panel_text}>Test Report </Text>
                                <Text style={styles.ctrl_panel_text}>Blight: </Text>
                                <Text style={styles.long_text}>{blightFlag}</Text>
                            <Text style={styles.ctrl_panel_text}>Legging: </Text>
                            <Text style={styles.long_text}>{leggingFlag}</Text>
                            <Text style={styles.ctrl_panel_text}>NVDI Health: </Text>
                            <Text style={styles.long_text}>{healthyImageFlag}</Text>
                            <Text style={styles.ctrl_panel_text}>Leaf Discoloration: </Text>
                            <Text style={styles.long_text}>{leafDiscoloredFlag}</Text>
                            <Text style={styles.ctrl_panel_text}>Pests: </Text>
                            <Text style={styles.long_text}>{pestsFlag}</Text>
                                
                                
                            
                        </View>
                            
                                
                        

                        )}
                        <Text style={styles.dark_green_text }>Ask The Model</Text>
                        <View style={styles.container_divider}>
                        {!isModelQueried && (
                            <View style={styles.background}>
                                <TextInput
                                        style={styles.textInput4}
                                        value={modelQuery}
                                        onChangeText={setmodelQuery}
                                    />
                                    <TouchableOpacity style={styles.button} onPress={() => SendModelQuery(modelQuery, tab_data)}>
                            <Text style={styles.buttonText}>Send Query</Text>
                          </TouchableOpacity>
                    </View>
                        )}

                        {isModelQueried && (
                            <View style={styles.background}>
                                 <Text style={styles.ctrl_panel_text}>Model Response </Text>
                            <Text style={styles.long_text}>{modelResponse}</Text>
                           
                                    <TouchableOpacity style={styles.button} onPress={() => GetNewQuery()}>
                            <Text style={styles.buttonText}>Start New Query</Text>
                          </TouchableOpacity>
                    </View>
                        )}
                        </View>
                        
                  </ScrollView>
          );
        }
      };

  return (
    <View style={styles.container}>
          {renderView()}
        </View>
  );
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
    width: '100%',
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
  textInput4: {
    width: '300',
    height: 50,
    borderColor: '#6b5a48',
    borderWidth: 2,
    borderRadius: 5,
    //marginBottom: 20,
    backgroundColor: '#ffffff',
    color: '#6b5a48',
    textAlign: 'center',
  },
  switch: {
    width: 100,
    height: 40,
    marginTop: 5,
    marginBottom: 15
  },
});

export default HealthInfoScreen;