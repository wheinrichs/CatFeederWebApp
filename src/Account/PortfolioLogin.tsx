/*
This file defines the login screen for the portfolio account and the login logic. 
All requests to the backend server are handled in the client file. 
*/

import { useNavigate } from "react-router-dom";
import * as client from "./client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import Footer from "../footer";
import { RotatingLines } from "react-loader-spinner";

const portfolioUsername = process.env.REACT_APP_PORTFOLIO_USERNAME;
const portfolioPassword = process.env.REACT_APP_PORTFOLIO_PASSWORD;

export default function PortfolioLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Create a state variable that shows the logging in message while waiting for server response
  const [loggingIn, setLoggingIn] = useState<Boolean>(false);


  // Checks if the user is currently logged in. If the user is logged in, navigates automatically to the home screen
  const checkLoggedIn = async () => {
    // Check is the login state is NULL or false. Otherwise navigate to the home screen
    const loginState = await client.checkLoginState();
    if (loginState !== false && loginState !== null) {
      console.log("trying to reroute");
      navigate("/home");
    }
  };

  // Check the login state upon loading the route
  useEffect(() => {
    checkLoggedIn();
  }, []);

  /*
  Function: PortfolioViewLogin
    This function handles a login attempt when the portfolio viewer account is selected
  */
  const PortfolioViewLogin = async () => {
    setLoggingIn(true)
    // Create a custom object for the portfolio user
    const user = { username: portfolioUsername, password: portfolioPassword };
    try {
      // Try and authenticate the portfolio user
      const response = (await client.attemptLocalLogin(user)) as any;

      // If the login is successful
      if (response.status === 200) {
        // Extract the user information and the session token from the response
        const {
          data: { user, sessionToken },
        } = response;

        // Save the token in local storage and save the user to the applciation state. Navigate to homescreen
        localStorage.setItem("token", sessionToken);
        dispatch(setCurrentUser(user));
        navigate("/");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  return (
    <div>
      <div>
        <div className="container-fluid vh-100 d-flex flex-column align-items-center">
          <div className="d-flex flex-column flex-grow-1 justify-content-center">
            <div
              className=" rounded p-2 text-center"
              style={{ width: "100%", maxWidth: "600px", overflow: "auto" }}
            >
              
              <img src="/PetFeederLogo.png" height="150" />
              <h3 className="mt-3">Automatic Pet Feeder</h3>
              <div className="mb-4 fs-6">Looks like you're viewing this as part of my portfolio!</div>
              {loggingIn ? (
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="50"
                  visible={true}
                />
              ) : (
                <button
                  className="btn btn-primary mt-1 mb-1"
                  onClick={PortfolioViewLogin}
                >
                  {" "}
                  Login as a Demo User
                </button>
              )}{" "}
              <br />
              <div className="d-flex align-items-center my-2 mx-3">
                <hr className="flex-grow-1" />
                <span className="mx-2">
                  <strong>or</strong>
                </span>
                <hr className="flex-grow-1" />
              </div>
              <button
                type="button"
                className="btn btn-dark p-3  mb-4"
                onClick={() => navigate("/login")}
              >
                Go to the Full Login Screen
              </button>

            </div>
          </div>
          <div className="mt-auto">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
