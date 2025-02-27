import time
import gpiod
import time
import threading
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

# Global variables to store Firebase values
app_open = False
level_under_test = 0
bottom_initialized = False
bottom_mode = "manual"
bottom_man_light = False
bottom_man_water = False
bottom_mode_light_edit = False
bottom_mode_water_edit = False
bottom_light_ref_off_hrs = 0
bottom_light_ref_on_hrs = 0
bottom_light_ref_off_mins = 0
bottom_light_ref_on_mins = 0
bottom_light_tts_hrs = 0
bottom_light_tts_mins = 0
bottom_water_ref_days = 0
bottom_water_ref_hrs = 0
bottom_water_ref_min = 0
bottom_water_ttw_days = 0
bottom_water_ttw_hrs = 0
bottom_water_ttw_min = 0
top_initialized = False
top_mode = "manual"
top_man_light = False
top_man_water = False
top_mode_light_edit = False
top_mode_water_edit = False
top_light_ref_off_hrs = 0
top_light_ref_on_hrs = 0
top_light_ref_off_mins = 0
top_light_ref_on_mins = 0
top_light_tts_hrs = 0
top_light_tts_mins = 0
top_water_ref_days = 0
top_water_ref_hrs = 0
top_water_ref_min = 0
top_water_ttw_days = 0
top_water_ttw_hrs = 0
top_water_ttw_min = 0

def fetch_flags():
    """ Fetch data from Firebase every 3 seconds in a background thread. """
    global app_open, level_under_test, bottom_initialized, bottom_mode, bottom_man_light, bottom_man_water
    global bottom_mode_light_edit, bottom_mode_water_edit, bottom_light_ref_off_hrs, bottom_light_ref_on_hrs, bottom_light_ref_off_mins
    global bottom_light_ref_on_mins, bottom_light_tts_hrs, bottom_light_tts_mins, bottom_water_ref_days
    global bottom_water_ref_hrs, bottom_water_ref_min, bottom_water_ttw_days, bottom_water_ttw_hrs, bottom_water_ttw_min
    global top_initialized, top_mode, top_man_light, top_man_water, top_mode_light_edit, top_mode_water_edit, top_light_ref_off_hrs
    global top_light_ref_on_hrs, top_light_ref_off_mins, top_light_ref_on_mins, top_light_tts_hrs, top_light_tts_mins
    global top_water_ref_days, top_water_ref_hrs, top_water_ref_min, top_water_ttw_days, top_water_ttw_hrs, top_water_ttw_min
    
    while True:
        data = ref.get()
        if data:
            app_open = data.get("app_open", False)
            level_under_test = data.get("level_under_test", 0)
            bottom_initialized = data.get("bottom_initialized", False)
            bottom_mode = data.get("bottom_mode", "manual")
            bottom_man_light = data.get("bottom_man_light", False)
            bottom_man_water = data.get("bottom_man_water", False)
            bottom_mode_light_edit = data.get("bottom_mode_light_edit", False)
            bottom_mode_water_edit = data.get("bottom_mode_water_edit", False)
            bottom_light_ref_off_hrs = data.get("bottom_light_ref_off_hrs", 0)
            bottom_light_ref_on_hrs = data.get("bottom_light_ref_on_hrs", 0)
            bottom_light_ref_off_mins = data.get("bottom_light_ref_off_mins", 0)
            bottom_light_ref_on_mins = data.get("bottom_light_ref_on_mins", 0)
            bottom_light_tts_hrs = data.get("bottom_light_tts_hrs", 0)
            bottom_light_tts_mins = data.get("bottom_light_tts_mins", 0)
            bottom_water_ref_days = data.get("bottom_water_ref_days", 0)
            bottom_water_ref_hrs = data.get("bottom_water_ref_hrs", 0)
            bottom_water_ref_min = data.get("bottom_water_ref_min", 0)
            bottom_water_ttw_days = data.get("bottom_water_ttw_days", 0)
            bottom_water_ttw_hrs = data.get("bottom_water_ttw_hrs", 0)
            bottom_water_ttw_min = data.get("bottom_water_ttw_min", 0)
            top_initialized = data.get("top_initialized", False)
            top_mode = data.get("top_mode", "manual")
            top_man_light = data.get("top_man_light", False)
            top_man_water = data.get("top_man_water", False)
            top_mode_light_edit = data.get("top_mode_light_edit", False)
            top_mode_water_edit = data.get("top_mode_water_edit", False)
            top_light_ref_off_hrs = data.get("top_light_ref_off_hrs", 0)
            top_light_ref_on_hrs = data.get("top_light_ref_on_hrs", 0)
            top_light_ref_off_mins = data.get("top_light_ref_off_mins", 0)
            top_light_ref_on_mins = data.get("top_light_ref_on_mins", 0)
            top_light_tts_hrs = data.get("top_light_tts_hrs", 0)
            top_light_tts_mins = data.get("top_light_tts_mins", 0)
            top_water_ref_days = data.get("top_water_ref_days", 0)
            top_water_ref_hrs = data.get("top_water_ref_hrs", 0)
            top_water_ref_min = data.get("top_water_ref_min", 0)
            top_water_ttw_days = data.get("top_water_ttw_days", 0)
            top_water_ttw_hrs = data.get("top_water_ttw_hrs", 0)
            top_water_ttw_min = data.get("top_water_ttw_min", 0)
            
            print("\nUpdated Firebase Flags:")
            for key, value in data.items():
                print(f"{key}: {value}")
        else:
            print("No data found in flags_test")
        led_line_9.set_value(1)
        time.sleep(3)  # Wait 3 seconds before fetching 
        led_line_9.set_value(0)

