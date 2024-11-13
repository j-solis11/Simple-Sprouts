#define MOSFET_PIN 21  // GPIO pin connected to the MOSFET gate

void setup() {
  pinMode(MOSFET_PIN, OUTPUT);  // Set the MOSFET pin as an output
  digitalWrite(MOSFET_PIN, LOW); // Initially turn off the inverter
}

void loop() {
  // Turn on the inverter
  digitalWrite(MOSFET_PIN, HIGH);  // Set GPIO pin high to turn on inverter
  delay(10000);                    // Keep lights on for 10 seconds (example duration)

  // Turn off the inverter
  digitalWrite(MOSFET_PIN, LOW);   // Set GPIO pin low to turn off inverter
  delay(10000);                    // Keep lights off for 10 seconds (example duration)
}
