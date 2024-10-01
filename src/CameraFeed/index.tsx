import React from 'react';

export default function CameraFeed() {
    const videoUrl = 'https://stream.jarvisfeeders1234.win/'; // Your proxy server URL
    const token = localStorage.getItem("token");

    return (
        <div>
            <h1>Video Feed</h1>
            <img
                src={`${videoUrl}?token=${token}`} // Append the token to the URL as a query parameter
                alt="Video Feed"
                style={{ width: '1000px', height: 'auto' }}
            />
        </div>
    );
}