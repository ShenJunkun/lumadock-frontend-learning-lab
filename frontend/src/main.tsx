import React from "react";
import ReactDOM from "react-dom/client";

import { AppProviders } from "./components/AppProviders";
import "./i18n";
import "antd/dist/reset.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders />
  </React.StrictMode>,
);
