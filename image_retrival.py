import requests
import base64
import ollama
import time


# Firebase URL pointing to the "Image_in_base64" field (include .json)
FIREBASE_URL_image = "https://simple-sprouts-database-default-rtdb.firebaseio.com/model/base64_image.json"
FIREBASE_URL_Response = "https://simple-sprouts-database-default-rtdb.firebaseio.com/response.json"
FIREBASE_URL_chat_flag = "https://simple-sprouts-database-default-rtdb.firebaseio.com/model/query_flag.json"


# Path to save the retrieved image
OUTPUT_IMAGE_PATH = "retrieved_image.jpg"

def retrieve_image_from_firebase():
    # Fetch the base64 image data from Firebase
    response = requests.get(FIREBASE_URL_image)
    if response.status_code == 200:
        image_data = response.json()  # Retrieve the base64 string
        if image_data:
            # Decode the base64 string and save it as an image file
            with open(OUTPUT_IMAGE_PATH, "wb") as image_file:
                image_file.write(base64.b64decode(image_data['Image_in_base64']))
            print(f"Image successfully retrieved and saved as {OUTPUT_IMAGE_PATH}")
        else:
            print("No image data found in the response.")
    else:
        print(f"Failed to retrieve image. HTTP Status Code: {response.status_code}")

def upload_to_firebase(data: dict,image) -> None:
        if image==1:
            response = requests.put(FIREBASE_URL_image, json=data)
        if image==2:
            response = requests.put(FIREBASE_URL_Response, json=data)
        if image==3:
            response = requests.put(FIREBASE_URL_chat_flag, json=data)
        print(f"Firebase response: {response.text}")
        response.close()

# Run the function
retrieve_image_from_firebase()

while True:
    getModel = requests.get(FIREBASE_URL_chat_flag)
    if getModel.status_code==200:
        run_Model = getModel.json()
        print(run_Model)
        retrieve_image_from_firebase()
        if run_Model['query_flag']=='True':   
            print("Asking model what it thinks")
            response = ollama.chat(
                model='llama3.2-vision',
                messages=[{
                    'role': 'user',
                    'content': 'Answer in a yes or no only, Are the fruits ripe?',
                    'images': ['retrieved_image.jpg']
                }]
            )
            print(response['message']['content'])

            data={"model_response": response['message']['content']}
            upload_to_firebase(data,2)
            data={"query_flag": "False"}
            upload_to_firebase(data,3)
        else:
            time.sleep(60*2)
            continue