import React, { useState, useEffect } from 'react';
import { View, Text, TextInput,ScrollView, Keyboard, TouchableWithoutFeedback, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchDataFromFirebase, pushDataToFirebase } from '../../services/firebaseService';  // Adjust the path accordingly
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { Platform } from 'react-native';



type RootStackParamList = {
  ChooseMode: {layer: number};
  ModeInfo: {tab_data: number};
  PlantInfo: {tab_data: number};
  More_Info: {layer: number};
  ConfigScheduling: {layer: number};
  BasicStatus: undefined;
  // Add other screen names here if needed
};   


interface PlantInfoScreenProps {
  navigation: RootStackParamList;  // Define this if you need navigation props
  route: {params: {tab_data: number}};       // This will provide access to the route params
}

// Define the BasicStatusScreen component
const PlantInfoScreen: React.FC<PlantInfoScreenProps> = ({ navigation, route }) => { 
  const pickerStyle = Platform.OS === 'ios' ? styles.picker : { ...styles.picker};
  const { tab_data } = route.params;

  const [showGraph, setShowGraph] = useState(false);
  const [expectedBotHarvest, setExpectedBotHarvest] = useState(false);
  const [expectedTopHarvest, setExpectedTopHarvest] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState('temperature');
  const [labels, setLabels] = useState(['1PM', '2PM', '3PM', '4PM']);
  const [dataPoints, setDataPoints] = useState([22, 23.5, 21.8, 22.3]);
  

  const getLast13Timestamps = () => {
    const timestamps = [];
    const now = new Date();
  
    for (let i = 0; i < 13; i++) {
      const time = new Date(now.getTime() - i * 12 * 60 * 60 * 1000); // 12 hours * 60 mins * 60 sec * 1000 ms
      const label = time.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        hour12: true,
      });
      timestamps.unshift(label); // add to beginning to keep chronological order
    }
  
    return timestamps;
  };

  const handleHistoricalPress = async (sensorType: string, layer: number) => {
    let firebasePath = '';
    switch (sensorType)
    {
      case 'temperature':
        firebasePath = 'sensor_readings/historical/temperature';
        break;
      case 'co2':
        firebasePath = 'sensor_readings/historical/co2';
        break;
      case 'humidity':
        firebasePath = 'sensor_readings/historical/humidity';
        break;
      case 'tvoc':
        firebasePath = 'sensor_readings/historical/tvoc';
        break;
      case 'moisture':
        if (layer == 1)
        {
          firebasePath = 'sensor_readings/historical/soil_moisture_bot';
        }
        else
        {
          firebasePath = 'sensor_readings/historical/soil_moisture_bot';
        }
        break;
    }
    await fetchDataFromFirebase(firebasePath, setDataPoints);

    setShowGraph(true);
  }

  const [bottomMode, setBottomMode] = useState<any>(null);
      const [bottomCrop, setBottomCrop] = useState<any>(null);
  
      const [topMode, setTopMode] = useState<any>(null);
      const [topCrop, setTopCrop] = useState<any>(null);

      const [bottomStage, setBottomStage] = useState<any>(null);
      const [topStage, setTopStage] = useState<any>(null);
      
  
      //Sensors if box only one, if not need top and bottom
      const [boxHumidity, setBoxHumidity] = useState<any>(null);
      const [boxTemp, setBoxTemp] = useState<any>(null);
      const [boxO2, setBoxCO2] = useState<any>(null);
      const [boxTVOC, setBoxTVOC] = useState<any>(null);
      const [bottomSoilMoisture, setBottomSoilMoisture] = useState<any>(null);
      const [topSoilMoisture, setTopSoilMoisture] = useState<any>(null);


      const PickerFunc = () => {
        return (
          <Picker
          selectedValue={selectedSensor}
          style={[styles.picker]}
          onValueChange={(itemValue) => setSelectedSensor(itemValue)}
        >
          <Picker.Item label="Temperature" value="temperature" />
          <Picker.Item label="Humidity" value="humidity" />
          <Picker.Item label="CO₂" value="co2" />
          <Picker.Item label="TVOC" value="tvoc" />
          <Picker.Item label="Soil Moisture" value="moisture" />
        </Picker>
        )
      }
      const fetchTopGeneralData = async() => {
        await fetchDataFromFirebase('flags_test/top_mode', setTopMode);
                await fetchDataFromFirebase('levels/top/crop', setTopCrop);
                await fetchDataFromFirebase('levels/top/expected_harvest', setExpectedTopHarvest);
                await fetchDataFromFirebase('levels/top/stage', setTopStage);
        await fetchDataFromFirebase('sensor_readings/latest/Humidity/humidity', setBoxHumidity);
                  await fetchDataFromFirebase('sensor_readings/latest/Temperature/temperature', setBoxTemp);
                  await fetchDataFromFirebase('sensor_readings/latest/Air Quality/co2', setBoxCO2);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                  await fetchDataFromFirebase('sensor_readings/latest/Air Quality/tvoc', setBoxTVOC);
                  
                  await fetchDataFromFirebase('sensor_readings/latest/soil_sensor_top/moisture', setTopSoilMoisture);

      }

      const fetchBottomGeneralData = async () => {
        await fetchDataFromFirebase('flags_test/bottom_mode', setBottomMode);
        await fetchDataFromFirebase('levels/bottom/crop', setBottomCrop);
        await fetchDataFromFirebase('sensor_readings/latest/Humidity/humidity', setBoxHumidity);
                  await fetchDataFromFirebase('sensor_readings/latest/Temperature/temperature', setBoxTemp);
                  await fetchDataFromFirebase('sensor_readings/latest/Air Quality/co2', setBoxCO2);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                  await fetchDataFromFirebase('sensor_readings/latest/Air Quality/tvoc', setBoxTVOC);
                  await fetchDataFromFirebase('sensor_readings/latest/soil_sensor_bottom/moisture', setBottomSoilMoisture);
                

        
      }

      
      
      useEffect(() => {



          const fetchData = async () => {
                try {      
          
                  await fetchDataFromFirebase('sensor_readings/latest/Humidity/humidity', setBoxHumidity);
                  await fetchDataFromFirebase('sensor_readings/latest/Temperature/temperature', setBoxTemp);
                  await fetchDataFromFirebase('sensor_readings/latest/Air Quality/co2', setBoxCO2);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                  await fetchDataFromFirebase('sensor_readings/latest/Air Quality/tvoc', setBoxTVOC);
                  await fetchDataFromFirebase('sensor_readings/latest/soil_sensor_bottom/moisture', setBottomSoilMoisture);
                  await fetchDataFromFirebase('sensor_readings/latest/soil_sensor_top/moisture', setTopSoilMoisture);
                } catch (error) {
                  Alert.alert('Error fetching data from Firebase');
                }
              };
              const intervalId = setInterval(() => {
              fetchData();
              }, 6000000)
        }, []);

    const renderView = () => {
      if (tab_data == 1)
      {
        fetchBottomGeneralData();
        if (bottomMode != null)
        {
          return (
                  
                  <ScrollView style={styles.container2} contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.dark_green_text }>Plant Info</Text>
                        <View style={styles.container_divider}>
                          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={styles.ctrl_panel_text}>Level: </Text>
                            <Text style={styles.ctrl_panel_text_unbolded}>{tab_data}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>Plant Type: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{bottomCrop}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>Plant Stage: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{bottomStage}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>Expected Harvest: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{expectedBotHarvest}</Text>
                        </View>


                        </View>

                        <Text style={styles.dark_green_text }>Current Sensor Info</Text>
                        <View style={styles.container_divider}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>Humidity: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{boxHumidity}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>Temp: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{boxTemp}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>CO2: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{boxO2}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>TVOC: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{boxTVOC}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>Soil Moisture: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{bottomSoilMoisture}</Text>
                        </View>
                        </View>

                        <Text style={styles.dark_green_text }>Historical Data</Text>
                        <View style={styles.container_divider}>
                        <Text style={styles.heading}>Select Data</Text>
                      <Picker
                        selectedValue={selectedSensor}
                        style={[styles.picker]}
                        onValueChange={(itemValue) => setSelectedSensor(itemValue)}
                      >
                        <Picker.Item label="Temperature" value="temperature" />
                        <Picker.Item label="Humidity" value="humidity" />
                        <Picker.Item label="CO₂" value="co2" />
                        <Picker.Item label="TVOC" value="tvoc" />
                        <Picker.Item label="Soil Moisture" value="moisture" />
                      </Picker>

                      <TouchableOpacity style={styles.button} onPress={() => handleHistoricalPress(selectedSensor, 1)}>
                        <Text style={styles.buttonText}>Show Graph</Text>
                      </TouchableOpacity>

                      {showGraph && (
                      <ScrollView horizontal={false}>
                    <LineChart
                      data={{
                        labels: getLast13Timestamps(),
                        datasets: [{ data: dataPoints }],
                      }}
                      width={Dimensions.get('window').width - 100}
                      height={220}
                      yAxisSuffix={
                        selectedSensor === 'co2' ? ' ppm' :
                        selectedSensor === 'humidity' ? ' %' :
                        selectedSensor === 'tvoc' ? ' ppb' :
                        selectedSensor === 'soil_moisture' ? ' %' :
                        ' °F' // default to temperature
                      }
                      chartConfig={{
                        backgroundColor: '#fff',
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff4e9',
                        decimalPlaces: 1,
                        color: (opacity = 1) => `rgba(158, 171, 154, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: { borderRadius: 16 },
                        propsForDots: {
                          r: '4',
                          strokeWidth: '2',
                          stroke: '#9eab9a',
                        },
                      }}
                      bezier
                      style={styles.chart}
                    />
                    </ScrollView>
                  )}

                        </View>

                  </ScrollView>
          )
        }
      }
      else if (tab_data == 2)
      {
        fetchTopGeneralData();
        if (topMode != null)
        {
          return (
                  
                  <ScrollView style={styles.container2} contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.dark_green_text }>Plant Info</Text>
                        <View style={styles.container_divider}>
                          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={styles.ctrl_panel_text}>Level: </Text>
                            <Text style={styles.ctrl_panel_text_unbolded}>{tab_data}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>Plant Type: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{topCrop}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>Plant Stage: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{topStage}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>Expected Harvest: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{expectedTopHarvest}</Text>
                        </View>
                        </View>

                        <Text style={styles.dark_green_text }>Current Sensor Info</Text>
                        <View style={styles.container_divider}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>Humidity: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{boxHumidity}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>Temp: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{boxTemp}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>CO2: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{boxO2}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>TVOC: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{boxTVOC}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={styles.ctrl_panel_text}>Soil Moisture: </Text>
                          <Text style={styles.ctrl_panel_text_unbolded}>{topSoilMoisture}</Text>
                        </View>
                        </View>
                        <Text style={styles.dark_green_text }>Historical Data</Text>
                        <View style={styles.container_divider}>
                        <Text style={styles.heading}>Select Data</Text>
                        
                        <PickerFunc></PickerFunc>
                      

                      <TouchableOpacity style={styles.button} onPress={() => handleHistoricalPress(selectedSensor, 2)}>
                        <Text style={styles.buttonText}>Show Graph</Text>
                      </TouchableOpacity>

                      {showGraph && (
                      <ScrollView horizontal={false}>
                    <LineChart
                      data={{
                        labels: getLast13Timestamps(),
                        datasets: [{ data: dataPoints }],
                      }}
                      width={Dimensions.get('window').width - 100}
                      height={220}
                      yAxisSuffix={
                        selectedSensor === 'co2' ? ' ppm' :
                        selectedSensor === 'humidity' ? ' %' :
                        selectedSensor === 'tvoc' ? ' ppb' :
                        selectedSensor === 'soil_moisture' ? ' %' :
                        ' °F' // default to temperature
                      }
                      chartConfig={{
                        backgroundColor: '#fff',
                        backgroundGradientFrom: '#fff',
                        backgroundGradientTo: '#fff4e9',
                        decimalPlaces: 1,
                        color: (opacity = 1) => `rgba(158, 171, 154, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: { borderRadius: 16 },
                        propsForDots: {
                          r: '4',
                          strokeWidth: '2',
                          stroke: '#9eab9a',
                        },
                      }}
                      bezier
                      style={styles.chart}
                    />
                    </ScrollView>
                  )}

                        </View>
                        
                  </ScrollView>
          )
        }
      }
    }

  return (
    <View style={styles.container}>
          {renderView()}
        </View>
  );
};

// Define some basic styles for the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff4e9',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',       // works here
    justifyContent: 'center',   // also works here
  },
  background: {
    alignItems: 'center',
    backgroundColor: '#fff4e9',
  },
  heading: {
    color: "#6b5a48",
    fontSize: 20,
    marginBottom: 10,
    marginRight: 25,
    marginLeft: 25,
    marginTop: 15
  },
  picker: {
    height: '50',
    width: '300',
    
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#e7d8c9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: "#6b5a48",
    color:"#6b5a48",
    marginBottom: 20,
    width: '100%'

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
  switch: {
    width: 100,
    height: 40,
    marginTop: 5,
    marginBottom: 15
  },
});

export default PlantInfoScreen;