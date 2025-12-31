import React from 'react';

const Leaderboard = ({ currentUser }) => {
  const players = [
    { name: "Satoshi", xp: 5200, streak: 15 },
    { name: "Ada", xp: 4800, streak: 32 },
    { name: "Linus", xp: 4100, streak: 7 },
    { ...currentUser, isUser: true }
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-white text-center mb-12">Leaderboard</h1>
      <div className="bg-[#161b2a] rounded-2xl border border-slate-800 overflow-hidden">
        <div className="grid grid-cols-12 p-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-7">User</div>
          <div className="col-span-2 text-center">Streak</div>
          <div className="col-span-2 text-right">XP</div>
        </div>
        {players.map((p, i) => (
          <div key={p.name} className={`grid grid-cols-12 p-4 items-center border-t border-slate-800 ${p.isUser ? 'bg-blue-600/10' : ''}`}>
            <div className="col-span-1 text-slate-500 text-xs">#{i+1}</div>
            <div className="col-span-7 font-bold text-sm">{p.name} {p.isUser && "(You)"}</div>
            <div className="col-span-2 text-center text-orange-500 text-xs font-bold">🔥 {p.streak}</div>
            <div className="col-span-2 text-right font-mono text-blue-400 text-xs">{p.xp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
