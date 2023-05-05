import React from "react";
import logo from "../assets/logo.png";
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

const ChatListHeader = () => {
  const { darkMode, headerModal } = useAppSelector((state) => state.page);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const dispatch = useAppDispatch();

  return (
    <div className={`relative shrink-0 ${darkMode && "dark"}`}>
      <header>
        <nav className="z-10 bg-white drop-shadow-md border-gray-200 px-4 lg:px-6 py-3 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mx-auto relative">
            <div className="flex items-center">
              <img
                onClick={() => {
                  dispatch(setUserModal(true));
                }}
                src={
                  "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/f2/f2c80166a0aafda50418f306720ad1b7a9086759_full.jpg"
                }
                className="mr-3 h-8 rounded-full cursor-pointer"
                alt="Logo"
              />
              <span className="self-center text-lg text-black font-semibold whitespace-nowrap dark:text-white">
                {user?.firstName + " " + user?.lastName}
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
