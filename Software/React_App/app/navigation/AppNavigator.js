// src/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import StartScreen from '../screens/Start';
import BasicStatusScreen from '../screens/BasicStatus';
import InitializationScreen from '../screens/Initialization';
import ModeInfoScreen from '../screens/more_info/ModeInfo';
import PlantInfoScreen from '../screens/more_info/PlantInfo';
import HealthInfoScreen from '../screens/more_info/HealthInfo';
import ChooseModeScreen from '../screens/ChooseMode';
import ConfigSchedulingScreen from '../screens/ConfigScheduling';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Create a Stack Navigator
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const TabNavigator = ({ route }) => {
  const { tab_data } = route.params || {};
  const navigation = useNavigation();
    return (
      <Tab.Navigator initialRouteName='Mode Info'>
        <Tab.Screen name="Mode Info" component={ModeInfoScreen} initialParams={{ tab_data }} 
        options={{ 
          headerStyle: {backgroundColor: "#879183"}, 
          headerTitleAlign: 'center',
          headerTintColor: '#fff4e9', 
          headerLeft: () => (
            <TouchableOpacity 
            onPress={() => navigation.navigate('BasicStatus')} 
            style={{ alignItems: "center", flexDirection: "row", justifyContent: "center", paddingHorizontal: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff4e9" />
            <Text style={{ marginLeft: 2, color: "#fff4e9", marginTop: -3, fontSize: 16 }}>Return to Basic Status</Text>
          </TouchableOpacity>
          )
          }} />
        <Tab.Screen name="PlantInfo" component={PlantInfoScreen} initialParams={{ tab_data }} options={{ 
          headerStyle: {backgroundColor: "#879183"}, 
          headerTitleAlign: 'center',
          headerTintColor: '#fff4e9', 
          headerLeft: () => (
            <TouchableOpacity 
            onPress={() => navigation.navigate('BasicStatus')} 
            style={{ alignItems: "center", flexDirection: "row", justifyContent: "center", paddingHorizontal: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff4e9" />
            <Text style={{ marginLeft: 2, color: "#fff4e9", marginTop: -3, fontSize: 16 }}>Return to Basic Status</Text>
          </TouchableOpacity>
          )
          }} />
          <Tab.Screen name="Health Info" component={HealthInfoScreen} initialParams={{ tab_data }} options={{ 
          headerStyle: {backgroundColor: "#879183"}, 
          headerTitleAlign: 'center',
          headerTintColor: '#fff4e9', 
          headerLeft: () => (
            <TouchableOpacity 
            onPress={() => navigation.navigate('BasicStatus')} 
            style={{ alignItems: "center", flexDirection: "row", justifyContent: "center", paddingHorizontal: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff4e9" />
            <Text style={{ marginLeft: 2, color: "#fff4e9", marginTop: -3, fontSize: 16 }}>Return to Basic Status</Text>
          </TouchableOpacity>
          )
          }} />
      </Tab.Navigator>
    );
  };

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Start">
      <Stack.Screen name="Start" component={StartScreen} options={{headerShown: false}} />
      <Stack.Screen name="BasicStatus" component={BasicStatusScreen} options={{headerShown: false}} />
      <Stack.Screen name="Initialization" component={InitializationScreen} options={{headerShown: false}} />
      <Stack.Screen name="More_Info" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="ChooseMode" component={ChooseModeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ConfigScheduling" component={ConfigSchedulingScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;