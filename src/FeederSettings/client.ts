import axios from "axios";

axios.defaults.withCredentials = true;
const serverUrl = process.env.REACT_APP_SERVER_URL;
console.log("Server URL:", serverUrl);

export const getUserPreferences = async (userID: any) => {
  try {
    const schedule = await axios.get(`${serverUrl}/api/schedule/${userID}`);
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
