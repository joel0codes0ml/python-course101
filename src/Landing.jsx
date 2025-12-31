import React from 'react';
import Sharingan from './components/Sharingan';

export default function Landing({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-red-500/30 overflow-hidden relative">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Sharingan size="w-8 h-8" animate={false} />
          <h1 className="text-xl font-black tracking-tighter italic">ZENIN<span className="text-blue-500">LABS</span></h1>
        </div>
        <button onClick={onGetStarted} className="text-xs font-bold uppercase tracking-widest hover:text-blue-400 transition-colors">
          Login
        </button>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8 animate-in backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">New: Python Mastery Path</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight animate-in">
          Master the Art of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-white to-red-500">Digital Ninjutsu</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-in">
          Forget boring tutorials. ZeninLabs is the premium environment for developers who want to sharpen their skills, track their streak, and code like a pro.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in">
          <button 
            onClick={onGetStarted}
            className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 transition-all hover:scale-105"
          >
            Get Started
          </button>
          <button className="px-10 py-5 bg-[#0f172a] border border-slate-700 hover:border-slate-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all">
            View Curriculum
          </button>
        </div>

        {/* FEATURE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 text-left">
          {[
            { title: "Multi-Language IDE", icon: "💻", desc: "Python, C++, Go, and SQL running directly in your browser." },
            { title: "Daily Streaks", icon: "🔥", desc: "Build discipline. Track your progress. Earn XP for every line of code." },
            { title: "Zenin Mascot", icon: "👁️", desc: "Interactive feedback system that watches your syntax and guides you." }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-[#0f172a]/50 border border-white/5 backdrop-blur-sm hover:border-blue-500/30 transition-all group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 bg-[#020617] py-12 text-center">
        <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">© 2025 ZeninLabs. Code Your Destiny.</p>
      </footer>
    </div>
  );
}
