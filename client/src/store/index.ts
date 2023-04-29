import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import pageReducer from "./reducers/pageReducer";
import authReducer from "./reducers/authReducer";
import { useDispatch } from "react-redux";

const reducer = combineReducers({
  page: pageReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof reducer>;
const store = configureStore({ reducer });
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export default store;
