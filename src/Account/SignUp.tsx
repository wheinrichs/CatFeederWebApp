/*
This file defines the sign up screen and the sign up logic. All requests to the backend server
are handled in the client file. 
*/

import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { FaGoogle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import Footer from "../footer";

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Create state variables for error checking the username and password criteria
  const [passwordsMatch, setPasswordsMatch] = useState<Boolean>(false);
  const [passwordsMeetCritera, setPasswordsMeetCriteria] =
    useState<Boolean>(false);
  const [usernameAvailable, setUsernameAvailable] = useState<Boolean>(true);
  const [usernames, setUsernames] = useState<any>([]);

  // Set state variables that will hold all of the form data the user fills out during registration
  const [name, setName] = useState<String>();
  const [email, setEmail] = useState<String>();
  const [username, setUsername] = useState<String>();
  const [password, setPassword] = useState<String>();
  const [passwordConfirm, setPasswordConfirm] = useState<String>();

  // Handle the google login
  const handleGoogleLogin = async () => {
    await client.handleLogin();
  };

  // Checks if the user is currently logged in. If the user is logged in, navigates automatically to the home screen
  const checkLoggedIn = async () => {
    const loginState = await client.checkLoginState();
    // Check is the login state is NULL or false. Otherwise navigate to the home screen
    if (loginState !== false && loginState !== null) {
      navigate("/home");
    }
  };

  // Fetches all the usernames in the database to see if the username the user is entering is available
  const fetchUsernames = async () => {
    const fetchedUsernames: any = await client.getAllUsernames();
    setUsernames(fetchedUsernames.data);
  };

  // Upon loading this route, fetch usernames and check the log in state
  useEffect(() => {
    fetchUsernames();
    checkLoggedIn();
  }, []);

  // When the password, username, or passwordConfirm variables are updated check if they meet the criteria
  useEffect(() => {
    checkPasswordMatch();
    checkUsernameAvailable();
  }, [password, passwordConfirm, username]);

  // This function checks if the entered in password meets the criteria of minimum length 7, contains a number, and contains a letter
  const checkPasswordCriteria = (e: any) => {
    setPassword(e.target.value);
    // Checks the length of the password is at least 7
    const hasMinLength = e.target.value.length >= 7;
    // Checks the password contains at least one number
    const hasNumber = /\d/.test(e.target.value);
    // Check the password contains at least one special character as defined below
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(e.target.value);

    // If the password has all of these things, update the state variable to dismiss the error message
    if (hasMinLength && hasNumber && hasSpecialChar) {
      setPasswordsMeetCriteria(true);
    } else {
      setPasswordsMeetCriteria(false);
    }
  };

  // Update the state variables for the password confirm field
  const assignPasswordConfirm = (e: any) => {
    setPasswordConfirm(e.target.value);
  };

  // Check if the username the user entered is available
  const checkUsernameAvailable = () => {
    setUsernameAvailable(!usernames.includes(username));
  };

  // Check if the two passwords match
  const checkPasswordMatch = () => {
    if (password === passwordConfirm) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  };

  /*
  Function: submitNewUser
    This function creates a new user based on the input information and passes that object to the 
    backend server to be added to the database.
  */
  const submitNewUser = async () => {
    // Create a new user object with the provided information
    const newUser = {
      username: username,
      password: password,
      name: name,
      email: email,
    };
    // Send the new user to the client and therefore to the backend server
    const response = (await client.createNewUser(newUser)) as any;
    // If there was an error creating the user log the error
    if (response.status == 400) {
      console.log("Error creating user");
    } 
    // If there was not an error retrieve the newly created user
    else {
      const response = (await client.attemptLocalLogin(newUser)) as any;
      const {
        data: { user, sessionToken },
      } = response;
      // Store the token in local storage, update the current user in the state vairable, and navigate to the homescreen
      localStorage.setItem("token", sessionToken);
      dispatch(setCurrentUser(user));
      navigate("/");
    }
  };

  return (
    <div className="container-fluid d-flex flex-column align-items-center" style={{  height: "100dvh"}}>
      <div className="d-flex flex-column flex-grow-1 justify-content-center">
        <div
          className=" p-2 text-center"
          style={{ width: "100%", maxWidth: "600px", overflow: "auto" }}
          >
          <h1>Sign up</h1>
          <h4>Welcome! Register a new account.</h4>
          <input
            placeholder="Name"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
            style={{ margin: "10px auto" }}
          ></input>
          <input
            placeholder="Email"
            type="email"
            className="form-control"
            onChange={(e) => setEmail(e.target.value)}
            style={{ margin: "10px auto" }}
          ></input>
          <input
            placeholder="Username"
            className="form-control"
            onChange={(e) => setUsername(e.target.value)}
            style={{ margin: "10px auto" }}
          ></input>
          <input
            placeholder="Password"
            type="password"
            className="form-control"
            onChange={(e) => checkPasswordCriteria(e)}
            style={{ margin: "10px auto" }}
          ></input>
          <input
            placeholder="Confirm password"
            type="password"
            className="form-control"
            onChange={(e) => assignPasswordConfirm(e)}
            style={{ margin: "10px auto" }}
          ></input>
          {(!passwordsMatch || !passwordsMeetCritera || !usernameAvailable) && (
            <div className="alert alert-danger">
              {!passwordsMeetCritera && (
                <div>
                  Password must contain: 7 Letters, 1 Number, 1 Special
                  Character
                </div>
              )}
              {!usernameAvailable && <div>Username Unavailable</div>}
              {!passwordsMatch && <div>Passwords Must Match</div>}
            </div>
          )}
          {passwordsMatch && passwordsMeetCritera && usernameAvailable && (
            <div>
              <button
                className="btn btn-primary mt-1 mb-1"
                onClick={submitNewUser}
              >
                {" "}
                Submit
              </button>{" "}
              <br />
            </div>
          )}
          <div className="d-flex align-items-center my-2 mx-3">
            <hr className="flex-grow-1" />
            <span className="mx-2">
              <strong>or</strong>
            </span>
            <hr className="flex-grow-1" />
          </div>
          <button
            type="button"
            className="btn btn-dark p-3 rounded rounded-4 mb-4"
            onClick={handleGoogleLogin}
          >
            <FaGoogle style={{ fontSize: "1.75rem" }} className="me-2" />
            Sign up with Google
          </button>
          <br />
          Already have an account? <Link to="/">Sign In</Link> <br />
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
