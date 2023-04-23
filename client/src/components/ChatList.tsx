import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import ChatCard from "./ChatCard";
import { Socket } from "socket.io-client";

interface ChatListProps {
  socket: Socket;
}
const ChatList = ({ socket }: ChatListProps) => {
  const { selectedChat, chatList, chatSearch } = useAppSelector(
    (state) => state.page
  );
  const [filteredChatList, setFilteredChatList] = useState(chatList);

  useEffect(() => {
    if (chatSearch) {
      const filtered = chatList.filter((chat) => {
        const otherUser = chat.users.find(
          (user) => user._id !== JSON.parse(localStorage.getItem("user")!)._id
        );
        const fullName = `${otherUser?.firstName} ${otherUser?.lastName}`;
        return fullName.toLowerCase().includes(chatSearch.toLowerCase());
      });
      setFilteredChatList(filtered);
    } else {
      setFilteredChatList(chatList);
    }
  }, [chatSearch, chatList]);

  return (
    <div className="w-full">
      {filteredChatList.map((chat, index) => {
        return (
          <ChatCard
            key={index.toString()}
            socket={socket}
            chat={chat}
            selected={selectedChat?._id === chat._id}
          />
        );
      })}
      {filteredChatList.length === 0 && (
        <div className="flex justify-center items-center h-96">
          <h1 className="text-2xl font-semibold text-gray-500">
            No Chats Found
          </h1>
        </div>
      )}
    </div>
  );
};

export default ChatList;
