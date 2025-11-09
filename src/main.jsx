import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root/Root.jsx";
import Home from "./components/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import AuthProvider from "./context/AuthProvider.jsx";
import PrivateRoute from "./PrivateRoute/PrivateRoute.jsx";
import MyBills from "./PrivateRoute/MyBills";
import BillDetails from "./PrivateRoute/BillDetails";
import Bills from "./pages/Bills.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, // ← use element with JSX
    children: [
      {
        index: true, // ← default child route
        element: <Home />, // ← JSX element
      },
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "register",
        element: <Register></Register>,
      },
      {
        path: "bills",
        element: <Bills></Bills>,
      },
      // {
      //   path: "bills/",
      //   element: (
      //     <PrivateRoute>
      //       <MyBills></MyBills>
      //     </PrivateRoute>
      //   ),
      // },
      {
        path: "billDetails/:id",
        element: (
          <PrivateRoute>
            <BillDetails></BillDetails>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
