import axios from "axios";

axios.defaults.withCredentials = true;
const serverUrl = process.env.REACT_APP_SERVER_URL;
console.log("Server URL:", serverUrl);

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