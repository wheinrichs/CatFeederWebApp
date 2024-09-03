import axios from "axios";
import { useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
const serverUrl = process.env.REACT_APP_SERVER_URL;

export default function Callback() {
  console.log("Callback")
  const called = useRef(false);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      if (currentUser === null) {
        try {
        
          if (called.current) return; // prevent rerender caused by StrictMode
          called.current = true;
          const res = await axios.get(
            `${serverUrl}/auth/token${window.location.search}`
          );
          console.log("response: ", res);
          const {
            data: { loggedIn: logged_in, user },
          } = res;
          console.log("callback user is: ", user)
          dispatch(setCurrentUser(user));
          navigate("/");
        } catch (err) {
          console.error(err);
          navigate("/");
        }
      } else if (currentUser !== null) {
        console.log("already logged in");
        navigate("/");
      }
    })();
  }, [currentUser, navigate]);
  return <></>;
}