# Function to track time with ON/OFF cycles for Timer One
def run_timer_bottom_light():
    global app_open, level_under_test, bottom_initialized, bottom_mode, bottom_man_light, bottom_man_water
    global bottom_mode_light_edit, bottom_mode_water_edit, bottom_light_ref_off_hrs, bottom_light_ref_on_hrs, bottom_light_ref_off_mins
    global bottom_light_ref_on_mins, bottom_light_tts_hrs, bottom_light_tts_mins, bottom_water_ref_days
    global bottom_water_ref_hrs, bottom_water_ref_min, bottom_water_ttw_days, bottom_water_ttw_hrs, bottom_water_ttw_min
    global top_initialized, top_mode, top_man_light, top_man_water, top_mode_light_edit, top_mode_water_edit, top_light_ref_off_hrs
    global top_light_ref_on_hrs, top_light_ref_off_mins, top_light_ref_on_mins, top_light_tts_hrs, top_light_tts_mins
    global top_water_ref_days, top_water_ref_hrs, top_water_ref_min, top_water_ttw_days, top_water_ttw_hrs, top_water_ttw_min

    total_on = 0
    total_off = 0
    while True:
        #counter = total_on  # Start counter
        if bottom_initialized == True:
            if bottom_mode == "scheduling":
                if bottom_mode_light_edit == True:
                    total_on = (bottom_light_ref_on_hrs*1) + (bottom_light_ref_on_mins*1)
                    total_off = (bottom_light_ref_off_hrs*1) + (bottom_light_ref_off_mins*1)
                    counter = total_on  # Start counter
                    #bottom_mode_light_edit = False
                    ref.update({"bottom_mode_light_edit": False})

                while counter > 0:
                    print("Bottom Light: ON")
                    led_line_17.set_value(1)
                    time.sleep(5)  # Wait for 5 seconds
                    counter -= 5    # Increment counter by 5
                    print(f"Timer One Counter: {counter} seconds")
                counter = total_off

                while counter > 0:
                    print("Bottom light: OFF")
                    led_line_17.set_value(0)
                    time.sleep(5)  # Wait for 5 seconds
                    counter -= 5    # Increment counter by 5
                    print(f"Timer One Counter: {counter} seconds")
                counter = total_on

def run_timer_bottom_water():
    global app_open, level_under_test, bottom_initialized, bottom_mode, bottom_man_light, bottom_man_water
    global bottom_mode_light_edit, bottom_mode_water_edit, bottom_light_ref_off_hrs, bottom_light_ref_on_hrs, bottom_light_ref_off_mins
    global bottom_light_ref_on_mins, bottom_light_tts_hrs, bottom_light_tts_mins, bottom_water_ref_days
    global bottom_water_ref_hrs, bottom_water_ref_min, bottom_water_ttw_days, bottom_water_ttw_hrs, bottom_water_ttw_min
    global top_initialized, top_mode, top_man_light, top_man_water, top_mode_light_edit, top_mode_water_edit, top_light_ref_off_hrs
    global top_light_ref_on_hrs, top_light_ref_off_mins, top_light_ref_on_mins, top_light_tts_hrs, top_light_tts_mins
    global top_water_ref_days, top_water_ref_hrs, top_water_ref_min, top_water_ttw_days, top_water_ttw_hrs, top_water_ttw_min

    total_on = 0
    total_off = 0
    while True:
        #counter = total_on  # Start counter
        if bottom_initialized == True:
            if bottom_mode == "scheduling":
                if bottom_mode_water_edit == True:
                    total_on = 10
                    total_off = (bottom_water_ref_days*1) + (bottom_water_ref_hrs*1) + (bottom_water_ref_min*1)
                    counter = total_off  # Start counter
                    #bottom_mode_light_edit = False
                    ref.update({"bottom_mode_water_edit": False})

                while counter > 0:
                    print("Bottom Light: ON")
                    led_line_27.set_value(0)
                    time.sleep(5)  # Wait for 5 seconds
                    counter -= 5    # Increment counter by 5
                    print(f"Timer One Counter: {counter} seconds")
                counter = total_on

                while counter > 0:
                    print("Bottom light: OFF")
                    led_line_27.set_value(1)
                    time.sleep(5)  # Wait for 5 seconds
                    counter -= 5    # Increment counter by 5
                    print(f"Timer One Counter: {counter} seconds")
                counter = total_off

