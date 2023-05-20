import { Navigate } from "react-router-dom";
import ChatList from "../../components/ChatList";
import ChatListHeader from "../../components/ChatListHeader";
import { useAppSelector } from "../../hooks/useAppSelector";
import ChatContainer from "../../components/ChatContainer";
import { Fragment, useEffect } from "react";
import SearchBar from "../../components/SearchBar";
import { useIsMobile } from "../../hooks/isMobile";
import { useAppDispatch } from "../../store";
import {
  IChatListItem,
  IMessage,
  appendChat,
  appendMessage,
  setUser,
} from "../../store/reducers/userReducer";
import {
  setChatModal,
  setEmojiModal,
  setHeaderModal,
} from "../../store/reducers/pageReducer";
import {
  GetChatMessagesRequest,
  GetChatRequest,
} from "../../store/actions/userActions";
import { toast } from "react-toastify";
import socket from "../../utils/socket";

const Home = () => {
  const { darkMode, headerModal, chatModal, emojiModal } = useAppSelector(
    (state) => state.page
  );
  const { selectedChat } = useAppSelector((state) => state.user);
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();

  const handleModal = (e: MouseEvent) => {
    const target = e.target;
    if (target instanceof HTMLElement) {
      const emojiClicked = target.outerHTML.includes("epr");
      if (!emojiClicked) {
        emojiModal && dispatch(setEmojiModal(false));
      }
      if (target.id.includes("mainDropdown")) {
        chatModal && dispatch(setChatModal(!chatModal));
      } else if (target.id.includes("chatDropdown")) {
        headerModal && dispatch(setHeaderModal(!headerModal));
      } else {
        headerModal && dispatch(setHeaderModal(!headerModal));
        chatModal && dispatch(setChatModal(!chatModal));
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleModal);
    return () => {
      document.removeEventListener("mousedown", handleModal);
    };
  }, [headerModal, chatModal, emojiModal]);

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

  //socket.io connection
  useEffect(() => {
    if (!socket.connected) {
      socket.io.opts.query = { user: user?._id };
      socket.connect();
    }
    socket.on("connect", () => {
      socket?.emit("setup", userData);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket, userData]);

  //socket.io message/chat
  useEffect(() => {
    if (socket) {
      socket.on("message", (data: IMessage) => {
        dispatch(appendMessage(data));
      });
      socket.on("newChat", (data: { chat: IChatListItem; name: string }) => {
        toast.success(
          <div>
            <span className="font-bold">{data.name}</span>
            <span> accepted your friend request !</span>
          </div>
        );
        dispatch(appendChat(data.chat));
      });
    }
  }, [socket]);

  if (!userData) {
    return <Navigate to={"/login"} />;
  }

  if (isMobile) {
    return (
      <div className={`flex grow flex-col h-screen ${darkMode && "dark"}`}>
        {!selectedChat ? (
          <Fragment>
            <ChatListHeader />
            <SearchBar placeholder="Search in Chats..." />
            <div className="bg-gray-100 h-screen overflow-y-auto dark:bg-gray-900">
              <ChatList />
            </div>
          </Fragment>
        ) : (
          <ChatContainer />
        )}
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${darkMode && "dark"}`}>
      <div
        className={
          "bg-gray-100 flex-col flex-nowrap basis-3/12 min-w-[%50] dark:bg-gray-900 overflow-hidden"
        }
      >
        <ChatListHeader />
        <SearchBar placeholder="Search in Chats..." />
        <div className="h-screen overflow-y-auto">
          <ChatList />
        </div>
      </div>
      <div className="basis-9/12">
        <ChatContainer />
      </div>
    </div>
  );
};

export default Home;
