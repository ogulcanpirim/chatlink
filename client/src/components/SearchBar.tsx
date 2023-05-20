import { memo } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../store";
import { setChatSearch } from "../store/reducers/userReducer";

interface SearchBarProps {
  placeholder: string;
  autoFocus?: boolean;
}

const SearchBar = ({ placeholder, autoFocus }: SearchBarProps) => {
  const { chatSearch } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return (
    <div
      id="searchBar"
      className="p-2 bg-gray-100 dark:bg-gray-900 border-b-1 border-gray-100 dark:border-gray-700"
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
          type="search"
          id="default-search"
          autoFocus={autoFocus}
          className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={placeholder}
          value={chatSearch}
          onChange={(e) => {
            dispatch(setChatSearch(e.target.value));
          }}
        />
      </form>
    </div>
  );
};

export default memo(SearchBar);
