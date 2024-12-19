import { Link, Navigate, useNavigate } from "react-router-dom";
import * as client from "./client";
import GoogleButton from "react-google-button";
import { FaGoogle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "./reducer";
import { RotatingLines } from "react-loader-spinner";
import footer from "../footer";
import Footer from "../footer";
const serverUrl = process.env.REACT_APP_SERVER_URL;

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
    const loginState = await client.checkLoginState();
    if (loginState !== false && loginState !== null) {
      console.log("trying to reroute");
      navigate("/home");
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const attemptLogin = async () => {
    const user = { username: username, password: password };
    try {
      const response = (await client.attemptLocalLogin(user)) as any;
      if (response.status === 200) {
        console.log("Login successful");
        console.log("response is: ", response);
        const {
          data: { user, sessionToken },
        } = response;
        console.log(
          "Token received in front end in attempt login is: ",
          sessionToken
        );
        localStorage.setItem("token", sessionToken);
        dispatch(setCurrentUser(user));
        navigate("/");
      } else if (response.response.status === 400) {
        console.error("User doesn't exist");
        setLoginFailed(true);
      } else if (response.response.status === 401) {
        console.error("Invalid password");
        setLoginFailed(true);
      } else {
        console.error("Unexpected response:", response);
        setLoginFailed(true);
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

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
              <Link to="/">Click here</Link>
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
