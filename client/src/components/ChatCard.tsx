import React, { useEffect, useState } from "react";
import rightArrow from "../assets/right-arrow.svg";
import { useDispatch } from "react-redux";
import { IChatListItem, setSelectedChat } from "../store/reducers/pageReducer";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../hooks/useAppSelector";

interface ChatCardProps {
  socket: Socket;
  chat: IChatListItem;
  selected: boolean;
}

interface SocketTypeData {
  chat_id: string;
  user_id: string;
}

const ChatCard = ({ socket, selected, chat }: ChatCardProps) => {
  const dispatch = useDispatch();
  const [typing, setTyping] = useState(false);
  const { chatSearch } = useAppSelector((state) => state.page);
  const handleChatSelect = () => {
    dispatch(setSelectedChat(chat));
  };

  useEffect(() => {
    if (socket) {
      socket.on("typing", (data: SocketTypeData) => {
        if (data.chat_id === chat._id) {
          setTyping(true);
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    typing && setTimeout(() => setTyping(false), 1000);
  }, [typing]);

  const user = localStorage.getItem("user");
  const user_id = user ? JSON.parse(user)._id : null;
  const otherUser = chat.users.find((user) => user._id !== user_id);
  const name = otherUser
    ? otherUser.firstName + " " + otherUser.lastName
    : "User";

  const getHighlightedText = (text: string, highlight: string) => {
    const parts: string[] = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {" "}
        {parts.map((part, i) => (
          <span
            key={i}
            className={`${
              part.toLowerCase() === highlight.toLowerCase() &&
              "text-fuchsia-500"
            }`}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { fontWeight: "bold" }
                : {}
            }
          >
            {part}
          </span>
        ))}{" "}
      </span>
    );
  };

  return (
    <div
      onClick={handleChatSelect}
      className={`${
        selected
          ? "bg-gray-300 dark:bg-gray-700"
          : "bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800"
      } flex flex-col justify-center px-5 py-6 mx-auto border-b dark:border-gray-800 cursor-pointer min-w-full`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <img
            className="w-12 h-12 rounded-full"
            src={`https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/f2/f2c80166a0aafda50418f306720ad1b7a9086759_full.jpg`}
            alt="User Avatar"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-md font-medium text-gray-900 truncate dark:text-white">
            {chatSearch.length > 0
              ? getHighlightedText(name, chatSearch)
              : name}
          </p>
          <p
            className={`text-sm text-gray-500 truncate dark:text-gray-400 ${
              typing && "italic"
            }`}
          >
            {typing ? "Typing..." : chat.latestMessage?.content || "-"}
          </p>
        </div>
        <img className="w-4 h-4" src={rightArrow} alt="Right Arrow" />
      </div>
    </div>
  );
};

export default React.memo(ChatCard);
