/*
This file defines the callback function that the google oauth2 returns to after logging in
*/

import axios from "axios";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
// Get the server url from the environment variable to handle the requests
const serverUrl = process.env.REACT_APP_SERVER_URL;

export default function Callback() {
  // State variable to track whether or not the callback has already been executed
  const called = useRef(false);
  // Retrieve the current user from the account reducer in the application 
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /*
  Function: useEffect
    This function executes when the component is loaded and is the core logic of the callback function
  */
  useEffect(() => {
    (async () => {
      // If the current user is null then there is no one currently registered as logged in so the callback should store a user
      if (currentUser === null) {
        try {
          // Prevent rerender caused by strict mode 
          if (called.current) return;
          called.current = true;

          // Sends a get request to the token endpoint with current URLs query string to be provided to the server
          const res = await axios.get(
            `${serverUrl}/auth/token${window.location.search}`
          );

          // The response from the server contains the user, sessionToken, and accessToken
          const {
            data: { user, sessionToken, accessToken },
          } = res;

          // Store the token and accessToken in local storage
          // The sessionToken authenticates the user is logged in
          // The accessToken is what can be used to access the user's google drive and google services
          localStorage.setItem('token', sessionToken);
          localStorage.setItem('accessToken', accessToken);

          // Set the current user of the application in the front end to this new user and navigate to the home screen
          dispatch(setCurrentUser(user));
          navigate("/");
        } catch (err) {
          console.error(err);
          navigate("/");
        }
      } else if (currentUser !== null) {
        console.log("already logged in");
        navigate("/");
      }
    })();
  }, [currentUser, navigate]);
  return <></>;
}
