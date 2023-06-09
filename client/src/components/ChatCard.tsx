import { memo, useEffect, useState } from "react";
import rightArrow from "../assets/right-arrow.svg";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../store";
import defaultAvatar from "../assets/default-avatar.png";
import useCheckUserOnline from "../hooks/useCheckUserOnline";
import { IChatListItem, setSelectedChat } from "../store/reducers/userReducer";
import socket from "../utils/socket";
interface ChatCardProps {
  chat: IChatListItem;
  selected: boolean;
}
interface SocketTypeData {
  chat_id: string;
  user_id: string;
}

const ChatCard = ({ selected, chat }: ChatCardProps) => {
  const dispatch = useAppDispatch();
  const [typing, setTyping] = useState(false);
  const { chatSearch } = useAppSelector((state) => state.user);
  const handleChatSelect = () => {
    dispatch(setSelectedChat(chat));
  };
  const userData = localStorage.getItem("user");
  const user_id = userData ? JSON.parse(userData)._id : null;
  const otherUser = chat.users?.find((user) => user._id !== user_id);
  const online = useCheckUserOnline(otherUser?._id as string);
  const name = otherUser
    ? otherUser.firstName + " " + otherUser.lastName
    : "User";

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
              "text-primary-500 dark:text-primary-400"
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
        <div className="relative flex-shrink-0">
          <img
            className="object-cover w-12 h-12 rounded-full"
            src={otherUser?.avatar || defaultAvatar}
            alt="User Avatar"
          />
          {online && (
            <span className="absolute bottom-0 right-0 inline-block w-3.5 h-3.5 bg-green-500 border-2 border-gray-100 dark:border-gray-900 rounded-full"></span>
          )}
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
            {typing
              ? "Typing..."
              : chat.latestMessage?.content || (
                  <span className="italic">
                    Click to chat with your friend!
                  </span>
                )}
          </p>
        </div>
        <img className="w-4 h-4" src={rightArrow} alt="Right Arrow" />
      </div>
    </div>
  );
};

export default memo(ChatCard);
