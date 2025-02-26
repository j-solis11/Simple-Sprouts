import time
import threading
import firebase_admin
import firebase_admin.db
import gpiod

# Initialize Firebase
firebase_key_path = "/home/pi/project_code/firebase_key.json"  # Update if needed
cred = firebase_admin.credentials.Certificate(firebase_key_path)
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://simplesproutstest-default-rtdb.firebaseio.com/"
})

# Firebase Reference
ref = firebase_admin.db.reference("/read_test")

# GPIO Setup
LED_PIN = 17
chip = gpiod.Chip('gpiochip0')
led_line = chip.get_line(LED_PIN)
led_line.request(consumer="LED", type=gpiod.LINE_REQ_DIR_OUT)

# Global Variables
time_on = 1  # Default: 1 hour
time_off = 1  # Default: 1 hour
current_state = None  # Tracks if LED is currently ON or OFF
stop_flag = False  # Used to stop the timer thread

### **Function to Control LED Timing**
def led_control():
    global current_state

    while not stop_flag:
        print(f"Turning LED ON for {time_on} hours...")
        led_line.set_value(1)
        current_state = "ON"
        time.sleep(time_on * 3600)  # Convert hours to seconds

        print(f"Turning LED OFF for {time_off} hours...")
        led_line.set_value(0)
        current_state = "OFF"
        time.sleep(time_off * 3600)  # Convert hours to seconds

### **Function to Check Firebase for Updates Every 5 Seconds**
def firebase_listener():
    global time_on, time_off

    while not stop_flag:
        data = ref.get()
        if data:
            new_time_on = int(data.get("time_on", time_on))
            new_time_off = int(data.get("time_off", time_off))

            if new_time_on != time_on or new_time_off != time_off:
                print(f"Updated Firebase Values - time_on: {new_time_on}, time_off: {new_time_off}")
                time_on = new_time_on
                time_off = new_time_off
        else:
            print("No data found in Firebase.")

        time.sleep(5)  # Check Firebase every 5 seconds

# Start Both Threads
led_thread = threading.Thread(target=led_control, daemon=True)
firebase_thread = threading.Thread(target=firebase_listener, daemon=True)

led_thread.start()
firebase_thread.start()

try:
    while True:
        time.sleep(1)  # Keep the script running
except KeyboardInterrupt:
    stop_flag = True
    print("\nShutting down...")
    led_line.release()
    chip.close()
    print("GPIO released. Exiting...")
