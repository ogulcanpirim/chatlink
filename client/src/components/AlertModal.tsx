import { Portal, Transition } from "@headlessui/react";
import React, { useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../store";
import { setAlertModal } from "../store/reducers/pageReducer";
import trash from "../assets/trash.svg";

const AlertModal = () => {
  const [show, setShow] = useState(true);
  const { darkMode, alertModal } = useAppSelector((state) => state.page);
  const dispatch = useAppDispatch();

  if (!alertModal) {
    return null;
  }

  return (
    <Portal>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShow(false);
          }
        }}
        className={`${
          darkMode && "dark"
        } fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center`}
      >
        <Transition
          show={show}
          appear={true}
          enter="transition-all ease-in-out duration-300 transform"
          enterFrom="opacity-0 scale-50"
          enterTo="opacity-100 scale-100"
          leave="transition-all ease-in-out duration-300 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-50"
          afterLeave={() => {
            dispatch(setAlertModal(false));
            setShow(true);
          }}
        >
          <div className="bg-white dark:bg-gray-800 w-96 py-8 rounded-lg">
            <div className="text-black dark:text-gray-500 flex flex-col items-center">
              <svg
                fill="currentColor"
                width="800px"
                height="800px"
                viewBox="0 0 24 24"
                className="w-10 h-10 shadow-2xl"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z" />
              </svg>
              <div className="text-black dark:text-white text-lg text-center font-semibold my-2">
                Delete Avatar
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm text-center font-medium">
                Are you sure you want to delete this avatar?
              </div>
              <div className="flex flex-row justify-evenly w-full mt-4 px-16">
                <button
                  type="button"
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Portal>
  );
};

export default React.memo(AlertModal);
