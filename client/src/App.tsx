import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./screens/Auth/Login";
import Register from "./screens/Auth/Register";
import Home from "./screens/Home/Home";
import FriendModal from "./components/FriendModal";

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
      </BrowserRouter>
      <FriendModal />
    </>
  );
}

export default App;
