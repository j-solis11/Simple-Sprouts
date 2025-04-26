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
FIREBASE_URL_health_report="https://simple-sprouts-database-default-rtdb.firebaseio.com/health_report.json"
FIREBASE_URL_Plant_stage_top="https://simple-sprouts-database-default-rtdb.firebaseio.com/Plant_stages/Top.json"
FIREBASE_URL_Plant_stage_bottom="https://simple-sprouts-database-default-rtdb.firebaseio.com/Plant_stages/Bottom.json"
FIREBASE_URL_User_query="https://simple-sprouts-database-default-rtdb.firebaseio.com/User_query.json"


# Path to save the retrieved image
OUTPUT0_ORIGINAL_PATH = "original_0.png"
OUTPUT0_CLRMAPPED_PATH = "color_mapped_image_0.png"
OUTPUT1_ORIGINAL_PATH = "original_1.png"
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
        if image==8:
            response = requests.put(FIREBASE_URL_health_report, json=data)
        if image==9:
            response = requests.put(FIREBASE_URL_Plant_stage_top, json=data)
        if image==10:
            response = requests.put(FIREBASE_URL_Plant_stage_bottom, json=data)
        print(f"Firebase response: {response.text}")
        response.close()

# Run the function
# retrieve_image_from_firebase()

