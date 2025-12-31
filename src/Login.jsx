import { useState } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => signInWithEmailAndPassword(auth, email, password);
  const register = () => createUserWithEmailAndPassword(auth, email, password);

  return (
    <div className="h-screen flex items-center justify-center bg-[#020617] text-white">
      <div className="w-[350px] p-8 bg-black/40 rounded-3xl">
        <h1 className="text-3xl font-black italic text-center mb-6">
          ZENINLABS
        </h1>

        <input
          placeholder="Email"
          className="w-full p-3 mb-3 rounded bg-black/50"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded bg-black/50"
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={login} className="w-full bg-red-600 py-3 rounded mb-2">
          Login
        </button>

        <button onClick={register} className="w-full border py-3 rounded">
          Register
        </button>
      </div>
    </div>
  );
}


