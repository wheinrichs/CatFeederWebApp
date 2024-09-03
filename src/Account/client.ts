import axios from "axios";

axios.defaults.withCredentials = true;
const serverUrl = process.env.REACT_APP_SERVER_URL;
console.log("Server URL:", serverUrl);

export const checkLoginState = async () => {
  try {
    const {
      data: { loggedIn: logged_in, user },
    } = await axios.get(`${serverUrl}/auth/logged_in`);
    if (logged_in === false) {
      console.log("checkLogin return null");
      return null;
    } else {
      console.log("checkLogin return user");

      return user;
    }
  } catch (err) {
    console.log("checkLogin return error");

    console.error(err);
    return err;
  }
};

export const getPosts = async (user: any) => {
  if (user !== null) {
    try {
      // Get posts from server
      const {
        data: { posts },
      } = await axios.get(`${serverUrl}/user/posts`);
      return posts;
    } catch (err) {
      console.error(err);
      return err;
    }
  }
};

export const handleLogout = async () => {
  try {
    await axios.post(`${serverUrl}/auth/logout`);
    console.log("logging out");
    return true;
  } catch (err) {
    console.error(err);
  }
};

export const handleLogin = async () => {
  console.log(serverUrl);
  try {
    // Gets authentication url from backend server
    const {
      data: { url },
    } = await axios.get(`${serverUrl}/auth/url`);
    console.log(url);
    // Navigate to consent screen
    window.location.assign(url);
  } catch (err) {
    console.error(err);
  }
};
