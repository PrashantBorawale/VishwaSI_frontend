import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import "./styles/erp-global.css";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axios from "axios";

// Helper to extract cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// 1. GLOBAL AXIOS INTERCEPTOR: Attaches Bearer token & CSRF token to ALL axios calls
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem("authToken");
  if (token && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  const csrfToken = getCookie("csrftoken");
  if (csrfToken && !config.headers["X-CSRFToken"]) {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
}, (error) => Promise.reject(error));

// 2. GLOBAL FETCH INTERCEPTOR: Attaches Bearer token & CSRF token to ALL window.fetch() calls
const originalFetch = window.fetch;
window.fetch = async function (resource, config = {}) {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem("authToken");
  const csrfToken = getCookie("csrftoken");

  let headers = config.headers ? new Headers(config.headers) : new Headers();

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (csrfToken && !headers.has("X-CSRFToken")) {
    headers.set("X-CSRFToken", csrfToken);
  }

  // Preserve Content-Type if already set or default to json for objects
  if (!headers.has("Content-Type") && typeof config.body === "string" && (config.body.startsWith("{") || config.body.startsWith("["))) {
    headers.set("Content-Type", "application/json");
  }

  const newConfig = {
    ...config,
    headers,
  };

  return originalFetch(resource, newConfig);
};
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js"></script>

const container = document.getElementById("root");
const root = createRoot(container); // Create a root.

root.render(
  <Router>
    <App />
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
