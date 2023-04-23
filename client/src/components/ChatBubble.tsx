import React from "react";
import moment from "moment";
import { useAppSelector } from "../hooks/useAppSelector";

interface ChatBubbleProps {
  username: string;
  message: string;
  time: string;
  isUser: boolean;
  delivered?: boolean;
}

const ChatBubble = ({
  username,
  message,
  time,
  isUser,
  delivered,
}: ChatBubbleProps) => {
  const { darkMode } = useAppSelector((state) => state.page);

  return (
    <div className={`z-10 chat ${isUser ? "chat-end" : "chat-start"}`}>
      <div className="chat-image avatar">
        <div className="w-8 rounded-full">
          <img
            src={`https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/f2/f2c80166a0aafda50418f306720ad1b7a9086759_full.jpg`}
          />
        </div>
      </div>
      <div className="chat-header text-black dark:text-white py-1">
        {username}
        <time className="text-black dark:text-white text-xs opacity-50 px-2">
          {moment(time).format("HH:mm")}
        </time>
      </div>
      <div
        className={`chat-bubble ${isUser && "chat-bubble-primary"}`}
      >
        {message}
      </div>
      {delivered && (
        <div className="text-black dark:text-white chat-footer opacity-50 mt-1">
          Delivered
        </div>
      )}
    </div>
  );
};

export default React.memo(ChatBubble);
