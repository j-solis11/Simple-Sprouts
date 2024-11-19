import requests
import base64

# Firebase URL pointing to the "Image_in_base64" field (include .json)
FIREBASE_URL = "https://simple-sprouts-database-default-rtdb.firebaseio.com/image/-OC1jDPMyezItNSIo7IY/Image_in_base64.json"

# Path to save the retrieved image
OUTPUT_IMAGE_PATH = "retrieved_image.jpg"

def retrieve_image_from_firebase():
    # Fetch the base64 image data from Firebase
    response = requests.get(FIREBASE_URL)
    if response.status_code == 200:
        image_data = response.json()  # Retrieve the base64 string
        if image_data:
            # Decode the base64 string and save it as an image file
            with open(OUTPUT_IMAGE_PATH, "wb") as image_file:
                image_file.write(base64.b64decode(image_data))
            print(f"Image successfully retrieved and saved as {OUTPUT_IMAGE_PATH}")
        else:
            print("No image data found in the response.")
    else:
        print(f"Failed to retrieve image. HTTP Status Code: {response.status_code}")

# Run the function
retrieve_image_from_firebase()
