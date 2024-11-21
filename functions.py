import cv2
import ollama
import pyrebase
import base64
import json
import requests
import time

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

def retrieve_image_from_firebase():
    # Fetch the base64 image data from Firebase
    response = requests.get(FIREBASE_URL)
    if response.status_code == 200:
        image_data = response.json()  # Retrieve the base64 string
        if image_data:
            # Decode the base64 string and save it as an image file
            with open(OUTPUT_IMAGE_PATH, "wb") as image_file:
                print(image_data)
                image_file.write(base64.b64decode(image_data['Image_in_base64']))
            print(f"Image successfully retrieved and saved as {OUTPUT_IMAGE_PATH}")
        else:
            print("No image data found in the response.")
    else:
        print(f"Failed to retrieve image. HTTP Status Code: {response.status_code}")