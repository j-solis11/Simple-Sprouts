//Sourav shib | shib0826@bu.edu
//This is the code for the first prototype. This code samples the four sensors connected to the esp32 every 5 seconds and depending on the data mode the user selected
//the program will send the data to the firebase database or simply print the values on to the serial monitor

//All the libraries for the sensors
#include <Wire.h>
#include <Adafruit_AHTX0.h>
#include <Adafruit_PCT2075.h>
#include <Adafruit_SGP30.h>
#include "Adafruit_seesaw.h"
#include <WiFi.h>
#include <HTTPClient.h>

// To use the sensors, we need to initialize an object for them using their repsective library
Adafruit_AHTX0 aht;
Adafruit_PCT2075 pct2075;
Adafruit_SGP30 sgp;
Adafruit_seesaw soilSensor;

// Wi-Fi and Firebase settings
const char* ssid = "BU Guest (unencrypted)";  // Replace with your Wi-Fi SSID
const char* firebase_host = "https://simple-sprouts-database-default-rtdb.firebaseio.com/";  // Replace with your Firebase Realtime Database URL

// To control the lofic to sending out data
bool sendData = false;

void setup() {
  Serial.begin(9600);
  while (!Serial) delay(10);

  // Connect to Wi-Fi
  WiFi.begin(ssid);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi!");

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
    Serial.print("STEMMA Soil Sensor started! Version: ");
    Serial.println(soilSensor.getVersion(), HEX);
  }

  Serial.println("\nType 'start' to begin sending data to Firebase.");
  Serial.println("Type 'stop' to stop sending data to Firebase.");
}

void sendToFirebase(float ahtTemp, float ahtHumidity, float pctTemp, uint16_t sgpCO2, uint16_t sgpTVOC, float soilTemp, uint16_t soilMoisture) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String jsonPayload = "{";
    jsonPayload += "\"AHT20_Temperature\":" + String(ahtTemp) + ",";
    jsonPayload += "\"AHT20_Humidity\":" + String(ahtHumidity) + ",";
    jsonPayload += "\"PCT2075_Temperature\":" + String(pctTemp) + ",";
    jsonPayload += "\"SGP30_CO2\":" + String(sgpCO2) + ",";
    jsonPayload += "\"SGP30_TVOC\":" + String(sgpTVOC) + ",";
    jsonPayload += "\"Soil_Temperature\":" + String(soilTemp) + ",";
    jsonPayload += "\"Soil_Moisture\":" + String(soilMoisture);
    jsonPayload += "}";

    // Make a post request to Firebase
    String url = String(firebase_host) + "/sensor_readings.json";  // Ensure '.json' is at the end
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonPayload);
    if (httpResponseCode > 0) {
      Serial.print("Firebase POST Response Code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Firebase POST Failed, Error: ");
      Serial.println(http.errorToString(httpResponseCode).c_str());
    }

    http.end();
  } else {
    Serial.println("Wi-Fi Disconnected! Cannot send data to Firebase.");
  }
}

void loop() {
  // Check for serial input to start or stop sending data to Firebase
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    input.trim();  // Remove any leading/trailing whitespace

    if (input.equalsIgnoreCase("start")) {
      sendData = true;
      Serial.println("Data sending to Firebase started.");
    } else if (input.equalsIgnoreCase("stop")) {
      sendData = false;
      Serial.println("Data sending to Firebase stopped.");
    }
  }

  // Read AHT20 (Temperature and Humidity)
  sensors_event_t humidity, temp;
  aht.getEvent(&humidity, &temp);
  float ahtTemp = temp.temperature;
  float ahtHumidity = humidity.relative_humidity;

  // Read PCT2075 (Temperature)
  float pctTemp = pct2075.getTemperature();

  // Read SGP30 (CO2 and VOC)
  uint16_t sgpCO2 = 0, sgpTVOC = 0;
  if (sgp.IAQmeasure()) {
    sgpCO2 = sgp.eCO2;
    sgpTVOC = sgp.TVOC;
  } else {
    Serial.println("SGP30 Measurement failed!");
  }

  // Read STEMMA Soil Sensor (Temperature and Capacitive Moisture)
  float soilTempC = soilSensor.getTemp();
  uint16_t capread = soilSensor.touchRead(0);

  // Log sensor data
  Serial.println("\nSensor Readings:");
  Serial.printf("AHT20 Temp: %.2f °C, Humidity: %.2f %%\n", ahtTemp, ahtHumidity);
  Serial.printf("PCT2075 Temp: %.2f °C\n", pctTemp);
  Serial.printf("SGP30 CO2: %d ppm, TVOC: %d ppb\n", sgpCO2, sgpTVOC);
  Serial.printf("Soil Temp: %.2f °C, Moisture: %d\n", soilTempC, capread);

  // If sendData is true, send data to Firebase
  if (sendData) {
    sendToFirebase(ahtTemp, ahtHumidity, pctTemp, sgpCO2, sgpTVOC, soilTempC, capread);
  }
  // Sample every 5 seconds
  // For testing, actual product will need to have different sample rates for different sensors
  delay(5000);
}
