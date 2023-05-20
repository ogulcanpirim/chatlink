import { useRef } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { Transition } from "@headlessui/react";
import { setMessageSearchModal } from "../store/reducers/pageReducer";
import { useAppDispatch } from "../store";
import { setMessageSearch } from "../store/reducers/userReducer";

const MessageSearchBar = () => {
  const { messageSearchModal } = useAppSelector((state) => state.page);
  const { messageSearch } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Transition
      show={messageSearchModal}
      enter="transition-all ease-in-out duration-300 transform"
      enterFrom="scale-0 h-0"
      enterTo="scale-100 h-[54px]"
      leave="transition-all ease-in-out duration-300 transform"
      leaveFrom="scale-100 h-[54px]"
      leaveTo="scale-0 h-0"
      afterEnter={() => {
        inputRef.current?.focus();
      }}
    >
      <div
        id="searchBar"
        className="p-2 bg-gray-100 drop-shadow-md dark:bg-gray-900 border-b-1 border-gray-100 dark:border-gray-700"
      >
        <form className="relative" onSubmit={(e) => e.preventDefault()}>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
          </div>
          <input
            ref={inputRef}
            type="search"
            id="default-search"
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={"Search in Messages..."}
            value={messageSearch}
            onChange={(e) => {
              dispatch(setMessageSearch(e.target.value));
            }}
            onBlur={() => {
              messageSearch.length === 0 &&
                dispatch(setMessageSearchModal(false));
            }}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          />
        </form>
      </div>
    </Transition>
  );
};

export default MessageSearchBar;
