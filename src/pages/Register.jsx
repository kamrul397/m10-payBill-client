import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContex";
import { useContext, useState, useMemo } from "react";
import toast from "react-hot-toast";

export default function Register() {
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Controlled form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    photo: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [capsOn, setCapsOn] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /** Password validation */
  const validatePassword = (pass) => {
    if (pass.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(pass)) return "Must contain at least 1 uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Must contain at least 1 lowercase letter.";
    return null;
  };

  /** Strength meter */
  const strength = useMemo(() => {
    const p = form.password || "";
    let score = 0;
    if (p.length >= 6) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return Math.min(score, 5);
  }, [form.password]);

  const strengthLabel =
    ["Very Weak", "Weak", "Fair", "Good", "Strong"][
      Math.max(0, strength - 1)
    ] || "Very Weak";

  /** Submit Handler */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const pwdError = validatePassword(form.password);
    if (pwdError) {
      setError(pwdError);
      toast.error(pwdError);
      return;
    }

    try {
      setSubmitting(true);

      await registerUser(form.name, form.email, form.password, form.photo);
      toast.success("Account created successfully 🎉");

      // Clear form
      setForm({ name: "", email: "", photo: "", password: "" });

      navigate("/");
    } catch (err) {
      const msg = err.message || "Registration failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <div className="w-full max-w-md relative">
        {/* Glow */}
        <div className="absolute -inset-1 rounded-3xl blur-2xl bg-gradient-to-r from-indigo-300 via-cyan-300 to-blue-300 opacity-30 animate-pulse" />

        {/* Card */}
        <div className="relative rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-xl p-6 sm:p-8">
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 grid place-items-center shadow-lg">
              {/* icon */}
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
            <h1 className="text-2xl font-semibold">Create Account</h1>
            <p className="text-sm text-gray-600">Join PayBill in seconds</p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Full Name
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John Carter"
                className="input input-bordered w-full rounded-lg border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            {/* Email */}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Email Address
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="john@email.com"
                className="input input-bordered w-full rounded-lg border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            {/* Photo URL */}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Photo URL (optional)
              </span>
              <input
                type="text"
                name="photo"
                value={form.photo}
                onChange={handleChange}
                placeholder="https://…"
                className="input input-bordered w-full rounded-lg border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            {/* Password */}
            <label className="block">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Password
                </span>
                {capsOn && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                    Caps Lock is ON
                  </span>
                )}
              </div>

              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onKeyUp={(e) =>
                    setCapsOn(
                      e.getModifierState && e.getModifierState("CapsLock")
                    )
                  }
                  required
                  placeholder="At least 6 chars, mix of cases"
                  className="input input-bordered w-full rounded-lg border-gray-200 pr-12 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-shadow"
                />

                {/* Eye button */}
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm rounded-full hover:bg-black/5"
                >
                  {showPassword ? (
                    // eye-off
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58M9.88 4.24A10.94 10.94 0 0 1 12 4c7 0 10 8 10 8a15.73 15.73 0 0 1-3.1 4.9M6.1 6.1A15.73 15.73 0 0 0 2 12s3 8 10 8a10.94 10.94 0 0 0 2.12-.24" />
                    </svg>
                  ) : (
                    // eye
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
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

              {/* Strength meter */}
              <div className="mt-2">
                <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      strength <= 1
                        ? "bg-red-400"
                        : strength === 2
                        ? "bg-orange-400"
                        : strength === 3
                        ? "bg-yellow-400"
                        : strength === 4
                        ? "bg-green-400"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${(strength / 5) * 100}%` }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
                  <span>
                    Password strength: <b>{strengthLabel}</b>
                  </span>
                  <span className="opacity-70">Tip: add numbers & symbols</span>
                </div>

                <ul className="mt-3 space-y-1 text-sm">
                  <Req
                    ok={form.password.length >= 6}
                    text="At least 6 characters"
                  />
                  <Req
                    ok={/[A-Z]/.test(form.password)}
                    text="Contains an uppercase letter (A-Z)"
                  />
                  <Req
                    ok={/[a-z]/.test(form.password)}
                    text="Contains a lowercase letter (a-z)"
                  />
                  <Req
                    ok={/\d/.test(form.password)}
                    text="Contains a number (0-9)"
                  />
                </ul>
              </div>
            </label>

            {error && (
              <p className="text-red-600 text-sm border border-red-200 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-2.5 font-medium shadow-lg hover:shadow-xl active:scale-[.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-r-transparent rounded-full animate-spin" />
                  Creating…
                </span>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/** Requirement Row */
function Req({ ok, text }) {
  return (
    <li
      className={`flex items-center gap-2 ${
        ok ? "text-green-600" : "text-gray-500"
      }`}
    >
      {ok ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      )}
      <span>{text}</span>
    </li>
  );
}
