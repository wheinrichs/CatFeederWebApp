import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { setCurrentUser } from "./reducer";

export default function TempNav() {

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

    const handleLogout = async() => {
        try {
            await client.handleLogout();
            dispatch(setCurrentUser(null));
            console.log("successful logout")
            navigate("/Login")
        }
        catch {
            console.log("ERROR LOGGING OUT");
        }
    }
    
  return (
    <div>
      <Link className="btn btn-primary" to="/Login">
        Login
      </Link>
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
      <Link className="btn btn-secondary" to="/livefeed">
        Live Feed
      </Link>
      <Link className="btn btn-dark" to="/FeederSettings">
        Feeder Settings
      </Link>
      <h4>{currentUser?.name}</h4>
      <br />
      <p>{currentUser?.email}</p>
      <br />
      <img src={currentUser?.picture} alt={currentUser?.name} />
      <br />
      <div>
        {posts && posts.map((post: any, idx: any) => (
          <div>
            <h5>{post?.title}</h5>
            <p>{post?.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
