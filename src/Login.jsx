// src/Login.jsx
import React, { useState } from 'react';
import Sharingan from './components/Sharingan';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd fetch('your-api/login', { method: 'POST', body: formData })
    // For now, we simulate the "Server" save to localStorage
    localStorage.setItem("zn_user_creds", JSON.stringify(formData));
    onLogin(formData.username);
  };

  return (
    <div className="h-screen w-full bg-[#020617] flex items-center justify-center p-6 selection:bg-red-500/30">
      <div className="w-full max-w-md animate-in">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
             <Sharingan size="w-16 h-16" pulse={true} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">ZENIN<span className="text-blue-500">LABS</span></h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">The Uchiha Path to Code</p>
        </div>

        <div className="bg-[#0f172a] p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-blue-600 to-red-600"></div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Username</label>
              <input type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full bg-[#020617] border border-slate-800 text-white rounded-2xl px-5 py-4 text-sm focus:border-red-500 outline-none transition-all" placeholder="Satoshi_Uchiha" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Email Address</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[#020617] border border-slate-800 text-white rounded-2xl px-5 py-4 text-sm focus:border-blue-500 outline-none transition-all" placeholder="dev@zeninlabs.com" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Password</label>
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-[#020617] border border-slate-800 text-white rounded-2xl px-5 py-4 text-sm focus:border-red-500 outline-none transition-all" placeholder="••••••••" />
            </div>

            <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-red-900/20 active:scale-[0.98] transition-all text-xs uppercase tracking-widest mt-4">
              Unlock Terminal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
