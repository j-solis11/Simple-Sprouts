# Simple Sprouts - Software Documentation

![Software Architecture](https://github.com/j-solis11/Simple-Sprouts/raw/main/assets/software_architecture.png)

## Software Overview

The Simple Sprouts software stack consists of several interconnected components that enable autonomous plant monitoring, automated environment control, and a user-friendly web interface. The system is primarily built around a Raspberry Pi 5 running Python scripts that interface with sensors and actuators, with data exchanged via Firebase to a React Native Expo web/mobile application.

## Software Architecture and Modules

### Core Software Modules

#### Sensing Module (`sensing.py`)
- **Purpose**: Reads data from all environmental and soil sensors
- **Dependencies**: Adafruit libraries for I2C sensors, Firebase Admin SDK
- **Update Rate**: 2-second intervals for real-time monitoring
- **Data Flow**: Sensor → GPIO/I2C → Python → Firebase → Web App

#### Automation Module (`automation.py`)
- **Purpose**: Controls all system actuators based on operating mode
- **Dependencies**: gpiod, gpiozero, Firebase Admin SDK
- **Operating Modes**: Manual, Scheduled, and Adaptive
- **Components Controlled**: Water pump, solenoid valves, grow lights, heater
- **Data Flow**: Firebase → Python → GPIO → MOSFET → Actuator

#### Camera Module (`Camera_noIR.py`)
- **Purpose**: Captures plant images and generates NDVI analysis
- **Dependencies**: PiCamera, OpenCV, numpy, Firebase Admin SDK
- **Image Processing**: Standard and NDVI (Normalized Difference Vegetation Index)
- **Data Flow**: NoIR Camera → Python → Base64 Encoding → Firebase → Web App

#### AI Module (`image_retrival.py`)
- **Purpose**: Analyzes plant health and responds to user queries
- **Dependencies**: MoonDream Cloud API, Firebase Admin SDK
- **Features**: Automated health assessment, custom query handling
- **Data Flow**: Firebase → Python → MoonDream Cloud API → Firebase → Web App

#### Web/Mobile App (React Native Expo)
- **Purpose**: User interface for system control and monitoring
- **Dependencies**: React Native, Expo, Firebase JS SDK
- **Features**: Real-time sensor visualization, control mode selection, plant health reports
- **Data Flow**: User Input → Firebase → Python Scripts → System Response

## Software Dependencies and Versions

| Component | Version | Notes |
|-----------|---------|-------|
| Python | 3.11.2 | Core language for Raspberry Pi scripts |
| Firebase Admin SDK | 6.2.0 | Python library for Firebase integration |
| Adafruit CircuitPython | 8.2.9 | Library for sensor communication |
| PiCamera | 1.13 | Camera interface library |
| OpenCV | 4.8.0 | Image processing library |
| Node.js | 18.16.0 | Required for React Native development |
| React Native | 0.72.6 | Mobile/web application framework |
| Expo | 49.0.0 | React Native development platform |
| Firebase JS SDK | 10.1.0 | JavaScript library for Firebase integration |
| MoonDream Cloud API | 1.0.0 | AI model API for plant analysis |

## Flow Diagram
