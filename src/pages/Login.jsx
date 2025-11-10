import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContex";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { loginEmail, loginGoogle } = useContext(AuthContext);
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErr("");
    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");

    try {
      await loginEmail(email, password);
      navigate(from, { replace: true });
    } catch (e) {
      setErr("Invalid email or password");
    }
  };

  const handleGoogle = async () => {
    try {
      await loginGoogle();
      navigate(from, { replace: true });
    } catch {
      setErr("Google Login failed");
    }
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <div className="w-full max-w-md relative">
        <div className="absolute -inset-1 rounded-3xl blur-2xl bg-gradient-to-r from-indigo-300 via-cyan-300 to-blue-300 opacity-30 animate-pulse" />

        <div className="relative rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-xl p-6 sm:p-8">
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 grid place-items-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 3l2 6-6 2 6 2-2 6 6-2 2 6 2-6 6 2-2-6 6-2-6-2 2-6-6 2-2-6-2 6-6-2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold">Welcome Back</h1>
            <p className="text-sm text-gray-600">Login to continue</p>
          </div>

          <form onSubmit={handleEmailLogin} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </span>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="input input-bordered w-full rounded-lg border-gray-200 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <label className="block">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Password
                </span>
                {capsOn && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                    Caps Lock ON
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  required
                  onKeyUp={(e) => setCapsOn(e.getModifierState("CapsLock"))}
                  className="input input-bordered w-full pr-12 rounded-lg border-gray-200 focus:ring-4 focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm rounded-full hover:bg-black/5"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6A2 2 0 0 0 12 14" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            {err && (
              <p className="text-red-600 text-sm border border-red-200 bg-red-50 px-3 py-2 rounded-lg">
                {err}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-2.5 font-medium shadow-lg hover:shadow-xl active:scale-[.99] transition"
            >
              Login
            </button>
          </form>

          <button
            onClick={handleGoogle}
            className="mt-4 w-full rounded-xl border border-indigo-200 py-2.5 font-medium hover:bg-indigo-50 transition flex items-center justify-center gap-2"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="h-5 w-5"
            />
            Continue with Google
          </button>

          <p className="mt-5 text-center text-sm">
            New here?{" "}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
