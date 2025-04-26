// Pin definition
const int pin_pump = 15; // Digital pin 15
const int pin_lights = x;

void setup() {
  // Initialize pin 15 as an output
  pinMode(pin_pump, OUTPUT);
  pinMode(pin_lights, OUTPUT);
  // Set the pin to LOW initially
  digitalWrite(pin_pump, LOW);
  digitalWrite(pin_lights, LOW);

  // Start serial communication
  Serial.begin(115200);
  Serial.println("Type 'on' to turn pin HIGH and 'off' to turn pin LOW.");
}

void loop() {
  // Check if there is serial input available
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n'); // Read the input until a newline character
    input.trim(); // Remove any leading or trailing spaces

    if (input.equalsIgnoreCase("on")) {
      digitalWrite(pin_pump, HIGH); // Set pin 15 HIGH
      digitalWrite(pin_lights, HIGH)
      Serial.println("Pin 15 set to HIGH.");
    } else if (input.equalsIgnoreCase("off")) {
      digitalWrite(pin_pump, LOW); // Set pin 15 LOW
      digitalWrite(pin_lights, LOW);
      Serial.println("Pin 15 set to LOW.");
    } else {
      Serial.println("Invalid command. Please type 'on' or 'off'.");
    }
  }
}
