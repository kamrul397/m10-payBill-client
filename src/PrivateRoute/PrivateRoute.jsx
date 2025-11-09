// import { useContext } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContex";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // while auth state loading - prevent flickering
  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  // user not logged in -> redirect to login with redirect-back
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // user logged in -> show the private page
  return children;
}
