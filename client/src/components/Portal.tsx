import { useEffect } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
}

const Portal = ({ children }: PortalProps) => {
  const mount = document.getElementById("modal-root");
  const el = document.createElement("div");

  useEffect(() => {
    mount?.appendChild(el);
    return () => {
      mount && mount.removeChild(el);
    };
  }, [el, mount]);

  return createPortal(children, el);
};

export default Portal;
