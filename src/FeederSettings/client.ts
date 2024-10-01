import axios from "axios";

axios.defaults.withCredentials = true;
const serverUrl = process.env.REACT_APP_SERVER_URL;
console.log("Server URL:", serverUrl);

export const getUserPreferences = async (userID: any) => {
  try {
    const schedule = await axios.get(`${serverUrl}/api/schedule/${userID}`);
    console.log("In clinet get the user pref is: ", schedule);
    return schedule.data;
  } catch (err) {
    console.error(err);
  }
};

export const setUserPreferences = async (userID:any, schdeule: any) => {
  try {
    console.log("in the clinet: ", schdeule);
    const response = await axios.put(`${serverUrl}/api/schedule/${userID}`, schdeule)
    return response.data
  } catch (err) {
    console.error(err);
  }
}

export const setPortionAndSchedule = async (userID:any, schedule: any, portion: any) => {
  try {
    const obj = {portion: portion, schedule: schedule}
    const response = await axios.put(`${serverUrl}/api/PortionSchedule/${userID}`, obj)
    return response.data
  } catch (err) {
    console.error(err);
  }
}
