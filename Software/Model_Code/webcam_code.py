import cv2
import pyrebase
import base64
import json
import requests
import time
import numpy as np
from fastiecm import fastiecm
from picamzero import Camera


FIREBASE_URL_image = "https://simple-sprouts-database-default-rtdb.firebaseio.com/pages/more_info/plant_info/image.json"
FIREBASE_URL_Response = "https://simple-sprouts-database-default-rtdb.firebaseio.com/pages/more_info/plant_info/health_status_desc.json"

def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        base64_string = base64.b64encode(image_file.read()).decode("utf-8")
    return base64_string

def delete_previous_image():
    # DELETE request to remove the previous image
    response = requests.delete(FIREBASE_URL_image)
    print(f"Deleted previous image: {response.status_code}")
    response.close()

def upload_to_firebase(data: dict,image) -> None:
        if image:
            response = requests.put(FIREBASE_URL_image, json=data)
        else:
            response = requests.put(FIREBASE_URL_Response, json=data)
        print(f"Firebase response: {response.text}")
        response.close()

def display(image, image_name):
    image = np.array(image, dtype=float)/float(255)
    shape = image.shape
    height = int(shape[0] / 2)
    width = int(shape[1] / 2)
    image = cv2.resize(image, (width, height))
    cv2.namedWindow(image_name)
    cv2.imshow(image_name, image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def calc_ndvi(image):
    b, g, r = cv2.split(image)
    bottom = (r.astype(float) + b.astype(float))
    bottom[bottom==0] = 0.01
    ndvi = (b.astype(float) - r) / bottom
    return ndvi

def contrast_stretch(im):
    in_min = np.percentile(im, 5)
    in_max = np.percentile(im, 95)

    out_min = 0.0
    out_max = 255.0

    out = im - in_min
    out *= ((out_min - out_max) / (in_min - in_max))
    out += in_min

    return out

while True:
    # Open the webcam
    cap = cv2.VideoCapture(0)

    # Capture a frame
    ret, frame = cap.read()
    print("finished Image capture")

    # Save the image
    cv2.imwrite('image.jpg', frame)
    print("Wrote image to a file")

    cap.release()
    print("asking llama")

    data ={
        "Image_in_base64":image_to_base64("image.jpg")
    }

    print(image_to_base64("image.jpg"))

    upload_to_firebase(data,True)
    time.sleep(2*60)


