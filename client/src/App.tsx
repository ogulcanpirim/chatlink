import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./screens/Auth/Login";
import Register from "./screens/Auth/Register";
import Home from "./screens/Home/Home";
import FriendTagModal from "./components/FriendTagModal";
import FriendsModal from "./components/FriendsModal";
import Toast from "./components/Toast";
import UserInfoModal from "./components/UserInfoModal";
import AlertModal from "./components/AlertModal";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <Toast />
        <FriendsModal />
        <FriendTagModal />
        <UserInfoModal />
        <AlertModal />
      </BrowserRouter>
    </>
  );
}

export default App;
