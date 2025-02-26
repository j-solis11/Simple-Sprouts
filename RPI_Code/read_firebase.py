import time
import firebase_admin
import firebase_admin.db

# Initialize Firebase
firebase_key_path = "/home/pi/project_code/firebase_key.json"  # Update if needed
cred = firebase_admin.credentials.Certificate(firebase_key_path)
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://simplesproutstest-default-rtdb.firebaseio.com/"
})

# Firebase Database Reference
ref = firebase_admin.db.reference("/read_test")

print("Reading Firebase data every 2 seconds...")

try:
    while True:
        # Fetch data from Firebase
        data = ref.get()
        if data:
            time_on = data.get("time_on", "N/A")
            time_off = data.get("time_off", "N/A")
            print(f"time_on: {time_on}, time_off: {time_off}")
        else:
            print("No data found in read_test node.")

        time.sleep(2)  # Wait for 2 seconds before the next read

except KeyboardInterrupt:
    print("\nScript interrupted by user. Exiting...")


