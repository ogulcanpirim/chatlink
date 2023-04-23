import React, { Fragment } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { Transition } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { deleteUser } from "../store/reducers/authReducer";
import {
  resetPage,
  toggleDarkMode,
  toggleHeaderModal,
} from "../store/reducers/pageReducer";

const MainDropdown = () => {
  const { headerModal, darkMode } = useAppSelector((state) => state.page);
  const dispatch = useDispatch();
  const handleSignOut = () => {
    dispatch(deleteUser());
    dispatch(resetPage());
  };

  const handleDarkMode = () => {
    dispatch(toggleHeaderModal());
    dispatch(toggleDarkMode());
  };
  return (
    <Transition
      as={Fragment}
      show={headerModal}
      enter="transition ease-out duration-3000"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <div className="absolute z-20 mt-8 mr-4 right-0 top-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 focus:bg-red-500">
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefaultButton"
        >
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Settings
            </a>
          </li>
          <li>
            <a
              id="mainDropdownDarkMode"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleDarkMode();
              }}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </a>
          </li>
          <li>
            <a
              id="mainDropdownSignOut"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleSignOut();
              }}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </Transition>
  );
};

export default React.memo(MainDropdown);
