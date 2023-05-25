import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import ChatBubble from "./ChatBubble";
import UserHeader from "./UserHeader";
import { useAppSelector } from "../hooks/useAppSelector";
import ScrollButton from "./ScrollButton";
import EmptyChatContainer from "./EmptyChatContainer";
import ChatDropdown from "./ChatDropdown";
import { useAppDispatch } from "../store";
import {
  IMessage,
  IMessageAPI,
  IUser,
  setMessageSearch,
} from "../store/reducers/userReducer";
import { SendChatMessageRequest } from "../store/actions/userActions";
import MessageSearchBar from "./MessageSearchBar";
import { toast } from "react-toastify";
import {
  setEmojiModal,
  setMessageSearchModal,
} from "../store/reducers/pageReducer";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import socket from "../utils/socket";
import { useIsMobile } from "../hooks/isMobile";

const MGS_CHAR_LIMIT = 1000;
interface SocketTypeData {
  chat_id: string;
  user_id: string;
}

const ChatContainer = () => {
  const { emojiModal, darkMode } = useAppSelector((state) => state.page);
  const { user, selectedChat, chatMessages, messageSearch } = useAppSelector(
    (state) => state.user
  );
  const dispatch = useAppDispatch();
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>(chatMessages);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (messageSearch) {
      const filtered = chatMessages.filter((msg) => {
        return msg.content.toLowerCase().includes(messageSearch.toLowerCase());
      });
      setMessages(filtered);
    } else {
      setMessages(chatMessages);
    }
  }, [messageSearch, chatMessages]);

  const getHighlightedText = useCallback(
    (text: string, highlight: string, isUser: boolean): JSX.Element => {
      const parts: string[] = text.split(new RegExp(`(${highlight})`, "gi"));
      return (
        <span>
          {" "}
          {parts.map((part, i) => (
            <span
              key={i}
              className={`${
                part.toLowerCase() === highlight.toLowerCase() &&
                `${
                  isUser
                    ? "text-red-300 dark:text-slate-900"
                    : "text-green-800 dark:text-violet-600"
                } font-bold dark:text-white`
              }`}
              style={part.toLowerCase() === highlight.toLowerCase() ? {} : {}}
            >
              {part}
            </span>
          ))}{" "}
        </span>
      );
    },
    []
  );

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

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    const chatInputElement = document.getElementById("chat");
    if (!chatInputElement) return;
    setText((prev) => prev + emojiObject.emoji);
  };

  useLayoutEffect(() => {
    const scrollContainer = document.getElementById("scrollContainer");
    messages.length > 0 &&
      scrollContainer?.scroll({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
  }, [messages]);

  useEffect(() => {
    typing &&
      setTimeout(() => {
        setTyping(false);
      }, 1000);
  }, [typing]);

  useEffect(() => {
    if (socket) {
      socket.on("typing", (data: SocketTypeData) => {
        if (data.chat_id === selectedChat?._id && !typing) {
          setTyping(true);
        }
      });
    }
  }, [socket, selectedChat, typing]);

  const emptySearch = useMemo(() => {
    return (
      messageSearch.length > 0 &&
      messages.length === 0 &&
      chatMessages.length > 0
    );
  }, [messageSearch, messages, chatMessages]);

  if (selectedChat === null) {
    return <EmptyChatContainer />;
  }

  const userData = localStorage.getItem("user");

  const isUser = (user_id: string) => {
    return userData && JSON.parse(userData)._id === user_id;
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
        id={otherUser?._id as string}
        avatar={otherUser?.avatar as string}
        typing={typing}
      />
      <MessageSearchBar />
      <div id="scrollContainer" className="overflow-auto p-4 h-screen">
        {emptySearch ? (
          <div className="flex flex-col space-y-1 h-full items-center justify-center text-gray-500">
            <svg className="w-8 h-8" viewBox="0 0 24 24" stroke="currentColor">
              <title />
              <g>
                <g>
                  <g>
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                    <line
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="12"
                      x2="12"
                      y1="12"
                      y2="16"
                    />
                    <line
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="12"
                      x2="12"
                      y1="8"
                      y2="8"
                    />
                  </g>
                </g>
              </g>
            </svg>
            <div className="text-lg font-semibold">No Messages Found !</div>
            <div
              onClick={() => {
                dispatch(setMessageSearch(""));
                dispatch(setMessageSearchModal(false));
              }}
              className="cursor-pointer text-md font-semibold text-primary-600 hover:underline dark:text-primary-500"
            >
              Clear
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatBubble
              key={index.toString()}
              username={username(message)}
              avatar={
                !!isUser(message.user_id) ? user?.avatar : otherUser?.avatar
              }
              message={
                messageSearch.length > 0
                  ? getHighlightedText(
                      message.content,
                      messageSearch,
                      !!isUser(message.user_id)
                    )
                  : message.content
              }
              time={message.createdAt}
              isUser={!!isUser(message.user_id)}
              delivered
            />
          ))
        )}
        <ScrollButton />
      </div>
      <ChatDropdown user={otherUser as IUser} />
      {emojiModal && (
        <div
          id="emojiModal"
          className="z-10 absolute origin-center left-0 bottom-0 -translate-y-[58px]"
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            emojiStyle={EmojiStyle.NATIVE}
            theme={darkMode ? Theme.DARK : Theme.LIGHT}
          />
        </div>
      )}
      <form onSubmit={onMessageSubmit}>
        <label htmlFor="chat" className="sr-only">
          Your message
        </label>
        <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
          <button
            type="button"
            className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            onClick={() =>
              toast.info(
                <span>
                  <span className="font-bold">Uploading Image</span> will be
                  available soon!
                </span>
              )
            }
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
          {!isMobile && (
            <button
              type="button"
              className={`p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 ${
                emojiModal &&
                "bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white"
              }`}
              onClick={() => {
                dispatch(setEmojiModal(!emojiModal));
              }}
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
          )}
          <textarea
            id="chat"
            rows={1}
            className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Your message..."
            value={text}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (text.length >= MGS_CHAR_LIMIT) {
                  toast.error(
                    <span>
                      Message limit is maximum{" "}
                      <span className="font-bold">1000</span> characters.
                    </span>
                  );
                }
                text.length !== 0 && handleMessageSubmit(text);
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              if (socket) {
                socket.emit("typing", {
                  chat_id: selectedChat?._id,
                  users: selectedChat?.users.map((user) => user._id),
                  user_id: userData && JSON.parse(userData)._id,
                });
              }
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
