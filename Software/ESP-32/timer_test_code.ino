#include <Wire.h>
#include <Adafruit_AHTX0.h>
#include <Adafruit_PCT2075.h>
#include <Adafruit_SGP30.h>
#include "Adafruit_seesaw.h"
#include <WiFi.h>
#include <HTTPClient.h>

// To use the sensors, we need to initialize an object for them using their respective library
Adafruit_AHTX0 aht;
Adafruit_PCT2075 pct2075;
Adafruit_SGP30 sgp;
Adafruit_seesaw soilSensor;

// Wi-Fi and Firebase settings
const char* ssid = "BU Guest (unencrypted)";  // Replace with your Wi-Fi SSID
const char* firebase_host = "https://simple-sprouts-database-default-rtdb.firebaseio.com/";  // Root Firebase Realtime Database URL

// Control pins for the relays (lights and pump)
const int lightPin = 27;
const int pumpPin = 15;

// Global variables to store data from Firebase
int light_amount_seconds = 0;  // Light on duration in seconds
int light_interval_seconds = 0;  // Light off duration in seconds
int water_amount_seconds = 0;  // Pump on duration in seconds
int water_interval_seconds = 0;  // Pump off interval in seconds

// Global seconds counter
int secondsCounter = 0;  // Increment this every second

// Control logic variables for light and pump
//bool lightOn = true;
bool pumpOn = false;
int seconds = 0;
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

  // Set relay pins to LOW initially (lights off, pump off)
  pinMode(lightPin, OUTPUT);
  pinMode(pumpPin, OUTPUT);
  digitalWrite(lightPin, LOW);
  digitalWrite(pumpPin, LOW);

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

    String url = String(firebase_host) + "sensor_readings.json";  // Ensure '.json' is at the end
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.PUT(jsonPayload);  // Use PUT to update the existing entry
    if (httpResponseCode > 0) {
      Serial.print("Firebase PUT Response Code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Firebase PUT Failed, Error: ");
      Serial.println(http.errorToString(httpResponseCode).c_str());
    }

    http.end();
  } else {
    Serial.println("Wi-Fi Disconnected! Cannot send data to Firebase.");
  }
}

void readFirebaseData() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(String(firebase_host) + "test_light_pump.json");  // Concatenate using String()
    int httpResponseCode = http.GET();
    if (httpResponseCode == 200) {
      String payload = http.getString();
      Serial.println("Data from Firebase: ");
      Serial.println(payload);

      // Extract values from Firebase JSON response
      light_amount_seconds = getJsonValue(payload, "light_amount_hours") * 1000; // Convert to milliseconds (seconds)
      light_interval_seconds = getJsonValue(payload, "light_interval_hours") * 1000; // Convert to milliseconds (seconds)
      water_amount_seconds = getJsonValue(payload, "water_amount_ml"); // Already in seconds
      water_interval_seconds = getJsonValue(payload, "water_interval_hours") * 1000; // Convert to milliseconds (seconds)
    } else {
      Serial.print("HTTP Error: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
}

int getJsonValue(String json, String key) {
  int start = json.indexOf(key + "\":") + key.length() + 3;
  int end = json.indexOf(",", start);
  if (end == -1) {
    end = json.indexOf("}", start);
  }
  String value = json.substring(start, end);
  return value.toInt();
}

// Function to increment the seconds counter every second
void incrementSecondsCounter() {
  static unsigned long previousMillis = 0;
  unsigned long currentMillis = millis();
  
  // If 1000ms (1 second) has passed
  if (currentMillis - previousMillis >= 1000) {
    previousMillis = currentMillis;
    secondsCounter++;  // Increment the seconds counter
  }
}

// Function to control light and pump based on seconds counter
void controlLightAndPump() {

  // Light control based on light_amount_seconds and light_interval_seconds
  if (seconds < light_amount_seconds) {
    digitalWrite(lightPin, HIGH);
      //lightOn = true;
    }
  else {
      digitalWrite(lightPin, LOW);
      //lightOn = true;
    }
  

  // Pump control based on water_amount_seconds and water_interval_seconds
  if (seconds < water_amount_seconds) {
    digitalWrite(pumpPin, HIGH);
  }
  else {
    // Turn off pump for the specified time (in seconds)
    digitalWrite(pumpPin, LOW);
  }
}



void loop() {
  seconds = seconds + 1;
  // Read Firebase data and update global variables
  readFirebaseData();

  // Read sensor data
  sensors_event_t humidity, temp;
  aht.getEvent(&humidity, &temp);
  float ahtTemp = temp.temperature;
  float ahtHumidity = humidity.relative_humidity;
  float pctTemp = pct2075.getTemperature();
  uint16_t sgpCO2 = 0, sgpTVOC = 0;
  if (sgp.IAQmeasure()) {
    sgpCO2 = sgp.eCO2;
    sgpTVOC = sgp.TVOC;
  }
  float soilTempC = soilSensor.getTemp();
  uint16_t capread = soilSensor.touchRead(0);

  // Log sensor data
  Serial.println("\nSensor Readings:");
  Serial.printf("AHT20 Temp: %.2f °C, Humidity: %.2f %%\n", ahtTemp, ahtHumidity);
  Serial.printf("PCT2075 Temp: %.2f °C\n", pctTemp);
  Serial.printf("SGP30 CO2: %d ppm, TVOC: %d ppb\n", sgpCO2, sgpTVOC);
  Serial.printf("Soil Temp: %.2f °C, Moisture: %d\n", soilTempC, capread);

  // Send data to Firebase (update existing entry)
  sendToFirebase(ahtTemp, ahtHumidity, pctTemp, sgpCO2, sgpTVOC, soilTempC, capread);

  // Control lights and pump based on received settings
  controlLightAndPump();

  // Sampling delay (1 second delay for incrementing seconds counter)
  delay(1000);  // Delay to allow control logic to run once per second
}
