import gpiod
import time

# Define GPIO pins
LED_PIN_17 = 17  # GPIO 17
LED_PIN_27 = 27  # GPIO 27
LED_PIN_22 = 22  # GPIO 22
LED_PIN_10 = 10  # GPIO 10
LED_PIN_9 = 9    # GPIO 9

# Use the correct GPIO chip (Check with ls /dev/gpiochip*)
chip = gpiod.Chip('gpiochip0')  # Change this if needed

# Get the GPIO lines for LEDs
led_line_17 = chip.get_line(LED_PIN_17)
led_line_27 = chip.get_line(LED_PIN_27)
led_line_22 = chip.get_line(LED_PIN_22)
led_line_10 = chip.get_line(LED_PIN_10)
led_line_9 = chip.get_line(LED_PIN_9)

# Request exclusive access to the lines and configure them as outputs
led_line_17.request(consumer="LED_17", type=gpiod.LINE_REQ_DIR_OUT)
led_line_27.request(consumer="LED_27", type=gpiod.LINE_REQ_DIR_OUT)
led_line_22.request(consumer="LED_22", type=gpiod.LINE_REQ_DIR_OUT)
led_line_10.request(consumer="LED_10", type=gpiod.LINE_REQ_DIR_OUT)
led_line_9.request(consumer="LED_9", type=gpiod.LINE_REQ_DIR_OUT)

print("Commands:")
print(" '1'   -> Turn ON LED 17")
print(" '0'   -> Turn OFF LED 17")
print(" '11'  -> Turn ON LED 27")
print(" '00'  -> Turn OFF LED 27")
print(" '111' -> Turn ON LED 22")
print(" '000' -> Turn OFF LED 22")
print(" '1111' -> Turn ON LED 10")
print(" '0000' -> Turn OFF LED 10")
print(" '11111' -> Turn ON LED 9")
print(" '00000' -> Turn OFF LED 9")
print("Type 'exit' to quit.")

try:
    while True:
        user_input = input("Enter command (1/0/11/00/111/000/1111/0000/11111/00000): ").strip()  # Get user input
        
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
        elif user_input == "111":
            led_line_22.set_value(1)
            print("LED 22 ON")
        elif user_input == "000":
            led_line_22.set_value(0)
            print("LED 22 OFF")
        elif user_input == "1111":
            led_line_10.set_value(1)
            print("LED 10 ON")
        elif user_input == "0000":
            led_line_10.set_value(0)
            print("LED 10 OFF")
        elif user_input == "11111":
            led_line_9.set_value(1)
            print("LED 9 ON")
        elif user_input == "00000":
            led_line_9.set_value(0)
            print("LED 9 OFF")
        elif user_input.lower() == "exit":
            break  # Exit the loop if user types 'exit'
        else:
            print("Invalid input! Use '1', '0', '11', '00', '111', '000', '1111', '0000', '11111', '00000', or 'exit'.")

finally:
    # Release the GPIO lines and clean up resources on program exit
    led_line_17.release()
    led_line_27.release()
    led_line_22.release()
    led_line_10.release()
    led_line_9.release()
    chip.close()
    print("GPIO released. Exiting...")
