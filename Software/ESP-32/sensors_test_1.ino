#include <Wire.h>
#include <Adafruit_AHTX0.h>
#include <Adafruit_PCT2075.h>
#include <Adafruit_SGP30.h>
#include "Adafruit_seesaw.h"

// Sensor objects
Adafruit_AHTX0 aht;
Adafruit_PCT2075 pct2075;
Adafruit_SGP30 sgp;
Adafruit_seesaw soilSensor;

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);

  // Initialize I2C
  Wire.begin();

  // Initialize AHT20
  if (!aht.begin()) {
    Serial.println("Failed to find AHT20 sensor!");
    while (1) delay(10);
  }
  Serial.println("AHT20 sensor initialized!");

  // Initialize PCT2075
  if (!pct2075.begin(0x37)) {  // Default I2C address for PCT2075
    Serial.println("Failed to find PCT2075 sensor!");
    while (1) delay(10);
  }
  Serial.println("PCT2075 sensor initialized!");

  // Initialize SGP30
  if (!sgp.begin()) {
    Serial.println("Failed to find SGP30 sensor!");
    while (1) delay(10);
  }
  Serial.println("SGP30 sensor initialized!");

  // Initialize SGP30 baseline
  Serial.println("Initializing SGP30 baseline...");
  if (!sgp.IAQinit()) {
    Serial.println("Failed to initialize IAQ baseline for SGP30!");
    while (1) delay(10);
  }

  // Initialize STEMMA Soil Sensor
  if (!soilSensor.begin(0x36)) {  // Default I2C address for soil sensor
    Serial.println("ERROR! STEMMA Soil Sensor not found!");
    while (1) delay(10);
  } else {
    Serial.print("STEMMA Soil Sensor started! version: ");
    Serial.println(soilSensor.getVersion(), HEX);
  }
}

void loop() {
  // Read AHT20 (Temperature and Humidity)
  sensors_event_t humidity, temp;
  aht.getEvent(&humidity, &temp);
  Serial.print("AHT20 Temperature: ");
  Serial.print(temp.temperature);
  Serial.println(" °C");
  Serial.print("AHT20 Humidity: ");
  Serial.print(humidity.relative_humidity);
  Serial.println(" %");

  // Read PCT2075 (Temperature)
  float pctTemp = pct2075.getTemperature();
  Serial.print("PCT2075 Temperature: ");
  Serial.print(pctTemp);
  Serial.println(" °C");

  // Read SGP30 (CO2 and VOC)
  if (sgp.IAQmeasure()) {
    Serial.print("SGP30 CO2: ");
    Serial.print(sgp.eCO2);
    Serial.println(" ppm");
    Serial.print("SGP30 TVOC: ");
    Serial.print(sgp.TVOC);
    Serial.println(" ppb");
  } else {
    Serial.println("SGP30 Measurement failed!");
  }

  // Read STEMMA Soil Sensor (Temperature and Capacitive Moisture)
  float soilTempC = soilSensor.getTemp();
  uint16_t capread = soilSensor.touchRead(0);
  Serial.print("Soil Sensor Temperature: ");
  Serial.print(soilTempC);
  Serial.println(" °C");
  Serial.print("Soil Moisture (Capacitive): ");
  Serial.println(capread);

  // Wait 2 seconds
  delay(2000);
}
