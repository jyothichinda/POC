import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import "antd/dist/reset.css";

const mount = (el) => {
  createRoot(el).render(<App />);
};

// If running standalone (directly in port 3003), mount it to `#_sweeping-root`
if (process.env.NODE_ENV === "development") {
  const root = document.querySelector("#_sweeping-root");
  if (root) {
    mount(root);
  }
}

export { mount };
