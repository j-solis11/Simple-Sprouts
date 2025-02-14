import time
import board
import busio
import firebase_admin
import firebase_admin.db
import adafruit_sgp30
import adafruit_pct2075
import adafruit_ahtx0

# Firebase setup
DATABASE_URL = 'https://simple-sprouts-database-default-rtdb.firebaseio.com/'  # Update with your database URL

firebase_admin.initialize_app(options={'databaseURL': DATABASE_URL})
ref = firebase_admin.db.reference('sensor_readings')

# Initialize I2C
i2c = busio.I2C(board.SCL, board.SDA)

# Initialize sensors
aht20 = adafruit_ahtx0.AHT20(i2c)
pct2075 = adafruit_pct2075.PCT2075(i2c)
sgp30 = adafruit_sgp30.Adafruit_SGP30(i2c)
sgp30.iaq_init()

# Function to read sensors and write data to Firebase
def log_sensor_data():
    temp_aht20 = aht20.temperature
    humidity_aht20 = aht20.relative_humidity
    temp_pct2075 = pct2075.temperature
    co2 = sgp30.eCO2
    tvoc = sgp30.TVOC
    
    data = {
        'AHT20_Temperature': temp_aht20,
        'AHT20_Humidity': humidity_aht20,
        'PCT2075_Temperature': temp_pct2075,
        'SGP30_eCO2': co2,
        'SGP30_TVOC': tvoc,
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
    }
    
    ref.push(data)
    print("Data written to Firebase:", data)

# Main loop
while True:
    log_sensor_data()
    time.sleep(1)  # Log data every second
