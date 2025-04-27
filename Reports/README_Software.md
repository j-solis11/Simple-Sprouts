# Simple Sprouts — Software Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Software Module Overviews](#software-module-overviews)
  - [Sensor & Actuator Control (Raspberry Pi)](#sensor--actuator-control-raspberry-pi)
  - [LLM-Based Adaptive Control (Raspberry Pi)](#llm-based-adaptive-control-raspberry-pi)
  - [Mobile App Interface (React Native / Expo)](#mobile-app-interface-react-native--expo)
- [System Architecture and Flow Chart](#system-architecture-and-flow-chart)
- [Development and Build Tools](#development-and-build-tools)
- [Installation and Setup Instructions](#installation-and-setup-instructions)
- [Operation Instructions](#operation-instructions)
- [Troubleshooting and Known Issues](#troubleshooting-and-known-issues)
- [Future Work](#future-work)

---

## Software Module Overviews

### Sensor & Actuator Control (Raspberry Pi)

**Location:** `/rpi_control/`  

<SOURAV>

**Main components:**

# scripts
<SOURAV>

**Technologies used:**
- Python 3.11
- GPIO Zero
- Flask 3.0
- SQLite3

---

### LLM-Based Adaptive Control (Raspberry Pi)

**Location:** `/Model_Code/`

This module adapts system behavior based on real-time environmental data using lightweight machine learning models.

**Main components:**
`/Model_Code/Camera_noIr.py`
`/Model_Code/image_retrival.py`

**Technologies used:**
<SOURAV>
---

### Mobile App Interface (React Native / Expo)

**Location:** `/mobile_app/`

The mobile app provides a user interface for:
- Viewing real-time sensor data
- Managing manual watering and lighting schedules
- Switching between manual and adaptive modes
- Viewing historical trends in environmental parameters

**Main components:**


**Technologies used:**


---

## System Architecture and Flow Chart

**System Data Flow Overview:**



---

## Development and Build Tools

---

## Installation and Setup Instructions

### Raspberry Pi Setup

1. **Flash Raspberry Pi OS:**
   - Install Raspberry Pi OS Bookworm Lite (64-bit).

2. **Install Required Packages:**
 
     ```

---

### Mobile App Setup

1. **Install Node.js and Expo CLI:**
   ```bash
   sudo apt install nodejs npm
   npm install -g expo-cli
   ```

2. **Install App Dependencies:**

---

## Operation Instructions

### Manual Mode
- Set watering/lighting/temperature schedules

### Adaptive Mode

---

## Troubleshooting and Known Issues

| Issue                             | Cause                                | Solution                           |
|-----------------------------------|--------------------------------------|------------------------------------|

---

## Future Work



---
# End of README_SOFTWARE.md
