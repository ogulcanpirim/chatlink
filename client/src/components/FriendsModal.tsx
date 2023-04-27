import React from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { setFriendModal } from "../store/reducers/pageReducer";
import PendingFriendCard from "./PendingFriendCard";
import { Portal } from "@headlessui/react";

const FriendsModal = () => {
  const { friendModal, darkMode } = useAppSelector((state) => state.page);

  const dispatch = useDispatch();

  const [pendingRequest, setPendingRequest] = React.useState<any>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);

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
          <div className="text-black dark:text-white text-lg text-center font-semibold py-4 border-b-[0.1rem] border-b-gray-200 dark:border-b-gray-700">
            Pending Request
          </div>
          <div className="flex flex-col h-96 overflow-y-auto py-2">
            {pendingRequest.map((item: number) => (
              <PendingFriendCard key={item.toString()} />
            ))}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default React.memo(FriendsModal);
