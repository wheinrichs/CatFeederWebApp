/*
This file sets up the loading screen for the react app while the server turns on. The server
hosted on render free tier goes to sleep after 15 minutes, and takes around 60 seconds to 
start up again. 
*/

import * as client from "./Account/client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./Account/reducer";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch } from "react-redux";
export default function Session({ children }: { children: any }) {
  // Define state variables for the pending response, whether the message should be shown, and which message is shown
  const [pending, setPending] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  // Defind an array of messages to ne shown during loading
  const messages = [
    "Server starting up",
    "Thank you for your patience",
    "Cold starts, am I right?",
    "Accepting donations to pay for server time!",
  ];
  // Use to update the current user
  const dispatch = useDispatch();
  
  /*
  Function: fetchProfile
    This function attempts to check the login state - if there is a token already assigned that isn't expired it uses this user
  */
  const fetchProfile = async () => {
    try {
      const currentUser = await client.checkLoginState();
      // Set the retrieved user to the session variable 
      dispatch(setCurrentUser(currentUser));
    } catch (err: any) {
      console.error(err);
    }
    // The user has been loaded, the server is on, set pending to false
    setPending(false);
  };

  /*
  Function: useEffect
    On startup show the loading screen and cycle through the messages
  */
  useEffect(() => {
    // The loading screen is only shown if an operation takes longer than 1 second (prevents it from showing on page navigation)
    const showLoadingTimer = setTimeout(() => {
      // Set show loading to true which renders the content below
      setShowLoading(true);
    }, 1000);

    // Fetch the profile from the server
    fetchProfile();

    // Update message every 10 seconds
    const messageInterval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 10000);

    // Clean up any remaining timers if the functions resolves before the timer is finished
    return () => {
      clearTimeout(showLoadingTimer);
      clearInterval(messageInterval);
    };  }, []);

  /*
    If the pending state variable is true and the show loading is true, show the messages and the loading screen
  */
  if (pending) {
    if (showLoading) {
      // Show "Server Starting Up" message while waiting for the fetchProfile to finish
      return (
        <div
          className="container-fluid d-flex flex-column justify-content-center align-items-center bg-opacity-50"
          style={{ height: "100dvh" }}
        >
          <h2>{messages[messageIndex]}</h2>
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="50"
            visible={true}
          />
        </div>
      );
    }
    return null;
  }

  // Once pending is false, render the children components
  return <>{children}</>;
}
