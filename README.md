# Simple Sprouts - Smart Vertical Farming System

<img width="407" alt="image" src="https://github.com/user-attachments/assets/442f44fd-c66f-480e-8735-e83bc1084b3e" />


## Quick Start Guide

Simple Sprouts is an autonomous vertical farming system designed for compact urban environments like university campuses and restaurants.
The system integrates smart sensing, adaptive watering and lighting, and AI-based plant health monitoring to enable users to grow plants
Indoors with minimal intervention.

### Project Overview

- **Build Status**: Completed and functional (April 2025)
- **Core Components**: Raspberry Pi 5, Custom PCB, Dual-Tier irrigation, Grow lights, Peltier temperature module, NoIR cameras
- **Key Features**: Three operation modes (Manual, Scheduled, Adaptive), AI plant health monitoring, Web-based user interface
- **Project Team**: Boston University ECE Senior Design Team 26 (Spring 2025)

## Getting Started

### Prerequisites
- Raspberry Pi 5 with microSD card (16 GB+ recommended)
- 24V DC power supply (3A minimum)
- WiFi connection for Firebase access
- React Native Expo for mobile/web interface
- Plant material and growing medium

### Initial Setup
1. Connect the 24V power supply to the system
2. Fill the water tank to the marked level
3. Connect to WiFi and ensure Firebase connectivity
4. Open the web app following the installation instructions in the Software README
5. Initialize plant settings through the app interface
6. Add growing medium and plant material to the containers

### Current Hardware State

- PCB: Fully functional, successfully powering all components through MOSFET switching.
- Power: Stable across all voltage rails (24V input, 12V and 5V regulated buses).
- Irrigation: Pump and solenoid valves reliably operate under manual, scheduled, and adaptive modes.
- Sensing: Soil moisture, temperature/humidity, air quality, and water tank level sensors provide live data.
- Heating: Peltier module + fan assembly actively regulates internal enclosure temperature.
- Enclosure: Sturdy, functional, and water-safe with protective barriers installed.
- Dashboard/Control: Hardware successfully communicates sensor and actuator states via Firebase and web app.

## Critical Lessons Learned

### PCB Design and Assembly
- Footprint Accuracy: Double-check footprints for all parts, especially connectors and larger diodes.
- Part Availability: Use components from suppliers that support automated assembly.
- Clear Labeling: Label all terminal blocks and GPIO pinouts.
- Flyback Protection: Always include flyback diodes across inductive loads, even as a just-in-case.

### Power System
- Oversize Power Supplies: Choose power supplies with 25–50% more headroom.
- Separate High/Low Power Paths: Keep high-current and sensitive signal paths isolated.

### Mechanical Assembly
- Splash Protection: Physical separation between water and electronics is critical.
- Wire Management: Use cable sleeves and zip ties to prevent mechanical stress.

### Testing and Validation
- System-Level Testing: Validate subsystems individually before full integration.
- Sensor Calibration: Calibrate sensors in the actual environment.

### Documentation
- Maintain detailed wiring diagrams from the beginning.

## Known Issues & Gotchas
- Sensor Drift: Soil moisture sensors may drift over time and require recalibration.
- Minor Leakage Possible: Valves tend to leak after overuse. Not used enough usually to reach this stage.

## Recommendations for Future Improvements
- Integrated load sensing for real-time diagnostics.
- Upgrade water tank sensing to more reliable float sensors.
- Add battery backup or solar integration for off-grid use.
- Get better-fitted valve fittings to combat leakage. 

## Current State and Future Development

### Current Implementation
- Fully functional Manual, Scheduled, and Adaptive modes.
- Full web-based control and monitoring.
- NDVI-based plant health monitoring.
- Real-time sensor logging via Firebase.

### Potential Future Development
- Cost-reduction through lower-cost microcontrollers.
- Local AI model deployment to reduce cloud dependency.
- Enhanced environmental control, i.e., humidity and CO2 control
- Expansion to multiple-layered growth systems.
- Integrating multiple users in the same household

### Critical Information for Future Teams

1. **Power Distribution**
   - The system uses a 24V DC supply stepped down to 12V and 5V. Always check voltage levels before connecting new components.
   - The custom PCB has MOSFETs controlling high-current devices. Be cautious when modifying connections to prevent damage.

2. **Irrigation System**
   - Water tube connections at the solenoid valves are pressure-fit and may need occasional reseating.
   - The water pump is rated for 12V but operates efficiently at 9- 15V. The current PCB provides ~12V to the pump.
   - **IMPORTANT**: Always maintain physical separation between water and electronic components.

3. **Software Dependencies**
   - Firebase integration requires proper API keys. See the Software README for setup details.
   - The MoonDream Cloud API has a free tier that may limit daily queries for plant health analysis.
   - React Native Expo dependency versions are critical - see package.json for specific versions.

4. **Sensor Calibration**
   - Soil moisture sensors are factory calibrated but may need recalibration for different soil types.
   - Typical moisture readings: 400-600 (very dry), 600-900 (ideal range), 900+ (overly wet)
   - Temperature sensors have ±1°C tolerance - cross-reference with ambient sensors if precision is required.

5. **Camera Setup**
   - NoIR cameras must be positioned at specific angles for proper plant assessment. Use the 3D-printed mounts.
   - The NDVI analysis uses specific thresholds for plant health determination - see model.py for details.

## Repository Structure

- `/Hardware` - PCB design files, component specifications, and hardware documentation
- `/Software` - Control scripts, web application code, and software implementation details
- `/Assets` - Images, diagrams, and supplementary files
- `/Documentation` - User manual, test plans, and additional project documentation

## Original Team Members

- Jared Solis (jared11@bu.edu)
- Sourav Shib (shib0826@bu.edu)
- Arthur Hua (ahua102@bu.edu)
- Dilhara DeSilva (dilharad@bu.edu)
- Alex Muntean (munteana@bu.edu)

## Conclusion

Simple Sprouts is a fully functioning prototype that brings together embedded systems, smart sensing,
adaptive control, and sustainable agriculture. Moving forward, careful attention to hardware reliability,
documentation quality, and iterative improvements will allow future teams to scale, enhance, and adapt the
platform to even greater applications.

*Boston University Electrical & Computer Engineering*  
*EC 464 Senior Design - Spring 2025*

---

For detailed hardware specifications, see [Hardware README](Hardware/README_HARDWARE.md)  
For software setup and details, see [Software README](Software/readme.md)
