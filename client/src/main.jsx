import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import HomePage from "./routes/homepage/HomePage.jsx";
import DashboardPage from "./routes/dashboard/DashboardPage.jsx";
import ChatPage from "./routes/chatpage/ChatPage.jsx";
import RootLayout from "./layouts/rootLayout/RootLayout.jsx";

import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout.jsx";
import Signin from "./routes/signin/Signin.jsx";
import Signup from "./routes/signup/Signup.jsx";

// Import your publishable key

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/sign-in/*",
        element: <Signin />,
      },
      {
        path: "/sign-up/*",
        element: <Signup />,
      },
      {
        element: <DashboardLayout />,

        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
