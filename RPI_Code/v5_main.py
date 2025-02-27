import time
import firebase_admin
from firebase_admin import credentials, db

# Initialize Firebase
firebase_key_path = "/home/pi/project_code/firebase_key.json"  # Path to your Firebase credentials JSON
cred = credentials.Certificate(firebase_key_path)
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://simple-sprouts-database-default-rtdb.firebaseio.com/"
})

# Firebase Database References
levels_ref = db.reference("/levels")
general_info_ref = db.reference("/general_info")

print("Reading Firebase data every 2 seconds...")

try:
    while True:
        # Fetch data from Firebase
        levels_data = levels_ref.get()
        general_info_data = general_info_ref.get()

        # Default to empty dictionary if no data is found
        levels_data = levels_data if levels_data else {}
        general_info_data = general_info_data if general_info_data else {}

        print("Levels Data:", levels_data)
        print("General Info Data:", general_info_data)

        time.sleep(3)  # Wait for 2 seconds before the next read

except KeyboardInterrupt:
    print("\nScript interrupted by user. Exiting...")
