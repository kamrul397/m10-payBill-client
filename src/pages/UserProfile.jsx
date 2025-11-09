import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContex";
import { updateProfile } from "firebase/auth";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(user?.photoURL || "");

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile(user, { displayName: name, photoURL: photo });
    // optional: toast success
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">My Profile</h1>

      <div className="flex items-center gap-3">
        <img
          src={user.photoURL || "https://i.ibb.co/F4gJ0dG/user.png"}
          alt="avatar"
          className="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <p className="font-medium">{user.displayName || "No name set"}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        <input
          className="input input-bordered w-full"
          placeholder="Display Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input input-bordered w-full"
          placeholder="Photo URL"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
        />
        <button className="btn btn-primary w-full">Save</button>
      </form>
    </div>
  );
}
