import time
import board
import busio
import adafruit_sgp30
import adafruit_ahtx0
import adafruit_pct2075
import adafruit_seesaw.seesaw

# Initialize I2C1 (Default: GPIO2 = SDA1, GPIO3 = SCL1) for most sensors
i2c1 = busio.I2C(board.SCL, board.SDA)  

# Initialize I2C0 (New: GPIO0 = SDA0, GPIO1 = SCL0) for SGP30
i2c0 = busio.I2C(board.I2C().scl, board.I2C().sda, bus=0)  

# Initialize sensors on their respective buses
sgp30 = adafruit_sgp30.Adafruit_SGP30(i2c0)  # SGP30 on I2C0
aht20 = adafruit_ahtx0.AHTx0(i2c1)  # AHT20 on I2C1
pct2075 = adafruit_pct2075.PCT2075(i2c1)  # PCT2075 on I2C1
soil_sensor = adafruit_seesaw.seesaw.Seesaw(i2c1, addr=0x36)  # Soil Sensor on I2C1

# Initialize SGP30 baseline
sgp30.iaq_init()
sgp30.set_iaq_baseline(0x8973, 0x8aae)

print("Starting sensor readings...")

while True:
    # Read AHT20 sensor (Temperature & Humidity)
    temperature_aht20 = aht20.temperature
    humidity = aht20.relative_humidity

    # Read PCT2075 sensor (Temperature)
    temperature_pct2075 = pct2075.temperature

    # Read SGP30 sensor (CO2 & TVOC) from I2C0
    co2 = sgp30.eCO2
    tvoc = sgp30.TVOC

    # Read Soil Sensor (Moisture & Temperature)
    soil_moisture = soil_sensor.moisture_read()
    soil_temp = soil_sensor.get_temp()

    # Print sensor data
    print("\nSensor Readings:")
    print(f"AHT20 - Temperature: {temperature_aht20:.2f}°C, Humidity: {humidity:.2f}%")
    print(f"PCT2075 - Temperature: {temperature_pct2075:.2f}°C")
    print(f"SGP30 - CO2: {co2} ppm, TVOC: {tvoc} ppb (Using I2C0)")
    print(f"Soil Sensor - Temperature: {soil_temp:.2f}°C, Moisture: {soil_moisture}")

    # Wait before next reading
    time.sleep(2)
