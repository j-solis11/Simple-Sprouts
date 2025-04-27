Simple Sprouts - Engineering Addendum
Welcome to the Simple Sprouts project repository!
This document serves as a quick-start guide and engineering addendum for any future teams continuing development of this project.

Project Overview
Simple Sprouts is a smart vertical farming system designed to automate the care of edible plants through environmental sensing, adaptive irrigation, lighting control, and AI-based plant health monitoring.

Key system features include:

Dual-tier grow environment

Soil moisture, temperature, humidity, air quality, and water level sensing

Adaptive watering and lighting control modes

Mobile/web app dashboard (React Native Expo) for control and monitoring

AI-based health analysis via NoIR cameras and NDVI processing

Real-time cloud synchronization with Firebase

Fully integrated custom PCB with MOSFET control

The system uses a Raspberry Pi 5 as the main controller and is powered by a centralized 24V DC supply with regulated 12V and 5V branches.

Quick-Start Guide
Hardware Setup
Place the enclosure on a stable, flat surface.

Fill the water reservoir with clean water.

Connect the 24V DC power adapter to the main PCB input.

Ensure a stable Wi-Fi connection for cloud communication.

Power on the Raspberry Pi and ensure the scripts auto-run (or start manually).

Software Setup
Install Node.js and pull the Simple-Sprouts GitHub repository.

Navigate to the app/ folder and run:

bash
Copy
Edit
npm install expo
npx expo start --tunnel
Update the Firebase API key inside assets/config/firebaseConfig.js.

Use Expo Go app on a mobile device or web browser to access the dashboard.

Sensor and automation scripts should auto-start, but can be run manually if needed:

bash
Copy
Edit
python3 sensing.py
python3 automation.py
python3 camera.py
python3 model_query.py
Current System Status (April 2025)

Subsystem	Status	Notes
PCB Assembly	✅	Fully functional
Sensors (soil, temp, humidity, air)	✅	Calibrated and integrated
Watering system	✅	Dual solenoid valves, diaphragm pump
Grow lights	✅	12V LED strips, MOSFET-controlled
Ultrasonic water level sensor	✅	Working with real-time updates
Peltier heating	✅	Maintains ~75°F inside enclosure
Raspberry Pi 5	✅	Handles computation and communication
Mobile/Web App	✅	Tested with Expo, Firebase backend
AI Image Analysis	✅	NDVI generation and MoonDream API integration
Lessons Learned / Gotchas
Wi-Fi Dependency: System operation heavily depends on Wi-Fi for Firebase communication. Use strong 2.4 GHz network for best reliability.

Power Supply Selection: Only use properly regulated 24V, 3A+ adapters. Unregulated or underpowered supplies cause erratic sensor behavior and actuator failures.

Sensor Conflicts: When using multiple I2C sensors, verify different addresses and use level-shifters if switching to alternate microcontrollers.

Water Protection: Always check water tubing and solenoid valve connections. Even minor leaks can risk the electronics despite the divider wall.

Camera Stability: The NoIR cameras are sensitive to movement. Secure mounts firmly to maintain image quality for NDVI processing.

Firebase Sync Timing: Be mindful of database read/write intervals to avoid overwhelming free-tier limits or causing synchronization lags.

Heat Management: Ensure that the Peltier cooling fan remains unobstructed, especially in hot ambient conditions (>85°F).

LLM Queries: MoonDream AI queries work best when images are properly exposed under grow lights. Avoid triggering health scans in darkness.

Future Improvements (Suggested)
Offload AI: Fully migrate plant health inference to the cloud to remove dependency on Raspberry Pi’s limited processing power.

Frame Redesign: Simplify enclosure structure for lighter weight and reduced manufacturing cost.

Dedicated Mobile App: Migrate away from Expo Go to a standalone built mobile app for faster interaction.

Backup Local Control: Implement a local fallback mode in case of Wi-Fi/Firebase failure.

Custom AI Model: Train and host a dedicated plant health model for better reliability and to reduce dependence on external APIs.

Repository Organization
bash
Copy
Edit
/hardware/
    - PCB files, schematics, BOM
/software/
    - Automation, sensing, camera, and model scripts
/app/
    - React Native Expo mobile/web app
User Manual.pdf
README.md (Engineering Addendum)
README_HARDWARE.md
README_SOFTWARE.md
Team Members
Jared Solis (Hardware, App Development)

Sourav Shib (Automation Software, Firebase Integration)

Arthur Hua (Camera System, Plant Health AI)

Dilhara DeSilva (Electrical Integration, Hardware Safety)

Alex Muntean (Enclosure Design, PCB Assembly)

Final Notes
Simple Sprouts is fully operational as of April 2025 and has been validated across all intended functions.
This repository contains everything needed to replicate, maintain, and extend the system.

If you are picking up this project, we strongly recommend reading through:

The User Manual

The README_HARDWARE.md and README_SOFTWARE.md

Reviewing the Firebase database structure

Physically inspecting all plumbing and wiring before operation.

Good luck, and happy growing! 🌱
