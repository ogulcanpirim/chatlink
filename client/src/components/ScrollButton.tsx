import { Fragment, useEffect, useState } from "react";
import arrowDown from "../assets/arrow-down.svg";
import { Transition } from "@headlessui/react";

const ScrollButton = () => {
  const [shown, setShown] = useState(false);

  const handleScroll = (event: Event) => {
    const target = event.target;
    if (target instanceof HTMLElement) {
      const { scrollTop, scrollHeight, clientHeight } = target;
      if (scrollTop + clientHeight >= scrollHeight) {
        setShown(false);
      } else {
        setShown(true);
      }
    }
  };

  useEffect(() => {
    const scrollContainer = document.getElementById("scrollContainer");
    scrollContainer?.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollTop = () => {
    var element = document.getElementById("scrollContainer");
    if (element) {
      element.scroll({ behavior: "smooth", top: element.scrollHeight });
    }
  };

  return (
    <Transition
      as={Fragment}
      show={shown}
      enter="transition ease-out duration-150"
      enterFrom="transform opacity-0 scale-50"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-150"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-50"
    >
      <div className="shadow-xl fixed bottom-20 right-5 z-10 bg-gray-100 dark:bg-gray-900 rounded-full p-1 flex items-center">
        <button onClick={handleScrollTop}>
          <img className="h-10 w-10" src={arrowDown} alt="Scroll Button" />
        </button>
      </div>
    </Transition>
  );
};

export default ScrollButton;
