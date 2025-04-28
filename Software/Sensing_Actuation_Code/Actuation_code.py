import time
import gpiod
import firebase_admin
from firebase_admin import credentials, db
from gpiozero import DistanceSensor  # Import the DistanceSensor from gpiozero

# --- GPIO Pin Definitions ---
BOTTOM_LIGHT_PIN = 22  # bottom light
TOP_LIGHT_PIN = 17     # top light
BOTTOM_VALVE_PIN = 13  # bottom water valve
TOP_VALVE_PIN = 19     # top water valve
PUMP_PIN = 0           # shared water pump
HEATER_PIN = 10        # heater

'''
Alternative Pin Set (commented out)
BOTTOM_LIGHT_PIN = 21
TOP_LIGHT_PIN = 20
BOTTOM_VALVE_PIN = 16
TOP_VALVE_PIN = 12
PUMP_PIN = 1
HEATER_PIN = 25
'''

# --- Initialize GPIO Chip and Lines ---
chip = gpiod.Chip('gpiochip0')
bottom_light_line = chip.get_line(BOTTOM_LIGHT_PIN)
top_light_line = chip.get_line(TOP_LIGHT_PIN)
bottom_valve_line = chip.get_line(BOTTOM_VALVE_PIN)
top_valve_line = chip.get_line(TOP_VALVE_PIN)
pump_line = chip.get_line(PUMP_PIN)
heater_line = chip.get_line(HEATER_PIN)

# Request lines for output
bottom_light_line.request(consumer="BOTTOM_LIGHT", type=gpiod.LINE_REQ_DIR_OUT)
top_light_line.request(consumer="TOP_LIGHT", type=gpiod.LINE_REQ_DIR_OUT)
bottom_valve_line.request(consumer="BOTTOM_VALVE", type=gpiod.LINE_REQ_DIR_OUT)
top_valve_line.request(consumer="TOP_VALVE", type=gpiod.LINE_REQ_DIR_OUT)
pump_line.request(consumer="PUMP", type=gpiod.LINE_REQ_DIR_OUT)
heater_line.request(consumer="HEATER", type=gpiod.LINE_REQ_DIR_OUT)

# --- Initialize Firebase ---
cred = credentials.Certificate("/home/pi/final_testing/sensor_firebase_key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://simple-sprouts-database-default-rtdb.firebaseio.com/'
})
ref = db.reference("flags_test")
sensor_readings_ref = db.reference("sensor_readings/latest")

# --- Initialize Ultrasonic Sensor ---
ultrasonic_sensor = DistanceSensor(echo=27, trigger=23, max_distance=4)
next_ultrasonic_sample = time.monotonic()

# --- Component State Dictionary ---
components = {
    "bottom_light": {
        "gpio": bottom_light_line,
        "state": False,
        "on_duration": 0,
        "off_duration": 0,
        "next_toggle": time.monotonic(),
        "init_key": "bottom_initialized",
        "mode_key": "bottom_mode",
        "edit_flag": "bottom_mode_light_edit"
    },
    "top_light": {
        "gpio": top_light_line,
        "state": False,
        "on_duration": 0,
        "off_duration": 0,
        "next_toggle": time.monotonic(),
        "init_key": "top_initialized",
        "mode_key": "top_mode",
        "edit_flag": "top_mode_light_edit"
    },
    "bottom_water": {
        "gpio": (bottom_valve_line, pump_line),
        "state": False,
        "on_duration": 0,
        "off_duration": 0,
        "next_toggle": time.monotonic(),
        "init_key": "bottom_initialized",
        "mode_key": "bottom_mode",
        "edit_flag": "bottom_mode_water_edit"
    },
    "top_water": {
        "gpio": (top_valve_line, pump_line),
        "state": False,
        "on_duration": 0,
        "off_duration": 0,
        "next_toggle": time.monotonic(),
        "init_key": "top_initialized",
        "mode_key": "top_mode",
        "edit_flag": "top_mode_water_edit"
    }
}

# Heater state
heater_state = False

# --- Helper Functions ---

