import React, { useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { setFriendModal } from "../store/reducers/pageReducer";
import PendingFriendCard from "./PendingFriendCard";
import { Portal, Transition } from "@headlessui/react";
import { useAppDispatch } from "../store";

const FriendsModal = () => {
  const { friendModal, darkMode } = useAppSelector((state) => state.page);
  const [show, setShow] = useState(true);
  const dispatch = useAppDispatch();

  const [pendingRequest, setPendingRequest] = React.useState<any>([
    1, 2, 3, 4, 5, 6, 7, 8, 9,
  ]);

  if (!friendModal) {
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
            dispatch(setFriendModal(false));
            setShow(true);
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-96">
            <div className="text-black dark:text-white text-lg text-center font-semibold py-4 border-b-[0.1rem] border-b-gray-200 dark:border-b-gray-700">
              Pending Request
            </div>
            <div className="flex flex-col h-96 overflow-y-auto py-2">
              {pendingRequest.map((item: number) => (
                <PendingFriendCard key={item.toString()} />
              ))}
            </div>
          </div>
        </Transition>
      </div>
    </Portal>
  );
};

export default React.memo(FriendsModal);
