import { useEffect } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import {
  setFriendModal,
  setHeaderModal,
  setUserModal,
} from "../store/reducers/pageReducer";
import moreLogo from "../assets/three-dots.svg";
import friendsLogo from "../assets/friends.svg";
import MainDropdown from "./MainDropdown";
import { useAppDispatch } from "../store";
import defaultAvatar from "../assets/default-avatar.png";
import { IUser, addPendingRequest } from "../store/reducers/userReducer";
import socket from "../utils/socket";

const ChatListHeader = () => {
  const { headerModal } = useAppSelector((state) => state.page);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const requestLength = user?.pendingRequests?.length || 0;

  useEffect(() => {
    if (socket) {
      socket.on("friendRequest", (user: IUser) => {
        dispatch(addPendingRequest(user));
      });
    }
  }, [socket]);

  return (
    <div className="relative shrink-0 min-w-max">
      <header>
        <nav className="z-10 bg-white drop-shadow-md border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mx-auto relative">
            <div className="flex items-center">
              <img
                onClick={() => {
                  dispatch(setUserModal(user));
                }}
                src={user?.avatar || defaultAvatar}
                className="object-cover mr-3 h-10 w-10 rounded-full cursor-pointer"
                alt="Logo"
              />
              <span className="self-center text-black font-semibold whitespace-nowrap dark:text-white">
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
                  <div className="relative">
                    {!!requestLength && (
                      <div className="absolute scale-75 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full -top-4 -right-4">
                        {requestLength}
                      </div>
                    )}
                    <img
                      className="w-5 h-5"
                      src={friendsLogo}
                      alt="More Logo"
                    />
                  </div>
                </div>
              </button>
              <button
                id="mainDropdown"
                onClick={() => {
                  dispatch(setHeaderModal(true));
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

export default ChatListHeader;
