import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as client from "./Account/client";
import { setCurrentUser } from "./Account/reducer";

export default function Masthead() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await client.handleLogout();
      dispatch(setCurrentUser(null));
      localStorage.removeItem("token");
      console.log("successful logout");
      navigate("/Login");
    } catch {
      console.log("ERROR LOGGING OUT");
    }
  };

  return (
    <div>
      <header className="masthead mb-auto">
        <div className="inner">
          <div className="masthead-brand d-flex flex-row justify-content-center">
            <img src="/PetFeederLogo.png" height="35" />
            <h3 className="ms-2">Pet Feeder</h3>
          </div>
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
              Live Feed
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
