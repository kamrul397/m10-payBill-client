import { Link, NavLink } from "react-router-dom";
import logo from "/logo.png"; // update path
import { useContext } from "react";
import { AuthContext } from "../context/AuthContex";
// assume you have `user` and `logout` from context

export default function Navbar() {
  const { user, logOut } = useContext(AuthContext);
  return (
    <div className="bg-base-100 border-b">
      <div className="navbar max-w-6xl mx-auto">
        {/* LEFT: logo */}
        <div className="navbar-start">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-20 w-auto" />
            <span className="text-xl font-bold hidden sm:inline">PayBill</span>
          </Link>
        </div>

        {/* MOBILE: dropdown */}
        <div className="lg:hidden navbar-center">
          <details className="dropdown">
            <summary className="btn btn-ghost">Menu</summary>
            <ul className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/bills">Bills</NavLink>
              </li>
              {user && (
                <li>
                  <NavLink to="/my-bills">My Pay Bills</NavLink>
                </li>
              )}
              {!user ? (
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
              ) : (
                <li>
                  <button onClick={logOut}>Logout</button>
                </li>
              )}
            </ul>
          </details>
        </div>

        {/* RIGHT: links */}
        <div className="navbar-end gap-4 items-center hidden lg:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:underline ${isActive ? "font-semibold" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/bills"
            className={({ isActive }) =>
              `hover:underline ${isActive ? "font-semibold" : ""}`
            }
          >
            Bills
          </NavLink>
          {user && (
            <NavLink
              to="/my-bills"
              className={({ isActive }) =>
                `hover:underline ${isActive ? "font-semibold" : ""}`
              }
            >
              My Pay Bills
            </NavLink>
          )}

          {user ? (
            <>
              <Link to="/userProfile" title={user.displayName || "Profile"}>
                <img
                  src={user.photoURL || "https://i.ibb.co/F4gJ0dG/user.png"}
                  alt="avatar"
                  className="w-9 h-9 rounded-full border cursor-pointer object-cover"
                />
              </Link>
              <button className="btn btn-sm" onClick={logOut}>
                Logout
              </button>
            </>
          ) : (
            <NavLink className="btn btn-sm" to="/login">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}
