import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import ChatCard from "./ChatCard";
import { setFriendTagModal } from "../store/reducers/pageReducer";
import { useAppDispatch } from "../store";

const ChatList = () => {
  const { selectedChat, chatList, chatSearch } = useAppSelector(
    (state) => state.user
  );
  const [filteredChatList, setFilteredChatList] = useState(chatList);
  const dispatch = useAppDispatch();

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
      <div className="flex h-full justify-center items-center flex-col space-y-1">
        <div className="text-xl font-semibold text-gray-500">
          No Chats Found
        </div>
        <div
          onClick={() => {
            dispatch(setFriendTagModal(true));
          }}
          className="cursor-pointer text-md font-semibold text-primary-600 hover:underline dark:text-primary-500"
        >
          Add a Friend
        </div>
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
