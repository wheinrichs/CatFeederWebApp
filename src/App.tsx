/*
This file defines the overall structure of the react application. It utilizes a browser router,
protected routes, the session file, and the store to setup the various pages and navigation of
the application. 
*/
import "./App.css";
import { Provider } from "react-redux";
import store from "./store";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Login from "./Account/Login";
import Callback from "./Account/Callback";
import ProtectedRoute from "./ProtectedRoute";
import CameraFeed from "./CameraFeed";
import Session from "./Session";
import FeederSettings from "./FeederSettings";
import SignUp from "./Account/SignUp";
import Homepage from "./Homepage";
import TestVideo from "./testindex";


function App() {
  return (
    // Link the store to this application for the session variables
    <Provider store={store}>
      {/* Utilize the session file to check if the server is on before any page is loaded */}
      <Session>
        {/* Use a browser router for navigation */}
        <BrowserRouter>
          {/* Establish a div for your the Routes */}
          <Routes>
            {/* login and signup are not protected routes and the default page is home */}
            <Route path="/" element={<Navigate to="home" />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Test" element={<TestVideo />} />
            <Route path="/SignUp" element={<SignUp />} />
            {/* All other routes are protected meaning they require login */}
            <Route
              path="/livefeed"
              element={
                <ProtectedRoute>
                  <CameraFeed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/FeederSettings"
              element={
                <ProtectedRoute>
                  <FeederSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>
              }
            />
            <Route path="/auth/callback" element={<Callback />} />
          </Routes>
        </BrowserRouter>
      </Session>
    </Provider>
  );
}

export default App;
