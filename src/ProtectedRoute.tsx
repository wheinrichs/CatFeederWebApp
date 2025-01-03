/*
This file creates protected routes. It prevents users who are not logged in from accessing
certain routes within the application. This helps prevent errors or access to restricted parts
of the application. 
*/
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
export default function ProtectedRoute({ children }: { children: any }) {
  // Get the current user from the session store
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  // If there is a current user already assigned, then render whatever route that is trying to be accessed
  if (currentUser) {
    return children;
  } else {
    // If there is no user currently stored in the application (no one is logged in) navigate to the login screen
    return <Navigate to="/Login" />;
  }
}