def run_timer_top_light():
    global app_open, level_under_test, bottom_initialized, bottom_mode, bottom_man_light, bottom_man_water
    global bottom_mode_light_edit, bottom_mode_water_edit, bottom_light_ref_off_hrs, bottom_light_ref_on_hrs, bottom_light_ref_off_mins
    global bottom_light_ref_on_mins, bottom_light_tts_hrs, bottom_light_tts_mins, bottom_water_ref_days
    global bottom_water_ref_hrs, bottom_water_ref_min, bottom_water_ttw_days, bottom_water_ttw_hrs, bottom_water_ttw_min
    global top_initialized, top_mode, top_man_light, top_man_water, top_mode_light_edit, top_mode_water_edit, top_light_ref_off_hrs
    global top_light_ref_on_hrs, top_light_ref_off_mins, top_light_ref_on_mins, top_light_tts_hrs, top_light_tts_mins
    global top_water_ref_days, top_water_ref_hrs, top_water_ref_min, top_water_ttw_days, top_water_ttw_hrs, top_water_ttw_min

    total_on = 0
    total_off = 0
    while True:
        #counter = total_on  # Start counter
        if top_initialized == True:
            if top_mode == "scheduling":
                if top_mode_light_edit == True:
                    total_on = (top_light_ref_on_hrs*1) + (top_light_ref_on_mins*1)
                    total_off = (top_light_ref_off_hrs*1) + (top_light_ref_off_mins*1)
                    counter = total_on  # Start counter
                    #bottom_mode_light_edit = False
                    ref.update({"top_mode_light_edit": False})

                while counter > 0:
                    print("Top Light: ON")
                    led_line_22.set_value(1)
                    time.sleep(5)  # Wait for 5 seconds
                    counter -= 5    # Increment counter by 5
                    #print(f"Timer One Counter: {counter} seconds")
                counter = total_off

                while counter > 0:
                    print("Top light: OFF")
                    led_line_22.set_value(0)
                    time.sleep(5)  # Wait for 5 seconds
                    counter -= 5    # Increment counter by 5
                    #print(f"Timer One Counter: {counter} seconds")
                counter = total_on

def run_timer_top_water():
    global app_open, level_under_test, bottom_initialized, bottom_mode, bottom_man_light, bottom_man_water
    global bottom_mode_light_edit, bottom_mode_water_edit, bottom_light_ref_off_hrs, bottom_light_ref_on_hrs, bottom_light_ref_off_mins
    global bottom_light_ref_on_mins, bottom_light_tts_hrs, bottom_light_tts_mins, bottom_water_ref_days
    global bottom_water_ref_hrs, bottom_water_ref_min, bottom_water_ttw_days, bottom_water_ttw_hrs, bottom_water_ttw_min
    global top_initialized, top_mode, top_man_light, top_man_water, top_mode_light_edit, top_mode_water_edit, top_light_ref_off_hrs
    global top_light_ref_on_hrs, top_light_ref_off_mins, top_light_ref_on_mins, top_light_tts_hrs, top_light_tts_mins
    global top_water_ref_days, top_water_ref_hrs, top_water_ref_min, top_water_ttw_days, top_water_ttw_hrs, top_water_ttw_min

    total_on = 0
    total_off = 0
    while True:
        #counter = total_on  # Start counter
        if top_initialized == True:
            if top_mode == "scheduling":
                if top_mode_water_edit == True:
                    total_on = 10
                    total_off = (top_water_ref_days*1) + (top_water_ref_hrs*1) + (top_water_ref_min*1)
                    counter = total_off  # Start counter
                    #bottom_mode_light_edit = False
                    ref.update({"top_mode_water_edit": False})

                while counter > 0:
                    print("Top Light: ON")
                    led_line_10.set_value(0)
                    time.sleep(5)  # Wait for 5 seconds
                    counter -= 5    # Increment counter by 5
                    #print(f"Timer One Counter: {counter} seconds")
                counter = total_on

                while counter > 0:
                    print("top light: OFF")
                    led_line_10.set_value(1)
                    time.sleep(5)  # Wait for 5 seconds
                    counter -= 5    # Increment counter by 5
                    print(f"Timer One Counter: {counter} seconds")
                counter = total_off

           



# Start fetch_flags() in a separate thread
firebase_thread = threading.Thread(target=fetch_flags, daemon=True)
firebase_thread.start()

# Create threads for each timer
timer_one_thread = threading.Thread(target=run_timer_bottom_light, daemon=True)
timer_two_thread = threading.Thread(target=run_timer_bottom_water, daemon=True)
timer_three_thread = threading.Thread(target=run_timer_top_light, daemon=True)
timer_four_thread = threading.Thread(target=run_timer_top_water, daemon=True)
# Start both threads
timer_one_thread.start()
timer_two_thread.start()
timer_three_thread.start()

# Keep the main program running
while True:
    time.sleep(1)
