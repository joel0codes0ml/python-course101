import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (!email || !username || !password) return;

    onLogin({ email, username, password });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#020617] text-white">
      <div className="bg-[#0b0f1a] p-10 rounded-3xl w-[360px] border border-white/10">
        <h2 className="text-2xl font-black mb-6 italic">Login to ZENINLABS</h2>

        <input placeholder="Email" onChange={e=>setEmail(e.target.value)}
          className="w-full mb-3 p-3 bg-black/40 rounded-xl outline-none" />

        <input placeholder="Username" onChange={e=>setUsername(e.target.value)}
          className="w-full mb-3 p-3 bg-black/40 rounded-xl outline-none" />

        <input type="password" placeholder="Password"
          onChange={e=>setPassword(e.target.value)}
          className="w-full mb-6 p-3 bg-black/40 rounded-xl outline-none" />

        <button onClick={handleSubmit}
          className="w-full bg-blue-600 py-3 rounded-xl font-black uppercase text-xs">
          Enter Dojo
        </button>
      </div>
    </div>
  );
}

