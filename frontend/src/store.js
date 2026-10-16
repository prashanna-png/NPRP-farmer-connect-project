import { configureStore } from "@reduxjs/toolkit";
import authSliceReducers from "./slices/authSlice";

const store = configureStore({
  reducer: {
    auth: authSliceReducers,
  },
});

export default store;
