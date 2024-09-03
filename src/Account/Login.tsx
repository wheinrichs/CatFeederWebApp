import { Link, Navigate, useNavigate } from "react-router-dom";
import * as client from "./client";
import GoogleButton from "react-google-button";
import { FaGoogle } from "react-icons/fa";
import { useEffect } from "react";


export default function Login() {
  const navigate = useNavigate();
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

  useEffect(() => {
    checkLoggedIn(); 
  }, [])

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-secondary bg-opacity-50">
      <div className="border border-2 border-secondary rounded p-2 text-center">
        <h1>Login</h1>
        <h4>
          We're thrilled to have you here, please login to check on your furry
          friend!
        </h4>
        <input
          placeholder="username"
          className="form-control"
          style={{ margin: "10px auto" }}
        ></input>
        <input
          placeholder="password"
          type="password"
          className="form-control"
          style={{ margin: "10px auto" }}
        ></input>
        <button className="btn btn-primary mt-1 mb-1"> Submit</button> <br />
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
        Don't have an account? <Link to="/">Sign up</Link> <br />
        Viewing this as part of a portfolio? <Link to="/">Click here</Link>
      </div>
    </div>
  );
}
