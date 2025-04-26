#define WATER_PUMP_PIN 22  // GPIO pin connected to the MOSFET gate for the water pump

void setup() {
  pinMode(WATER_PUMP_PIN, OUTPUT);  // Set the water pump pin as an output
  digitalWrite(WATER_PUMP_PIN, LOW); // Initially turn off the water pump
}

void loop() {
  // Turn on the water pump
  digitalWrite(WATER_PUMP_PIN, HIGH);  // Set GPIO pin high to turn on the water pump
  delay(10000);                        // Keep the pump on for 10 seconds

  // Turn off the water pump
  digitalWrite(WATER_PUMP_PIN, LOW);   // Set GPIO pin low to turn off the water pump
  delay(10000);                        // Keep the pump off for 10 seconds
}
