import cv2
import ollama
import pyrebase
import base64
import json
import requests

FIREBASE_URL_image = "https://simple-sprouts-database-default-rtdb.firebaseio.com/image.json"
FIREBASE_URL_Response = "https://simple-sprouts-database-default-rtdb.firebaseio.com/response.json"

def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        base64_string = base64.b64encode(image_file.read()).decode("utf-8")
    return base64_string

def upload_to_firebase(data: dict,image) -> None:
        if image:
            response = requests.post(FIREBASE_URL_image, json=data)
        else:
            response = requests.post(FIREBASE_URL_Response, json=data)
        print(f"Firebase response: {response.text}")
        response.close()

# # Open the webcam
# cap = cv2.VideoCapture(0)

# # Capture a frame
# ret, frame = cap.read()
# print("finished Image capture")

# # Save the image
# cv2.imwrite('image.jpg', frame)
# print("Wrote image to a file")

# cap.release()
# print("asking llama")

# data ={
#     "Image_in_base64":image_to_base64("image.jpg")
# }

# print(image_to_base64("image.jpg"))

# upload_to_firebase(data,true)
response = ollama.chat(
    model='llama3.2-vision',
    messages=[{
        'role': 'user',
        'content': 'What is in this image?',
        'images': ['image.jpg']
    }]
)
print(response['message']['content'])

data={"model_response": response['message']['content']}
upload_to_firebase(data,False)

print(response)

