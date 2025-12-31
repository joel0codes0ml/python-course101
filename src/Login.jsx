import React, { useState } from 'react';
import Sharingan from './components/Sharingan';

const Login = ({ onLogin }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onLogin(name.trim());
  };

  return (
    <div className="h-screen w-full bg-[#020617] flex items-center justify-center p-6 font-sans selection:bg-red-500/30">
      <div className="w-full max-w-sm animate-in">
        
        {/* LOGO & MASCOT ON TOP */}
        <div className="text-center mb-10 flex flex-col items-center">
          <Sharingan size="w-20 h-20" animate={true} />
          <h1 className="text-4xl font-black text-white tracking-tighter mt-4 mb-2">
            ZENIN<span className="text-blue-500">LABS</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            Unlock Your Potential
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-[#0f172a] p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-red-600"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">
                Authenticate User
              </label>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Username..."
                className="w-full bg-[#020617] border border-slate-700 text-white rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-800"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all text-[11px] uppercase tracking-[0.2em]"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
