import { useAppSelector } from "../hooks/useAppSelector";
import moreLogo from "../assets/three-dots.svg";
import rightArrow from "../assets/right-arrow.svg";
import {
  clearSelectedChat,
  toggleChatModal,
} from "../store/reducers/pageReducer";

import { useIsMobile } from "../hooks/isMobile";
import { useAppDispatch } from "../store";

interface UserHeaderProps {
  name: string;
  typing: boolean;
}

const UserHeader = ({ name, typing }: UserHeaderProps) => {
  const { darkMode, chatModal } = useAppSelector((state) => state.page);
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  return (
    <div className={`relative ${darkMode && "dark"}`}>
      <header>
        <nav className="shrink-0 bg-white drop-shadow-md border-gray-200 px-4 lg:px-6 py-2 dark:bg-gray-800">
          <div className="flex flex-wrap items-center mx-auto">
            <div className="flex flex-row items-center space-x-2">
              {isMobile && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(clearSelectedChat());
                  }}
                  className="rounded-full p-2 cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <img
                    src={rightArrow}
                    className="mr-auto h-4 rotate-180"
                    alt="More Logo"
                  />
                </button>
              )}
              <div className="w-10 h-10">
                <img
                  className="rounded-full"
                  src={`https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/f2/f2c80166a0aafda50418f306720ad1b7a9086759_full.jpg`}
                  alt="User Avatar"
                />
              </div>
            </div>
            <div className="flex flex-col ml-2">
              <span className="self-center text-md text-black whitespace-nowrap dark:text-white">
                {name}
              </span>
              <span className="text-sm opacity-50">
                {typing ? "Typing..." : "Online"}
              </span>
            </div>
            <div className="flex flex-row items-center ml-auto space-x-2">
              <button
                onClick={() => {}}
                className="rounded-full p-2 cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </button>
              <button
                id="chatDropdown"
                onClick={() => {
                  dispatch(toggleChatModal());
                }}
                className={`rounded-full p-2 cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 ${
                  chatModal &&
                  "text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600"
                }`}
              >
                <div className="flex items-center lg:order-2">
                  <img
                    id="chatDropdownImg"
                    className="w-5 h-5"
                    src={moreLogo}
                    alt="More Logo"
                  />
                </div>
              </button>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default UserHeader;
