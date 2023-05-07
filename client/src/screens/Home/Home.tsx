import { Navigate } from "react-router-dom";
import ChatList from "../../components/ChatList";
import BottomBar from "../../components/BottomBar";
import ChatListHeader from "../../components/ChatListHeader";
import { useAppSelector } from "../../hooks/useAppSelector";
import ChatContainer from "../../components/ChatContainer";
import { Fragment, useEffect, useRef } from "react";
import {
  IMessage,
  appendMessage,
  toggleChatModal,
  toggleHeaderModal,
} from "../../store/reducers/pageReducer";
import SearchBar from "../../components/SearchBar";
import { useIsMobile } from "../../hooks/isMobile";
import {
  GetChatMessagesRequest,
  GetChatRequest,
} from "../../store/actions/pageActions";

import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "../../store";
import { setUser } from "../../store/reducers/authReducer";

const Home = () => {
  const { darkMode, headerModal, chatModal, selectedChat } = useAppSelector(
    (state) => state.page
  );

  const socketRef = useRef<Socket>();
  const userData = localStorage.getItem("user");
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();

  const handleModal = (e: MouseEvent) => {
    const target = e.target;
    if (target instanceof HTMLElement) {
      if (target.id.includes("mainDropdown")) {
        chatModal && dispatch(toggleChatModal());
      } else if (target.id.includes("chatDropdown")) {
        headerModal && dispatch(toggleHeaderModal());
      } else {
        headerModal && dispatch(toggleHeaderModal());
        chatModal && dispatch(toggleChatModal());
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleModal);
    return () => {
      document.removeEventListener("mousedown", handleModal);
    };
  }, [headerModal, chatModal]);

  //get user chat(s)
  useEffect(() => {
    if (userData) {
      const user = JSON.parse(userData);
      dispatch(GetChatRequest(user._id));
      dispatch(setUser(user));
    }
  }, [userData]);

  //fetch chat messages
  useEffect(() => {
    selectedChat && dispatch(GetChatMessagesRequest(selectedChat._id));
  }, [selectedChat]);

  //socket.io
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL);
    socketRef.current.on("connect", () => {
      console.log("connected");
      socketRef.current?.emit("setup", userData);
    });
    socketRef.current.on("disconnect", () => {
      console.log("disconnected");
    });
    socketRef.current.on("message", (data: IMessage) => {
      dispatch(appendMessage(data));
    });
  }, [userData]);

  if (!userData) {
    return <Navigate to={"/login"} />;
  }

  if (isMobile) {
    return (
      <div className={`flex grow flex-col h-screen ${darkMode && "dark"}`}>
        {!selectedChat ? (
          <Fragment>
            <ChatListHeader />
            <SearchBar />
            <div className="bg-gray-100 h-screen overflow-y-auto dark:bg-gray-500">
              <ChatList socket={socketRef.current as Socket} />
            </div>
            <BottomBar />
          </Fragment>
        ) : (
          <ChatContainer socket={socketRef.current as Socket} />
        )}
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${darkMode && "dark"}`}>
      <div
        className={
          "bg-gray-100 flex-col flex-nowrap basis-1/5 min-w-[%50] dark:bg-gray-900 overflow-hidden"
        }
      >
        <ChatListHeader />
        <SearchBar />
        <div className="h-screen overflow-y-auto">
          <ChatList socket={socketRef.current as Socket} />
        </div>
      </div>
      <div className="basis-4/5">
        <ChatContainer socket={socketRef.current as Socket} />
      </div>
    </div>
  );
};

export default Home;
