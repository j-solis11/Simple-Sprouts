import requests
import base64
import time
import moondream as md
from PIL import Image
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env
Api_key = os.getenv("API_KEY")

model = md.vl(api_key= "")

# Firebase URL pointing to the "Image_in_base64" field (include .json)
FIREBASE_URL_image = "https://simple-sprouts-database-default-rtdb.firebaseio.com/pages/more_info/plant_info/image.json"
FIREBASE_URL_Response = "https://simple-sprouts-database-default-rtdb.firebaseio.com/pages/more_info/plant_info/health_status_desc.json"
FIREBASE_URL_chat_flag = "https://simple-sprouts-database-default-rtdb.firebaseio.com/pages/more_info/plant_info/health_status_query.json"
# FIREBASE_URL_Init_curpage= "https://simple-sprouts-database-default-rtdb.firebaseio.com/pages/initialization/current_page.json"
FIREBASE_URL_Plant_query = "https://simple-sprouts-database-default-rtdb.firebaseio.com/pages/initialization/plant_valid_query.json"
FIREBASE_URL_Plant_valid="https://simple-sprouts-database-default-rtdb.firebaseio.com/pages/initialization/plant_valid.json"
FIREBASE_URL_Plant_name="https://simple-sprouts-database-default-rtdb.firebaseio.com/Plants.json"
# FIREBASE_URL_More_info_curpage= "https://simple-sprouts-database-default-rtdb.firebaseio.com/pages/more_info/current_page.json"
# FIREBASE_URL_More_info_plant_info_curpage="https://simple-sprouts-database-default-rtdb.firebaseio.com/pages/more_info/plant_info/current_page.json"

FIREBASE_URL_query_LLM="https://simple-sprouts-database-default-rtdb.firebaseio.com/llm.json"
FIREBASE_URL_query_LLM_flag="https://simple-sprouts-database-default-rtdb.firebaseio.com/llm/query_flag.json"
FIREBASE_URL_query_LLM_response="https://simple-sprouts-database-default-rtdb.firebaseio.com/llm/response.json"



# Path to save the retrieved image
OUTPUT0_ORIGINAL_PATH = "original_0.png"
OUTPUT0_CLRMAPPED_PATH = "color_mapped_image_0.png"
OUTPUT1_ORIGINAL_PATH = "ooriginal_1.png"
OUTPUT1_CLRMAPPED_PATH = "color_mapped_image_1.png"

def retrieve_image_from_firebase():
    # Fetch the base64 image data from Firebase
    response = requests.get(FIREBASE_URL_image)
    if response.status_code == 200:
        image_data = response.json()  # Retrieve the base64 string
        if image_data:
            # Decode the base64 string and save it as an image file
            with open(OUTPUT_ORIGINAL_PATH, "wb") as image_file:
                image_file.write(base64.b64decode(image_data['Image_in_base64_original']))
            print(f"Image successfully retrieved and saved as {OUTPUT_ORIGINAL_PATH}")
            with open(OUTPUT_CLRMAPPED_PATH, "wb") as image_file:
                image_file.write(base64.b64decode(image_data['Image_in_base64_color_mapped']))
            print(f"Image successfully retrieved and saved as {OUTPUT_CLRMAPPED_PATH}")
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
        if image==4:
            response = requests.put(FIREBASE_URL_Plant_query, json=data)
        if image==5:
            response = requests.put(FIREBASE_URL_Plant_valid, json=data)
        if image==6:
            response = requests.put(FIREBASE_URL_query_LLM, json=data)
        if image==7:
            response = requests.put(FIREBASE_URL_query_LLM_response, json=data)
        print(f"Firebase response: {response.text}")
        response.close()

# Run the function
# retrieve_image_from_firebase()

