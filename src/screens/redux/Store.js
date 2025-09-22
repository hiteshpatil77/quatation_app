import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./Slices/counterSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer, // add all slices here
  },
});

export default store;
