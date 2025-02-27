import requests

# Firebase Realtime Database URL
FIREBASE_URL = "https://simple-sprouts-database-default-rtdb.firebaseio.com/"

def get_firebase_data(section):
    """Fetches data from a specific section of the Firebase Realtime Database."""
    url = f"{FIREBASE_URL}{section}.json"  # Append section name to the base URL
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()  # Parse JSON response
        return data
    else:
        print(f"Error fetching {section}: {response.status_code}")
        return None

# Fetch "levels" and "general_info" sections
levels_data = get_firebase_data("levels")
general_info_data = get_firebase_data("general_info")

# Print results
print("\n--- Levels Section ---")
print(levels_data)

print("\n--- General Info Section ---")
print(general_info_data)
