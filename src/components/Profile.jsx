import React from 'react';

const Profile = ({ user, points, streak, progress }) => {
  const totalCompleted = Object.values(progress).reduce((acc, curr) => acc + (curr > 0 ? 1 : 0), 0);
  
  const badges = [
    { name: "Early Adopter", icon: "💎", goal: "Join ZeninLabs", active: true },
    { name: "Consistency", icon: "🔥", goal: "7 Day Streak", active: streak >= 7 },
    { name: "XP Master", icon: "👑", goal: "1000 XP Earned", active: points >= 1000 },
    { name: "Polyglot", icon: "🌎", goal: "5 Languages Started", active: totalCompleted >= 5 },
  ];

  const StatBox = ({ label, value, color }) => (
    <div className="bg-slate-800/50 px-6 py-3 rounded-2xl border border-slate-700">
       <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</span>
       <span className={`text-lg font-mono font-bold ${color}`}>{value}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-10 animate-in">
      {/* HEADER CARD */}
      <div className="bg-[#0f172a] rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row items-center gap-8 mb-12 shadow-2xl">
        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl shadow-lg shadow-blue-500/20">👤</div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white mb-4">{user}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <StatBox label="Total XP" value={`${points} XP`} color="text-blue-400" />
            <StatBox label="Daily Streak" value={`${streak} Days`} color="text-orange-500" />
            <StatBox label="Courses" value={totalCompleted} color="text-white" />
          </div>
        </div>
      </div>

      {/* BADGES GRID */}
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Achievements</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map(b => (
          <div key={b.name} className={`p-6 rounded-2xl border text-center transition-all duration-500 ${b.active ? 'bg-slate-800 border-blue-500/30' : 'bg-slate-900 border-slate-800 opacity-20 grayscale'}`}>
            <div className="text-3xl mb-3">{b.icon}</div>
            <div className="text-xs font-bold text-white mb-1">{b.name}</div>
            <div className="text-[10px] text-slate-500">{b.goal}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
