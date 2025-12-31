import React from 'react';

const Leaderboard = ({ currentUser }) => {
  // Static mock data mixed with the real user
  const players = [
    { name: "Satoshi_Dev", xp: 5240, streak: 12 },
    { name: "Ada_Lovelace", xp: 4890, streak: 45 },
    { name: "Linus_X", xp: 4100, streak: 7 },
    { name: "CodeWizard", xp: 3200, streak: 3 },
    { ...currentUser, isUser: true }
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-3xl mx-auto p-10 animate-in">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-white uppercase tracking-[0.3em]">Global Rankings</h1>
        <p className="text-slate-500 text-xs mt-2 font-medium uppercase tracking-widest">Top Contributors this week</p>
      </div>

      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        {/* HEADER */}
        <div className="grid grid-cols-12 p-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-900/50">
          <div className="col-span-1">#</div>
          <div className="col-span-7">Developer</div>
          <div className="col-span-2 text-center">Streak</div>
          <div className="col-span-2 text-right">Points</div>
        </div>

        {/* ROWS */}
        <div className="divide-y divide-slate-800/50">
          {players.map((p, i) => (
            <div key={p.name} className={`grid grid-cols-12 p-5 items-center transition-colors ${p.isUser ? 'bg-blue-600/10 border-l-4 border-l-blue-500' : 'hover:bg-slate-800/30'}`}>
              <div className="col-span-1 text-slate-500 font-mono text-xs">#{i+1}</div>
              <div className="col-span-7 font-bold text-sm text-slate-200">
                {p.name} {p.isUser && <span className="text-[10px] ml-2 text-blue-500 uppercase font-black">(You)</span>}
              </div>
              <div className="col-span-2 text-center text-orange-500 text-xs font-bold">
                🔥 {p.streak}
              </div>
              <div className="col-span-2 text-right font-mono text-blue-400 text-xs font-bold">
                {p.xp.toLocaleString()} XP
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