while True:
    getModel = requests.get(FIREBASE_URL_chat_flag)
    # getPlantQuery =requests.get(FIREBASE_URL_Plant_query)
    # getPlntvalid =requests.get(FIREBASE_URL_Plant_valid)
    # getPltname =requests.get(FIREBASE_URL_Plant_name)
    # run_Pltname = getPltname.json()
    getQueryLLM =requests.get(FIREBASE_URL_query_LLM)
    # getUserQuery =requests.get(FIREBASE_URL_User_query)
    # run_UserQuery=getUserQuery.json()


    if getModel.status_code==200:
        # run_Model = getModel.json()
        # run_PlantQuery = getPlantQuery.json()
        # run_Plntvalid = getPlntvalid.json()
        run_QueryLLM=getQueryLLM.json()

        print(run_Pltname)
        # retrieve_image_from_firebase()
        image = Image.open(OUTPUT0_ORIGINAL_PATH)
        encoded_image = model.encode_image(image)

        if run_QueryLLM['query_flag']:
            #0-1 is asking if the plant can be planted indoors, 2-3 asks if the plant is healthy,
            #4-5 asks how many hours of growlight does the plant need, 6-7 asks about the stages of each plant,
            #8-9 ask about harvest time, 10-11 allow user to directly prompt the model.

            if run_QueryLLM['cmd_id']==0: #bottom layer
                getPltname =requests.get(FIREBASE_URL_Plant_name)
                run_Pltname = getPltname.json()
                answer_plant_indoors = model.query(encoded_image, f"Ignore the image, Can {run_Pltname['Bottom']} be planted indoor enviroment with growlights?")["answer"]
                print("Answer:", answer_plant_indoors)
                data={"response":answer_plant_indoors, "query_flag": False, "cmd_id":0}
                upload_to_firebase(data,6)
                # data={"query_flag": False}
                # upload_to_firebase(data,6)

            if run_QueryLLM['cmd_id']==1: #bottom layer
                getPltname =requests.get(FIREBASE_URL_Plant_name)
                run_Pltname = getPltname.json()
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

                image = Image.open(OUTPUT0_ORIGINAL_PATH)
                encoded_image = model.encode_image(image)
                answer_blight = model.query(encoded_image, "Is there any visible blight on this plant?")["answer"]
                answer_healthy_image = model.query(encoded_image, "Is this plant healthy?")["answer"]
                answer_discolor = model.query(encoded_image, "Is there any visible leafs discolouring on the plant?")["answer"]
                answer_legging = model.query(encoded_image, "Is the plant visibly legging?")["answer"]
                answer_pests = model.query(encoded_image, "Are there any pests in box?")["answer"]
                data={'blight': answer_blight,'healthy_image': answer_healthy_image,'leaf_discolor': answer_discolor,'legging': answer_legging,'pest': answer_pests}
                upload_to_firebase(data,8)
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

                image = Image.open(OUTPUT1_ORIGINAL_PATH)
                encoded_image = model.encode_image(image)
                answer_blight = model.query(encoded_image, "Is there any visible blight on this plant?")["answer"]
                answer_healthy_image = model.query(encoded_image, "Is this plant healthy?")["answer"]
                answer_discolor = model.query(encoded_image, "Is there any visible leafs discolouring on the plant?")["answer"]
                answer_legging = model.query(encoded_image, "Is the plant visibly legging?")["answer"]
                answer_pests = model.query(encoded_image, "Are there any pests in box?")["answer"]
                data={'blight': answer_blight,'healthy_image': answer_healthy_image,'leaf_discolor': answer_discolor,'legging': answer_legging,'pest': answer_pests}
                upload_to_firebase(data,8)

                # data={"query_flag": "False"}
                # upload_to_firebase(data,6)
                    
            if run_QueryLLM['cmd_id']==4:   #this is going to be for lower level
                getPltname =requests.get(FIREBASE_URL_Plant_name)
                run_Pltname = getPltname.json()
                print("Asking model what it thinks")
                image = Image.open(OUTPUT0_ORIGINAL_PATH)
                encoded_image = model.encode_image(image)
                answer = model.query(encoded_image, f"I have {run_Pltname['Bottom']} in an enclosure, how many hours of growlight will it need, give an average.")["answer"]
                print("Answer:", answer)
                data={"response": answer,"query_flag": False, "cmd_id":1}
                upload_to_firebase(data,6)

                data={'Bottom_plant_on':answer}
                response = requests.put("https://simple-sprouts-database-default-rtdb.firebaseio.com/Plant_light_time/Bottom_plant_on.json", json=data)
                # data={"query_flag": "False"}
                # upload_to_firebase(data,6)

            if run_QueryLLM['cmd_id']==5:   #this is going to be for upper level
                getPltname =requests.get(FIREBASE_URL_Plant_name)
                run_Pltname = getPltname.json()
                print("Asking model what it thinks")
                image = Image.open(OUTPUT1_ORIGINAL_PATH)
                encoded_image = model.encode_image(image)
                answer = model.query(encoded_image, f"I have {run_Pltname['Top']} is in an enclosure, how many hours of growlight will it need, give only a number.")["answer"]
                print("Answer:", answer)
                data={"response": answer,"query_flag": False, "cmd_id":1}
                upload_to_firebase(data,6)
                data={'Top_plant_on':answer}
                response = requests.put("https://simple-sprouts-database-default-rtdb.firebaseio.com/Plant_light_time/Top_plant_on.json", json=data)
                # data={"query_flag": "False"}
                # upload_to_firebase(data,6)  

            if run_QueryLLM['cmd_id']==6:   #this is going to be for lower level
                getPltname =requests.get(FIREBASE_URL_Plant_name)
                run_Pltname = getPltname.json()
                print("Asking model what it thinks")
                image = Image.open(OUTPUT0_ORIGINAL_PATH)
                encoded_image = model.encode_image(image)
                answer = model.query(encoded_image, f"I have {run_Pltname['Bottom']} in an enclosure, how many hours of growlight will it need, give an average.")["answer"]

                answer_flowering = model.query(encoded_image, f"How long would the flowering stage last for a {run_Pltname['Bottom']} plant, give it in a number.")["answer"]
                answer_germination = model.query(encoded_image, f"How long would the germination stage last for a {run_Pltname['Bottom']} plant, give it in a number.")["answer"]
                answer_seedling = model.query(encoded_image, f"How long would the seedling stage last for a {run_Pltname['Bottom']} plant, give it in a number.")["answer"]
                answer_senescence = model.query(encoded_image, f"How long would the senescence stage last for a {run_Pltname['Bottom']} plant, give it in a number.")["answer"]
                answer_vegetative = model.query(encoded_image, f"How long would the vegetative stage last for a {run_Pltname['Bottom']} plant, give it in a number.")["answer"]

                print("Answer:", answer)
                data={"response": answer,"query_flag": False, "cmd_id":1}
                upload_to_firebase(data,6)
                data={'flowering':answer_flowering, 'germination':answer_germination,'seedling':answer_seedling, 'senescence':answer_senescence, 'vegetative':answer_vegetative}
                upload_to_firebase(data,10)
                # data={"query_flag": "False"}
                # upload_to_firebase(data,6)

            if run_QueryLLM['cmd_id']==7:   #this is going to be for upper level
                getPltname =requests.get(FIREBASE_URL_Plant_name)
                run_Pltname = getPltname.json()
                print("Asking model what it thinks")
                image = Image.open(OUTPUT1_ORIGINAL_PATH)
                encoded_image = model.encode_image(image)
                answer = model.query(encoded_image, f"I have {run_Pltname['Top']} is in an enclosure, how many hours of growlight will it need, give only a number.")["answer"]

                answer_flowering = model.query(encoded_image, f"How long would the flowering stage last for a {run_Pltname['Top']} plant, give it in a number.")["answer"]
                answer_germination = model.query(encoded_image, f"How long would the germination stage last for a {run_Pltname['Top']} plant, give it in a number.")["answer"]
                answer_seedling = model.query(encoded_image, f"How long would the seedling stage last for a {run_Pltname['Top']} plant, give it in a number.")["answer"]
                answer_senescence = model.query(encoded_image, f"How long would the senescence stage last for a {run_Pltname['Top']} plant, give it in a number.")["answer"]
                answer_vegetative = model.query(encoded_image, f"How long would the vegetative stage last for a {run_Pltname['Top']} plant, give it in a number.")["answer"]

                print("Answer:", answer)
                data={"response": answer,"query_flag": False, "cmd_id":1}
                upload_to_firebase(data,6)
                data={'flowering':answer_flowering, 'germination':answer_germination,'seedling':answer_seedling, 'senescence':answer_senescence, 'vegetative':answer_vegetative}
                upload_to_firebase(data,9)

                # data={"query_flag": "False"}
                # upload_to_firebase(data,6) 

            if run_QueryLLM['cmd_id']==8: #bottom layer
                getPltname =requests.get(FIREBASE_URL_Plant_name)
                run_Pltname = getPltname.json()
                image = Image.open(OUTPUT0_ORIGINAL_PATH)
                answer_plant_indoors = model.query(encoded_image, f"It is a {run_Pltname['Bottom']} plant in the image, how many days until I can havest from that plant? ")["answer"]
                print("Answer:", answer_plant_indoors)
                data={"response":answer_plant_indoors, "query_flag": False, "cmd_id":0}
                upload_to_firebase(data,6)
                # data={"query_flag": False}
                # upload_to_firebase(data,6)

            if run_QueryLLM['cmd_id']==9: #top layer
                getPltname =requests.get(FIREBASE_URL_Plant_name)
                run_Pltname = getPltname.json()
                image = Image.open(OUTPUT1_ORIGINAL_PATH)
                answer_plant_indoors = model.query(encoded_image, f"It is a {run_Pltname['Top']} plant in the image, how many days until I can havest from that plant? ")["answer"]
                print("Answer:", answer_plant_indoors)
                data={"response":answer_plant_indoors, "query_flag": False, "cmd_id":0}
                upload_to_firebase(data,6)
                # data={"query_flag": False}
                # upload_to_firebase(data,6)

            if run_QueryLLM['cmd_id']==10: #bottom layer
                getUserQuery =requests.get(FIREBASE_URL_User_query)
                run_UserQuery=getUserQuery.json()
                image = Image.open(OUTPUT0_ORIGINAL_PATH)
                answer_plant_indoors = model.query(encoded_image, f"{run_UserQuery['Question']}")["answer"]
                print("Answer:", answer_plant_indoors)
                data={"response":answer_plant_indoors, "query_flag": False, "cmd_id":0}
                upload_to_firebase(data,6)
                # data={"query_flag": False}
                # upload_to_firebase(data,6)

            if run_QueryLLM['cmd_id']==11: #top layer
                getUserQuery =requests.get(FIREBASE_URL_User_query)
                run_UserQuery=getUserQuery.json()
                image = Image.open(OUTPUT1_ORIGINAL_PATH)
                answer_plant_indoors = model.query(encoded_image, f"{run_UserQuery['Question']}")["answer"]
                print("Answer:", answer_plant_indoors)
                data={"response":answer_plant_indoors, "query_flag": False, "cmd_id":0}
                upload_to_firebase(data,6)
                # data={"query_flag": False}
                # upload_to_firebase(data,6)
        else:
            time.sleep(5)
            continue