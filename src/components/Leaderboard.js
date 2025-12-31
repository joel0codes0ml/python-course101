import React from 'react';
import { useUser } from '../context/UserContext';

const Leaderboard = () => {
  const { user } = useUser();

  // Mock data for other users
  const players = [
    { name: "Satoshi_Dev", points: 450 },
    { name: "CodeQueen", points: 380 },
    { name: user.username || "You (Guest)", points: user.points },
    { name: "PyMaster", points: 210 },
  ].sort((a, b) => b.points - a.points);

  return (
    <div className="bg-gray-800 p-6 rounded-xl text-white">
      <h2 className="text-xl font-bold mb-4">🏆 Weekly Leaderboard</h2>
      {players.map((p, i) => (
        <div key={i} className={`flex justify-between p-2 ${p.name.includes(user.username) ? 'bg-blue-600 rounded' : ''}`}>
          <span>{i + 1}. {p.name}</span>
          <span className="font-mono">{p.points} XP</span>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
