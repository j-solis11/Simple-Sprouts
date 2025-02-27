import time
import gpiod
import time
import threading

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

# Function to track time with ON/OFF cycles for Timer One
def run_timer_one():
    counter = 0  # Start counter

    while True:
        # ON cycle (1000 seconds)
        print("Timer One: Starting ON cycle...")
        while counter < 30:
            print("Timer One: ON")
            led_line_17.set_value(1)
            time.sleep(5)  # Wait for 5 seconds
            counter += 5    # Increment counter by 5
            print(f"Timer One Counter: {counter} seconds")

        # Reset counter for OFF cycle
        counter = 0

        # OFF cycle (500 seconds)
        print("Timer One: Starting OFF cycle...")
        while counter < 15:
            print("Timer One: OFF")
            led_line_17.set_value(0)
            time.sleep(5)  # Wait for 5 seconds
            counter += 5    # Increment counter by 5
            print(f"Timer One Counter: {counter} seconds")

        # Reset counter to restart cycle
        counter = 0

# Function to track time with ON/OFF cycles for Timer Two
def run_timer_two():
    counter = 0  # Start counter

    while True:

        print("Timer Two: Starting ON cycle...")
        while counter < 10:
            print("Timer Two: ON")
            led_line_27.set_value(1)
            time.sleep(2)  # Wait for 5 seconds
            counter += 2    # Increment counter by 5
            print(f"Timer Two Counter: {counter} seconds")

        # Reset counter for OFF cycle
        counter = 0

        # OFF cycle (500 seconds)
        print("Timer Two: Starting OFF cycle...")
        while counter < 6:
            print("Timer Two: OFF")
            led_line_27.set_value(0)
            time.sleep(2)  # Wait for 5 seconds
            counter += 2    # Increment counter by 5
            print(f"Timer Two Counter: {counter} seconds")

        # Reset counter to restart cycle
        counter = 0

# Create threads for each timer
timer_one_thread = threading.Thread(target=run_timer_one, daemon=True)
timer_two_thread = threading.Thread(target=run_timer_two, daemon=True)

# Start both threads
timer_one_thread.start()
timer_two_thread.start()

# Keep the main program running
while True:
    time.sleep(1)