while True:
    getModel = requests.get(FIREBASE_URL_chat_flag)
    getPlantQuery =requests.get(FIREBASE_URL_Plant_query)
    getPlntvalid =requests.get(FIREBASE_URL_Plant_valid)
    getPltname =requests.get(FIREBASE_URL_Plant_name)
    getQueryLLM =requests.get(FIREBASE_URL_query_LLM)

    if getModel.status_code==200:
        run_Model = getModel.json()
        run_PlantQuery = getPlantQuery.json()
        run_Plntvalid = getPlntvalid.json()
        run_Pltname = getPltname.json()
        run_QueryLLM=getQueryLLM.json()

        print(run_Pltname)
        # retrieve_image_from_firebase()
        image = Image.open(OUTPUT0_CLRMAPPED_PATH)
        encoded_image = model.encode_image(image)

        if run_QueryLLM['query_flag']:
            #0-1 is asking if the plant can be planted indoors, 2-3 asks if the plant is healthy, 4-5 asks how many hours of growlight does the plant need

            if run_QueryLLM['cmd_id']==0: #bottom layer
                answer_plant_indoors = model.query(encoded_image, f"Ignore the image, Can {run_Pltname['Bottom']} be planted indoor enviroment with growlights?")["answer"]
                print("Answer:", answer_plant_indoors)
                data={"response":answer_plant_indoors, "query_flag": False, "cmd_id":0}
                upload_to_firebase(data,6)
                # data={"query_flag": False}
                # upload_to_firebase(data,6)

            if run_QueryLLM['cmd_id']==1: #bottom layer
                answer_plant_indoors = model.query(encoded_image, f"Ignore the image, Can {run_Pltname['Top']} be planted indoor enviroment with growlights?")["answer"]
                print("Answer:", answer_plant_indoors)
                data={"response":answer_plant_indoors, "query_flag": False, "cmd_id":0}
                upload_to_firebase(data,6)
                # data={"query_flag": False}
                # upload_to_firebase(data,6)

            if run_QueryLLM['cmd_id']==2:   #this is going to be for lower level
                print("Asking model what it thinks")
                image = Image.open(OUTPUT0_CLRMAPPED_PATH)
                encoded_image = model.encode_image(image)
                answer = model.query(encoded_image, "Red means healthy plant, is this plant healthy?")["answer"]
                print("Answer:", answer)
                data={"response": answer,"query_flag": False, "cmd_id":1}
                upload_to_firebase(data,6)
                # data={"query_flag": "False"}
                # upload_to_firebase(data,6)

            if run_QueryLLM['cmd_id']==3:   #this is going to be for upper level
                print("Asking model what it thinks")
                image = Image.open(OUTPUT1_CLRMAPPED_PATH)
                encoded_image = model.encode_image(image)
                answer = model.query(encoded_image, "Red means healthy plant, is this plant healthy?")["answer"]
                print("Answer:", answer)
                data={"response": answer,"query_flag": False, "cmd_id":1}
                upload_to_firebase(data,6)
                # data={"query_flag": "False"}
                # upload_to_firebase(data,6)
                    
            if run_QueryLLM['cmd_id']==4:   #this is going to be for lower level
                print("Asking model what it thinks")
                image = Image.open(OUTPUT0_CLRMAPPED_PATH)
                encoded_image = model.encode_image(image)
                answer = model.query(encoded_image, f"I have {run_Pltname['Bottom']} in an enclosure, how many hours of growlight will it need, give an average.")["answer"]
                print("Answer:", answer)
                data={"response": answer,"query_flag": False, "cmd_id":1}
                upload_to_firebase(data,6)
                # data={"query_flag": "False"}
                # upload_to_firebase(data,6)

            if run_QueryLLM['cmd_id']==5:   #this is going to be for upper level
                print("Asking model what it thinks")
                image = Image.open(OUTPUT1_CLRMAPPED_PATH)
                encoded_image = model.encode_image(image)
                answer = model.query(encoded_image, f"I have {run_Pltname['Top']} is in an enclosure, how many hours of growlight will it need, give only a number.")["answer"]
                print("Answer:", answer)
                data={"response": answer,"query_flag": False, "cmd_id":1}
                upload_to_firebase(data,6)
                # data={"query_flag": "False"}
                # upload_to_firebase(data,6)  
        else:
            time.sleep(5)
            continue