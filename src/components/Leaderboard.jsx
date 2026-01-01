// src/components/Leaderboard.jsx
import { useEffect, useState } from "react";
import { subscribeLeaderboard } from "../firebase";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsub = subscribeLeaderboard(setUsers);
    return () => unsub();
  }, []);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      <ol className="list-decimal ml-5 space-y-2">
        {users.map((u) => (
          <li key={u.uid} className="flex justify-between">
            <span>{u.username}</span>
            <span>{u.xp} XP</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

