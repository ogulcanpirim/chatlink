import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import pageReducer from "./reducers/pageReducer";
import authReducer from "./reducers/authReducer";

const reducer = combineReducers({
  page: pageReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof reducer>;
const store = configureStore({ reducer });
export type AppDispatch = typeof store.dispatch;
export default store;
