import masthead from "../masthead";
import "./cover.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as client from "../Account/client";
import { setCurrentUser } from "../Account/reducer";
import footer from "../footer";
import Footer from "../footer";

export default function Homepage() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([] as any)

  console.log("User is: ", currentUser)
  

  const evalCurrentUser = async () => {
    const FetchUser = await client.checkLoginState();
    dispatch(setCurrentUser(FetchUser))
  }

  const getPosts = async() => {
      setPosts(await client.getPosts(currentUser));
  }

  useEffect(() => {
    evalCurrentUser(); 
    getPosts();
  }, [])

  return (
    <div className="text-center vh-100">
      <div className="cover-container d-flex h-100 p-3 mx-auto flex-column">
        <div className="mb-auto">{masthead()}</div>
        <div className="content-view">
          <main role="main" className="inner cover">
            <h1 className="cover-heading">Welcome to your pet feeder.</h1>
            <p className="lead">Should we check on your furry friend?</p>
            <p className="lead">
              <a href="/livefeed" className="btn btn-lg btn-secondary">
                Live Feed
              </a>
            </p>
          </main>
        </div>
        <div className = "mt-auto">
        <Footer />
        </div>
      </div>
    </div>
  );
}
