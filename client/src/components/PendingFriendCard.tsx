import { memo, useRef, useState } from "react";
import checkLogo from "../assets/check.svg";
import cross from "../assets/cross.svg";
import { Transition } from "@headlessui/react";
import defaultAvatar from "../assets/default-avatar.png";
import { useAppDispatch } from "../store";
import {
  AcceptFriendRequest,
  RejectFriendRequest,
} from "../store/actions/userActions";
import { useAppSelector } from "../hooks/useAppSelector";
interface PendingFriendCardProps {
  avatar: string | null | undefined;
  fullName: string;
  email: string;
  friendTag: string;
}

type Operation = "accept" | "decline";

const PendingFriendCard = ({
  avatar,
  fullName,
  email,
  friendTag,
}: PendingFriendCardProps) => {
  const [show, setShow] = useState(true);
  const operation = useRef<Operation | null>(null);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  return (
    <Transition
      show={show}
      leave="transition-all ease-in-out duration-300 transform"
      leaveFrom={`opacity-100 h-[62px] scale-100`}
      leaveTo="opacity-0 h-0 scale-75"
      afterLeave={() => {
        if (user) {
          const data = {
            user_tag: user.tag,
            friend_tag: friendTag,
          };
          if (operation.current === "accept") {
            dispatch(AcceptFriendRequest(data));
          } else if (operation.current === "decline") {
            dispatch(RejectFriendRequest(data));
          }
        }
      }}
    >
      <div
        id="friendCard"
        className="flex items-center justify-between py-2 px-4 border-b-[0.1rem] border-b-gray-200 dark:border-b-gray-700"
      >
        <div className="flex items-center">
          <img
            className="w-12 h-12 rounded-full"
            src={avatar || defaultAvatar}
            alt="User Avatar"
          />
          <div className="ml-4">
            <div className="text-black dark:text-white text-md font-semibold">
              {fullName}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              {email}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <button
            className="mr-4"
            onClick={(e) => {
              e.preventDefault();
              operation.current = "accept";
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
              operation.current = "decline";
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

export default memo(PendingFriendCard);
