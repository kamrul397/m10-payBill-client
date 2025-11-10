import { Link, NavLink } from "react-router-dom";
import logo from "/logo.png"; // update path
import { useContext } from "react";
import { AuthContext } from "../context/AuthContex";

// assume you have `user` and `logout` from context
export default function Navbar() {
  const { user, logOut } = useContext(AuthContext);
  console.log("USER:", user);

  return (
    <div className="sticky top-0 z-50 bg-base-100/80 backdrop-blur border-b border-base-300/60">
      <div className="navbar max-w-6xl mx-auto">
        {/* LEFT: logo */}
        <div className="navbar-start">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="logo"
              className="h-10 mask mask-circle w-auto rounded-xl ring-1 ring-base-300/60 group-hover:ring-primary/50 transition-all duration-300"
            />
            <span className="text-2xl font-extrabold hidden sm:inline tracking-tight">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PayBill
              </span>
            </span>
          </Link>
        </div>
        {/* MOBILE: static menu */}
        <div className="lg:hidden navbar-center">
          <ul className="flex items-center gap-3 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full transition ${
                  isActive
                    ? "bg-primary/10 text-primary ring-1 ring-primary/40"
                    : "hover:bg-base-200/70"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/bills"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full transition ${
                  isActive
                    ? "bg-primary/10 text-primary ring-1 ring-primary/40"
                    : "hover:bg-base-200/70"
                }`
              }
            >
              Bills
            </NavLink>

            {user && (
              <NavLink
                to="/my-bills"
                className={({ isActive }) =>
                  `px-3 py-1 rounded-full transition ${
                    isActive
                      ? "bg-primary/10 text-primary ring-1 ring-primary/40"
                      : "hover:bg-base-200/70"
                  }`
                }
              >
                My Bills
              </NavLink>
            )}

            {!user ? (
              <NavLink
                to="/login"
                className="btn btn-primary btn-xs rounded-full px-4"
              >
                Login
              </NavLink>
            ) : (
              <button
                onClick={logOut}
                className="btn btn-xs btn-error rounded-full px-4"
              >
                Logout
              </button>
            )}
          </ul>
        </div>

        {/* RIGHT: links */}
        <div className="navbar-end gap-3 items-center hidden lg:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `btn btn-ghost  rounded-full px-4 transition-all ${
                isActive
                  ? "bg-primary/10 text-primary ring-1 ring-primary/40"
                  : "hover:bg-base-200/70"
              }`
            }
          >
            <span className="relative after:block after:h-[2px] after:w-0 hover:after:w-full after:transition-all after:bg-current after:mt-[2px]">
              Home
            </span>
          </NavLink>

          <NavLink
            to="/bills"
            className={({ isActive }) =>
              `btn btn-ghost rounded-full px-4 transition-all ${
                isActive
                  ? "bg-primary/10 text-primary ring-1 ring-primary/40"
                  : "hover:bg-base-200/70"
              }`
            }
          >
            <span className="relative after:block after:h-[2px] after:w-0 hover:after:w-full after:transition-all after:bg-current after:mt-[2px]">
              Bills
            </span>
          </NavLink>

          {user && (
            <NavLink
              to="/my-bills"
              className={({ isActive }) =>
                `btn btn-ghost  rounded-full px-4 transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary ring-1 ring-primary/40"
                    : "hover:bg-base-200/70"
                }`
              }
            >
              <span className="relative after:block after:h-[2px] after:w-0 hover:after:w-full after:transition-all after:bg-current after:mt-[2px]">
                My Pay Bills
              </span>
            </NavLink>
          )}

          {user ? (
            <>
              <Link
                to="/userProfile"
                title={user.displayName || "Profile"}
                className="tooltip tooltip-bottom"
                data-tip={user.displayName || "Profile"}
              >
                <img
                  src={user.photoURL || "https://i.ibb.co/F4gJ0dG/user.png"}
                  alt="avatar"
                  className="w-9 h-9 rounded-full ring-2 ring-primary/60 ring-offset-2 ring-offset-base-100 object-cover hover:scale-105 transition"
                />
              </Link>
              <button
                className="btn btn-primary btn-sm normal-case"
                onClick={logOut}
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink className="btn btn-primary btn-sm normal-case" to="/login">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}
