import time
import board
import busio
from adafruit_sgp30 import Adafruit_SGP30
from adafruit_pct2075 import PCT2075
from adafruit_ahtx0 import AHT20

# Initialize I2C bus
i2c = busio.I2C(board.SCL, board.SDA)

# Initialize sensors
sgp30 = Adafruit_SGP30(i2c)
pct2075 = PCT2075(i2c)
aht20 = AHT20(i2c)

# Initialize SGP30 baseline
sgp30.iaq_init()
sgp30.set_iaq_baseline(0x8973, 0x8aae)

# Function to read all sensors
def read_sensors():
    # Read AHT20 (Temperature and Humidity)
    temp_aht20 = aht20.temperature
    humidity_aht20 = aht20.relative_humidity

    # Read PCT2075 (Temperature)
    temp_pct2075 = pct2075.temperature

    # Read SGP30 (CO2 and VOC)
    co2 = sgp30.eCO2
    tvoc = sgp30.TVOC

    # Display readings
    print(f"AHT20 - Temperature: {temp_aht20:.2f} C, Humidity: {humidity_aht20:.2f} %")
    print(f"PCT2075 - Temperature: {temp_pct2075:.2f} C")
    print(f"SGP30 - eCO2: {co2} ppm, TVOC: {tvoc} ppb")
    print("-" * 40)

# Main loop
while True:
    read_sensors()
    time.sleep(1)  # Wait for 1 second before next reading
