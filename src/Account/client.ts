/*
This file defines all of the client requests that will be made to the server for the account services
*/

import axios from "axios";

// Require axios to be made with credentials and get the server URL
axios.defaults.withCredentials = true;
const serverUrl = process.env.REACT_APP_SERVER_URL;

/*
Function: checkLoginState
  This function checks if the user is logged in or not by providing the token in local storage
*/
export const checkLoginState = async () => {
  try {
    // Get the token from local storage
    const token = localStorage.getItem('token');
    // Send a request to the backend server to see if there is a user logged in 
    const {
      data: { loggedIn: logged_in, user },
    } = await axios.get(`${serverUrl}/auth/logged_in`, {
      headers: {
        'authorization': `Bearer ${token}`,
      },
    });
    if (logged_in === false) {
      return null;
    } else {
      // Return the user from the logged_in endpoint
      return user;
    }
  } catch (err) {
    console.log("checkLogin return error");
    console.error(err);
    return err;
  }
};

/*
Function: handleLogout
  This function sends a request to the backend server to log out the current user 
*/
export const handleLogout = async () => {
  try {
    await axios.post(`${serverUrl}/auth/logout`);
    return true;
  } catch (err) {
    console.error(err);
  }
};

/*
Function: handleLogin
  This function handles the google oauth 2 login requests to the backend server. The server
  returns a URL for the google consent screen and this function navigates to that screen
*/
export const handleLogin = async () => {
  try {
    // Gets authentication url from backend server
    const {
      data: { url },
    } = await axios.get(`${serverUrl}/auth/url`);
    // Navigate to consent screen
    window.location.assign(url);
  } catch (err) {
    console.error(err);
  }
};

/*
Function: getAllUsernames
  This function retrieves all the usernames from the backend server and the database
*/
export const getAllUsernames = async () => {
  try {
    // Get Usernames from server
    const response = await axios.get(`${serverUrl}/api/getAllUsernames`);
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
};

/*
Function: createNewUser
  This function sends a request to the backend server to create a new user during registration
*/
export const createNewUser = async (newUser: any) => {
  try {
    // Send the new user to the customUsers endpoint for the backend server
    const response = await axios.post(`${serverUrl}/api/customUsers`, newUser);
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
};

/*
Function: attemptLocalLogin
  This function executes when a login attempt is made using the local login (not google)
*/
export const attemptLocalLogin = async (user: any) => {
  try {
    // See if the login is successful with the passed in username and password to the backend server
    const response = await axios.post(`${serverUrl}/api/login`, user);
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
};