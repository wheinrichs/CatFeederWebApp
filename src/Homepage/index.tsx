/*
This file defines the homepage that the user sees when initially signing in. It also 
contains some logic for setting the overall application state. 
*/

import masthead from "../masthead";
import "./cover.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as client from "../Account/client";
import { setCurrentUser } from "../Account/reducer";
import Footer from "../footer";

export default function Homepage() {
  const dispatch = useDispatch();  

  // Evaluate who the current user is by sending the token to the backend server
  const evalCurrentUser = async () => {
    const FetchUser = await client.checkLoginState();
    // Set the current user to the application state
    dispatch(setCurrentUser(FetchUser))
  }

  // Check the current user when the application initially loads
  useEffect(() => {
    evalCurrentUser(); 
  }, [])

  return (
    <div className="text-center" style={{  height: "100dvh"}}>
      <div className="cover-container d-flex h-100 p-3 mx-auto flex-column">
        <div className="mb-auto">{masthead()}</div>
        <div className="content-view">
          <main role="main" className="inner cover">
            <h1 className="cover-heading">Welcome to your pet feeder.</h1>
            <p className="lead">Should we check on your furry friend?</p>
            <p className="lead">
              <a href="/livefeed" className="btn btn-lg btn-secondary">
                Camera
              </a>
            </p>
          </main>
        </div>
        <div className = "mt-auto">
        <Footer />
        </div>
      </div>
    </div>
  );
}
