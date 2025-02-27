import firebase_admin
from firebase_admin import credentials, db

# Path to your Firebase service account key JSON file
firebase_key_path = "/home/pi/project_code/firebase_key.json"  # Update if needed

# Initialize Firebase Admin SDK (Only if it's not already initialized)
if not firebase_admin._apps:
    cred = credentials.Certificate(firebase_key_path)
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://simple-sprouts-database-default-rtdb.firebaseio.com/"
    })

# Firebase Database References
levels_ref = db.reference("/levels")          # Reference to "levels" section
general_info_ref = db.reference("/general_info")  # Reference to "general_info" section

# Fetch data from Firebase
levels_data = levels_ref.get()
general_info_data = general_info_ref.get()

# Print Levels Data
print("\n--- Levels Section ---")
print(levels_data if levels_data else "No data found in 'levels'.")

# Print General Info Data
print("\n--- General Info Section ---")
print(general_info_data if general_info_data else "No data found in 'general_info'.")

print("\nProgram completed. Exiting...")
