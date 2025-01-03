/*
This file defines the reducer that holds the account state variables for the application. It 
holds the current user and if the user is logged in or not
*/

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    currentUser: null,
    loggedIn: false,
};
const accountSlice = createSlice({
    name:"account", 
    initialState,
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        }
    },
})
export const { setCurrentUser, setLoggedIn } = accountSlice.actions;
export default accountSlice.reducer;