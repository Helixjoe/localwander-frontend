import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import App from "./pages/App";
import TripCreate from "./pages/TripCreate";
import TripInterface from "./pages/TripInterface";
import AllUsers from "./pages/AllUsers";
import UserTrips from "./pages/UserTrips";
import TripDetails from "./pages/UserSpecifcTrip";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/app",
    element: <App />,
  },
  {
    path: "/app/createTrip",
    element: <TripCreate />,
  },
  {
    path: "/trip/:tripid",
    element: <TripInterface />,
  },
  {
    path: "/app/community",
    element: <AllUsers />,
  },
  {
    path: "/app/community/users/:userId",
    element: <UserTrips />,
  },
  {
    path: "/app/trips/:tripId",
    element: <TripDetails />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
