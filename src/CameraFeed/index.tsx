import React, { useEffect, useState } from "react";
import masthead from "../masthead";
import footer from "../footer";
import Footer from "../footer";
import { access } from "fs";
import axios from "axios";
import * as client from "./client";
import "./index.css"
import { group } from "console";
const serverUrl = process.env.REACT_APP_SERVER_URL;

export default function CameraFeed() {
  const videoUrl = "https://stream.jarvisfeeders1234.win/"; // Your proxy server URL
  const accessToken = localStorage.getItem("accessToken");
  const sessionToken = localStorage.getItem("token");
  const folderName = "PetFeederRecordings";


  const [videos, setVideos] = useState<
    { id: any; name: any; webViewLink: any }[]
  >([]);
  const [processedVideos, setProcessedVideos] = useState<
    { id: any; name: any; webViewLink: any; date: any; time: any }[]
  >([]);
  const [folderID, setFolderID] = useState(null);
  const [dateSelected, setDateSelected] = useState<any | null>(null);
  const [videoSelected, setVideoSelected] = useState<any | null>(null);
  const [liveView, setLiveView] = useState<Boolean>(true);


  const [groupedVideos, setGroupedVideos] = useState<Record<string, any[]>>({});

  const getRecordingFolderID = async () => {
    setFolderID(await client.getFolderId(folderName, accessToken));
  };

  const processVideoDatesAndTimes = () => {
    const videosByDate: Record<string, any[]> = {};

    let newVideos = videos.map((video) => {
      const splitTitle = video.name.split("_");
      console.log("Split title is: ", splitTitle);
      const year = splitTitle[1].slice(0, 4);
      const month = splitTitle[1].slice(4, 6);
      const day = splitTitle[1].slice(6, 8);
      const formattedDate = `${month}/${day}/${year}`;

      const hour = splitTitle[2].slice(0, 2);
      const minute = splitTitle[2].slice(2, 4);
      const second = splitTitle[2].slice(4, 6);
      const formattedTime = `${hour}:${minute}:${second}`;

      const processedVideo = {
        ...video,
        date: formattedDate,
        time: formattedTime,
      };

      // Add the video to the corresponding date in videosByDate
      if (!videosByDate[formattedDate]) {
        videosByDate[formattedDate] = [];
      }
      videosByDate[formattedDate].push(processedVideo);

      return processedVideo;
    });
    // Sort dates in the object
    const sortedDates = Object.keys(videosByDate).sort().reverse();
    const sortedVideosByDate: Record<string, any[]> = {};
    sortedDates.forEach((date) => {
      sortedVideosByDate[date] = videosByDate[date];
    });

    // Update states
    setProcessedVideos(newVideos); // Set all processed videos
    setGroupedVideos(sortedVideosByDate); // Grouped videos by date
  };
  const fetchFiles = async () => {
    console.log("Token is: ", accessToken);
    if (folderID !== null) {
      let allFiles: any[] = [];
      let pageToken: string | null = null;

      do {
        const response: any = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${folderID}' in parents and trashed=false&fields=nextPageToken,files(id,name,webViewLink)&pageSize=100${
            pageToken ? `&pageToken=${pageToken}` : ""
          }`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();
        allFiles = allFiles.concat(data.files || []);
        pageToken = data.nextPageToken || null; // Update pageToken for the next iteration
      } while (pageToken);

      setVideos(allFiles); // Set all files after fetching all pages
    }
  };
  
  const selectVideo = (video: any) => {
    setVideoSelected(video)
    setLiveView(false)
  }

  useEffect(() => {
    getRecordingFolderID();
  }, [accessToken]);

  useEffect(() => {
    fetchFiles();
  }, [folderID]);

  useEffect(() => {
    processVideoDatesAndTimes();
  }, [videos]);

  console.log("videos: ", videos);
  console.log("Session token is: ", sessionToken);
  console.log("FolderID is ", folderID);
  console.log("access token is: ", accessToken);
  console.log("selected date is: ", dateSelected)
  console.log(groupedVideos)
  return (
    <div className="text-center" style={{ height: "100dvh" }}>
      <div className="cover-container d-flex h-100 p-3 mx-auto flex-column">
        <div className="mb-auto">{masthead()}</div>
        <div className="content-wrapper">
          <main role="main" className="inner cover">
            {liveView ? (
            <div className="video-container my-3">
              <img
                src={`${videoUrl}?token=${sessionToken}`} // Append the token to the URL as a query parameter
                alt="Video Feed"
                className="responsive-img"
              />
            </div>
            ) :
            (
              <div>
              <h3>{`${videoSelected.date} at ${videoSelected.time}`}</h3>
                  <video
                    className="responsive-video"
                    controls
                    width="500"
                    src={`${serverUrl}/api/video/${videoSelected.id}?accessToken=${accessToken}`}
                  >
                    Your browser does not support the video tag.
                  </video>
              </div>
            )

}

            <div className="container border rounded-2">
              <div className="row" >
                <div className="col-4">
                  <div>
                    <div className="menu">
                      <ul className="list-unstyled">
                        {processedVideos &&
                          Object.keys(groupedVideos).map((date) => (
                            <li className="my-2">
                              <button
                                className="btn btn-light text-start d-flex justify-content-between align-items-center"
                                style={{ width: "100%" }}
                                // onClick={(e) => displayTimestamps(date)}
                                onClick={() => setDateSelected(date)}
                              >
                                <span>{date}</span>
                                <span className="badge bg-primary">{groupedVideos[date].length}</span>
                              </button>
                            </li>
                          ))}

                        <li className="my-2">
                          <hr className="dropdown-divider" />
                        </li>
                        <li className="my-2">
                          <button
                            className="btn btn-primary text-decoration-none text-start"
                            style={{ width: "100%" }}
                            onClick={() => setLiveView(true)}
                          >
                            Live View
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col border-start" style={{ maxHeight: "500px", overflowY: "auto" }}>
                <ul className="list-unstyled m-2">
                        {dateSelected &&
                          groupedVideos[dateSelected].map((video) => (
                            <li className="my-2">
                              <button
                                className="btn btn-light text-start d-flex justify-content-between align-items-center"
                                style={{ width: "100%" }}
                                onClick={() => selectVideo(video)}
                              >
                                <span>{video.time}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}
