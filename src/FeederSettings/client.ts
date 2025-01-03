/*
This file defines the client functions for the feeder settings that communicate with
the backend server and ultimately with the database.
*/

import axios from "axios";

// Set the communication with the server to occur with credentials
axios.defaults.withCredentials = true;
const serverUrl = process.env.REACT_APP_SERVER_URL;

// Get the current user preferences by using the userID
export const getUserPreferences = async (userID: any) => {
  try {
    const schedule = await axios.get(`${serverUrl}/api/schedule/${userID}`);
    return schedule.data;
  } catch (err) {
    console.error(err);
  }
};

// Set the user's preferences by passing in a new schedule and the userID for which it should update
export const setUserPreferences = async (userID:any, schdeule: any) => {
  try {
    const response = await axios.put(`${serverUrl}/api/schedule/${userID}`, schdeule)
    return response.data
  } catch (err) {
    console.error(err);
  }
}

// Set a user's portion and schedule by passing in the variables and the userIF for which it should update
export const setPortionAndSchedule = async (userID:any, schedule: any, portion: any) => {
  try {
    // Create a new object with the portion and schedule and pass this object with the userID as a parameter
    const obj = {portion: portion, schedule: schedule}
    const response = await axios.put(`${serverUrl}/api/PortionSchedule/${userID}`, obj)
    return response.data
  } catch (err) {
    console.error(err);
  }
}
