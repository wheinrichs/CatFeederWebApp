import * as client from "./client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { MdDelete } from "react-icons/md";

export default function FeederSettings() {
  const [times, setTimes] = useState({} as any);
  const [schedule, setSchedule] = useState([] as any);
  const navigate = useNavigate();
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
  const [portion, setPortion] = useState<any>();

  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const fetchUserPreferences = async () => {
    const fetchedSchedule = await client.getUserPreferences(currentUser._id);
    console.log("Fetched schedule is: ", fetchedSchedule)
    setTimes(fetchedSchedule.schedule as any);
    setPortion(fetchedSchedule.portion);
  };

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  useEffect(() => {
    processSchedulesForDisplay();
  }, [times]);

  const processSchedulesForDisplay = () => {
    setSchedule((prevSchedule: any) => {
      let newSchedule = [...prevSchedule];
      for (let key in times) {
        if (times.hasOwnProperty(key)) {
          let value = times[key];
          let found = false;

          if (newSchedule.length !== 0) {
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

          if (!found) {
            const idGen =
              Date.now().toString(36) + Math.random().toString(36).substr(2);
            console.log("Date ", idGen);
            newSchedule.push({ times: value, days: [key], id: idGen });
          }
        }
      }
      return newSchedule;
    });
  };

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
            days: updatedDays, // Update the days array
          };
        }
        return day;
      })
    );
  };

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

  const addSchedule = () => {
    const idGen =
      Date.now().toString(36) + Math.random().toString(36).substr(2);
    setSchedule([...schedule, { times: [], days: [], id: idGen }]);
  };

  const deconstructScheduleForServer = () => {
    let serverFormatSched: { [key: string]: string[] } = {};

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

  const deleteSchedule = (schedule_id: any) => {
    setSchedule(schedule.filter((sched: any) => sched.id !== schedule_id));
  };

  const postScheduleChanges = async () => {
    const toWrite = deconstructScheduleForServer();
    console.log("written ", toWrite);
    const fetchedSchedule = await client.setPortionAndSchedule(
      currentUser._id,
      toWrite,
      portion
    );
    console.log(fetchedSchedule);
    navigate("/TempNav");
  };

  const deleteTime = (dayId: any, index: any) => {
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

  console.log("schedule is: ", schedule);

  return (
    <div>
      <div
        className="bg-secondary bg-opacity-50 position-fixed w-100 h-100"
        style={{ zIndex: -1 }}
      ></div>
      <div className="container-fluid vh-100 d-flex justify-content-center position-relative">
        <div className="p-2 text-center">
          <h1 className="mb-3">Feeder Settings</h1>
          <div className="container border border-2 border-dark my-5 p-4 rounded-4">
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
                1/8 Cups At Each Time
              </label>
            </div>
          </div>
          {schedule.map((day: any) => (
            <div className="border border-2 border-dark m-2 p-4 rounded-4">
              <div
                className="btn-group btn-group-lg mb-3"
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
                  className="btn btn-outline-primary"
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
                  className="btn btn-outline-primary"
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
                  className="btn btn-outline-primary"
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
                  className="btn btn-outline-primary"
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
                  className="btn btn-outline-primary"
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
                  className="btn btn-outline-primary"
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
                  className="btn btn-outline-primary"
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
            <button className="btn btn-dark my-1 me-2" onClick={addSchedule}>
              Add Another Schedule
            </button>
          </div>
          <div className="mt-4">
            <button
              className="btn btn-danger mb-4 me-2"
              onClick={() => navigate("/TempNav")}
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
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmationModalLabel">
                Confirm Delete
              </h5>
              <button
                type="button"
                className="btn-close"
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
  );
}
