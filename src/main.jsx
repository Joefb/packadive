import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "@material-tailwind/react";
import { AuthProvider } from "./contexts/AuthContext";
import { ListProvider } from "./contexts/ListContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ListProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ListProvider>
    </AuthProvider>
  </React.StrictMode>,
);
