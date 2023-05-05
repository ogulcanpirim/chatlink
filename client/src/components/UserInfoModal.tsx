import { Portal, Transition } from "@headlessui/react";
import React, { useCallback, useState } from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../store";
import { setUserModal } from "../store/reducers/pageReducer";
import photo from "../assets/photo.svg";
import info from "../assets/info.svg";

const UserInfoModal = () => {
  const { darkMode, userModal } = useAppSelector((state) => state.page);
  const [show, setShow] = useState(true);
  const [image, setImage] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleImageSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          setImage(event.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }
    },
    []
  );

  if (!userModal) {
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
            dispatch(setUserModal(false));
            setShow(true);
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg w-96">
            <div className="flex flex-col items-center pt-8">
              <div className="relative group">
                <img
                  src={
                    image ||
                    "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/f2/f2c80166a0aafda50418f306720ad1b7a9086759_full.jpg"
                  }
                  alt="user avatar"
                  className="rounded-full w-28 h-28 group-hover:opacity-40 transition-opacity duration-300"
                />
                <div className="absolute hidden group-hover:flex flex-col inset-0 items-center justify-center transition-opacity duration-300">
                  <label
                    htmlFor="file-input"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-1"
                  >
                    <img
                      src={photo}
                      alt="change avatar"
                      className="w-6 h-6 select-none group-hover:cursor-pointer"
                    />
                    <input
                      id="file-input"
                      type="file"
                      className="hidden"
                      accept="image/jpeg, image/png"
                      onChange={handleImageSelect}
                    />
                    <span className="text-white font-semibold text-sm text-center px-2 select-none">
                      Change Your Avatar
                    </span>
                  </label>
                </div>
              </div>
              <div className="text-xl mt-2 text-black dark:text-white">
                Oğulcan Pirim
              </div>
              <div className="text-md">opirim@gmail.com</div>
            </div>
            <div className="flex flex-row justify-around mt-4 rounded-b-lg py-4">
              <div className="flex flex-col items-center space-y-1">
                <div className="text-black dark:text-white text-lg">3</div>
                <div className="text-md max-w-sm text-gray-500 dark:text-gray-400">
                  Friends
                </div>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="text-black dark:text-white text-lg">5</div>
                <div className="text-md text-gray-500 dark:text-gray-400">
                  Requests
                </div>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="text-black dark:text-white text-lg">12 Feb</div>
                <div className="text-md text-gray-500 dark:text-gray-400">
                  Joined
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Portal>
  );
};

/*
You can change your profile picture by hovering over it. Only
                .jpg and .png files are accepted.
*/
export default React.memo(UserInfoModal);
