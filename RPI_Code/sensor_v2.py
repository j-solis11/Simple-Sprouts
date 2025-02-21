import time
import board
import busio
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
soil_sensor = adafruit_seesaw.seesaw.Seesaw(i2c_bus, addr=0x36)  # Update address if needed

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

    # Read SGP30 sensor (CO2 & TVOC)
    co2 = sgp30.eCO2
    tvoc = sgp30.TVOC

    # Read Soil Sensor (Moisture & Temperature)
    soil_moisture = soil_sensor.moisture_read()
    soil_temp = soil_sensor.get_temp()

    # Print sensor data
    print("\nSensor Readings:")
    print(f"AHT20 - Temperature: {temperature_aht20:.2f}°C, Humidity: {humidity:.2f}%")
    print(f"PCT2075 - Temperature: {temperature_pct2075:.2f}°C")
    print(f"SGP30 - CO2: {co2} ppm, TVOC: {tvoc} ppb")
    print(f"Soil Sensor - Temperature: {soil_temp:.2f}°C, Moisture: {soil_moisture}")

    # Wait before next reading
    time.sleep(2)
