# Simple Sprouts - Software Documentation

![Software Architecture](https://github.com/j-solis11/Simple-Sprouts/raw/main/assets/software_architecture.png)

## Software Overview

The Simple Sprouts software stack consists of several interconnected components that enable autonomous plant monitoring, automated environment control, and a user-friendly web interface. The system is primarily built around a Raspberry Pi 5 running Python scripts that interface with sensors and actuators, with data exchanged via Firebase to a React Native Expo web/mobile application.

## Software Architecture and Modules

### Core Software Modules

---

#### Mobile App Interface (React Native / Expo)

**Location:** `/React_App`

The mobile app provides a user interface for:
- Viewing real-time sensor data
- Switching   
- Managing manual watering and lighting schedules
- Switching between manual and adaptive modes
- Viewing historical trends in environmental parameters

**Main components:**
- `app/navigation/AppNavigator.js`: 
   - Allows navigation between different screens in the app
   - Configures Tab screen for transitions between Mode Info, Health Info, and Plant Info screens
- `app/services/firebaseServices.tsx`: 
   - Allows communication to Firebase to connect to modules on Raspberry Pi 5
- `app/screens/BasicStatus.tsx`: 
   - Opening screen for the UI 
   - Allows user to see the status of each plant level or reinitialize a new plant
- `app/screens/more_info/ModeInfo.tsx`: 
   - Allows the user to see information pertinent to each mode, i.e. time till next schedule for Scheduling Mode
   - Initializes mode switching
- `app/screens/more_info/HealthInfo.tsx`: 
   - Allows the user to view Plant Health Analysis, which shows LLM results to queries that highlight health
   - Communicates with LLM to allow the user to query the model directly
- `app/screens/more_info/PlantInfo.tsx`: 
   - Displays current and historical sensor information

**Technologies used:**
- React Native Expo 0.22.15
- Expo Go SDK 52

---

---

#### Sensing Script (Python / Raspberry Pi)

**Location:** `/Sensing_Actuation_Code`

**Main components:**
- `app/navigation/AppNavigator.js`: 
   - Allows navigation between different screens in the app
   - Configures Tab screen for transitions between Mode Info, Health Info, and Plant Info screens
- `app/services/firebaseServices.tsx`: 
   - Allows communication to Firebase to connect to modules on Raspberry Pi 5
- `app/screens/BasicStatus.tsx`: 
   - Opening screen for the UI in which 
- `app/screens/BasicStatus.tsx`: 


**Technologies used:**


---

#### Model and camera code

**Location:** `/Model_Code`

The camera and model code:
- Takes routine images of the plants
- Processes the images into NVDI images to aid in assessing plant health   
- Sends images up to firebase to be displayed on the web app
- Stores images locally to be passes to model
- Model assess plant health and qualifications to be planted within the planter box
- Model also gives recommendations and schedules on how to take care of plants

**Main components:**
- `Model_Code/Camera_noIR.py`: 
   - Takes pictures of the plants and processes them then sends to firebase
- `Model_Code/image_retrival.py`: 
   - Waits for prompts from teh web app to query model


**Technologies used:**
- NoIR camera
- MoonDream cloud API
- Firebase API
- OpenCv



## Software Dependencies and Versions
- React Native Expo 0.22.15
- Expo Go SDK 52

## Flow Diagram
<img width="654" alt="image" src="https://github.com/user-attachments/assets/58f69fa5-42ff-46d7-ba53-65d0736ff3a9" />


