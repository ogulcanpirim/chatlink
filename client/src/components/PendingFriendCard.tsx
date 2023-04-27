import React, { useState } from "react";
import checkLogo from "../assets/check.svg";
import cross from "../assets/cross.svg";
import { Transition } from "@headlessui/react";

const PendingFriendCard = () => {
  const [show, setShow] = useState(true);

  const height = document.getElementById("friendCard")?.clientHeight;

  return (
    <Transition
      show={show}
      leave="transition-all ease-in-out duration-300 transform"
      leaveFrom={`opacity-100 h-[${height}px] scale-100`}
      leaveTo="opacity-0 h-0 scale-75"
    >
      <div
        id="friendCard"
        className="flex items-center justify-between py-2 px-4 border-b-[0.1rem] border-b-gray-200 dark:border-b-gray-700"
      >
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
              show && setShow(false);
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
              show && setShow(false);
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
    </Transition>
  );
};

export default React.memo(PendingFriendCard);
