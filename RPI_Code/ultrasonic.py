import RPi.GPIO as GPIO
import time

# Set GPIO mode
GPIO.setmode(GPIO.BCM)

# Define GPIO pins
GPIO_TRIGGER = 14  # TRIG pin
GPIO_ECHO = 4      # ECHO pin

# Setup GPIO direction
GPIO.setup(GPIO_TRIGGER, GPIO.OUT)
GPIO.setup(GPIO_ECHO, GPIO.IN)

def measure_distance():
    """Measures the distance using HC-SR04 ultrasonic sensor."""
    # Send 10µs pulse to trigger
    GPIO.output(GPIO_TRIGGER, True)
    time.sleep(0.00001)
    GPIO.output(GPIO_TRIGGER, False)

    start_time = time.time()
    stop_time = time.time()

    # Wait for ECHO pin to go HIGH
    while GPIO.input(GPIO_ECHO) == 0:
        start_time = time.time()

    # Wait for ECHO pin to go LOW
    while GPIO.input(GPIO_ECHO) == 1:
        stop_time = time.time()

    # Time difference
    time_elapsed = stop_time - start_time

    # Distance calculation: Speed of sound = 34300 cm/s (divide by 2 for round trip)
    distance = (time_elapsed * 34300) / 2
    return distance

try:
    while True:
        dist = measure_distance()
        print(f"Measured Distance: {dist:.1f} cm")
        time.sleep(1)  # Delay for readability

except KeyboardInterrupt:
    print("Measurement stopped by User")
    GPIO.cleanup()
