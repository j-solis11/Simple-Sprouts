# Simple Sprouts - Smart Vertical Farming System

<img width="407" alt="image" src="https://github.com/user-attachments/assets/442f44fd-c66f-480e-8735-e83bc1084b3e" />


## Quick Start Guide

Simple Sprouts is an autonomous vertical farming system designed for compact urban environments like university campuses and restaurants. The system integrates smart sensing, adaptive watering and lighting, and AI-based plant health monitoring to enable users to grow plants indoors with minimal intervention.

### Project Overview

- **Build Status**: Completed and functional (April 2025)
- **Core Components**: Raspberry Pi 5, Custom PCB, Dual-tier irrigation, Grow lights, Peltier temperature module, NoIR cameras
- **Key Features**: Three operation modes (Manual, Scheduled, Adaptive), AI plant health monitoring, Web-based user interface
- **Project Team**: Boston University ECE Senior Design Team 26 (Spring 2025)

## 🚀 Getting Started

### Prerequisites
- Raspberry Pi 5 with microSD card (16GB+ recommended)
- 24V DC power supply (3A minimum)
- WiFi connection for Firebase access
- React Native Expo for mobile/web interface
- Plant material and growing medium

### Initial Setup
1. Connect the 24V power supply to the system
2. Fill the water tank to the marked level
3. Connect to WiFi and ensure Firebase connectivity
4. Open the web app following installation instructions in the Software README
5. Initialize plant settings through the app interface
6. Add growing medium and plant material to the containers

## ⚠️ Known Issues & Gotchas

### Critical Information for Future Teams

1. **Power Distribution**
   - The system uses a 24V DC supply stepped down to 12V and 5V. Always check voltage levels before connecting new components.
   - The custom PCB has MOSFETs controlling high-current devices. Be cautious when modifying connections to prevent damage.

2. **Irrigation System**
   - Water tube connections at the solenoid valves are pressure-fit and may need occasional reseating.
   - The water pump is rated for 12V but operates efficiently at 9-15V. Current PCB provides ~12V to the pump.
   - **IMPORTANT**: Always maintain physical separation between water and electronic components.

3. **Software Dependencies**
   - Firebase integration requires proper API keys. See Software README for setup details.
   - The MoonDream Cloud API has a free tier that may limit daily queries for plant health analysis.
   - React Native Expo dependency versions are critical - see package.json for specific versions.

4. **Sensor Calibration**
   - Soil moisture sensors are factory calibrated but may need recalibration for different soil types.
   - Typical moisture readings: 400-600 (very dry), 600-900 (ideal range), 900+ (overly wet)
   - Temperature sensors have ±1°C tolerance - cross-reference with ambient sensors if precision is required.

5. **Camera Setup**
   - NoIR cameras must be positioned at specific angles for proper plant assessment. Use the 3D-printed mounts.
   - The NDVI analysis uses specific thresholds for plant health determination - see model.py for details.

## 🔧 Current State & Future Development

### Current Implementation
- All three control modes are fully functional (Manual, Scheduled, Adaptive)
- Web application provides full control and monitoring capabilities
- AI plant health assessment with NDVI analysis is operational
- Temperature control via Peltier module maintains growing environment
- Firebase integration allows real-time data monitoring and remote control

### Potential Improvements
- Replace Raspberry Pi 5 with less expensive microcontroller for cost reduction
- Implement local AI model to reduce cloud dependency
- Add humidity control for better environmental management
- Integrate multiple plant types with specific care requirements
- Expand to more than two growing layers using the same control infrastructure

## 📁 Repository Structure

- `/Hardware` - PCB design files, component specifications, and hardware documentation
- `/Software` - Control scripts, web application code, and software implementation details
- `/Assets` - Images, diagrams, and supplementary files
- `/Documentation` - User manual, test plans, and additional project documentation

## 👥 Original Team Members

- Jared Solis (jared11@bu.edu)
- Sourav Shib (shib0826@bu.edu)
- Arthur Hua (ahua102@bu.edu)
- Dilhara DeSilva (dilharad@bu.edu)
- Alex Muntean (munteana@bu.edu)

*Boston University Electrical & Computer Engineering*  
*EC 464 Senior Design - Spring 2025*

---

For detailed hardware specifications, see [Hardware README](Hardware/README_HARDWARE.md)  
For software setup and details, see [Software README](Software/README_SOFTWARE.md)
