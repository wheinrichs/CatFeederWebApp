/*
This file defines the login screen and the login logic. All requests to the backend server
are handled in the client file. 
*/

import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { FaGoogle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import Footer from "../footer";

const portfolioUsername = process.env.REACT_APP_PORTFOLIO_USERNAME;
const portfolioPassword = process.env.REACT_APP_PORTFOLIO_PASSWORD;

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Create state variables for the username, password, and loginFailed flag which shows login error messages
  const [username, setUsername] = useState<String>();
  const [password, setPassword] = useState<String>();
  const [loginFailed, setLoginFailed] = useState<Boolean>(false);

  // This handles the google oauth 2 requests to the backend server
  const handleGoogleLogin = async () => {
    await client.handleLogin();
  };

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
  Function: attemptLogin
    This function handles an attempt to login using the local method (not google)
  */
  const attemptLogin = async () => {
    // Create a custom object for the user that is being attempted with the typed username and password
    const user = { username: username, password: password };
    try {
      // Try and authenticate this user with the backend server
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
      // If the user cannot be found in the database, report the username does not exist
      else if (response.response.status === 400) {
        console.error("User doesn't exist");
        setLoginFailed(true);
      }
      // If the password is incorrect for the given username, report invalid password
      else if (response.response.status === 401) {
        console.error("Invalid password");
        setLoginFailed(true);
      }
      // If there is a third unexpected response from the server, report it
      else {
        console.error("Unexpected response:", response);
        setLoginFailed(true);
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  /*
  Function: PortfolioViewLogin
    This function handles a login attempt when the portfolio viewer account is selected
  */
  const PortfolioViewLogin = async () => {
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
  } }

  // Re render if the loginFailed state changes to force the error message to render
  useEffect(() => {}, [loginFailed]);

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
              <h4 className="mt-3">Please Sign In</h4>
              <form className="d-flex flex-column justify-content-center mx-3 my-4">
                <div className="form-group">
                  <input
                    placeholder="username"
                    className="form-control rounded-top rounded-0"
                    onChange={(e) => setUsername(e.target.value)}
                  ></input>
                </div>
                <div className="form-group">
                  <input
                    placeholder="password"
                    type="password"
                    className="form-control rounded-bottom rounded-0"
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                </div>
              </form>
              {loginFailed && (
                <div className="alert alert-danger">
                  Wrong Username or Password
                </div>
              )}
              <button
                className="btn btn-primary mt-1 mb-1"
                onClick={attemptLogin}
              >
                {" "}
                Submit
              </button>{" "}
              <br />
              <div className="d-flex align-items-center my-2 mx-3">
                <hr className="flex-grow-1" />
                <span className="mx-2">
                  <strong>or</strong>
                </span>
                <hr className="flex-grow-1" />
              </div>
              {/* This is where the google login button is placed */}
              <button
                type="button"
                className="btn btn-dark p-3 rounded rounded-4 mb-4"
                onClick={handleGoogleLogin}
              >
                <FaGoogle style={{ fontSize: "1.75rem" }} className="me-2" />
                Sign in with Google
              </button>
              <br />
              Don't have an account? <Link to="/SignUp">Sign up</Link> <br />
              Viewing this as part of my portfolio?{" "}
              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  PortfolioViewLogin();
                }}
              >
                Click here
              </Link>
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
