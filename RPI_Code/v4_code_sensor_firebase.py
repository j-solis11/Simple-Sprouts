import time
import board
import busio
import json
import firebase_admin
import firebase_admin.db  # Explicitly import the db module
import adafruit_sgp30
import adafruit_ahtx0
import adafruit_pct2075
import adafruit_seesaw.seesaw

# Initialize I2C bus
i2c_bus = busio.I2C(board.SCL, board.SDA)

# Initialize sensors
sgp30 = adafruit_sgp30.Adafruit_SGP30(i2c_bus)
aht20 = adafruit_ahtx0.AHTx0(i2c_bus)
pct2075 = adafruit_pct2075.PCT2075(i2c_bus)
soil_sensor_1 = adafruit_seesaw.seesaw.Seesaw(i2c_bus, addr=0x36)  # First soil sensor
soil_sensor_2 = adafruit_seesaw.seesaw.Seesaw(i2c_bus, addr=0x39)  # Second soil sensor

# Initialize SGP30 baseline
sgp30.iaq_init()
sgp30.set_iaq_baseline(0x8973, 0x8aae)

# Initialize Firebase
firebase_key_path = "/home/pi/project_code/firebase_key.json"  # Update if needed
cred = firebase_admin.credentials.Certificate(firebase_key_path)
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://simplesproutstest-default-rtdb.firebaseio.com/"
})

# Firebase Database Reference (Fixed Path)
ref = firebase_admin.db.reference("/sensor_readings")  # Reference the main node

print("Starting sensor readings and Firebase updates...")

while True:
    # Read AHT20 sensor (Temperature & Humidity)
    temperature_aht20 = aht20.temperature
    humidity = aht20.relative_humidity

    # Read PCT2075 sensor (Temperature)
    temperature_pct2075 = pct2075.temperature

    # Read SGP30 sensor (CO2 & TVOC)
    co2 = sgp30.eCO2
    tvoc = sgp30.TVOC

    # Read First Soil Sensor (Moisture & Temperature)
    soil_moisture_1 = soil_sensor_1.moisture_read()
    soil_temp_1 = soil_sensor_1.get_temp()
    
    # Read Second Soil Sensor (Moisture & Temperature)
    soil_moisture_2 = soil_sensor_2.moisture_read()
    soil_temp_2 = soil_sensor_2.get_temp()

    # Create data dictionary
    sensor_data = {
        "aht20": {"temperature": round(temperature_aht20, 2), "humidity": round(humidity, 2)},
        "pct2075": {"temperature": round(temperature_pct2075, 2)},
        "sgp30": {"co2": co2, "tvoc": tvoc},
        "soil_sensor_1": {"temperature": round(soil_temp_1, 2), "moisture": soil_moisture_1},
        "soil_sensor_2": {"temperature": round(soil_temp_2, 2), "moisture": soil_moisture_2},
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

    # Print sensor data locally
    print("\nSensor Readings:")
    print(json.dumps(sensor_data, indent=4))

    # Upload data to Firebase (overwrite the same entry)
    ref.child("latest").set(sensor_data)  # Overwrites "/sensor_readings/latest"

    print("Data updated in Firebase successfully.")

    # Wait before next reading
    time.sleep(2)
