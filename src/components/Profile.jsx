import React from 'react';

const Profile = ({ user, points, progress, streak }) => {
  const totalLessons = Object.values(progress).reduce((acc, curr) => acc + (curr / 2.5), 0);
  
  const badges = [
    { id: 1, name: "First Step", desc: "1 Lesson Done", active: totalLessons >= 1, icon: "🎯" },
    { id: 2, name: "XP Hunter", desc: "1,000 XP Earned", active: points >= 1000, icon: "⚡" },
    { id: 3, name: "Consistent", desc: "7 Day Streak", active: streak >= 7, icon: "🔥" },
    { id: 4, name: "Centurion", desc: "100 Lessons", active: totalLessons >= 100, icon: "💯" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-[#161b2a] rounded-3xl p-8 border border-slate-800 flex items-center gap-8 mb-12">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl">👤</div>
        <div>
          <h1 className="text-3xl font-bold text-white">{user}</h1>
          <div className="flex gap-4 mt-4">
            <StatBox label="XP" value={points} color="text-blue-400" />
            <StatBox label="Streak" value={streak} color="text-orange-500" />
            <StatBox label="Lessons" value={Math.floor(totalLessons)} color="text-white" />
          </div>
        </div>
      </div>
      <h2 className="text-lg font-bold mb-6">Badges & Achievements</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map(b => (
          <div key={b.id} className={`p-6 rounded-2xl border text-center ${b.active ? 'bg-slate-800 border-blue-500/30' : 'bg-slate-900 border-slate-800 opacity-30 grayscale'}`}>
            <div className="text-3xl mb-2">{b.icon}</div>
            <div className="text-xs font-bold text-white">{b.name}</div>
            <div className="text-[10px] text-slate-500 mt-1">{b.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatBox = ({ label, value, color }) => (
  <div className="bg-slate-800 px-4 py-1.5 rounded-lg border border-slate-700">
    <div className="text-[9px] text-slate-500 font-bold uppercase">{label}</div>
    <div className={`text-sm font-mono font-bold ${color}`}>{value}</div>
  </div>
);

export default Profile;
