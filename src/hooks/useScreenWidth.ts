// hooks/useScreenWidth.ts
import { useEffect, useState } from "react";

export const useScreenWidth = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 481);
    };

    checkScreenWidth();

    window.addEventListener("resize", checkScreenWidth);

    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  return isMobile;
};
