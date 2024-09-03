import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
export default function ProtectedRoute({ children }: { children: any }) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  console.log("current user in protected route is: ", currentUser)

  if (currentUser) {
    return children;
  } else {
    return <Navigate to="/Login" />;
  }
}