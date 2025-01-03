/*
This file sets up the masthead for the website. The core styling was adopted from a bootstrap template
credited here: https://getbootstrap.com/docs/4.0/examples/cover/
*/

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as client from "./Account/client";
import { setCurrentUser } from "./Account/reducer";

export default function Masthead() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /*
  Function> handleLogout
    This function contains the logic for logging out a user from the application
  */
  const handleLogout = async () => {
    try {
      // Send the logout request to the server to handle any logout serverside logic
      await client.handleLogout();
      // Clear the current user in the application state on the front end
      dispatch(setCurrentUser(null));
      // Remove the current token from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      // Navigate to the login screen
      navigate("/Login");
    } catch {
      // If there was an error log it
      console.log("ERROR LOGGING OUT");
    }
  };

  // Create a function for the home buttom that navigates to the home screen
  const navHomeButton = () => {
    navigate("/home")
  };

  return (
    <div>
      <header className="masthead mb-auto">
        <div className="inner">
          {/* Set the home logo as a clickable nav button to the home screen */}
          <div className="masthead-brand d-flex flex-row justify-content-center" onClick={navHomeButton} style={{ cursor: 'pointer' }}
          >
            <img src="/PetFeederLogo.png" height="35" />
            <h3 className="ms-2">Pet Feeder</h3>
          </div>
          {/* Set up the buttons so they are displaying as active if the url contains the button name */}
          <nav className="nav nav-masthead justify-content-center">
            <a
              className={`nav-link ${
                window.location.href.toLowerCase().includes("/home")
                  ? "active"
                  : ""
              }`}
              href="/home"
            >
              Home
            </a>
            <a
              className={`nav-link ${
                window.location.href.toLowerCase().includes("/livefeed")
                  ? "active"
                  : ""
              }`}
              href="/livefeed"
            >
              Camera
            </a>
            <a
              className={`nav-link ${
                window.location.href.toLowerCase().includes("/feedersettings")
                  ? "active"
                  : ""
              }`}
              href="/feedersettings"
            >
              Feeder Settings
            </a>
            <button className={`nav-link text-danger`} onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </div>
      </header>
    </div>
  );
}
