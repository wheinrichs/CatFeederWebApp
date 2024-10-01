import { Link, Navigate, useNavigate } from "react-router-dom";
import * as client from "./client";
import GoogleButton from "react-google-button";
import { FaGoogle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "./reducer";


export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState<String>();
  const [password, setPassword] = useState<String>();
  const [loginFailed, setLoginFailed] = useState<Boolean>(false);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const handleGoogleLogin = async () => {
    await client.handleLogin();
  };

  const checkLoggedIn = async () => {
    const loginState = await client.checkLoginState()
    if(loginState !== false && loginState !== null) {
      console.log("trying to reroute")
      navigate("/TempNav");
    }
  }

  const attemptLogin = async () => {
    const user = { username: username, password: password };
    try {
        const response = await client.attemptLocalLogin(user) as any;
        if (response.status === 200) {
            console.log("Login successful");
            console.log("response is: ", response)
            const {
              data: {  user, accessToken },
            } = response;
            localStorage.setItem('token', accessToken);
            dispatch(setCurrentUser(user));
            navigate("/");
        } else if (response.response.status === 400) {
            console.error("User doesn't exist");
            setLoginFailed(true)

        } else if (response.response.status === 401) {
            console.error("Invalid password");
            setLoginFailed(true)
        } else {
            console.error("Unexpected response:", response);
            setLoginFailed(true)
        }
    } catch (error) {
        console.error("An error occurred during login:", error);
    }
};

  useEffect(() => {
    checkLoggedIn(); 
  }, [])

  useEffect(() => {}, [loginFailed])

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-secondary bg-opacity-50">
      <div className="border border-2 border-secondary rounded p-2 text-center" style={{ width: "600px", overflow: "auto" }}>
        <h1>Login</h1>
        <h4>
          Please login to check on your furry friend!
        </h4>
        <input
          placeholder="username"
          className="form-control"
          onChange={(e) => setUsername(e.target.value)}
          style={{ margin: "10px auto" }}
        ></input>
        <input
          placeholder="password"
          type="password"
          className="form-control"
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: "10px auto" }}
        ></input>
            {loginFailed && (
            <div className="alert alert-danger">
              Wrong Username or Password
            </div>
          )}
        <button className="btn btn-primary mt-1 mb-1" onClick={attemptLogin}> Submit</button> <br />
        <div className="d-flex align-items-center my-2 mx-3">
          <hr className="flex-grow-1" />
          <span className="mx-2">
            <strong>or</strong>
          </span>
          <hr className="flex-grow-1" />
        </div>
          <button type="button" className = "btn btn-dark p-3 rounded rounded-4 mb-4" onClick={handleGoogleLogin}>
            <FaGoogle style={{ fontSize: '1.75rem' }} className="me-2"/>
            Sign in with Google
          </button>
        <br />
        Don't have an account? <Link to="/SignUp">Sign up</Link> <br />
        Viewing this as part of my portfolio? <Link to="/">Click here</Link>
      </div>
    </div>
  );
}
