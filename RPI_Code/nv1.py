import time
import gpiod
import time
#import threading
import firebase_admin
from firebase_admin import credentials, db

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

# Initialize Firebase
cred = credentials.Certificate("/home/pi/project_code/firebase_key.json")  # Replace with your actual credentials file
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://simple-sprouts-database-default-rtdb.firebaseio.com/'
})

# Reference to the database location
ref = db.reference("flags_test")

def manual_mode():

    data = ref.get()

    level_under_test = data.get("level_under_test", 1)
    print(level_under_test)

    if level_under_test == 1:
        bottom_initialized = data.get("bottom_initialized", False)

        if bottom_initialized is True:
            bottom_mode = data.get("bottom_mode", "manual")

            if bottom_mode == "manual":
                bottom_man_light = data.get("bottom_man_light", False)
                bottom_man_water = data.get("bottom_man_water", False)
                if bottom_man_light == True:
                    #led_line_17.set_value(1)
                    print("LED: 1 - ON")
                else: 
                    #led_line_17.set_value(0)
                    print("LED: 1 - OFF")
                if bottom_man_water == True:
                    #led_line_27.set_value(1)
                    print("LED: 2 - ON")
                    #led_line_9.set_value(1)
                    print("LED: 5 - ON")
                else:
                    #led_line_27.set_value(0)
                    print("LED: 2 - OFF")
                    #led_line_9.set_value(0)
                    print("LED: 5 - OFF")
                    
    if level_under_test == 2:
        top_initialized = data.get("top_initialized", False)

        if top_initialized == True:
            top_mode = data.get("top_mode", "manual")

            if top_mode == "manual":
                top_man_light = data.get("top_man_light", False)
                top_man_water = data.get("top_man_water", False)

                if top_man_light == True:
                    #led_line_22.set_value(1)
                    print("LED: 3 - ON")
                else: 
                    #led_line_22.set_value(0)
                    print("LED: 3 - OFF")

                if top_man_water == True:
                    #led_line_10.set_value(1)
                    print("LED: 4 - ON")
                    #led_line_9.set_value(1)
                    print("LED: 5 - ON")
                else:
                    #led_line_10.set_value(0)
                    print("LED: 4 - OFF")
                    #led_line_9.set_value(0)
                    print("LED: 5 - OFF")
    
    time.sleep(1)

while True:
    manual_mode()
    
