import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import Login from "./Account/Login";
import axios from "axios";
import TempNav from "./Account/TempNav";
import Callback from "./Account/Callback";
import ProtectedRoute from "./ProtectedRoute";
import CameraFeed from "./CameraFeed"
import Session from "./Session";
import FeederSettings from "./FeederSettings";
import SignUp from "./Account/SignUp";

function App() {
  return (
    <Provider store={store}>
      <Session>
        <BrowserRouter>
          {/* Establish a div for your the Routes */}
          <Routes>
            <Route path="/" element={<Navigate to="TempNav" />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/SignUp" element={<SignUp />} />

            <Route
              path="/TempNav"
              element={
                <ProtectedRoute>
                  <TempNav />
                </ProtectedRoute>
              }
            />
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
            <Route path="/auth/callback*" element={<Callback />} />
          </Routes>
        </BrowserRouter>
      </Session>
    </Provider>
  );
}

export default App;
