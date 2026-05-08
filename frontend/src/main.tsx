import React from "react";
import ReactDOM from "react-dom/client";

import { AppProviders } from "./components/AppProviders";
import "./i18n";
import "antd/dist/reset.css";
import "./styles/global.css";

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MOCKS !== "true") {
    return;
  }

  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

void enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AppProviders />
    </React.StrictMode>,
  );
});
