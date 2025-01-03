/*
This file defines the feeder option screen where a user can update when and how
much the feeder outputs. All communication with the backend server (and consequently
the database) happens in the client file
*/

import * as client from "./client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { MdDelete } from "react-icons/md";
import masthead from "../masthead";
import Footer from "../footer";

export default function FeederSettings() {
  const navigate = useNavigate();

  // Set state variables for the times, schedule, and portion for the users account
  const [times, setTimes] = useState({} as any);
  const [schedule, setSchedule] = useState([] as any);
  const [portion, setPortion] = useState<any>();

  // Create a state variable to store the schedule a user wants to delete during the confirmation modal
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

  // Retrieve the current user from the reducer
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  // Fetch the users preferences from the backend server (and consequently the database)
  const fetchUserPreferences = async () => {
    const fetchedSchedule = await client.getUserPreferences(currentUser._id);
    // Update the times and portion state variables using this information
    setTimes(fetchedSchedule.schedule as any);
    setPortion(fetchedSchedule.portion);
  };

  // Fetch the user preferences when the screen is loaded for the first time 
  useEffect(() => {
    fetchUserPreferences();
  }, []);

  // Process the schedules when the times are updated
  useEffect(() => {
    processSchedulesForDisplay();
  }, [times]);

  /*
  Function: processSchedulesForDisplay
    This function iterates over each entry in the schedule and groups together 
    days with the same times for display pruposes
  */ 
  const processSchedulesForDisplay = () => {
    setSchedule((prevSchedule: any) => {
      // Create anew schedule which is a copy of the current schedule
      let newSchedule = [...prevSchedule];
      // For each day in the schedule
      for (let key in times) {
        // Retrieve the time and set a flag to false to represent it hasn't been seen yet
        if (times.hasOwnProperty(key)) {
          let value = times[key];
          let found = false;
          
          // If the schedule length is not 0
          if (newSchedule.length !== 0) {
            // Check if the new schdule already contains this time already
            newSchedule = newSchedule.map((sched) => {
              if (value.length === 0 && sched.times.length === 0) {
                if (!sched.days.includes(key)) {
                  sched.days = [...sched.days, key];
                }
                found = true;
              } else if (
                value.length !== 0 &&
                value.sort().join(",") === sched.times.sort().join(",")
              ) {
                if (!sched.days.includes(key)) {
                  sched.days = [...sched.days, key];
                }
                found = true;
              }
              return sched;
            });
          }

          // If the exact times were not found already then create a new schedule entry with a unique ID
          if (!found) {
            const idGen =
              Date.now().toString(36) + Math.random().toString(36).substr(2);
            newSchedule.push({ times: value, days: [key], id: idGen });
          }
        }
      }
      return newSchedule;
    });
  };

  /*
  Function: changeDays
    This function handles changing the schedule when a user removes or adds a day to the 
    schedule. 
  */
  const changeDays = (e: any, id: any, dayOfWeek: string) => {
    setSchedule(
      schedule.map((day: any) => {
        if (day.id === id) {
          const updatedDays = [...day.days];
          const dayIndex = updatedDays.indexOf(dayOfWeek);

          if (e.target.checked && dayIndex === -1) {
            // If checked and day is not already in the array, add it
            updatedDays.push(dayOfWeek);
          } else if (!e.target.checked && dayIndex !== -1) {
            // If unchecked and day is in the array, remove it
            updatedDays.splice(dayIndex, 1);
          }

          return {
            ...day,
            days: updatedDays,
          };
        }
        return day;
      })
    );
  };

  /*
  Function: addTime
    This function handles changing the schedule when a user adds a time to the 
    schedule. 
  */
  const addTime = (id: any) => {
    setSchedule(
      schedule.map((day: any) => {
        if (day.id === id) {
          const updatedTimes = [...day.times, "00:00"];

          return {
            ...day,
            times: updatedTimes,
          };
        }
        return day;
      })
    );
  };

  /*
  Function: changeTime
    This function handles changing the schedule when a user changes a time on the 
    schedule. 
  */
  const changeTime = (e: any, id: any, index: any) => {
    const newTime = e.target.value;

    setSchedule(
      schedule.map((day: any) => {
        if (day.id === id) {
          const updatedTimes = [...day.times];
          updatedTimes[index] = newTime;

          return {
            ...day,
            times: updatedTimes,
          };
        }
        return day;
      })
    );
  };

  // This function adds a new shcedule to the user's account
  const addSchedule = () => {
    const idGen =
      Date.now().toString(36) + Math.random().toString(36).substr(2);
    setSchedule([...schedule, { times: [], days: [], id: idGen }]);
  };

  // This function handles parsing the schedule object that the react front end creates and adjusting it to match the database format
  const deconstructScheduleForServer = () => {
    let serverFormatSched: { [key: string]: string[] } = {};
    // For each schedule in the list, adjust the formatting to match the destination database format
    schedule.forEach((sched: any) => {
      sched.days.forEach((day: any) => {
        if (Object.hasOwn(serverFormatSched, day)) {
          serverFormatSched[day] = [...serverFormatSched[day], ...sched.times];
        } else {
          serverFormatSched[day] = [...sched.times];
        }
      });
    });
    return serverFormatSched;
  };

  // Detele the schedule by removing it from the state variable
  const deleteSchedule = (schedule_id: any) => {
    setSchedule(schedule.filter((sched: any) => sched.id !== schedule_id));
  };

  // Write the schedules in the list to the server and to the database
  const postScheduleChanges = async () => {
    // Create a new object in the correct format to be written
    const toWrite = deconstructScheduleForServer();
    // Send the new schedule to the backend server
    const fetchedSchedule = await client.setPortionAndSchedule(
      currentUser._id,
      toWrite,
      portion
    );
    // Navigate to the home screen
    navigate("/home");
  };

  // Delete a time from the shcedule 
  const deleteTime = (dayId: any, index: any) => {
    // Set the schedule so the time on the specified day is no longer included in the state variable
    setSchedule(
      schedule.map((day: any) => {
        if (day.id === dayId) {
          const updatedTimes = day.times.filter(
            (_: any, i: any) => i !== index
          );
          return {
            ...day,
            times: updatedTimes,
          };
        }
        return day;
      })
    );
  };

  return (
    <div className="container-fluid text-center" style={{  height: "100dvh"}}>
      <div className="cover-container d-flex h-100 mx-auto flex-column">
        <div className="mb-auto p-3">{masthead()}</div>
        <div className="content-wrapper">
          <main role="main">
            <div>
              <div
                className="bg-secondary bg-opacity-50 position-fixed w-100 h-100"
                style={{ zIndex: -1}}
              ></div>
              <div className="container-fluid d-flex justify-content-center position-relative"
                        style={{ width: "100%", maxWidth: "600px", overflow: "hidden"}}
>
                <div className="text-center">
                  <h1 className="mb-3">Feeder Settings</h1>
                  <div className="container border border-2 border-light my-5 p-4 rounded-4">
                    <div className="row align-items-center">
                      <label htmlFor="portionBox" className="col-auto">
                        Portion:
                      </label>

                      <div className="col">
                        <input
                          id="portionBox"
                          className="form-control"
                          type="number"
                          defaultValue={portion}
                          onChange={(e) => setPortion(e.target.value)}
                        />
                      </div>

                      <label htmlFor="portionBox" className="col-auto">
                        1/6 Cups At Each Time
                      </label>
                    </div>
                  </div>
                  {schedule.map((day: any) => (
                    <div className="border border-2 border-light m-2 p-4 rounded-4">
                      <div
                        className="btn-group btn-group-lg flex-wrap mb-3"
                        role="group"
                        aria-label="Basic checkbox toggle button group"
                      >
                        <input
                          type="checkbox"
                          className="btn-check"
                          id={`mCheck.${day.id}`}
                          autoComplete="off"
                          onChange={(e) => {
                            changeDays(e, day.id, "M");
                          }}
                          checked={day.days.includes("M")}
                        />
                        <label
                          className="btn btn-outline-light"
                          htmlFor={`mCheck.${day.id}`}
                        >
                          M
                        </label>

                        <input
                          type="checkbox"
                          className="btn-check"
                          id={`tCheck.${day.id}`}
                          autoComplete="off"
                          onChange={(e) => {
                            changeDays(e, day.id, "T");
                          }}
                          checked={day.days.includes("T")}
                        />
                        <label
                          className="btn btn-outline-light"
                          htmlFor={`tCheck.${day.id}`}
                        >
                          T
                        </label>

                        <input
                          type="checkbox"
                          className="btn-check"
                          id={`wCheck.${day.id}`}
                          autoComplete="off"
                          onChange={(e) => {
                            changeDays(e, day.id, "W");
                          }}
                          checked={day.days.includes("W")}
                        />
                        <label
                          className="btn btn-outline-light"
                          htmlFor={`wCheck.${day.id}`}
                        >
                          W
                        </label>

                        <input
                          type="checkbox"
                          className="btn-check"
                          id={`thCheck.${day.id}`}
                          autoComplete="off"
                          onChange={(e) => {
                            changeDays(e, day.id, "Th");
                          }}
                          checked={day.days.includes("Th")}
                        />
                        <label
                          className="btn btn-outline-light"
                          htmlFor={`thCheck.${day.id}`}
                        >
                          Th
                        </label>

                        <input
                          type="checkbox"
                          className="btn-check"
                          id={`fCheck.${day.id}`}
                          autoComplete="off"
                          onChange={(e) => {
                            changeDays(e, day.id, "F");
                          }}
                          checked={day.days.includes("F")}
                        />
                        <label
                          className="btn btn-outline-light"
                          htmlFor={`fCheck.${day.id}`}
                        >
                          F
                        </label>

                        <input
                          type="checkbox"
                          className="btn-check"
                          id={`sCheck.${day.id}`}
                          autoComplete="off"
                          onChange={(e) => {
                            changeDays(e, day.id, "S");
                          }}
                          checked={day.days.includes("S")}
                        />
                        <label
                          className="btn btn-outline-light"
                          htmlFor={`sCheck.${day.id}`}
                        >
                          S
                        </label>

                        <input
                          type="checkbox"
                          className="btn-check"
                          id={`suCheck.${day.id}`}
                          autoComplete="off"
                          onChange={(e) => {
                            changeDays(e, day.id, "Su");
                          }}
                          checked={day.days.includes("Su")}
                        />
                        <label
                          className="btn btn-outline-light"
                          htmlFor={`suCheck.${day.id}`}
                        >
                          Su
                        </label>
                      </div>
                      {day.times &&
                        day.times.map((time: any, index: any) => (
                          <div className="d-flex align-items-center">
                            <input
                              className="form-control my-2"
                              aria-label="Time"
                              onChange={(e) => changeTime(e, day.id, index)}
                              type="time"
                              value={time}
                            />
                            <button
                              className="btn btn-danger ms-3"
                              onClick={() => deleteTime(day.id, index)}
                            >
                              <MdDelete className="fs-4" />
                            </button>
                          </div>
                        ))}
                      <div>
                        <button
                          className="btn btn-primary m-2"
                          onClick={() => addTime(day.id)}
                        >
                          Add Another Time
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger m-2"
                          onClick={() => setScheduleToDelete(day.id)}
                          data-bs-toggle="modal"
                          data-bs-target="#confirmationModal"
                        >
                          Delete Schedule
                        </button>
                      </div>
                    </div>
                  ))}
                  <div>
                    <button
                      className="btn btn-dark my-1 me-2"
                      onClick={addSchedule}
                    >
                      Add Another Schedule
                    </button>
                  </div>
                  <div className="mt-4">
                    <button
                      className="btn btn-danger mb-4 me-2"
                      onClick={() => navigate("/home")}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-success mb-4"
                      onClick={postScheduleChanges}
                    >
                      Submit Changes
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="modal fade"
                id="confirmationModal"
                aria-labelledby="confirmationModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content" style={{ backgroundColor: "#333333" }}>
                    <div className="modal-header">
                      <h5 className="modal-title" id="confirmationModalLabel">
                        Confirm Delete
                      </h5>
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      Are you sure you want to delete this schedule?
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        data-bs-dismiss="modal"
                        onClick={() => {
                          deleteSchedule(scheduleToDelete);
                          setScheduleToDelete(null);
                        }}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <div className = "mt-auto">

        <Footer />
        </div>
      </div>
    </div>
  );
}
