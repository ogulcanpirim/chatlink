import React, { Fragment } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { Transition } from "@headlessui/react";
import {
  clearSelectedChat,
  toggleChatModal,
} from "../store/reducers/pageReducer";
import { useAppDispatch } from "../store";

const ChatDropdown = () => {
  const { chatModal } = useAppSelector((state) => state.page);
  const dispatch = useAppDispatch();
  return (
    <Transition
      as={Fragment}
      show={chatModal}
      enter="transition ease-out duration-300"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <div className="absolute mt-10 mr-10 right-0 top-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 focus:bg-red-500">
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefaultButton"
        >
          <li>
            <a
              href="/"
              id="chatDropdownContactInfo"
              onClick={(e) => {
                e.preventDefault();
                dispatch(toggleChatModal());
              }}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Contact Info
            </a>
          </li>
          <li>
            <a
              href="/"
              id="chatDropdownCloseChat"
              onClick={(e) => {
                e.preventDefault();
                dispatch(clearSelectedChat());
              }}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Close Chat
            </a>
          </li>
        </ul>
      </div>
    </Transition>
  );
};

export default React.memo(ChatDropdown);
