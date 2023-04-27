import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setFriendTagModal } from "../store/reducers/pageReducer";
import { useAppSelector } from "../hooks/useAppSelector";
import copyLogo from "../assets/copy.svg";
import checkLogo from "../assets/check.svg";
import { useForm } from "react-hook-form";
import { QRCode } from "react-qrcode-logo";
import logo from "../assets/logo.png";
import qr from "../assets/qr.svg";
import { Portal, Transition } from "@headlessui/react";
import { AppDispatch } from "../store";
import { SendFriendRequest } from "../store/actions/authActions";

const FriendTagModal = () => {
  const { friendTagModal, darkMode } = useAppSelector((state) => state.page);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const dispatch = useDispatch<AppDispatch>();
  const [copy, setCopy] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [show, setShow] = useState(true);

  const { register, handleSubmit } = useForm<{ friendTag: string }>();

  const userTag = !user._id ? "-" : user.tag;

  const onSubmit = (data: { friendTag: string }) => {
    const tags = {
      user_tag: userTag,
      friend_tag: data.friendTag,
    };
    dispatch(SendFriendRequest(tags));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(userTag).then(() => {
      setCopy(true);
    });
  };

  const handlePressQR = () => {
    setShowQR((prev) => !prev);
  };

  useEffect(() => {
    if (copy) {
      setTimeout(() => {
        setCopy(false);
      }, 2000);
    }
  }, [copy]);

  if (!friendTagModal) {
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
            dispatch(setFriendTagModal(false));
            setShow(true);
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-96">
            <div className="text-black dark:text-white text-lg text-center font-semibold py-4">
              Add a Friend
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-4 text-center">
              You can share your user tag with your friends
              <br />
              or add them by their user tags.
            </div>
            <Transition
              show={showQR}
              enter="transition-all ease-in-out duration-700 transform"
              enterFrom="opacity-0 scale-50 h-0"
              enterTo="opacity-100 scale-100 h-52"
              leave="transition-all ease-in-out duration-700 transform"
              leaveFrom="opacity-100 scale-100 h-52"
              leaveTo="opacity-0 scale-50 h-0"
            >
              <div className="flex justify-center py-4">
                <div>
                  <QRCode
                    eyeRadius={8}
                    value={userTag}
                    logoImage={logo}
                    logoHeight={40}
                    logoWidth={40}
                    fgColor={darkMode ? "#ffffff" : "#000000"}
                    bgColor="transparent"
                    qrStyle="dots"
                  />
                </div>
              </div>
            </Transition>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Your user tag
            </label>
            <div className="relative flex group">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                #
              </span>
              <input
                type="text"
                className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={userTag}
                disabled
                readOnly
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <img
                  className={`w-5 h-5 hidden group-hover:block cursor-pointer`}
                  onClick={handlePressQR}
                  src={qr}
                  alt="qr"
                />
                <div className="hidden group-hover:block text-gray-400 mx-2">
                  or
                </div>
                <img
                  className={`w-5 h-5 ${
                    !copy && "hidden"
                  } group-hover:block cursor-pointer`}
                  onClick={handleCopy}
                  src={copy ? checkLogo : copyLogo}
                  alt="copy"
                />
              </div>
            </div>
            <label className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white">
              You can enter your friend's user tag here.
            </label>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  #
                </span>
                <input
                  className="uppercase rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter user tag"
                  maxLength={6}
                  {...register("friendTag", {
                    required: true,
                    minLength: 6,
                    maxLength: 6,
                  })}
                />
              </div>
              <button
                type="submit"
                className="w-full mt-12 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Add Friend
              </button>
            </form>
          </div>
        </Transition>
      </div>
    </Portal>
  );
};

export default React.memo(FriendTagModal);
