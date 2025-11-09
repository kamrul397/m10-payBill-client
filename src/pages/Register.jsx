import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContex";
import { useContext, useState } from "react";

export default function Register() {
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    photo: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validatePassword = (pass) => {
    if (pass.length < 6) return "Password must be at least 6 characters.";
    if (!/[A-Z]/.test(pass)) return "Must contain at least 1 uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Must contain at least 1 lowercase letter.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwdError = validatePassword(form.password);
    if (pwdError) return setError(pwdError);

    try {
      await registerUser(form.name, form.email, form.password, form.photo);
      navigate("/"); // redirect to Home after register
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Create Account</h1>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="photo"
            onChange={handleChange}
            placeholder="Photo URL (optional)"
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full border p-2 rounded"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:opacity-90"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
