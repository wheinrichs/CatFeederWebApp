import React, { useEffect, useState } from "react";
import masthead from "../masthead";
import footer from "../footer";
import Footer from "../footer";
import { access } from "fs";
import axios from "axios";
import * as client from "./client";
import "./index.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import { CiViewList } from "react-icons/ci";
import { RiGalleryView2 } from "react-icons/ri";

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
  const [listView, setListView] = useState<Boolean>(true);

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
    setVideoSelected(video);
    setLiveView(false);
  };

  useEffect(() => {
    getRecordingFolderID();
  }, [accessToken]);

  useEffect(() => {
    fetchFiles();
  }, [folderID]);

  useEffect(() => {
    processVideoDatesAndTimes();
  }, [videos]);

  useEffect(() => {}, [dateSelected, listView]);

  console.log("videos: ", videos);
  console.log("Session token is: ", sessionToken);
  console.log("FolderID is ", folderID);
  console.log("access token is: ", accessToken);
  console.log("selected date is: ", dateSelected);
  console.log(groupedVideos);
  return (
    <div className="text-center" style={{ height: "100dvh" }}>
      <div className="cover-container d-flex h-100 p-3 mx-auto flex-column">
        <div className="mb-auto">{masthead()}</div>
        <div className="content-wrapper h-100">
          <main role="main" className="inner cover h-100">
            {liveView ? (
              <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setLiveView(false)}
                >
                  View Recordings
                </button>
                <div className="video-container my-3">
                  <img
                    src={`${videoUrl}?token=${sessionToken}`} // Append the token to the URL as a query parameter
                    alt="Video Feed"
                    className="responsive-img"
                  />
                </div>
              </div>
            ) : (
              <div className="h-100 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <button
                    type="button"
                    className="btn btn-primary mb-2 mt-1"
                    onClick={() => setLiveView(true)}
                  >
                    Back to Live View
                  </button>

                  <div>
                    <button
                      className="btn btn-dark ms-2"
                      onClick={() => setListView(true)}
                    >
                      <CiViewList size={25} />
                    </button>
                    <button
                      className="btn btn-dark ms-1"
                      onClick={() => setListView(false)}
                    >
                      <RiGalleryView2 size={25} />
                    </button>
                  </div>
                </div>
                {videos.length !== 0 ? (
                  <div
                    className="h-100 p-3 border rounded-2 py-2 flex-grow-1"
                    style={{ overflow: "auto" }}
                  >

                    {listView ? (

                    <div className="h-100 d-flex flex-column flex-md-row">
                      <div className="col-sm-12 col-md-4 order-2 order-md-1">
                        {dateSelected === null ? (
                          <div>
                            <div className="menu">
                              <ul className="list-unstyled">
                                {processedVideos &&
                                  Object.keys(groupedVideos).map((date) => (
                                    <li className="my-2">
                                      <button
                                        className="btn btn-light text-start d-flex justify-content-between align-items-center"
                                        style={{ width: "100%" }}
                                        onClick={() => setDateSelected(date)}
                                      >
                                        <span>{date}</span>
                                        <span className="badge bg-primary">
                                          {groupedVideos[date].length}
                                        </span>
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
                        ) : (
                          <div className="d-flex flex-column flex-grow-1 h-100">
                            <div className="d-flex align-items-center">
                              <button
                                className="btn btn-light ms-2"
                                onClick={() => setDateSelected(null)}
                              >
                                <IoMdArrowRoundBack />
                              </button>
                              <h4 className="my-2 mx-auto">{dateSelected}</h4>
                            </div>
                            <div
                              className="m-2 h-100"
                              style={{ overflowY: "auto" }}
                            >
                              <ul className="list-unstyled">
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
                        )}
                      </div>
                      <div className="h-100 col-sm-12 col-md-8 order-1 order-md-2">
                        {videoSelected && (
                          <div className="h-100">
                            <h3>{`${videoSelected.date} at ${videoSelected.time}`}</h3>
                            <video
                              className="responsive-img"
                              controls
                              width="500"
                              src={`${serverUrl}/api/video/${videoSelected.id}?accessToken=${accessToken}`}
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        )}
                      </div>
                    </div>
                    ) : (
                      <div className="h-100 d-flex flex-column flex-md-row">
                      <div className="col-sm-12 col-md-4">
                          <div>
                            <div className="menu">
                              <ul className="list-unstyled">
                                {processedVideos &&
                                  Object.keys(groupedVideos).map((date) => (
                                    <li className="my-2">
                                      <button
                                        className="btn btn-light text-start d-flex justify-content-between align-items-center"
                                        style={{ width: "100%" }}
                                        onClick={() => setDateSelected(date)}
                                      >
                                        <span>{date}</span>
                                        <span className="badge bg-primary">
                                          {groupedVideos[date].length}
                                        </span>
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





                          <div className="h-100 col-sm-12 col-md-8">
                            <div className="container">
                              <div className="row">
                        {dateSelected && 
                          groupedVideos[dateSelected].map((video) => (
                          <div className="col m-2">
                            <h5>{`${video.time}`}</h5>
                            <video
                              controls
                              width="200"
                              src={`${serverUrl}/api/video/${video.id}?accessToken=${accessToken}`}
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ))}
                        </div>
                        </div>
                      </div>





                          </div>
                    )}
                  </div>
                ) : (
                  <h3>No recordings found</h3>
                )}
              </div>
            )}
          </main>
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
}
