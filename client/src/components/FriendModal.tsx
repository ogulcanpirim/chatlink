import React, { useEffect, useState } from "react";
import Portal from "./Portal";
import { useDispatch } from "react-redux";
import { setFriendModal, setFriendTag } from "../store/reducers/pageReducer";
import { useAppSelector } from "../hooks/useAppSelector";
import copyLogo from "../assets/copy.svg";
import checkLogo from "../assets/check.svg";

const FriendModal = () => {
  const { friendModal, darkMode, friendTag } = useAppSelector(
    (state) => state.page
  );
  const dispatch = useDispatch();
  const [copy, setCopy] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("5A4TF2").then(() => {
      setCopy(true);
    });
  };

  useEffect(() => {
    if (copy) {
      setTimeout(() => {
        setCopy(false);
      }, 2000);
    }
  }, [copy]);

  if (!friendModal) {
    return null;
  }
  return (
    <Portal>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            dispatch(setFriendModal(false));
          }
        }}
        className={`${
          darkMode && "dark"
        } fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-96">
          <div className="text-black dark:text-white text-lg text-center font-semibold py-4">
            Add a Friend
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 text-center">
            You can share your user tag with your friends<br/>or add them by their
            user tags.
          </div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Your user tag
          </label>
          <div className="relative flex group">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              #
            </span>
            <input
              type="text"
              className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={"5A4TF2"}
              disabled
              readOnly
            />
            <div
              onClick={() => {
                handleCopy();
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            >
              <img
                className={`w-5 h-5 ${!copy && "hidden"} group-hover:block`}
                src={copy ? checkLogo : copyLogo}
                alt="copy"
              />
            </div>
          </div>
          <label className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white">
            You can enter your friend's user tag here.
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
              #
            </span>
            <input
              id="friend-tag"
              className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter user tag"
              value={friendTag}
              maxLength={6}
              onChange={(e) => {
                e.preventDefault();
                dispatch(setFriendTag(e.target.value.toUpperCase()));
              }}
            />
          </div>
          <button
            type="submit"
            className="w-full mt-12 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Add Friend
          </button>
        </div>
      </div>
    </Portal>
  );
};

export default React.memo(FriendModal);
