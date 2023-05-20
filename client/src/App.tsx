import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./screens/Auth/Login";
import Register from "./screens/Auth/Register";
import FriendTagModal from "./components/FriendTagModal";
import FriendsModal from "./components/FriendsModal";
import UserInfoModal from "./components/UserInfoModal";
import DeleteProfileModal from "./components/DeleteProfileModal";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppSelector } from "./hooks/useAppSelector";
import { useEffect } from "react";
import { useAppDispatch } from "./store";
import { setDarkMode } from "./store/reducers/pageReducer";
const Home = React.lazy(() => import("./screens/Home/Home.js"));

function App() {
  const { darkMode } = useAppSelector((state) => state.page);
  const dispatch = useAppDispatch();
  const darkData = localStorage.getItem("darkMode");

  useEffect(() => {
    if (darkData) {
      dispatch(setDarkMode(JSON.parse(darkData)));
    }
  }, []);

  return (
    <div className={`${darkMode && "dark"}`}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <FriendsModal />
        <FriendTagModal />
        <UserInfoModal />
        <DeleteProfileModal />
        <ToastContainer
          position="bottom-left"
          toastClassName={
            "bg-gray-50 dark:bg-gray-800 shadow-2xl text-gray-500"
          }
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          transition={Flip}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
