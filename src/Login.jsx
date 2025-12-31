import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [source, setSource] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.length > 2 && source) {
      localStorage.setItem("zenin_discovery", source);
      onLogin(user);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[#0f172a]">
      <div className="bg-[#1e293b] p-10 rounded-2xl border-2 border-red-500 text-center w-[360px] shadow-2xl">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-black ring-2 ring-red-500">
           <img src="https://i.pinimg.com/1200x/a7/21/d5/a721d5d3b9294833c32f9c5f8db71b43.jpg" alt="Sharingan" />
        </div>
        <h2 className="text-white font-mono tracking-[4px] text-xl mb-8">ZENIN<span className="text-red-500">LABS</span></h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Username" required 
            className="w-full p-3 bg-[#0f172a] border border-slate-700 text-white rounded outline-none focus:border-red-500" 
            onChange={(e) => setUser(e.target.value)} />
          
          <select required className="w-full p-3 bg-[#0f172a] border border-slate-700 text-slate-400 rounded outline-none focus:border-red-500 text-sm"
            onChange={(e) => setSource(e.target.value)}>
            <option value="">How did you find us?</option>
            <option value="Tiktok">Tiktok</option>
            <option value="Instagram">Instagram</option>
            <option value="Search">Google Search</option>
            <option value="Friend">A Friend</option>
          </select>

          <button type="submit" className="w-full p-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded transition-all active:scale-95">
            INITIALIZE SYSTEM
          </button>
        </form>
      </div>
    </div>
  );
}
