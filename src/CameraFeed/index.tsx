/*
This file creates the route for the live camera feed and the recordings stored in google drive. 
*/

import { useEffect, useState } from "react";
import masthead from "../masthead";
import Footer from "../footer";
import * as client from "./client";
import "./index.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import { CiViewList } from "react-icons/ci";
import { RiGalleryView2 } from "react-icons/ri";
import { useSelector } from "react-redux";
import { group } from "console";

// Get the serverURL from the environment variable
const serverUrl = process.env.REACT_APP_SERVER_URL;
const portfolioViewerID = process.env.REACT_APP_PORTFOLIO_VIEWER_SUB_ID;

export default function CameraFeed() {
  // Get current user and evaluate it to see if it's portfolio viewer
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  // Get the live stream video URL from the proxy server that connects to the users raspberryPi
  const videoUrl = "https://stream.jarvisfeeders1234.win/";

  // Retrieve the accessToken and the sessionToken from local storage
  const accessToken = localStorage.getItem("accessToken");
  const sessionToken = localStorage.getItem("token");

  // This is the folder name in google drive where the recordings are stored
  const folderName = "PetFeederRecordings";

  // Create a state variable that holds the array of videos that are found in the google drive folder
  const [videos, setVideos] = useState<
    { id: any; name: any; webViewLink: any }[]
  >([]);
  // Create a new state variable that holds the same videos but now contains the date and time of the video extracted from the title
  const [processedVideos, setProcessedVideos] = useState<
    { id: any; name: any; webViewLink: any; date: any; time: any }[]
  >([]);

  // Create state variables that hold the individual information for the selections of the user
  const [folderID, setFolderID] = useState(null);
  const [dateSelected, setDateSelected] = useState<any | null>(null);
  const [videoSelected, setVideoSelected] = useState<any | null>(null);

  // Create a state variable for if the user wants to view as a gallery or if the user wants a live view
  const [liveView, setLiveView] = useState<Boolean>(true);
  const [listView, setListView] = useState<Boolean>(true);

  // Create a state variable to hold a subset of the videos (often sorted by date and stored here)
  const [groupedVideos, setGroupedVideos] = useState<Record<string, any[]>>({});

  // Get the ID of the folder in google drive with the matching name
  const getRecordingFolderID = async () => {
    setFolderID(await client.getFolderId(folderName, accessToken));
  };

  /*
  Function: processVideoDatesAndTimes
    This function takes in the list of videos and for each video title extracts the date and time
  */
  const processVideoDatesAndTimes = () => {
    // Create a new variable to hold the videos sorted by date
    const videosByDate: Record<string, any[]> = {};

    // Map over each video in the videos variable
    let newVideos = videos.map((video) => {
      // Split the title into individual portion separated by _
      const splitTitle = video.name.split("_");

      // Extract the year, month and day and form a formatted date
      const year = splitTitle[1].slice(0, 4);
      const month = splitTitle[1].slice(4, 6);
      const day = splitTitle[1].slice(6, 8);
      const formattedDate = `${month}/${day}/${year}`;

      // Extract the hour, minute, and second and form a formatted time
      const hour = splitTitle[2].slice(0, 2);
      const minute = splitTitle[2].slice(2, 4);
      const second = splitTitle[2].slice(4, 6);
      const formattedTime = `${hour}:${minute}:${second}`;

      // Create a new object which contains the original information along with the new date and time information
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

  /*
  Function: fetchFiles
    This function uses the access token and the retrieved folderID to access the users google drive folder 
    and retrieve all of the videos that are stored in there.
  */
  const fetchFiles = async () => {
    // If the fodler ID is not equal to NULL, try and retrieve the videos
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
        // Check all the pages of results
        pageToken = data.nextPageToken || null;
      } while (pageToken);
      console.log(allFiles);
      // Set all files after fetching all pages
      setVideos(allFiles);
    }
  };

  /*
  Function: fetchFilesLocal
    This function retrieves the local video files from the public folder for when 
    the portfolio viewer account is selected. This account allows people looking at my
    portfolio to view the website with its full video functionality
  */
  const fetchFilesLocal = async () => {
    fetch("/SampleRecordings/PortfolioViewerVideoFiles.json")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error(err));
  };

  // Set the selected video and turn off the live view
  const selectVideo = (video: any) => {
    setVideoSelected(video);
    setLiveView(false);
  };

  // When the access token updates get the folder ID in the google drive, if the portfolio viewer account is logged in
  useEffect(() => {
    if (portfolioViewerID !== currentUser._id) {
      getRecordingFolderID();
    }
  }, [accessToken]);

  // When the folder ID updates fetch the local files
  useEffect(() => {
    // If the user is the portfolio viewer account, retrieve the local videos
    if (portfolioViewerID === currentUser._id) {
      console.log("Fetching locally");
      fetchFilesLocal();
    }
    // If it is not the portfolio viewer account, fetch the files from the google account
    else {
      fetchFiles();
    }
  }, [folderID]);

  // When the videos update process the videos to extract the date and time information
  useEffect(() => {
    processVideoDatesAndTimes();
  }, [videos]);

  // Rerender the screen when the date selected changes or if the list view option changes to gallery (or vice versa)
  useEffect(() => {}, [dateSelected, listView]);

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
                  className="btn btn-primary mt-1"
                  onClick={() => setLiveView(false)}
                >
                  View Recordings
                </button>
                <div className="video-container my-3">
                  {portfolioViewerID === currentUser._id ? 
                  <img
                  src={"/SampleRecordings/LiveFeedStatic.gif"}
                  alt="Video Feed"
                  className="responsive-img"
                />
                    :
                  <img
                    src={`${videoUrl}?token=${sessionToken}`} // Append the token to the URL as a query parameter
                    alt="Video Feed"
                    className="responsive-img"
                  />
}
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
                    className="h-100 p-3 rounded-2 py-2 flex-grow-1"
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
                                      <li className="my-2 me-4">
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
                              {portfolioViewerID === currentUser._id ? (
                                <video
                                  className="responsive-img"
                                  controls
                                  width="500"
                                  src={`/SampleRecordings/${videoSelected.name}`}
                                >
                                  Your browser does not support the video tag.
                                </video>
                              ) : (
                                <video
                                  className="responsive-img"
                                  controls
                                  width="500"
                                  src={`${serverUrl}/api/video/${videoSelected.id}?accessToken=${accessToken}`}
                                >
                                  Your browser does not support the video tag.
                                </video>
                              )}
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
                                    {portfolioViewerID === currentUser._id ? (
                                      <video
                                        controls
                                        width="200"
                                        src={`/SampleRecordings/${video.name}`}
                                      >
                                        Your browser does not support the video
                                        tag.
                                      </video>
                                    ) : (
                                      <video
                                        controls
                                        width="200"
                                        src={`${serverUrl}/api/video/${video.id}?accessToken=${accessToken}`}
                                      >
                                        Your browser does not support the video
                                        tag.
                                      </video>
                                    )}
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
