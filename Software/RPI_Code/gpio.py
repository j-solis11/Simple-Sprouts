import gpiod
import time

LED_PIN = 17  # GPIO pin number where the LED is connected

# Use the correct GPIO chip (Check with ls /dev/gpiochip*)
chip = gpiod.Chip('gpiochip0')  # Change this if needed

# Get the GPIO line for the LED
led_line = chip.get_line(LED_PIN)

# Request exclusive access to the line and configure it as an output
led_line.request(consumer="LED", type=gpiod.LINE_REQ_DIR_OUT)

print("Type '1' to turn ON, '0' to turn OFF. Type 'exit' to quit.")

try:
    while True:
        user_input = input("Enter command (1/0): ").strip()  # Get user input from Thonny
        if user_input == "1":
            led_line.set_value(1)
            print("LED ON")
        elif user_input == "0":
            led_line.set_value(0)
            print("LED OFF")
        elif user_input.lower() == "exit":
            break  # Exit the loop if user types 'exit'
        else:
            print("Invalid input! Type '1' for ON, '0' for OFF, or 'exit' to quit.")

finally:
    # Release the GPIO line and clean up resources on program exit
    led_line.release()
    chip.close()
    print("GPIO released. Exiting...")
