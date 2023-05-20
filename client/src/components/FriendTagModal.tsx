import { useEffect, useState } from "react";
import { setFriendTagModal } from "../store/reducers/pageReducer";
import { useAppSelector } from "../hooks/useAppSelector";
import copyLogo from "../assets/copy.svg";
import checkLogo from "../assets/check.svg";
import { useForm } from "react-hook-form";
import { QRCode } from "react-qrcode-logo";
import logo from "../assets/logo.png";
import qr from "../assets/qr.svg";
import { Portal, Transition } from "@headlessui/react";
import { useAppDispatch } from "../store";
import { SendFriendRequest } from "../store/actions/userActions";

const FriendTagModal = () => {
  const { friendTagModal, darkMode } = useAppSelector((state) => state.page);
  const { loading } = useAppSelector((state) => state.user);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const dispatch = useAppDispatch();
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
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="w-full mt-12 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                disabled={loading}
              >
                {loading ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#ffffff"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  "Add Friend"
                )}
              </button>
            </form>
          </div>
        </Transition>
      </div>
    </Portal>
  );
};

export default FriendTagModal;
