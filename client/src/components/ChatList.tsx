import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import ChatCard from "./ChatCard";

const ChatList = () => {
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

  if (filteredChatList.length === 0) {
    return (
      <div className="flex h-full justify-center items-center">
        <h1 className="text-lg font-semibold text-gray-500">No Chats Found</h1>
      </div>
    );
  }

  return (
    <div className="w-full">
      {filteredChatList.map((chat, index) => {
        return (
          <ChatCard
            key={index.toString()}
            chat={chat}
            selected={selectedChat?._id === chat._id}
          />
        );
      })}
    </div>
  );
};

export default ChatList;
