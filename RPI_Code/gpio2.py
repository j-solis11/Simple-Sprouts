import gpiod
import time

# Define GPIO pins
LED_PIN_17 = 17  # GPIO 17
LED_PIN_27 = 27  # GPIO 27

# Use the correct GPIO chip (Check with ls /dev/gpiochip*)
chip = gpiod.Chip('gpiochip0')  # Change this if needed

# Get the GPIO lines for LEDs
led_line_17 = chip.get_line(LED_PIN_17)
led_line_27 = chip.get_line(LED_PIN_27)

# Request exclusive access to the lines and configure them as outputs
led_line_17.request(consumer="LED_17", type=gpiod.LINE_REQ_DIR_OUT)
led_line_27.request(consumer="LED_27", type=gpiod.LINE_REQ_DIR_OUT)

print("Commands:")
print(" '1'  -> Turn ON LED 17")
print(" '0'  -> Turn OFF LED 17")
print(" '11' -> Turn ON LED 27")
print(" '00' -> Turn OFF LED 27")
print("Type 'exit' to quit.")

try:
    while True:
        user_input = input("Enter command (1/0/11/00): ").strip()  # Get user input
        
        if user_input == "1":
            led_line_17.set_value(1)
            print("LED 17 ON")
        elif user_input == "0":
            led_line_17.set_value(0)
            print("LED 17 OFF")
        elif user_input == "11":
            led_line_27.set_value(1)
            print("LED 27 ON")
        elif user_input == "00":
            led_line_27.set_value(0)
            print("LED 27 OFF")
        elif user_input.lower() == "exit":
            break  # Exit the loop if user types 'exit'
        else:
            print("Invalid input! Use '1', '0', '11', '00', or 'exit'.")

finally:
    # Release the GPIO lines and clean up resources on program exit
    led_line_17.release()
    led_line_27.release()
    chip.close()
    print("GPIO released. Exiting...")
