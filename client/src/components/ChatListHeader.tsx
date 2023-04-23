import React, { useState } from "react";
import logo from "../assets/logo.png";
import { useAppSelector } from "../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import {
  setFriendModal,
  toggleHeaderModal,
} from "../store/reducers/pageReducer";
import moreLogo from "../assets/three-dots.svg";
import friendsLogo from "../assets/friends.svg";
import MainDropdown from "./MainDropdown";

const ChatListHeader = () => {
  const { darkMode, headerModal, friendModal } = useAppSelector(
    (state) => state.page
  );

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const dispatch = useDispatch();

  return (
    <div className={`relative shrink-0 ${darkMode && "dark"}`}>
      <header>
        <nav className="z-10 bg-white drop-shadow-md border-gray-200 px-4 lg:px-6 py-2 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mx-auto relative">
            <a href="#" className="flex items-center">
              <img src={logo} className="mr-3 h-8" alt="Logo" />
              <span className="self-center text-lg text-black font-semibold whitespace-nowrap dark:text-white">
                {user?.firstName + " " + user?.lastName}
              </span>
            </a>
            <div className="items-center justify-center">
              <button
                onClick={() => {
                  dispatch(setFriendModal(!friendModal));
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
            <MainDropdown />
          </div>
        </nav>
      </header>
    </div>
  );
};

export default React.memo(ChatListHeader);
