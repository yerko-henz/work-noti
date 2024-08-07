// @ts-nocheck
import React from "react";
import ReactDOM from "react-dom";
import App from "./App.tsx";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import "./global.css";

const root = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </React.StrictMode>,
  root
);
