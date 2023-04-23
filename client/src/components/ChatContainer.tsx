import { useEffect, useLayoutEffect, useState } from "react";
import ChatBubble from "./ChatBubble";
import UserHeader from "./UserHeader";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useAppSelector } from "../hooks/useAppSelector";
import ScrollButton from "./ScrollButton";
import EmptyChatContainer from "./EmptyChatContainer";
import ChatDropdown from "./ChatDropdown";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { SendChatMessageRequest } from "../store/actions/pageActions";
import { IMessage, IMessageAPI } from "../store/reducers/pageReducer";
import { Socket } from "socket.io-client";

interface ChatContainerProps {
  socket: Socket;
}

interface SocketTypeData {
  chat_id: string;
  user_id: string;
}

const ChatContainer = ({ socket }: ChatContainerProps) => {
  const { darkMode, selectedChat, chatMessages } = useAppSelector(
    (state) => state.page
  );
  const dispatch = useDispatch<AppDispatch>();
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [emojiPicker, setEmojiPicker] = useState(false);

  const onMessageSubmit = (e: any) => {
    e.preventDefault();
    handleMessageSubmit(text);
  };
  const handleMessageSubmit = (text: string) => {
    const scrollContainer = document.getElementById("scrollContainer");
    scrollContainer?.scroll({
      top: scrollContainer.scrollHeight,
      behavior: "smooth",
    });
    const data = {
      chat_id: selectedChat?._id,
      content: text,
      user_id: JSON.parse(localStorage.getItem("user") || "{}")._id,
    } as IMessageAPI;
    dispatch(SendChatMessageRequest(data));
    setText("");
  };

  const handleEmojiPress = () => {
    setEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emoji: { unified: string }) => {
    const sym = emoji.unified.split("-");
    const codesArray: any[] = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    const emojiStr = String.fromCodePoint(...codesArray);
    setText((text) => text + emojiStr);
  };

  useLayoutEffect(() => {
    const scrollContainer = document.getElementById("scrollContainer");
    chatMessages.length > 0 &&
      scrollContainer?.scroll({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
  }, [chatMessages]);

  useEffect(() => {
    typing &&
      setTimeout(() => {
        setTyping(false);
      }, 1000);
  }, [typing]);

  useEffect(() => {
    socket.on("typing", (data: SocketTypeData) => {
      if (data.chat_id === selectedChat?._id && !typing) {
        setTyping(true);
      }
    });
  }, [socket, selectedChat, typing]);

  if (selectedChat === null) {
    return <EmptyChatContainer />;
  }

  const user = localStorage.getItem("user");

  const isUser = (user_id: string) => {
    return user && JSON.parse(user)._id === user_id;
  };

  const otherUser = selectedChat?.users.find((user) => !isUser(user._id));

  const username = (message: IMessage) => {
    return message.user_id === otherUser?._id
      ? otherUser?.firstName + " " + otherUser?.lastName
      : "You";
  };

  return (
    <div className="relative h-screen flex flex-col bg-gray-50 dark:bg-gray-800">
      <UserHeader
        name={otherUser?.firstName + " " + otherUser?.lastName}
        typing={typing}
      />
      <div id="scrollContainer" className="overflow-auto p-4 h-screen">
        {chatMessages.map((message, index) => (
          <ChatBubble
            key={index.toString()}
            username={username(message)}
            message={message.content}
            time={message.createdAt}
            isUser={!!isUser(message.user_id)}
            delivered
          />
        ))}
        <ScrollButton />
      </div>
      <ChatDropdown />
      <form onSubmit={onMessageSubmit}>
        {emojiPicker && (
          <div className="z-10">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={darkMode ? Theme.DARK : Theme.LIGHT}
            />
          </div>
        )}
        <label htmlFor="chat" className="sr-only">
          Your message
        </label>
        <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
          <button
            type="button"
            className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <svg
              aria-hidden="true"
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Upload image</span>
          </button>
          <button
            type="button"
            className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            onClick={handleEmojiPress}
          >
            <svg
              aria-hidden="true"
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Add emoji</span>
          </button>
          <textarea
            id="chat"
            rows={1}
            className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Your message..."
            value={text}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                text.length !== 0 && handleMessageSubmit(text);
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              socket.emit("typing", {
                chat_id: selectedChat?._id,
                users: selectedChat?.users.map((user) => user._id),
                user_id: user && JSON.parse(user)._id,
              });
              setText(e.target.value);
            }}
          ></textarea>
          <button
            type="submit"
            className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
          >
            <svg
              aria-hidden="true"
              className="w-6 h-6 rotate-90"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatContainer;
