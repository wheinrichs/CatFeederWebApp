/*
This file sets up the store that contains the account reducer. This reducer stores the user information. 
*/

import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Account/reducer"

const store = configureStore({
    reducer: {
        accountReducer
    },
})

export default store;