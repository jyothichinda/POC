import React from "react";
import {createRoot} from 'react-dom/client'

import App from "./App";

import "antd/dist/reset.css";

createRoot(document.querySelector('#root').render(<App />))