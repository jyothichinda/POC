import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import "antd/dist/reset.css";

const root = createRoot(document.querySelector("#root"));
root.render(<App />);
