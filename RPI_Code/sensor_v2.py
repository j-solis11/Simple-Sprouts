import board
import busio
import adafruit_sgp30
import adafruit_ahtx0
import adafruit_pct2075
import adafruit_seesaw.seesaw  # Import the seesaw submodule
import time

# Initialize I2C bus
i2c = busio.I2C(board.SCL, board.SDA)

# Initialize sensors
sgp30 = adafruit_sgp30.Adafruit_SGP30(i2c)
aht20 = adafruit_ahtx0.AHTx0(i2c)
pct2075 = adafruit_pct2075.PCT2075(i2c)
soil_sensor = adafruit_seesaw.seesaw.Seesaw(i2c, 0x36)  # Corrected way to access Seesaw

# Initialize SGP30 baseline
sgp30.iaq_init()
sgp30.set_iaq_baseline(0x8973, 0x8aae)

print("Starting sensor readings...")

while True:
    # Read temperature & humidity from AHT20
    temperature_aht20 = aht20.temperature
    humidity = aht20.relative_humidity

    # Read temperature from PCT2075
    temperature_pct2075 = pct2075.temperature

    # Read CO2 & TVOC from SGP30
    co2 = sgp30.eCO2
    tvoc = sgp30.TVOC

    # Read moisture from soil sensor
    soil_moisture = soil_sensor.moisture_read()

    # Print sensor data
    print("\nSensor Readings:")
    print(f"AHT20 - Temperature: {temperature_aht20:.2f}°C, Humidity: {humidity:.2f}%")
    print(f"PCT2075 - Temperature: {temperature_pct2075:.2f}°C")
    print(f"SGP30 - CO2: {co2} ppm, TVOC: {tvoc} ppb")
    print(f"Soil Sensor - Moisture: {soil_moisture}")

    # Wait before next reading
    time.sleep(2)
