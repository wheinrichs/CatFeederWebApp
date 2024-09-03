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
            console.log("made it here with: ", action.payload)
            state.currentUser = action.payload;
        },
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        }
    },
})
export const { setCurrentUser, setLoggedIn } = accountSlice.actions;
export default accountSlice.reducer;