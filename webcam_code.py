import cv2
import numpy as np

def is_ripe(image):
    """
    Determines ripeness based on color in the image.
    Adjust color ranges as needed for different produce.
    """
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    lower_color = np.array([0, 100, 100]) 
    upper_color = np.array([10, 255, 255]) 

    mask = cv2.inRange(hsv, lower_color, upper_color)

    ripe_area = cv2.countNonZero(mask)
    total_area = image.shape[0] * image.shape[1]
    ripe_percentage = (ripe_area / total_area) * 100

    ripe_threshold = 20  

    return ripe_percentage >= ripe_threshold

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open webcam.")
else:
    ret, frame = cap.read()
    if ret:
        if is_ripe(frame):
            print("The fruit is ripe!")
        else:
            print("The fruit is not ripe.")

        cv2.imshow('Webcam Image', frame)
        cv2.waitKey(0)

    else:
        print("Error: Could not capture image.")

cap.release()
cv2.destroyAllWindows()
