// firebaseService.ts
import { database } from '../../assets/config/firebaseConfig.js';  // Correct import for Firebase database
import { ref, set, get, update } from 'firebase/database';

// Function to fetch data from Firebase
export const fetchDataFromFirebase = async (path: string, setDataCallback: (data: any) => void) => {
    const dataRef = ref(database, path); // Reference to the provided path in the Firebase DB
  
    try {
      const snapshot = await get(dataRef); // Fetch the data
  
      if (snapshot.exists()) {
        const data = snapshot.val();
        setDataCallback(data); // Pass data to the callback to update the state
      }
    } catch (error) {
      console.log("Error fetching data");
    }
  };

// The pushNewScheduleToFirebase function
export const pushDataToFirebase = async (path: string, data: any[], nodes: string[]) => {
    const scheduleRef = ref(database, path);  // Reference to the provided path in Firebase

    // Check if data and nodes have the same length
    if (data.length !== nodes.length) {
        throw new Error("Data and nodes must have the same length");
    }

    // Prepare the object to update
    const updateObject: { [key: string]: any } = {};

    // Populate the updateObject using nodes and data
    for (let i = 0; i < nodes.length; i++) {
        updateObject[nodes[i]] = data[i];  // Assign each node with the corresponding data
    }

    try {
        // Update the Firebase data with the updateObject
        await update(scheduleRef, updateObject);
        console.log("Schedule updated successfully!");
    } catch (error) {
        console.error("Error updating schedule:", error);
    }
};
