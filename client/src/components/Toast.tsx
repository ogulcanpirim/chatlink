import { Portal, Transition } from "@headlessui/react";
import React, { useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { clearErrors } from "../store/reducers/authReducer";
import { useAppDispatch } from "../store";

const DURATION = 5000;

interface ToastProps {
  message?: string;
}

const Toast = ({ message }: ToastProps) => {
  const { error, errorMessage } = useAppSelector((state) => state.auth);
  const { darkMode } = useAppSelector((state) => state.page);
  const dispatch = useAppDispatch();
  const [timeFlag, setTimeFlag] = useState(false);

  return (
    <Portal>
      <Transition
        show={error}
        appear={true}
        className={`${darkMode && "dark"} z-50 fixed left-5 bottom-5`}
        enter="transition-all ease-in-out duration-700 transform"
        enterFrom="opacity-0 scale-75"
        enterTo="opacity-100 scale-100"
        afterEnter={() => {
          setTimeFlag(true);
        }}
        leave="transition-all ease-in-out duration-700 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-75"
        afterLeave={() => {
          setTimeFlag(false);
        }}
      >
        <div
          id="toastModal"
          className="flex items-center w-full max-w-xs space-x-2 p-4 text-red-500 bg-white divide-x divide-gray-200 rounded-lg shadow-2xl dark:text-red-400 dark:divide-gray-700 dark:bg-gray-800"
          role="alert"
        >
          <svg
            aria-hidden="true"
            className="flex-shrink-0 inline w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            ></path>
          </svg>
          <div className="px-2 text-sm font-normal">{errorMessage}</div>
        </div>
        <Transition
          show={timeFlag}
          enter={`transition-all duration-[${DURATION}ms] ease-linear transform`}
          enterFrom="w-[100%]"
          enterTo="w-[0%]"
          afterEnter={() => {
            dispatch(clearErrors());
          }}
        >
          <Transition
            show={timeFlag}
            appear={true}
            enter={`transition-all duration-150 ease-in-out transform`}
            enterFrom={`opacity-0 scale-95`}
            enterTo={`opacity-100 scale-100`}
          >
            <div className="z-40 rounded-b-lg h-1 -translate-y-1 bg-red-500 dark:bg-red-400" />
          </Transition>
        </Transition>
      </Transition>
    </Portal>
  );
};

export default React.memo(Toast);
