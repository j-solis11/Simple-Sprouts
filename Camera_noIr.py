import cv2
import pyrebase
import base64
import json
import requests
import time
import numpy as np
from fastiecm import fastiecm
from picamzero import Camera
from picamera2 import Picamera2
from PIL import Image

FIREBASE_URL_image = "https://simple-sprouts-database-default-rtdb.firebaseio.com/images.json"
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
    #ndvi = (b.astype(float) - r) / bottom
    ndvi = (r.astype(float) - b.astype(float)) / (r.astype(float) + b.astype(float))
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

cam0 = Picamera2(0)
cam1 = Picamera2(1)
config0 = cam0.create_still_configuration(main={"size": (1920, 1080)})
config1 = cam1.create_still_configuration(main={"size": (1920, 1080)})
cam0.configure(config0)
cam1.configure(config1)
cam0.start()
cam1.start()
# Apply rotation
#cam0.set_controls({"Rotation": 180})
#cam1.set_controls({"Rotation": 180})
time.sleep(2)

while True:


    key = cv2.waitKey(0)
    if key == ord('q'):
        print("Quitting and closing cameras.")
        break

    image0 = cam0.capture_array()
    image1 = cam1.capture_array()
    image0 = cv2.rotate(image0, cv2.ROTATE_180)
    image1 = cv2.rotate(image1, cv2.ROTATE_180)

    # Convert to RGB
    image0 = cv2.cvtColor(image0, cv2.COLOR_BGR2RGB)
    image1 = cv2.cvtColor(image1, cv2.COLOR_BGR2RGB)
    # # Open the webcam
    # cam = Camera()
    # cam.rotation = 180
    # cam.still_size = (1920, 1080) # Uncomment if using a Pi Noir camera
    # #cam.still_size = (2592, 1952) # Comment this line if using a Pi Noir camera

    # stream = cam.capture_array()
    # original = stream

    contrasted = contrast_stretch(image0)
    ndvi = calc_ndvi(contrasted)
    ndvi_contrasted = contrast_stretch(ndvi)
    color_mapped_prep = ndvi_contrasted.astype(np.uint8)
    color_mapped_image_0 = cv2.applyColorMap(color_mapped_prep, fastiecm)
    # cv2.imwrite('color_mapped_image.png', color_mapped_image_1)
    # cv2.imwrite('original.png', original)
    #display(color_mapped_image_0,"nvdi")
    Image.fromarray(cv2.cvtColor(color_mapped_image_0, cv2.COLOR_BGR2RGB)).save("color_mapped_image_0.png")
    Image.fromarray(cv2.cvtColor(image0, cv2.COLOR_BGR2RGB)).save("original_0.png")


    contrasted = contrast_stretch(image1)
    ndvi = calc_ndvi(contrasted)
    ndvi_contrasted = contrast_stretch(ndvi)
    color_mapped_prep = ndvi_contrasted.astype(np.uint8)
    color_mapped_image_1 = cv2.applyColorMap(color_mapped_prep, fastiecm)
    #display(color_mapped_image_1,"nvdi1")
    Image.fromarray(cv2.cvtColor(color_mapped_image_1, cv2.COLOR_BGR2RGB)).save("color_mapped_image_1.png")
    Image.fromarray(cv2.cvtColor(image1, cv2.COLOR_BGR2RGB)).save("original_1.png")


    data ={
        "Image_in_base64_original_0":image_to_base64("original_0.png"),
        "Image_in_base64_color_mapped_0":image_to_base64("color_mapped_image_0.png"),
        "Image_in_base64_original_1":image_to_base64("original_1.png"),
        "Image_in_base64_color_mapped_1":image_to_base64("color_mapped_image_1.png")
    }

    upload_to_firebase(data,True)

    print("done")
    time.sleep(2*60)

cam0.stop()
cam1.stop()