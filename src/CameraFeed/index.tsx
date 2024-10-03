import React from "react";
import masthead from "../masthead";

export default function CameraFeed() {
  const videoUrl = "https://stream.jarvisfeeders1234.win/"; // Your proxy server URL
  const token = localStorage.getItem("token");

  return (
    <div className="text-center vh-100">
      <div className="cover-container d-flex h-100 p-3 mx-auto flex-column">
        <div className="mb-auto">{masthead()}</div>
        <div className="content-wrapper">
          <main role="main" className="inner cover">
            <div className="video-container my-3">
              <img
                src={`${videoUrl}?token=${token}`} // Append the token to the URL as a query parameter
                alt="Video Feed"
                className="responsive-img"
              />
            </div>
          </main>
        </div>
        <footer className="mastfoot mt-auto">
          <div className="inner">
            <p>Project Created by Winston Heinrichs - 2024</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
