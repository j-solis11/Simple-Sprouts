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

# Store Firebase data in a structured dictionary
firebase_data = {
    "levels": {},
    "general_info": {}
}

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
    global firebase_data
    while True:
        firebase_data["levels"] = db.reference("/levels").get() or {}
        firebase_data["general_info"] = db.reference("/general_info").get() or {}
        print("\nRetrieved Firebase Data:")
        print("Levels:", firebase_data["levels"])
        print("General Info:", firebase_data["general_info"])
        time.sleep(2)

def get_value(path, default=None):
    """Helper function to safely retrieve values from firebase_data dictionary."""
    keys = path.split("/")
    data = firebase_data
    for key in keys:
        data = data.get(key, {})
        if not isinstance(data, dict):  # Stop if reached a non-dict value
            return data
    return default

def countdown_timer(section, interval_key, gpio_pin, firebase_key, is_lighting):
    """ Controls the lighting and watering timers and updates Firebase. """
    while True:
        time_till_switch = get_value(f"levels/{section}/scheduling/{interval_key}/time_till_switch", {})
        reference_time = get_value(f"levels/{section}/scheduling/{interval_key}/reference", {})

        if not isinstance(time_till_switch, dict) or "hrs" not in time_till_switch or "min" not in time_till_switch:
            print(f"Error: time_till_switch for {section}/{interval_key} is missing or invalid. Skipping iteration.")
            time.sleep(5)
            continue

        if time_till_switch["hrs"] == 0 and time_till_switch["min"] == 0:
            if is_lighting:
                # Toggle lights
                gpio_lines[gpio_pin].set_value(1)
                time_till_switch = reference_time  # Reset time
            else:
                # Run water pump for 20 seconds
                gpio_lines[gpio_pin].set_value(1)
                time.sleep(20)
                gpio_lines[gpio_pin].set_value(0)
                time_till_switch = reference_time  # Reset time
            
            # Update Firebase with new timer values
            try:
                db.reference(f"levels/{section}/scheduling/{interval_key}/time_till_switch").set(time_till_switch)
            except Exception as e:
                print(f"Error updating Firebase for {section}/{interval_key}: {e}")
        else:
            # Countdown logic
            if time_till_switch["min"] > 0:
                time_till_switch["min"] -= 1
            elif time_till_switch["hrs"] > 0:
                time_till_switch["hrs"] -= 1
                time_till_switch["min"] = 59

            # Update Firebase every 5 seconds
            try:
                db.reference(f"levels/{section}/scheduling/{interval_key}/time_till_switch").set(time_till_switch)
            except Exception as e:
                print(f"Error updating Firebase countdown for {section}/{interval_key}: {e}")
            time.sleep(5)

def control_gpio():
    while True:
        if not firebase_data["levels"] or not firebase_data["general_info"]:
            print("Error: Missing data from Firebase. Retrying...")
            time.sleep(2)
            continue
        
        print("Firebase data successfully retrieved.")
        app_open = get_value("general_info/app_open", False)
        
        if app_open:
            level_under_test = get_value("general_info/level_under_test")
            if level_under_test == 1 and get_value("levels/bottom/initialized", False):
                if get_value("levels/bottom/mode") == "manual":
                    light_enabled = get_value("levels/bottom/manual/light_enabled", False)
                    water_enabled = get_value("levels/bottom/manual/water_enabled", False)
                    gpio_lines["light_bottom"].set_value(1 if light_enabled else 0)
                    gpio_lines["water_bottom"].set_value(1 if water_enabled else 0)
            elif level_under_test == 2 and get_value("levels/top/initialized", False):
                if get_value("levels/top/mode") == "manual":
                    light_enabled = get_value("levels/top/manual/light_enabled", False)
                    water_enabled = get_value("levels/top/manual/water_enabled", False)
                    gpio_lines["light_top"].set_value(1 if light_enabled else 0)
                    gpio_lines["water_top"].set_value(1 if water_enabled else 0)
        else:
            for section in ["bottom", "top"]:
                if get_value(f"levels/{section}/initialized", False):
                    mode = get_value(f"levels/{section}/mode")
                    if mode == "scheduling":
                        print(f"{section.capitalize()} Level - Scheduling mode")
                        if get_value(f"levels/{section}/mode_edited", False):
                            db.reference(f"levels/{section}/mode_edited").set(False)
                            db.reference(f"levels/{section}/scheduling/lighting_interval/time_till_switch").set(get_value(f"levels/{section}/scheduling/lighting_interval/reference"))
                            db.reference(f"levels/{section}/scheduling/watering_interval/time_till_water").set(get_value(f"levels/{section}/scheduling/watering_interval/reference"))
                        
                        threading.Thread(target=countdown_timer, args=(section, "lighting_interval", f"light_{section}", "time_till_switch", True), daemon=True).start()
                        threading.Thread(target=countdown_timer, args=(section, "watering_interval", f"water_{section}", "time_till_water", False), daemon=True).start()
                    else:
                        print(f"{section.capitalize()} Level - Continue mode")
        
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
