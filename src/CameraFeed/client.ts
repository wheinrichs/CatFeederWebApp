/*
This file handles all of the logic that the camera feed needs when communicating with the backend server
*/

import axios from "axios";

// Require axios to be made with credentials and get the server URL
axios.defaults.withCredentials = true;
const serverUrl = process.env.REACT_APP_SERVER_URL;

/*
Function: getFolderId
    This function gets the folder ID in google drive that matches the name of the parameter folderName.
    It uses the accessToken that was generated when the user logged in via google. 
*/
export const getFolderId = async (folderName: any, accessToken: any) => {
    try {
        // Get folderID from server
        const response = await axios.post(`${serverUrl}/api/getFolderID`, {folderName, accessToken});
        return response.data.folderId;
    } catch (err) {
        console.error("Error fetching folder ID", err);
        return err;
    }
}