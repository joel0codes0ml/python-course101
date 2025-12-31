const Profile = ({ user, points, streak, progress }) => {
  const totalCompleted = Object.values(progress).reduce((acc, curr) => acc + (curr > 0 ? 1 : 0), 0);
  
  const badges = [
    { name: "Early Adopter", icon: "💎", goal: "Join ZeninLabs", active: true },
    { name: "Code Streak", icon: "🔥", goal: "7 Day Streak", active: streak >= 7 },
    { name: "XP Master", icon: "👑", goal: "1000 XP", active: points >= 1000 },
    { name: "Polyglot", icon: "🌎", goal: "5 Languages", active: totalCompleted >= 5 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-10 animate-in">
      <div className="bg-[#0f172a] rounded-3xl p-8 border border-slate-800 flex items-center gap-8 mb-12 shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl">👤</div>
        <div>
          <h1 className="text-3xl font-bold text-white">{user}</h1>
          <div className="flex gap-4 mt-4">
            <div className="bg-slate-800 px-4 py-1.5 rounded-lg border border-slate-700">
               <span className="block text-[9px] text-slate-500 font-bold uppercase">Total XP</span>
               <span className="text-sm font-mono text-blue-400">{points}</span>
            </div>
            <div className="bg-slate-800 px-4 py-1.5 rounded-lg border border-slate-700">
               <span className="block text-[9px] text-slate-500 font-bold uppercase">Streak</span>
               <span className="text-sm font-mono text-orange-500">{streak} Days</span>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-6">Unlocked Badges</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map(b => (
          <div key={b.name} className={`p-6 rounded-2xl border text-center transition-all ${b.active ? 'bg-slate-800 border-blue-500/40 grayscale-0' : 'bg-slate-900 border-slate-800 opacity-30 grayscale'}`}>
            <div className="text-3xl mb-2">{b.icon}</div>
            <div className="text-xs font-bold text-white">{b.name}</div>
            <div className="text-[10px] text-slate-500 mt-1">{b.goal}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
