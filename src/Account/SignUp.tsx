import { Link, Navigate, useNavigate } from "react-router-dom";
import * as client from "./client";
import GoogleButton from "react-google-button";
import { FaGoogle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "./reducer";

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [passwordsMatch, setPasswordsMatch] = useState<Boolean>(false);
  const [passwordsMeetCritera, setPasswordsMeetCriteria] =
    useState<Boolean>(false);
  const [usernameAvailable, setUsernameAvailable] = useState<Boolean>(true);
  const [usernames, setUsernames] = useState<any>([]);

  const [name, setName] = useState<String>();
  const [email, setEmail] = useState<String>();
  const [username, setUsername] = useState<String>();
  const [password, setPassword] = useState<String>();
  const [passwordConfirm, setPasswordConfirm] = useState<String>();

  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const handleGoogleLogin = async () => {
    await client.handleLogin();
  };

  const checkLoggedIn = async () => {
    const loginState = await client.checkLoginState();
    if (loginState !== false && loginState !== null) {
      console.log("trying to reroute");
      navigate("/TempNav");
    }
  };

  const fetchUsernames = async () => {
    const fetchedUsernames: any = await client.getAllUsernames();
    setUsernames(fetchedUsernames.data);
    console.log(fetchedUsernames.data);
  };

  useEffect(() => {
    fetchUsernames();
    checkLoggedIn();
  }, []);

  useEffect(() => {
    checkPasswordMatch();
    checkUsernameAvailable();
  }, [password, passwordConfirm, username]);

  const checkPasswordCriteria = (e: any) => {
    setPassword(e.target.value);
    const hasMinLength = e.target.value.length >= 7;
    const hasNumber = /\d/.test(e.target.value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(e.target.value); // checks for at least one special character

    if (hasMinLength && hasNumber && hasSpecialChar) {
      setPasswordsMeetCriteria(true);
    } else {
      setPasswordsMeetCriteria(false);
    }
    console.log(passwordsMeetCritera);
  };

  const assignPasswordConfirm = (e: any) => {
    setPasswordConfirm(e.target.value);
  };

  const checkUsernameAvailable = () => {
    setUsernameAvailable(!usernames.includes(username));
  };

  const checkPasswordMatch = () => {
    if (password === passwordConfirm) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  };

  const submitNewUser = async () => {
    const newUser = {
      username: username,
      password: password,
      name: name,
      email: email,
    };
    const response = (await client.createNewUser(newUser)) as any;
    console.log("Response is: ", response);
    if (response.status == 400) {
      console.log("Error creating user");
    } else {
      const response = (await client.attemptLocalLogin(newUser)) as any;
      const {
        data: { user, accessToken },
      } = response;
      localStorage.setItem("token", accessToken);
      dispatch(setCurrentUser(user));
      navigate("/");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <div
        className=" p-2 text-center"
        style={{ width: "600px", overflow: "auto" }} // Set fixed width and height
      >
        <h1>Sign Up</h1>
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
                Password must contain: 7 Letters, 1 Number, 1 Special Character
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
  );
}
