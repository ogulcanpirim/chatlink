import React from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import {
  setFriendModal,
  setUserModal,
  toggleHeaderModal,
} from "../store/reducers/pageReducer";
import moreLogo from "../assets/three-dots.svg";
import friendsLogo from "../assets/friends.svg";
import MainDropdown from "./MainDropdown";
import { useAppDispatch } from "../store";
import defaultAvatar from "../assets/default-avatar.png";

const ChatListHeader = () => {
  const { darkMode, headerModal } = useAppSelector((state) => state.page);

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <div className={`relative shrink-0 ${darkMode && "dark"}`}>
      <header>
        <nav className="z-10 bg-white drop-shadow-md border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mx-auto relative">
            <div className="flex items-center">
              <img
                onClick={() => {
                  dispatch(setUserModal(true));
                }}
                src={user?.avatar || defaultAvatar}
                className="object-cover mr-3 h-10 w-10 rounded-full cursor-pointer"
                alt="Logo"
              />
              <span className="self-center text-lg text-black font-semibold whitespace-nowrap dark:text-white">
                {userData?.firstName + " " + userData?.lastName}
              </span>
            </div>
            <div className="items-center justify-center">
              <button
                onClick={() => {
                  dispatch(setFriendModal(true));
                }}
                className={`rounded-full p-2 cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600
              }`}
              >
                <div className="flex items-center lg:order-2">
                  <img className="w-5 h-5" src={friendsLogo} alt="More Logo" />
                </div>
              </button>
              <button
                id="mainDropdown"
                onClick={() => {
                  dispatch(toggleHeaderModal());
                }}
                className={`rounded-full p-2 cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 ${
                  headerModal &&
                  "text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600"
                }`}
              >
                <div className="flex items-center lg:order-2">
                  <img
                    id="mainDropdownImg"
                    className="w-5 h-5"
                    src={moreLogo}
                    alt="More Logo"
                  />
                </div>
              </button>
            </div>
          </div>
        </nav>
        <MainDropdown />
      </header>
    </div>
  );
};

export default React.memo(ChatListHeader);
