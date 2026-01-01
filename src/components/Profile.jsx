// src/components/Profile.jsx
import { useEffect, useState } from "react";
import { auth, getUserProfile, updateUserProfile } from "../firebase";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const uid = auth.currentUser.uid;
    getUserProfile(uid).then((data) => {
      setProfile(data);
      setUsername(data.username);
      setEmail(data.email);
    });
  }, []);

  const handleSave = async () => {
    const uid = auth.currentUser.uid;
    await updateUserProfile(uid, { username, email });
    alert("Profile updated!");
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-4">Your Profile</h2>
      <label className="block mb-2">Username</label>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-gray-700"
      />
      <label className="block mb-2">Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-gray-700"
      />
      <button
        onClick={handleSave}
        className="bg-green-600 px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}

