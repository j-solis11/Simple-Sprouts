Overview

Simple Sprouts is an autonomous vertical farming system built around a custom-designed PCB, a Raspberry Pi 5 controller, and integrated environmental sensing and actuation. The system uses sensor feedback to manage irrigation, lighting, and temperature across a two-level enclosure. All design files, CAD models, schematics, and supporting documentation are included in the GitHub repository to allow future teams full access for reproduction or improvement.

This document serves as the complete hardware report, detailing schematics, PCB/CAD designs, Bill of Materials (BOM), datasheet references, power specifications, and physical system documentation.

1. Schematics, PCB, and CAD Diagrams

Schematic Files:

KiCad 8.0 project files (.sch) are located in /Hardware/Schematics/

PDF exports of full schematic diagrams are provided for easy reference.

PCB Layout Files:

Full KiCad PCB layout files (.kicad_pcb) included.

Gerber files for PCB fabrication provided in /Hardware/Gerbers/

PCB designed as a two-layer board with:

2mm traces for high-current paths

0.25mm traces for logic-level signals

Separate 12V and Ground planes

3D visualizations of PCB assembly available in /Hardware/Photos/

CAD Drawings:

Mechanical design built primarily from plywood and 1/8" acrylic panels.

Simple 2D CAD sketches (PDF) and final enclosure photographs provided in /Hardware/Photos/

2. Vendor Information and Bill of Materials (BOM)

PCB and Electrical Components:

PCB Fabrication & Assembly: JLCPCB (www.jlcpcb.com)

MOSFETs: Texas Instruments CSD18532Q5B

Terminal Blocks: Phoenix Contact 1751248 (C89122)

Flyback Diodes: SS510 Schottky Diodes (Microdiode)

Soil Moisture Sensors: Capacitive 3.0–5.5V sensors (generic vendors)

Temperature/Humidity Sensor: DHT22 (Adafruit)

Air Quality Sensor: MQ-135 (Adafruit)

Ultrasonic Distance Sensor: HC-SR04 (generic)

Water Pump: 12V diaphragm pump (SparkFun equivalent)

Solenoid Valves: 12V normally closed (Amazon)

Grow Lights: 12V white LED strips

Heating Unit: 12V Peltier Module + fan combo

DC-DC Converters: 24V-12V and 24V-5V buck converters (Pololu)

Power Supply: MeanWell GST60A24-P1J (24V, 2.5A output)

Mechanical Components:

1/8" Acrylic Panels (Amazon)

Plywood Sheets (Home Depot)

Push-to-connect irrigation fittings

1/4" Tubing (Home Depot)

M3 Screws and Nylon Standoffs

Complete BOM:

Located in /Hardware/BOM/SimpleSprouts_BOM.xlsx

Includes quantity, part number, description, supplier link.

3. References to Datasheets and Design Resources

MOSFET Datasheet: CSD18532Q5B

Flyback Diode Datasheet: SS510 Schottky Diode Datasheet

Phoenix Terminal Block Datasheet: 1751248 Datasheet

Soil Moisture Sensor: Capacitive Sensor General Guide

DHT22 Datasheet: DHT22 Humidity and Temperature Sensor

Peltier Module Datasheet: TEC1-12706 (available in /Hardware/References/)

MQ-135 Air Quality Sensor Datasheet: (available in /Hardware/References/)

All referenced datasheets are stored locally in /Hardware/References/ for offline use.

4. Power Requirements

Primary Power Source:

24V DC regulated supply rated at 3A (MeanWell GST60A24)

Voltage Rails:

24V Primary Input Rail

12V Step-down Rail (via DC-DC converter) for:

Water Pump

Solenoid Valves

LED Grow Lights

Peltier Heating Module

5V Step-down Rail (via DC-DC converter) for:

Raspberry Pi 5

All environmental sensors

Typical System Power Load:

Raspberry Pi 5: ~1.5A @ 5V

Water Pump: ~0.8A @ 12V (peak)

Solenoid Valves: ~0.25A each @ 12V

LED Grow Lights: ~0.5A total @ 12V

Peltier Module + Fan: ~2A @ 12V (peak)

Important Power Notes:

Confirm 5V and 12V outputs before wiring critical loads.

Avoid running pump and Peltier at full load simultaneously for long periods unless supply margin is verified.

5. System Photographs and Assembly Documentation

Photographs have been captured and placed in /Hardware/Photos/ showing:

PCB Top View (fully populated)

PCB Side View (showing component height and header stacking)

Full System Inside View (component wall and irrigation)

Close-up of Irrigation System and Water Tank

Cable Management and Tubing Routing

Finished Enclosure with Plants Installed

Notes on System Assembly:

Maintain splash protection by securing acrylic barrier.

Secure tubing with clamps and hot glue as needed.

Run 24V input wiring separately from sensor wiring to avoid noise.

Keep DC-DC converters in ventilated spaces inside the frame.

6. Additional Resources

KiCad Project Backup (/Hardware/Schematics/FullProjectBackup.zip)

Web links to component datasheets.

Assembly and Testing Guide (SimpleSprouts_SetupGuide.pdf).

Conclusion

The Simple Sprouts hardware platform is a fully operational, scalable, and well-documented embedded agricultural system. With modular design choices, strong documentation, and open project files, it is positioned for straightforward maintenance, upgrades, and future research use. By following careful engineering practices, future teams can continue to enhance its sustainability, expandability, and performance in smart agriculture applications.
