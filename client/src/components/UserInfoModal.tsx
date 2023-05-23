import { Portal, Transition } from "@headlessui/react";
import React, { useCallback, useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../store";
import {
  setDeleteProfileModal,
  setUserModal,
} from "../store/reducers/pageReducer";
import photo from "../assets/photo.svg";
import { UploadProfilePictureRequest } from "../store/actions/userActions";
import defaultAvatar from "../assets/default-avatar.png";
import moment from "moment";

const UserInfoModal = () => {
  const { darkMode, userModal } = useAppSelector((state) => state.page);
  const { user } = useAppSelector((state) => state.user);
  const [show, setShow] = useState(true);
  const dispatch = useAppDispatch();
  const loggedUser = userModal?._id === user?._id;

  const handleImageSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        if (loggedUser && user) {
          const data = {
            avatar: selectedFile,
            id: user._id,
          };
          dispatch(UploadProfilePictureRequest(data));
        }
      }
    },
    [user, userModal]
  );

  if (!userModal) {
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
            dispatch(setUserModal(null));
            setShow(true);
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg w-96">
            <div className="flex flex-col items-center pt-8">
              <div className="relative group">
                <img
                  src={
                    (loggedUser ? user?.avatar : userModal?.avatar) ||
                    defaultAvatar
                  }
                  alt="user avatar"
                  className={`object-cover rounded-full w-28 h-28 ${
                    loggedUser && "group-hover:opacity-40"
                  }`}
                />
                {loggedUser && (
                  <div className="absolute hidden group-hover:flex flex-col rounded-full inset-0 overflow-hidden">
                    <label
                      htmlFor="file-input"
                      className="basis-3/4 cursor-pointer flex flex-col items-center justify-center space-y-1"
                    >
                      <img
                        src={photo}
                        alt="change avatar"
                        className="w-4 h-4 select-none group-hover:cursor-pointer"
                      />
                      <input
                        id="file-input"
                        type="file"
                        className="hidden"
                        accept="image/jpeg, image/png"
                        onChange={handleImageSelect}
                      />
                      <span className="text-white font-semibold text-sm text-center px-2 select-none">
                        Change Your Avatar
                      </span>
                    </label>
                    {userModal?.avatar && (
                      <div
                        onClick={() => {
                          dispatch(setDeleteProfileModal(true));
                        }}
                        className="group-hover:cursor-pointer basis-1/4 bg-red-500 bg-opacity-70 text-white"
                      >
                        <svg
                          fill="currentColor"
                          width="800px"
                          height="800px"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 select-none m-auto mt-1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="text-xl mt-2 text-black dark:text-white">
                {userModal?.firstName + " " + userModal?.lastName}
              </div>
              <div className="text-md text-gray-500">{userModal?.email}</div>
            </div>
            <div className="flex flex-row justify-around mt-4 rounded-b-lg py-4">
              <div className="flex flex-col items-center space-y-1">
                <div className="text-black dark:text-white text-lg">
                  {userModal?.friends.length || 0}
                </div>
                <div className="text-md max-w-sm text-gray-500 dark:text-gray-400">
                  Friends
                </div>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="text-black dark:text-white text-lg">
                  {userModal?.pendingRequests.length || 0}
                </div>
                <div className="text-md text-gray-500 dark:text-gray-400">
                  Requests
                </div>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="text-black dark:text-white text-lg">
                  {moment(userModal?.createdAt).format("D MMM")}
                </div>
                <div className="text-md text-gray-500 dark:text-gray-400">
                  Joined
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Portal>
  );
};

export default UserInfoModal;
