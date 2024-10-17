import * as client from "./Account/client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./Account/reducer";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch } from "react-redux";
export default function Session({ children }: { children: any }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();
  const fetchProfile = async () => {
    try {
      console.log("Currently waiting for sessino server")
      const currentUser = await client.checkLoginState();
      dispatch(setCurrentUser(currentUser));
    } catch (err: any) {
      console.error(err);
    }
    setPending(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (pending) {
    // Show "Server Starting Up" message while waiting for the fetchProfile to finish
    return (
      <div className="container-fluid d-flex flex-column justify-content-center align-items-center bg-opacity-50" style={{ height: "100dvh" }}>
        <h2>Server Starting Up</h2>
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="50"
          visible={true}
        />
      </div>
    );
  }

  // Once pending is false, render the children components
  return <>{children}</>;
}
