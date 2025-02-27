import threading
import time
import firebase_admin
from firebase_admin import credentials, db
import gpiod

# GPIO Pin Definitions
LIGHT_BOTTOM_PIN = 17
WATER_BOTTOM_PIN = 27
LIGHT_TOP_PIN = 22
WATER_TOP_PIN = 10

def setup_gpio():
    chip = gpiod.Chip('gpiochip0')
    light_bottom = chip.get_line(LIGHT_BOTTOM_PIN)
    water_bottom = chip.get_line(WATER_BOTTOM_PIN)
    light_top = chip.get_line(LIGHT_TOP_PIN)
    water_top = chip.get_line(WATER_TOP_PIN)
    
    light_bottom.request(consumer="Light_Bottom", type=gpiod.LINE_REQ_DIR_OUT)
    water_bottom.request(consumer="Water_Bottom", type=gpiod.LINE_REQ_DIR_OUT)
    light_top.request(consumer="Light_Top", type=gpiod.LINE_REQ_DIR_OUT)
    water_top.request(consumer="Water_Top", type=gpiod.LINE_REQ_DIR_OUT)
    
    return {
        "light_bottom": light_bottom,
        "water_bottom": water_bottom,
        "light_top": light_top,
        "water_top": water_top
    }

def update_firebase_data():
    global levels_data, general_info_data
    while True:
        levels_data = db.reference("/levels").get()
        general_info_data = db.reference("/general_info").get()
        time.sleep(2)

def control_gpio():
    while True:
        if general_info_data and levels_data:
            print("Firebase data successfully retrieved.")
        else:
            print("Error: Missing data from Firebase. Retrying...")
            time.sleep(2)
            continue
            app_open = general_info_data.get("app_open", False)
            
            if app_open:
                level_under_test = general_info_data.get("level_under_test")
                if level_under_test == 1 and levels_data.get("bottom", {}).get("initialized"):
                    if levels_data["bottom"].get("mode") == "manual":
                        light_state = levels_data["bottom"]["manual"].get("light_enabled", False)
                        water_state = levels_data["bottom"]["manual"].get("water_enabled", False)
                        gpio_lines["light_bottom"].set_value(1 if light_state else 0)
                        gpio_lines["water_bottom"].set_value(1 if water_state else 0)
                elif level_under_test == 2 and levels_data.get("top", {}).get("initialized"):
                    if levels_data["top"].get("mode") == "manual":
                        light_state = levels_data["top"]["manual"].get("light_enabled", False)
                        water_state = levels_data["top"]["manual"].get("water_enabled", False)
                        gpio_lines["light_top"].set_value(1 if light_state else 0)
                        gpio_lines["water_top"].set_value(1 if water_state else 0)
            else:
                for level in ["bottom", "top"]:
                    if levels_data.get(level, {}).get("initialized"):
                        if levels_data[level].get("mode") == "scheduling":
                            print(f"{level.capitalize()} Level - Scheduling mode")
                        else:
                            print(f"{level.capitalize()} Level - Continue mode")
        time.sleep(2)

# Initialize Firebase
firebase_key_path = "/home/pi/project_code/firebase_key.json"
cred = credentials.Certificate(firebase_key_path)
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://simple-sprouts-database-default-rtdb.firebaseio.com/"
})

# Setup GPIO
gpio_lines = setup_gpio()

# Start Firebase update thread
firebase_thread = threading.Thread(target=update_firebase_data, daemon=True)
firebase_thread.start()

# Start GPIO control thread
control_thread = threading.Thread(target=control_gpio, daemon=True)
control_thread.start()

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Program terminated.")
