import App from "./App.tsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React from "react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
