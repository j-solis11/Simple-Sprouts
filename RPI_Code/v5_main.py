import firebase_admin
from firebase_admin import credentials, db
import time

global app_open, level_under_test, bottom_initialized, bottom_mode, bottom_man_light, bottom_man_water
global botton_mode_edited, bottom_light_ref_off_hrs, bottom_light_ref_on_hrs, bottom_light_ref_off_mins
global bottom_light_ref_on_mins, bottom_light_tts_hrs, bottom_light_tts_mins, bottom_water_ref_days
global bottom_water_ref_hrs, bottom_water_ref_min, bottom_water_ttw_days, bottom_water_ttw_hrs, bottom_water_ttw_min
global top_initialized, top_mode, top_man_light, top_man_water, top_mode_edited, top_light_ref_off_hrs
global top_light_ref_on_hrs, top_light_ref_off_mins, top_light_ref_on_mins, top_light_tts_hrs, top_light_tts_mins
global top_water_ref_days, top_water_ref_hrs, top_water_ref_min, top_water_ttw_days, top_water_ttw_hrs, top_water_ttw_min

# Initialize Firebase (Ensure you have a Firebase Admin SDK JSON file or use anonymous authentication)
cred = credentials.Certificate("/home/pi/project_code/firebase_key.json")  # Replace with your actual credentials file
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://simple-sprouts-database-default-rtdb.firebaseio.com/'
})

# Reference to the database location
ref = db.reference("flags_test")

def fetch_flags():
    
    data = ref.get()
    if data:
        app_open = data.get("app_open", False)
        level_under_test = data.get("level_under_test", 0)
        bottom_initialized = data.get("bottom_initialized", False)
        bottom_mode = data.get("bottom_mode", "manual")
        bottom_man_light = data.get("bottom_man_light", False)
        bottom_man_water = data.get("bottom_man_water", False)
        botton_mode_edited = data.get("botton_mode_edited", False)
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
        top_mode_edited = data.get("top_mode_edited", False)
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
        
        print("Updated Flags:")
        for key, value in data.items():
            print(f"{key}: {value}")
    else:
        print("No data found in flags_test")

# Continuously fetch data every 3 seconds
while True:
    fetch_flags()
    time.sleep(3)
