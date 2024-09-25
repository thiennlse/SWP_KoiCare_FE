import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Fish from "./Fish";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Fish />
  </React.StrictMode>
);
