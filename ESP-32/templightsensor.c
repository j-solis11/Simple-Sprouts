#include <Wire.h>
#include "Adafruit_AS7341.h"
#include "Adafruit_HDC1000.h" // HDC1000 library as a placeholder for HDC3022

// Create sensor instances
Adafruit_AS7341 as7341;
Adafruit_HDC1000 hdc1000;

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);

  Serial.println("Initializing Light, Temperature, and Humidity Sensor...");

  // Initialize I2C communication
  Wire.begin();

  // Initialize AS7341 Light Sensor
  if (!as7341.begin()) {
    Serial.println("Failed to find AS7341 light sensor!");
    while (1) { delay(10); }
  }
  Serial.println("AS7341 light sensor initialized.");

  // Initialize HDC3022 Temperature & Humidity Sensor (using HDC1000 library as placeholder)
  if (!hdc1000.begin(0x40)) { // 0x40 is default I2C address
    Serial.println("Failed to find HDC3022 temperature and humidity sensor!");
    while (1) { delay(10); }
  }
  Serial.println("HDC3022 temperature and humidity sensor initialized.");
}

void loop() {
  // Read light levels from AS7341
  uint16_t clear = as7341.readChannel(AS7341_CHANNEL_CLEAR);
  uint16_t nir = as7341.readChannel(AS7341_CHANNEL_NIR);

  Serial.print("Light Level (Clear Channel): ");
  Serial.println(clear);
  Serial.print("Light Level (NIR Channel): ");
  Serial.println(nir);

  // Read temperature and humidity from HDC3022
  float temperatureC = hdc1000.readTemperature();
  float humidity = hdc1000.readHumidity();

  if (!isnan(temperatureC)) {
    // Convert Celsius to Fahrenheit
    float temperatureF = temperatureC * 9.0 / 5.0 + 32.0;
    Serial.print("Temperature: ");
    Serial.print(temperatureF);
    Serial.println(" °F");
  } else {
    Serial.println("Error reading temperature!");
  }

  if (!isnan(humidity)) {
    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");
  } else {
    Serial.println("Error reading humidity!");
  }

  // Send data to ESP32 for automated lighting adjustments
  adjustLighting(clear);

  delay(2000); // Wait for 2 seconds before the next reading
}

void adjustLighting(uint16_t lightLevel) {
  const uint16_t threshold = 3000; // Threshold we determine

  if (lightLevel < threshold) {
    // Code to turn on grow lights
    Serial.println("Light level is low. Turning on grow lights.");
    digitalWrite(GROW_LIGHT_PIN, HIGH); // Define GROW_LIGHT_PIN
  } else {
    // Code to turn off grow lights
    Serial.println("Light level is sufficient. Turning off grow lights.");
    digitalWrite(GROW_LIGHT_PIN, LOW); // Define GROW_LIGHT_PIN
  }
}