def update_schedule(comp_name, data, current_time):
    comp = components[comp_name]
    if comp_name in ["bottom_light", "top_light"]:
        total_on = data.get(f"{comp_name}_ref_on_hrs", 0) * 1 + data.get(f"{comp_name}_ref_on_mins", 0) * 1
        total_off = data.get(f"{comp_name}_ref_off_hrs", 0) * 1 + data.get(f"{comp_name}_ref_off_mins", 0) * 1
        comp["on_duration"] = total_on
        comp["off_duration"] = total_off
    elif comp_name in ["bottom_water", "top_water"]:
        amount = data.get(f"{comp_name}_amount", 0)
        total_off = (data.get(f"{comp_name}_ref_days", 0) * 1 +
                     data.get(f"{comp_name}_ref_hrs", 0) * 1 +
                     data.get(f"{comp_name}_ref_mins", 0) * 1)
        comp["on_duration"] = amount
        comp["off_duration"] = total_off
    if comp["next_toggle"] < current_time:
        if comp["state"]:
            comp["next_toggle"] = current_time + comp["on_duration"]
        else:
            comp["next_toggle"] = current_time + comp["off_duration"]

def update_adaptive_schedule(comp_name, data, current_time):
    comp = components[comp_name]
    if comp_name == "bottom_light":
        total_on = data.get("adp_bottom_light_on_hrs", 0) * 1
        total_off = data.get("adp_bottom_light_off_hrs", 0) * 1
    elif comp_name == "top_light":
        total_on = data.get("adp_top_light_on_hrs", 0) * 1
        total_off = data.get("adp_top_light_off_hrs", 0) * 1
    comp["on_duration"] = total_on
    comp["off_duration"] = total_off
    if comp["next_toggle"] < current_time:
        if comp["state"]:
            comp["next_toggle"] = current_time + comp["on_duration"]
        else:
            comp["next_toggle"] = current_time + comp["off_duration"]

def set_valve(comp, value):
    if isinstance(comp["gpio"], tuple):
        comp["gpio"][0].set_value(1 if value else 0)
    else:
        comp["gpio"].set_value(1 if value else 0)

def adaptive_water_logic(comp_name, sensor_value, current_time):
    comp = components[comp_name]
    if "watering_until" not in comp:
        comp["watering_until"] = 0
    if sensor_value < 450:
        comp["state"] = True
        comp["watering_until"] = current_time + 5
    elif sensor_value < 680:
        if comp["state"]:
            comp["watering_until"] = current_time + 5
    else:
        comp["state"] = False
        comp["watering_until"] = 0

def handle_manual_mode(data):
    if data.get("bottom_initialized", False):
        if data.get("bottom_mode", "manual") == "manual":
            bottom_light_line.set_value(1 if data.get("bottom_man_light", False) else 0)
            bottom_valve_line.set_value(1 if data.get("bottom_man_water", False) else 0)
    if data.get("top_initialized", False):
        if data.get("top_mode", "manual") == "manual":
            top_light_line.set_value(1 if data.get("top_man_light", False) else 0)
            top_valve_line.set_value(1 if data.get("top_man_water", False) else 0)

def update_pump(data):
    bottom_mode = data.get("bottom_mode", "manual")
    if bottom_mode in ["scheduling", "adaptive"]:
        bottom_state = components["bottom_water"]["state"]
    else:
        bottom_state = data.get("bottom_man_water", False)
    top_mode = data.get("top_mode", "manual")
    if top_mode in ["scheduling", "adaptive"]:
        top_state = components["top_water"]["state"]
    else:
        top_state = data.get("top_man_water", False)
    pump_state = bottom_state or top_state
    pump_line.set_value(1 if pump_state else 0)

def update_heater(data, sensors):
    global heater_state
    current_temp = sensors.get("temp", 20)
    target_temp = data.get("target_temp", 25)
    if not heater_state and current_temp < (target_temp - 5):
        heater_state = True
    elif heater_state and current_temp >= target_temp:
        heater_state = False
    heater_line.set_value(1 if heater_state else 0)

