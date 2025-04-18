import React, { useState, useEffect } from 'react';
import { Pressable, SafeAreaView, Button, View, Text, ActivityIndicator, TextInput, ScrollView, Keyboard, TouchableWithoutFeedback, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchDataFromFirebase, pushDataToFirebase } from '../../services/firebaseService';  // Adjust the path accordingly
import { useFocusEffect } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { onValue, ref, off } from 'firebase/database';
import LightSwitch from "../../components/LightSwitch"
import { database } from '../../../assets/config/firebaseConfig.js'
import { useSharedValue, withTiming } from 'react-native-reanimated';

type RootStackParamList = {
  ChooseMode: {new_layer: number};
  ModeInfo: {tab_data: number};
  More_Info: {layer: number};
  PlantInfo: {tab_data: number};
  ConfigScheduling: {layer: number};
  BasicStatus: undefined;
  Initialization: {layer: number};
  // Add other screen names here if needed
};   

interface ModeInfoScreenProps {
  navigation: any;  // Define this if you need navigation props
  route: {params: {tab_data: number}};       // This will provide access to the route params
}

// Define the BasicStatusScreen component
//const ModeInfoScreen: React.FC<ModeInfoScreenProps> = ({ navigation }) => { 
const ModeInfoScreen: React.FC<ModeInfoScreenProps> = ({ navigation, route }) => { 
  const [isLoading, setIsLoading] = useState(true);

  const { tab_data } = route.params;


  // For animated switch
  const manualBotLightAnim = useSharedValue(false); // SharedValue for the switch
  const manualTopLightAnim = useSharedValue(false); // SharedValue for the switch

    
  const [layerUnderTest, setLayerUnderTest] = useState<any>(null);

  const [bottomMode, setBottomMode] = useState<any>(null);
    const [bottomCrop, setBottomCrop] = useState<any>(null);

     const [topStage, setTopStage] = useState(false);
     const [expectedTopHarvest, setExpectedTopHarvest] = useState(false);

     const [botStage, setBotStage] = useState(false);
     const [expectedBotHarvest, setExpectedBotHarvest] = useState(false);

    const [topMode, setTopMode] = useState<any>(null);
    const [topCrop, setTopCrop] = useState<any>(null);

    const [manualBotLight, setManualBotLight] = useState<any>(null);
    const [manualBotWater, setManualBotWater] = useState<any>(null);
    const [manualBotWaterAmt, setManualBotWaterAmt] = useState("5");
    const [newmanualBotWaterAmt, setnewManualBotWaterAmt] = useState("5");

    const [manualTopLight, setManualTopLight] = useState<any>(null);
    const [manualTopWater, setManualTopWater] = useState<any>(null);
    const [manualTopWaterAmt, setManualTopWaterAmt] = useState("5");

    const [targetTemp, setTargetTemp] = useState("80");
    
    // Scheduling Mode Info
    const [bottomSchedulingLightEnabled, setBottomSchedulingLightEnabled] = useState<any>(null);
    const [bottomSchedulingLightRefOffHrs, setBottomSchedulingLightRefOffHrs] = useState<any>(null);
    const [bottomSchedulingLightRefOnHrs, setBottomSchedulingLightRefOnHrs] = useState<any>(null);
    const [bottomSchedulingLightRefOffMins, setBottomSchedulingLightRefOffMins] = useState<any>(null);
    const [bottomSchedulingLightRefOnMins, setBottomSchedulingLightRefOnMins] = useState<any>(null);
    const [bottomSchedulingLightTimerHrs, setBottomSchedulingLightTimerHrs] = useState<any>(null);
    const [bottomSchedulingLightTimerMins, setBottomSchedulingLightTimerMins] = useState<any>(null);

    const [newSchedulingLightRefOffHrs, setnewSchedulingLightRefOffHrs] = useState<any>(null);
    const [newSchedulingLightRefOnHrs, setnewSchedulingLightRefOnHrs] = useState<any>(null);
    const [newSchedulingLightRefOffMins, setnewSchedulingLightRefOffMins] = useState<any>(null);
    const [newSchedulingLightRefOnMins, setnewSchedulingLightRefOnMins] = useState<any>(null);

    const [newSchedulingWaterRefDays, setnewSchedulingWaterRefDays] = useState<any>(null);
    const [newSchedulingWaterRefHrs, setnewSchedulingWaterRefHrs] = useState<any>(null);
    const [newSchedulingWaterRefMins, setnewSchedulingWaterRefMins] = useState<any>(null);

    const [bottomSchedulingWaterEnabled, setBottomSchedulingWaterEnabled] = useState<any>(null);
    const [bottomSchedulingWaterRefDays, setBottomSchedulingWaterRefDays] = useState<any>(null);
    const [bottomSchedulingWaterRefHrs, setBottomSchedulingWaterRefHrs] = useState<any>(null);
    const [bottomSchedulingWaterRefMins, setBottomSchedulingWaterRefMins] = useState<any>(null);
    const [bottomSchedulingWaterTimerDays, setBottomSchedulingWaterTimerDays] = useState<any>(null);
    const [bottomSchedulingWaterTimerHrs, setBottomSchedulingWaterTimerHrs] = useState<any>(null);
    const [bottomSchedulingWaterTimerMins, setBottomSchedulingWaterTimerMins] = useState<any>(null);
    const [bottomSchedulingWaterRefAmount, setBottomSchedulingWaterRefAmount] = useState<any>(null);


    const [topSchedulingLightEnabled, setTopSchedulingLightEnabled] = useState<any>(null);
    const [topSchedulingLightRefOffHrs, setTopSchedulingLightRefOffHrs] = useState<any>(null);
    const [topSchedulingLightRefOnHrs, setTopSchedulingLightRefOnHrs] = useState<any>(null);
    const [topSchedulingLightRefOffMins, setTopSchedulingLightRefOffMins] = useState<any>(null);
    const [topSchedulingLightRefOnMins, setTopSchedulingLightRefOnMins] = useState<any>(null);
    const [topSchedulingLightTimerHrs, setTopSchedulingLightTimerHrs] = useState<any>(null);
    const [topSchedulingLightTimerMins, setTopSchedulingLightTimerMins] = useState<any>(null);

    const [topSchedulingWaterEnabled, setTopSchedulingWaterEnabled] = useState<any>(null);
    const [topSchedulingWaterRefDays, setTopSchedulingWaterRefDays] = useState<any>(null);
    const [topSchedulingWaterRefHrs, setTopSchedulingWaterRefHrs] = useState<any>(null);
    const [topSchedulingWaterRefMins, setTopSchedulingWaterRefMins] = useState<any>(null);
    const [topSchedulingWaterTimerDays, setTopSchedulingWaterTimerDays] = useState<any>(null);
    const [topSchedulingWaterTimerHrs, setTopSchedulingWaterTimerHrs] = useState<any>(null);
    const [topSchedulingWaterTimerMins, setTopSchedulingWaterTimerMins] = useState<any>(null);
    const [topSchedulingWaterRefAmount, setTopSchedulingWaterRefAmount] = useState<any>(null);
    const [activeView, setActiveView] = useState<number>(1);
  
    
    useEffect(() => {
      if (manualBotLight != null)
      {
        manualBotLightAnim.value = manualBotLight;
      }
    }, [manualBotLight]); // Effect triggers when manualBotLight state changes

    useEffect(() => {
      if (manualTopLight != null)
      {
        manualTopLightAnim.value = manualTopLight;
      }
    }, [manualTopLight]); // Effect triggers when manualBotLight state changes
  
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];


    const setupListener = (path: string, setter: (val: any) => void) => {
      const reference = ref(database, path);
      const callback = (snapshot: any) => {
        setter(snapshot.val());
      };

      // Start listening
      onValue(reference, callback);

      // Push the unsubscribe function manually
      unsubscribers.push(() => off(reference, 'value', callback));
    };

    const fetchBottomGeneralData = async () => {
      await fetchDataFromFirebase('flags_test/bottom_mode', setBottomMode);
      await fetchDataFromFirebase('levels/bottom/crop', setBottomCrop);
      await fetchDataFromFirebase('levels/bot/expected_harvest', setExpectedBotHarvest);
      await fetchDataFromFirebase('levels/bot/stage', setBotStage);
    }

    const fetchBottomManualData = async () => {
      await fetchDataFromFirebase('flags_test/bottom_man_light', setManualBotLight);
      await fetchDataFromFirebase('flags_test/bottom_man_water', setManualBotWater);

      //await fetchDataFromFirebase('flags_test/bottom_heater_target_temp', setBottomSchedulingWaterEnabled);
      //manualBotLightAnim.value = manualBotLight;
    };

    const fetchBottomSchedulingStaticData = async () => {
      await fetchDataFromFirebase('flags_test/bottom_light_ref_off_hrs', setBottomSchedulingLightRefOffHrs);
      await fetchDataFromFirebase('flags_test/bottom_light_ref_on_hrs', setBottomSchedulingLightRefOnHrs);
      await fetchDataFromFirebase('flags_test/bottom_light_ref_off_mins', setBottomSchedulingLightRefOffMins);
      await fetchDataFromFirebase('flags_test/bottom_light_ref_on_mins', setBottomSchedulingLightRefOnMins);
      await fetchDataFromFirebase('flags_test/bottom_water_ref_days', setBottomSchedulingWaterRefDays);
      await fetchDataFromFirebase('flags_test/bottom_water_ref_hrs', setBottomSchedulingWaterRefHrs);
      await fetchDataFromFirebase('flags_test/bottom_water_ref_mins', setBottomSchedulingWaterRefMins);
      await fetchDataFromFirebase('flags_test/bottom_water_amount', setBottomSchedulingWaterRefAmount);
    };

    // Need to make event listener
    const setupListenersBottomSchedulingDynamicData = async () => {
      setupListener('flags_test/bottom_light_tts_hrs', setBottomSchedulingLightTimerHrs);
      setupListener('flags_test/bottom_light_tts_mins', setBottomSchedulingLightTimerMins);
      setupListener('flags_test/bottom_water_ttw_days', setBottomSchedulingWaterTimerDays);
      setupListener('flags_test/bottom_water_ttw_hrs', setBottomSchedulingWaterTimerHrs);
      setupListener('flags_test/bottom_water_ttw_min', setBottomSchedulingWaterTimerMins);
    };

    const fetchTopGeneralData = async() => {
      await fetchDataFromFirebase('flags_test/top_mode', setTopMode);
      await fetchDataFromFirebase('levels/top/crop', setTopCrop);
      await fetchDataFromFirebase('levels/top/expected_harvest', setExpectedTopHarvest);
      await fetchDataFromFirebase('levels/top/stage', setTopStage);
    }

    const fetchTopManualData = async () => {
      await fetchDataFromFirebase('flags_test/top_man_light', setManualTopLight);
      await fetchDataFromFirebase('flags_test/top_man_water', setManualTopWater);
      //await fetchDataFromFirebase('flags_test/top_heater_target_temp', setBottomSchedulingWaterEnabled);

      //manualTopLightAnim.value = manualTopLight;
    };

    const fetchTopSchedulingStaticData = async () => {
      await fetchDataFromFirebase('flags_test/top_light_ref_off_hrs', setTopSchedulingLightRefOffHrs);
      await fetchDataFromFirebase('flags_test/top_light_ref_on_hrs', setTopSchedulingLightRefOnHrs);
      await fetchDataFromFirebase('flags_test/top_light_ref_off_mins', setTopSchedulingLightRefOffMins);
      await fetchDataFromFirebase('flags_test/top_light_ref_on_mins', setTopSchedulingLightRefOnMins);
      await fetchDataFromFirebase('flags_test/top_water_ref_days', setTopSchedulingWaterRefDays);
      await fetchDataFromFirebase('flags_test/top_water_ref_hrs', setTopSchedulingWaterRefHrs);
      await fetchDataFromFirebase('flags_test/top_water_ref_mins', setTopSchedulingWaterRefMins);
      await fetchDataFromFirebase('flags_test/top_water_amount', setTopSchedulingWaterRefAmount);
    };

    // Need to make event listener
    const setupListenersTopSchedulingDynamicData = async () => {
      setupListener('flags_test/top_light_tts_hrs', setTopSchedulingLightTimerHrs);
      setupListener('flags_test/top_light_tts_mins', setTopSchedulingLightTimerMins);
      setupListener('flags_test/top_water_ttw_days', setTopSchedulingWaterTimerDays);
      setupListener('flags_test/top_water_ttw_hrs', setTopSchedulingWaterTimerHrs);
      setupListener('flags_test/top_water_ttw_mins', setTopSchedulingWaterTimerMins);
    };


    try {
      if (tab_data == 1)  //bottom
      {
        console.log("bottom_level");
        fetchBottomGeneralData();
        fetchBottomManualData();
        fetchBottomSchedulingStaticData();
        setupListenersBottomSchedulingDynamicData();
        /*
        if (bottomMode != null)
        {
          if (bottomMode == "manual")
            {
              console.log("manual mode");
              fetchBottomManualData();
              
            }
            else if ((bottomMode == "scheduling") || (bottomMode == "adaptive"))
            {
              console.log("not manual mode");
              fetchBottomSchedulingStaticData();
              setupListenersBottomSchedulingDynamicData();
            }
        }
        */

      }
      else if (tab_data == 2)
      {
        console.log("top_level");
        fetchTopGeneralData();
        fetchTopManualData();
        fetchTopSchedulingStaticData();
        setupListenersTopSchedulingDynamicData();
        /*
        if (topMode == "manual")
        {
          fetchTopManualData();
          manualTopLightAnim.value = manualTopLight;
        }
        else if ((topMode == "scheduling") || (topMode == "adaptive"))
        {
          fetchTopSchedulingStaticData();
          setupListenersTopSchedulingDynamicData();
        }
        setIsLoading(false);
        */
      }
    } catch (error) {
      Alert.alert('Error fetching data from Firebase');
      setIsLoading(false);
    }
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, []);

  //manualBotLightAnim.value = manualBotLight;

  const ManualBotLightPress = () => {
    const newState = !manualBotLight;
    setManualBotLight(newState);
    manualBotLightAnim.value = manualBotLight;
    pushDataToFirebase("flags_test", [newState], ["bottom_man_light"])
      
    };
  
    const ManualBotWaterPress = () => {
      const newState = !manualBotWater;
      setManualBotWater(newState);
      pushDataToFirebase("flags_test", [newState], ["bottom_man_water"])
    };

    const TargetTemperaturePress = () => {
      const newState = targetTemp;
      setTargetTemp(targetTemp);
      pushDataToFirebase("flags_test", [parseInt(newState)], ["target_temp"]) 
    };

    const ManualTopLightPress = () => {
      const newState = !manualTopLight;
    setManualTopLight(newState);
    manualTopLightAnim.value = manualTopLight;
    pushDataToFirebase("flags_test", [newState], ["top_man_light"])
    };
  
    const ManualTopWaterPress = () => {
    const newState = !manualTopWater;
    setManualTopWater(newState);
    pushDataToFirebase("flags_test", [newState], ["top_man_water"])
    };

    const ChooseNewTopModePress = () => {
      navigation.navigate('ChooseMode', { new_layer: 2 });
      };

      const ChooseNewBotModePress = () => {
        navigation.navigate('ChooseMode', { new_layer: 1 });
        };

      const NewLightSchedulingPress = () => {
        pushDataToFirebase("flags_test", [parseInt(newSchedulingLightRefOnHrs), parseInt(newSchedulingLightRefOnMins), parseInt(newSchedulingLightRefOffHrs), parseInt(newSchedulingLightRefOffMins)], ["bottom_light_ref_on_hrs", "bottom_light_ref_on_mins", "bottom_light_ref_off_hrs", "bottom_light_ref_off_min"])
        };

        const NewWaterSchedulingPress = () => {
          pushDataToFirebase("flags_test", [parseInt(newSchedulingLightRefOnHrs), parseInt(newSchedulingLightRefOnMins), parseInt(newSchedulingLightRefOffHrs), parseInt(newSchedulingLightRefOffMins)], ["bottom_light_ref_on_hrs", "bottom_light_ref_on_mins", "bottom_light_ref_off_hrs", "bottom_light_ref_off_min"])
        };


  const renderView = () => {
    /*
    if (topMode == null) {
      // Show loading spinner while data is being fetched
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
      */
     
    if (tab_data == 1)
    {
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
            <Text style={styles.ctrl_panel_text_unbolded}>{botStage}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.ctrl_panel_text}>Expected Harvest: </Text>
            <Text style={styles.ctrl_panel_text_unbolded}>{expectedBotHarvest}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.ctrl_panel_text}>Mode: </Text>
            <Text style={styles.ctrl_panel_text_unbolded}>{bottomMode.charAt(0).toUpperCase() + bottomMode.slice(1)}</Text>
          </View>
          
          </View>
          <Text style={styles.dark_green_text}> {bottomMode.charAt(0).toUpperCase() + bottomMode.slice(1)} Mode Panel </Text>
          {bottomMode == "manual" && (
            
            <View style={styles.man_mode_ctrl_panel}>
              <Text style={styles.ctrl_panel_text}>Set Lighting</Text>
            <LightSwitch
              value={manualBotLightAnim} // `isOn` is the state controlling the switch, replace with your actual state
              onPress={ManualBotLightPress}  // Toggle the switch
              style={styles.switch}
            />
            <Text style={styles.ctrl_panel_text}>Set Watering</Text>

            <TouchableOpacity style={styles.touchable} onPress={ManualBotWaterPress}>
              <Text style={styles.water_button_text}>Toggle Water</Text>
            </TouchableOpacity>

            <Text style={styles.ctrl_panel_text}>Set Temperature</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <TextInput
              style={styles.textInput1}
              value={targetTemp}
              onChangeText={setTargetTemp}
              keyboardType="numeric"
            />
            <Text style={styles.ml_text}>°F</Text>
            </View>
            
            
            <TouchableOpacity style={styles.touchable} onPress={TargetTemperaturePress}>
              <Text style={styles.water_button_text}>Set Target</Text>
            </TouchableOpacity>
            
            </View>
            //<View style={styles.layer1_container}>
              //<Text style={styles.text}>manual</Text>
            //</View>
          )}
          {bottomMode == "adaptive" && (
            
    
            <View style={styles.man_mode_ctrl_panel}>
              <Text style={styles.dark_green_text}>Current Light Scheduling </Text>
              <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff4e9',
                  borderColor: "#6b5a48",
                  borderRadius: 15,
                  borderWidth: 2,
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingHorizontal: 5,
                  marginTop: 5,
                  marginBottom: 20, }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.ctrl_panel_text}>Light Status: </Text>
              <Text style={styles.ctrl_panel_text_unbolded}>{bottomSchedulingLightEnabled ? 'ON' : 'OFF'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.ctrl_panel_text}>Light Switches in: </Text>
            <Text style={styles.ctrl_panel_text_unbolded}>{bottomSchedulingLightTimerHrs} Hrs {bottomSchedulingLightTimerMins} Mins</Text>
            </View>

            
            <Text style={styles.ctrl_panel_text}>Scheduled Light ON Every: </Text>
            <Text style={styles.ctrl_panel_text_unbolded}>{bottomSchedulingLightRefOnHrs} Hrs {bottomSchedulingLightRefOnMins} Mins</Text>
            

            
            <Text style={styles.ctrl_panel_text}>Scheduled Light OFF Every: </Text>
            <Text style={styles.ctrl_panel_text_unbolded}>{bottomSchedulingLightRefOffHrs} Hrs {bottomSchedulingLightRefOffMins} Mins</Text>
            
            </View>

           


            
                  <Text style={styles.dark_green_text}>Current Water Scheduling </Text>
            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff4e9',
                  borderColor: "#6b5a48",
                  borderRadius: 15,
                  borderWidth: 2,
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingHorizontal: 2,
                  marginTop: 5,
                  marginBottom: 20}}>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.ctrl_panel_text}>Watering Amount: </Text>
              <Text style={styles.ctrl_panel_text_unbolded}>{bottomSchedulingWaterRefAmount} secs</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.ctrl_panel_text}>Water Deploys in: </Text>
            <Text style={styles.ctrl_panel_text_unbolded}>{bottomSchedulingWaterTimerDays} Days {bottomSchedulingWaterTimerHrs} Hrs {bottomSchedulingWaterTimerMins} Mins</Text>
            </View>
        
            <Text style={styles.ctrl_panel_text}>Scheduled Water Every: </Text>
            <Text style={styles.ctrl_panel_text_unbolded}>{bottomSchedulingWaterRefDays} Days {bottomSchedulingWaterRefHrs} Hrs {bottomSchedulingWaterRefMins} Mins</Text>

                    </View>


           

            <Text style={styles.ctrl_panel_text}>Target Temperature</Text>
      

            <Text style={styles.ml_text}>{targetTemp}°F</Text>
    
            
            
            
            </View>
          )}
          {bottomMode == "scheduling" && (
  
    
            <View style={styles.man_mode_ctrl_panel}>
              <Text style={styles.dark_green_text}>Current Light Scheduling </Text>
              <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff4e9',
                  borderColor: "#6b5a48",
                  borderRadius: 15,
                  borderWidth: 2,
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingHorizontal: 5,
                  marginTop: 5,
                  marginBottom: 20, }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.ctrl_panel_text}>Light Status: </Text>
              <Text style={styles.ctrl_panel_text_unbolded}>{bottomSchedulingLightEnabled ? 'ON' : 'OFF'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.ctrl_panel_text}>Light Switches in: </Text>
            <Text style={styles.ctrl_panel_text_unbolded}>{bottomSchedulingLightTimerHrs} Hrs {bottomSchedulingLightTimerMins} Mins</Text>
            </View>

            
            <Text style={styles.ctrl_panel_text}>Scheduled Light ON Every: </Text>
            <Text style={styles.ctrl_panel_text_unbolded}>{bottomSchedulingLightRefOnHrs} Hrs {bottomSchedulingLightRefOnMins} Mins</Text>
            

            
            <Text style={styles.ctrl_panel_text}>Scheduled Light OFF Every: </Text>
            <Text style={styles.ctrl_panel_text_unbolded}>{bottomSchedulingLightRefOffHrs} Hrs {bottomSchedulingLightRefOffMins} Mins</Text>
            
            </View>

            <Text style={styles.dark_green_text}>New Light Scheduling </Text>
            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff4e9',
                  borderColor: "#6b5a48",
                  borderRadius: 15,
                  borderWidth: 2,
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingHorizontal: 2,
                  marginTop: 5,
                  marginBottom: 20,
                  width: '80%' }}>
                  
                  <Text style={styles.ctrl_panel_text}>Light ON Schedule</Text>

                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

            <TextInput
              style={styles.textInput2}
              value={newSchedulingLightRefOnHrs}
              onChangeText={setnewSchedulingLightRefOnHrs}
              keyboardType="numeric"
            />
            <Text style={styles.ml_text}>Hrs</Text>
            <TextInput
              style={styles.textInput2}
              value={newSchedulingLightRefOnMins}
              onChangeText={setnewSchedulingLightRefOnMins}
              keyboardType="numeric"
            />
            <Text style={styles.ml_text}>Mins</Text>
                  </View>
                  <Text style={styles.ctrl_panel_text}>Light OFF Schedule</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

            <TextInput
              style={styles.textInput2}
              value={newSchedulingLightRefOffHrs}
              onChangeText={setnewSchedulingLightRefOffHrs}
              keyboardType="numeric"
            />
            <Text style={styles.ml_text}>Hrs</Text>
            <TextInput
              style={styles.textInput2}
              value={newSchedulingLightRefOffMins}
              onChangeText={setnewSchedulingLightRefOffMins}
              keyboardType="numeric"
            />
            <Text style={styles.ml_text}>Mins</Text>
                  </View>
                  <TouchableOpacity style={styles.touchable_scheduling} onPress={NewLightSchedulingPress}>
              <Text style={styles.water_button_text}>Set New Schedule</Text>
            </TouchableOpacity>
                  </View>   


            
                  <Text style={styles.dark_green_text}>Current Water Scheduling </Text>
            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff4e9',
                  borderColor: "#6b5a48",
                  borderRadius: 15,
                  borderWidth: 2,
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingHorizontal: 2,
                  marginTop: 5,
                  marginBottom: 20}}>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.ctrl_panel_text}>Watering Amount: </Text>
              <Text style={styles.ctrl_panel_text_unbolded}>{bottomSchedulingWaterRefAmount}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.ctrl_panel_text}>Water Deploys in: </Text>
            <Text style={styles.ctrl_panel_text_unbolded}>{bottomSchedulingWaterTimerDays} Days {bottomSchedulingWaterTimerHrs} Hrs {bottomSchedulingWaterTimerMins} Mins</Text>
            </View>
            
            <Text style={styles.ctrl_panel_text}>Scheduled Water Every: </Text>
            <Text style={styles.ctrl_panel_text_unbolded}>{bottomSchedulingWaterRefDays} Days {bottomSchedulingWaterRefHrs} Hrs {bottomSchedulingWaterRefMins} Mins</Text>

                    </View>


                    <Text style={styles.dark_green_text}>New Water Scheduling </Text>
            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff4e9',
                  borderColor: "#6b5a48",
                  borderRadius: 15,
                  borderWidth: 2,
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingHorizontal: 2,
                  marginTop: 5,
                  marginBottom: 20,
                  width: '90%' }}>
                  
                  <Text style={styles.ctrl_panel_text}>Watering Amount</Text>

                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                  <TextInput
              style={styles.textInput1}
              value={newmanualBotWaterAmt}
              onChangeText={setnewManualBotWaterAmt}
              keyboardType="numeric"
            />
            <Text style={styles.ml_text}>secs   (1 sec = 15mL)</Text>
                  </View>
                  <Text style={styles.ctrl_panel_text}>Water Schedule</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

            <TextInput
              style={styles.textInput3}
              value={newSchedulingWaterRefDays}
              onChangeText={setnewSchedulingWaterRefDays}
              keyboardType="numeric"
            />
            <Text style={styles.ml_text}>Days</Text>
            <TextInput
              style={styles.textInput3}
              value={newSchedulingWaterRefHrs}
              onChangeText={setnewSchedulingWaterRefHrs}
              keyboardType="numeric"
            />
            <Text style={styles.ml_text}>Hrs</Text>
            <TextInput
              style={styles.textInput3}
              value={newSchedulingWaterRefMins}
              onChangeText={setnewSchedulingWaterRefMins}
              keyboardType="numeric"
            />
            <Text style={styles.ml_text}>Mins</Text>
                  </View>
                  <TouchableOpacity style={styles.touchable_scheduling} onPress={NewWaterSchedulingPress}>
              <Text style={styles.water_button_text}>Set New Schedule</Text>
            </TouchableOpacity>
                  </View>  

            <Text style={styles.ctrl_panel_text}>Set Temperature</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
              style={styles.textInput1}
              value={targetTemp}
              onChangeText={setTargetTemp}
              keyboardType="numeric"
            />
            <Text style={styles.ml_text}>°F</Text>
            </View>
            
            
            <TouchableOpacity style={styles.touchable_scheduling} onPress={TargetTemperaturePress}>
              <Text style={styles.water_button_text}>Set Target</Text>
            </TouchableOpacity>
            
            </View>
          )}
          <TouchableOpacity style={styles.touchable_bigger} onPress={ChooseNewBotModePress}>
              <Text style={styles.water_button_text}>Set New Mode</Text>
            </TouchableOpacity>
        </ScrollView>
        
      );
    }
    }
    else if (tab_data == 2)
    {
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
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.ctrl_panel_text}>Mode: </Text>
            <Text style={styles.ctrl_panel_text_unbolded}>{topMode.charAt(0).toUpperCase() + topMode.slice(1)}</Text>
          </View>
          
          </View>

          {topMode == "manual" && (
            
            <View style={styles.man_mode_ctrl_panel}>
              <Text style={styles.ctrl_panel_text}>Set Lighting</Text>
            <LightSwitch
              value={manualTopLightAnim} // `isOn` is the state controlling the switch, replace with your actual state
              onPress={ManualTopLightPress}  // Toggle the switch
              style={styles.switch}
            />
            <Text style={styles.ctrl_panel_text}>Set Watering</Text>

            <TouchableOpacity style={styles.touchable} onPress={ManualTopWaterPress}>
              <Text style={styles.water_button_text}>Toggle Water</Text>
            </TouchableOpacity>

            <Text style={styles.ctrl_panel_text}>Set Temperature</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <TextInput
              style={styles.textInput1}
              value={targetTemp}
              onChangeText={setTargetTemp}
              keyboardType="numeric"
            />
            <Text style={styles.ml_text}>°F</Text>
            </View>
            
            
            <TouchableOpacity style={styles.touchable} onPress={TargetTemperaturePress}>
              <Text style={styles.water_button_text}>Set Target</Text>
            </TouchableOpacity>
            
            </View>
            //<View style={styles.layer1_container}>
              //<Text style={styles.text}>manual</Text>
            //</View>
          )}
          {topMode == "adaptive" && (
            
            <View style={styles.man_mode_ctrl_panel}>
              <Text style={styles.dark_green_text}>Current Light Scheduling </Text>
              <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff4e9',
                  borderColor: "#6b5a48",
                  borderRadius: 15,
                  borderWidth: 2,
                  paddingTop: 5,
                  paddingBottom: 5,
                  paddingHorizontal: 5,
                  marginTop: 5,
                  marginBottom: 20, }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.ctrl_panel_text}>Light Status: </Text>
              <Text style={styles.ctrl_panel_text_unbolded}>{topSchedulingLightEnabled ? 'ON' : 'OFF'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.ctrl_panel_text}>Light Switches in: </Text>
            <Text style={styles.ctrl_panel_text_unbolded}>{topSchedulingLightTimerHrs} Hrs {topSchedulingLightTimerMins} Mins</Text>
            </View>

            
            <Text style={styles.ctrl_panel_text}>Scheduled Light ON Every: </Text>
            <Text style={styles.ctrl_panel_text_unbolded}>{topSchedulingLightRefOnHrs} Hrs {topSchedulingLightRefOnMins} Mins</Text>
            

            
            <Text style={styles.ctrl_panel_text}>Scheduled Light OFF Every: </Text>
            <Text style={styles.ctrl_panel_text_unbolded}>{topSchedulingLightRefOffHrs} Hrs {topSchedulingLightRefOffMins} Mins</Text>
            
            </View>

           




           

            <Text style={styles.ctrl_panel_text}>Target Temperature</Text>
      

            <Text style={styles.ml_text}>{targetTemp}°F</Text>
    
            
            
            
            </View>
          )}
          {topMode == "scheduling" && (
             
    
             <View style={styles.man_mode_ctrl_panel}>
             <Text style={styles.dark_green_text}>Current Light Scheduling </Text>
             <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff4e9',
                 borderColor: "#6b5a48",
                 borderRadius: 15,
                 borderWidth: 2,
                 paddingTop: 5,
                 paddingBottom: 5,
                 paddingHorizontal: 5,
                 marginTop: 5,
                 marginBottom: 20, }}>
           <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
             <Text style={styles.ctrl_panel_text}>Light Status: </Text>
             <Text style={styles.ctrl_panel_text_unbolded}>{topSchedulingLightEnabled ? 'ON' : 'OFF'}</Text>
           </View>
           <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
           <Text style={styles.ctrl_panel_text}>Light Switches in: </Text>
           <Text style={styles.ctrl_panel_text_unbolded}>{topSchedulingLightTimerHrs} Hrs {topSchedulingLightTimerMins} Mins</Text>
           </View>

           
           <Text style={styles.ctrl_panel_text}>Scheduled Light ON Every: </Text>
           <Text style={styles.ctrl_panel_text_unbolded}>{topSchedulingLightRefOnHrs} Hrs {topSchedulingLightRefOnMins} Mins</Text>
           

           
           <Text style={styles.ctrl_panel_text}>Scheduled Light OFF Every: </Text>
           <Text style={styles.ctrl_panel_text_unbolded}>{topSchedulingLightRefOffHrs} Hrs {topSchedulingLightRefOffMins} Mins</Text>
           
           </View>

           <Text style={styles.dark_green_text}>New Light Scheduling </Text>
           <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff4e9',
                 borderColor: "#6b5a48",
                 borderRadius: 15,
                 borderWidth: 2,
                 paddingTop: 5,
                 paddingBottom: 5,
                 paddingHorizontal: 2,
                 marginTop: 5,
                 marginBottom: 20,
                 width: '80%' }}>
                 
                 <Text style={styles.ctrl_panel_text}>Light ON Schedule</Text>

                 <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

           <TextInput
             style={styles.textInput2}
             value={newSchedulingLightRefOnHrs}
             onChangeText={setnewSchedulingLightRefOnHrs}
             keyboardType="numeric"
           />
           <Text style={styles.ml_text}>Hrs</Text>
           <TextInput
             style={styles.textInput2}
             value={newSchedulingLightRefOnMins}
             onChangeText={setnewSchedulingLightRefOnMins}
             keyboardType="numeric"
           />
           <Text style={styles.ml_text}>Mins</Text>
                 </View>
                 <Text style={styles.ctrl_panel_text}>Light OFF Schedule</Text>
                 <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

           <TextInput
             style={styles.textInput2}
             value={newSchedulingLightRefOffHrs}
             onChangeText={setnewSchedulingLightRefOffHrs}
             keyboardType="numeric"
           />
           <Text style={styles.ml_text}>Hrs</Text>
           <TextInput
             style={styles.textInput2}
             value={newSchedulingLightRefOffMins}
             onChangeText={setnewSchedulingLightRefOffMins}
             keyboardType="numeric"
           />
           <Text style={styles.ml_text}>Mins</Text>
                 </View>
                 <TouchableOpacity style={styles.touchable_scheduling} onPress={NewLightSchedulingPress}>
             <Text style={styles.water_button_text}>Set New Schedule</Text>
           </TouchableOpacity>
                 </View>   


           
                 <Text style={styles.dark_green_text}>Current Water Scheduling </Text>
           <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff4e9',
                 borderColor: "#6b5a48",
                 borderRadius: 15,
                 borderWidth: 2,
                 paddingTop: 5,
                 paddingBottom: 5,
                 paddingHorizontal: 2,
                 marginTop: 5,
                 marginBottom: 20}}>

                   <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
             <Text style={styles.ctrl_panel_text}>Watering Amount: </Text>
             <Text style={styles.ctrl_panel_text_unbolded}>{topSchedulingWaterRefAmount}</Text>
           </View>
           <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
           <Text style={styles.ctrl_panel_text}>Water Deploys in: </Text>
           <Text style={styles.ctrl_panel_text_unbolded}>{topSchedulingWaterTimerDays} Days {topSchedulingWaterTimerHrs} Hrs {topSchedulingWaterTimerMins} Mins</Text>
           </View>
           
           <Text style={styles.ctrl_panel_text}>Scheduled Water Every: </Text>
           <Text style={styles.ctrl_panel_text_unbolded}>{topSchedulingWaterRefDays} Days {topSchedulingWaterRefHrs} Hrs {topSchedulingWaterRefMins} Mins</Text>

                   </View>


                   <Text style={styles.dark_green_text}>New Water Scheduling </Text>
           <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff4e9',
                 borderColor: "#6b5a48",
                 borderRadius: 15,
                 borderWidth: 2,
                 paddingTop: 5,
                 paddingBottom: 5,
                 paddingHorizontal: 2,
                 marginTop: 5,
                 marginBottom: 20,
                 width: '90%' }}>
                 
                 <Text style={styles.ctrl_panel_text}>Watering Amount</Text>

                 <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                 <TextInput
             style={styles.textInput1}
             value={newmanualBotWaterAmt}
             onChangeText={setnewManualBotWaterAmt}
             keyboardType="numeric"
           />
           <Text style={styles.ml_text}>secs   (1 sec = 15mL)</Text>
                 </View>
                 <Text style={styles.ctrl_panel_text}>Water Schedule</Text>
                 <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

           <TextInput
             style={styles.textInput3}
             value={newSchedulingWaterRefDays}
             onChangeText={setnewSchedulingWaterRefDays}
             keyboardType="numeric"
           />
           <Text style={styles.ml_text}>Days</Text>
           <TextInput
             style={styles.textInput3}
             value={newSchedulingWaterRefHrs}
             onChangeText={setnewSchedulingWaterRefHrs}
             keyboardType="numeric"
           />
           <Text style={styles.ml_text}>Hrs</Text>
           <TextInput
             style={styles.textInput3}
             value={newSchedulingWaterRefMins}
             onChangeText={setnewSchedulingWaterRefMins}
             keyboardType="numeric"
           />
           <Text style={styles.ml_text}>Mins</Text>
                 </View>
                 <TouchableOpacity style={styles.touchable_scheduling} onPress={NewWaterSchedulingPress}>
             <Text style={styles.water_button_text}>Set New Schedule</Text>
           </TouchableOpacity>
                 </View>  

           <Text style={styles.ctrl_panel_text}>Set Temperature</Text>
           <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
           <TextInput
             style={styles.textInput1}
             value={targetTemp}
             onChangeText={setTargetTemp}
             keyboardType="numeric"
           />
           <Text style={styles.ml_text}>°F</Text>
           </View>
           
           
           <TouchableOpacity style={styles.touchable_scheduling} onPress={TargetTemperaturePress}>
             <Text style={styles.water_button_text}>Set Target</Text>
           </TouchableOpacity>
           
           </View>

          )}
        <TouchableOpacity style={styles.touchable_bigger} onPress={ChooseNewTopModePress}>
              <Text style={styles.water_button_text}>Set New Mode</Text>
            </TouchableOpacity>
        </ScrollView>
      );
    }
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

export default ModeInfoScreen;