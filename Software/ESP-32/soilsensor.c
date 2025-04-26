#include <Wire.h>               // For I2C communication
#include <Adafruit_seesaw.h>    // Adafruit seesaw library for soil moisture sensor

// Define sensors, pump, and thresholds
Adafruit_seesaw ss1;            // Soil sensor 1
Adafruit_seesaw ss2;            // Soil sensor 2
#define MOISTURE_THRESHOLD 500  // Moisture threshold value; adjust after testing
#define PUMP_PIN 23             // GPIO pin controlling the pump (connected to a relay or transistor)
#define PUMP_DURATION 5000      // Pump run duration in milliseconds (5 seconds)

unsigned long previousMillis = 0;     // Last time the sensor was read
const long interval = 1800000;        // 30 minutes in milliseconds

void setup() {
  Serial.begin(115200);
  
  // Initialize soil sensors
  if (!ss1.begin(0x36)) {       // Default I2C address for the first sensor
    Serial.println("Failed to find Soil Sensor 1");
    while (1);
  }
  if (!ss2.begin(0x37)) {       // Use a different I2C address for the second sensor
    Serial.println("Failed to find Soil Sensor 2");
    while (1);
  }
  
  // Initialize pump control pin
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, LOW);  // Ensure pump is off initially
  
  Serial.println("Setup complete.");
}

void loop() {
  unsigned long currentMillis = millis();
  
  // Check if it's time to read the soil moisture
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
    
    // Read moisture levels from each sensor
    uint16_t moisture1 = ss1.touchRead(0);
    uint16_t moisture2 = ss2.touchRead(0);

    // Print moisture readings for debugging
    Serial.print("Soil Moisture Sensor 1: "); Serial.println(moisture1);
    Serial.print("Soil Moisture Sensor 2: "); Serial.println(moisture2);

    // Check if either sensor detects dry soil
    if (moisture1 < MOISTURE_THRESHOLD || moisture2 < MOISTURE_THRESHOLD) {
      Serial.println("Soil is dry; activating pump...");
      digitalWrite(PUMP_PIN, HIGH);   // Turn on pump
      delay(PUMP_DURATION);           // Run pump for the specified duration
      digitalWrite(PUMP_PIN, LOW);    // Turn off pump
      Serial.println("Pump deactivated.");
    } else {
      Serial.println("Soil moisture is sufficient; pump remains off.");
    }
  }
}