# --- Main Event Loop ---
while True:
    current_time = time.monotonic()
    
    # Ultrasonic sampling
    if current_time >= next_ultrasonic_sample:
        distance_cm = ultrasonic_sensor.distance * 100
        sensor_readings_ref.update({"ultrasonic": distance_cm})
        next_ultrasonic_sample = current_time + 5

    data = ref.get()

    # Bottom light processing
    comp = components["bottom_light"]
    mode = data.get(comp["mode_key"], "manual")
    if data.get(comp["init_key"], False):
        if mode == "scheduling":
            if data.get(comp["edit_flag"], False):
                update_schedule("bottom_light", data, current_time)
                ref.update({comp["edit_flag"]: False})
            if current_time >= comp["next_toggle"]:
                comp["state"] = not comp["state"]
                comp["gpio"].set_value(1 if comp["state"] else 0)
                comp["next_toggle"] = current_time + (comp["on_duration"] if comp["state"] else comp["off_duration"])
        elif mode == "adaptive":
            if data.get("adp_bottom_light_edit", False):
                update_adaptive_schedule("bottom_light", data, current_time)
                ref.update({"adp_bottom_light_edit": False})
            if current_time >= comp["next_toggle"]:
                comp["state"] = not comp["state"]
                comp["gpio"].set_value(1 if comp["state"] else 0)
                comp["next_toggle"] = current_time + (comp["on_duration"] if comp["state"] else comp["off_duration"])

    # Top light processing
    comp = components["top_light"]
    mode = data.get(comp["mode_key"], "manual")
    if data.get(comp["init_key"], False):
        if mode == "scheduling":
            if data.get(comp["edit_flag"], False):
                update_schedule("top_light", data, current_time)
                ref.update({comp["edit_flag"]: False})
            if current_time >= comp["next_toggle"]:
                comp["state"] = not comp["state"]
                comp["gpio"].set_value(1 if comp["state"] else 0)
                comp["next_toggle"] = current_time + (comp["on_duration"] if comp["state"] else comp["off_duration"])
        elif mode == "adaptive":
            if data.get("adp_top_light_edit", False):
                update_adaptive_schedule("top_light", data, current_time)
                ref.update({"adp_top_light_edit": False})
            if current_time >= comp["next_toggle"]:
                comp["state"] = not comp["state"]
                comp["gpio"].set_value(1 if comp["state"] else 0)
                comp["next_toggle"] = current_time + (comp["on_duration"] if comp["state"] else comp["off_duration"])

    # Bottom water processing
    comp = components["bottom_water"]
    mode = data.get(comp["mode_key"], "manual")
    if data.get(comp["init_key"], False):
        if mode == "scheduling":
            if data.get(comp["edit_flag"], False):
                update_schedule("bottom_water", data, current_time)
                ref.update({comp["edit_flag"]: False})
            if current_time >= comp["next_toggle"]:
                comp["state"] = not comp["state"]
                set_valve(comp, comp["state"])
                comp["next_toggle"] = current_time + (comp["on_duration"] if comp["state"] else comp["off_duration"])
        elif mode == "adaptive":
            sensors = db.reference("Sensors").get()
            soil_value = sensors.get("soil_2", 700)
            adaptive_water_logic("bottom_water", soil_value, current_time)
            set_valve(comp, comp["state"])

    # Top water processing
    comp = components["top_water"]
    mode = data.get(comp["mode_key"], "manual")
    if data.get(comp["init_key"], False):
        if mode == "scheduling":
            if data.get(comp["edit_flag"], False):
                update_schedule("top_water", data, current_time)
                ref.update({comp["edit_flag"]: False})
            if current_time >= comp["next_toggle"]:
                comp["state"] = not comp["state"]
                set_valve(comp, comp["state"])
                comp["next_toggle"] = current_time + (comp["on_duration"] if comp["state"] else comp["off_duration"])
        elif mode == "adaptive":
            sensors = db.reference("Sensors").get()
            soil_value = sensors.get("soil_1", 700)
            adaptive_water_logic("top_water", soil_value, current_time)
            set_valve(comp, comp["state"])

    # Manual mode override
    handle_manual_mode(data)

    # Update pump
    update_pump(data)

    # Update heater
    sensors = db.reference("Sensors").get()
    update_heater(data, sensors)

    time.sleep(0.5)
