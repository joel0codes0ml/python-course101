import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="h-screen w-full bg-[#020617] flex items-center justify-center p-6 font-sans selection:bg-blue-500/30">
      <div className="w-full max-w-sm animate-in">
        {/* LOGO */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
            ZENIN<span className="text-blue-500">LABS</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
            Learn to Code for Free
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-[#0f172a] p-8 rounded-[2rem] border border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">
                Your Developer Name
              </label>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Satoshi_Dev"
                className="w-full bg-[#020617] border border-slate-700 text-white rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-700"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all text-xs uppercase tracking-widest"
            >
              Get Started
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              By joining, you agree to our Terms
            </p>
          </div>
        </div>

        {/* ALREADY HAVE ACCOUNT LINK */}
        <p className="text-center mt-8 text-slate-500 text-xs font-medium">
          Already have an account? <span className="text-blue-500 cursor-pointer hover:underline">Log in</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
