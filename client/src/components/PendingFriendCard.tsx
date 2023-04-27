import React from "react";
import checkLogo from "../assets/check.svg";
import cross from "../assets/cross.svg";

const PendingFriendCard = () => {
  return (
    <div className="flex items-center justify-between py-2 px-4 border-b-[0.1rem] border-b-gray-200 dark:border-b-gray-700">
      <div className="flex items-center">
        <img
          className="w-12 h-12 rounded-full"
          src={`https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/f2/f2c80166a0aafda50418f306720ad1b7a9086759_full.jpg`}
          alt="User Avatar"
        />
        <div className="ml-4">
          <div className="text-black dark:text-white text-md font-semibold">
            {"Oğulcan Pirim"}
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            {"opirim@gmail.com"}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <button
          className="mr-4"
          onClick={(e) => {
            e.preventDefault();
            console.log("accept");
          }}
        >
          <img
            className="w-8 h-8 hover:bg-green-500 hover:rounded-full hover:bg-opacity-30"
            src={checkLogo}
            alt="Check Logo"
          />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            console.log("decline");
          }}
        >
          <img
            className="w-8 h-8 border-red-500 hover:bg-red-500 hover:rounded-full hover:bg-opacity-30"
            src={cross}
            alt="Cross Logo"
          />
        </button>
      </div>
    </div>
  );
};

export default React.memo(PendingFriendCard);
