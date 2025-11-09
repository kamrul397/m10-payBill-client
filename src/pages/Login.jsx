// import { useContext, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useLocation, useNavigate, Link } from "react-router-dom";

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContex";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { loginEmail, loginGoogle } = useContext(AuthContext);
  const [err, setErr] = useState("");
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
      navigate(from, { replace: true }); // ✅ redirect back
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginGoogle();
      navigate(from, { replace: true }); // ✅ redirect back
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleEmailLogin} className="space-y-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input input-bordered w-full"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input input-bordered w-full"
          required
        />
        {err && <p className="text-red-500 text-sm">{err}</p>}
        <button className="btn btn-primary w-full" type="submit">
          Login
        </button>
      </form>
      <button onClick={handleGoogle} className="btn btn-outline w-full mt-3">
        Continue with Google
      </button>
      <p className="text-sm mt-3">
        New here?{" "}
        <Link className="link" to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}
