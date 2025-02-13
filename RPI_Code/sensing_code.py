import time
import smbus2
import board
import busio

# Constants for I2C Addresses
AHT20_ADDR = 0x38
PCT2075_ADDR = 0x48
SGP30_ADDR = 0x58

# Initialize I2C
bus = smbus2.SMBus(1)

# Function to read temperature and humidity from AHT20
def read_aht20():
    bus.write_byte(AHT20_ADDR, 0xAC)  # Trigger measurement
    time.sleep(0.1)  # Wait for conversion

    data = bus.read_i2c_block_data(AHT20_ADDR, 0x00, 6)
    humidity = ((data[1] << 8) | data[2]) / 65536.0 * 100.0
    temperature = (((data[3] & 0x0F) << 16) | (data[4] << 8) | data[5]) / 65536.0 * 200.0 - 50.0
    
    return temperature, humidity

# Function to read temperature from PCT2075
def read_pct2075():
    data = bus.read_i2c_block_data(PCT2075_ADDR, 0x00, 2)
    temp = ((data[0] << 8) | data[1]) >> 5
    temp = temp * 0.125  # Convert to Celsius
    return temp

# Function to read CO2 and TVOC from SGP30
def read_sgp30():
    bus.write_i2c_block_data(SGP30_ADDR, 0x20, [0x08])  # Start measurement
    time.sleep(0.1)
    
    data = bus.read_i2c_block_data(SGP30_ADDR, 0x00, 6)
    co2 = (data[0] << 8) | data[1]
    tvoc = (data[3] << 8) | data[4]
    
    return co2, tvoc

# Main Loop
while True:
    try:
        temp_aht20, humidity = read_aht20()
        temp_pct2075 = read_pct2075()
        co2, tvoc = read_sgp30()

        print(f"AHT20 - Temperature: {temp_aht20:.2f}°C, Humidity: {humidity:.2f}%")
        print(f"PCT2075 - Temperature: {temp_pct2075:.2f}°C")
        print(f"SGP30 - CO2: {co2} ppm, TVOC: {tvoc} ppb")
        print("-" * 40)

    except Exception as e:
        print(f"Error reading sensors: {e}")

    time.sleep(5)
