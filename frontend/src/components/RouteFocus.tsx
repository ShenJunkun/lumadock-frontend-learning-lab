import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function RouteFocus() {
  const location = useLocation();

  useEffect(() => {
    const main = document.getElementById("main-content");
    main?.focus({ preventScroll: true });
  }, [location.pathname]);

  return null;
}
