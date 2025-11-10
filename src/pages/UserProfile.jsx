import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContex";
import { updateProfile } from "firebase/auth";
import { toast } from "react-hot-toast";

export default function UserProfile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(user?.photoURL || "");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile(user, {
        displayName: name?.trim() || user.displayName || "",
        photoURL: photo?.trim() || user.photoURL || "",
      });

      // Refresh local Firebase user object so UI shows new values
      await user.reload();

      toast.success("Profile updated successfully ✅");
      navigate("/userProfile", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const resetToCurrent = () => {
    setName(user?.displayName || "");
    setPhoto(user?.photoURL || "");
    toast("Restored current profile values");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="card bg-base-100/80 backdrop-blur border border-base-300/60 shadow-md">
        <div className="card-body">
          <h1 className="text-2xl font-extrabold tracking-tight text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            My Profile
          </h1>

          {/* Top: Avatar + Basic */}
          <div className="mt-4 flex items-center gap-4">
            <img
              src={
                photo || user.photoURL || "https://i.ibb.co/F4gJ0dG/user.png"
              }
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/60 ring-offset-2 ring-offset-base-100"
            />
            <div>
              <p className="font-medium">{user.displayName || "No name set"}</p>
              <p className="text-sm opacity-70">{user.email}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="mt-4 space-y-3">
            <label className="form-control">
              <span className="label-text">Display Name</span>
              <input
                className="input input-bordered w-full"
                placeholder="Display Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="form-control">
              <span className="label-text">Photo URL</span>
              <input
                className="input input-bordered w-full"
                placeholder="Photo URL"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
              />
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary flex-1"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={resetToCurrent}
                className="btn btn-ghost"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Tips */}
          <div className="mt-3 text-xs opacity-70">
            Tip: Use a square image URL (e.g., 256×256) for best avatar quality.
          </div>
        </div>
      </div>
    </div>
  );
}
