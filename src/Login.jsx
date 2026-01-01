// src/Login.jsx

import { useState } from "react";
import { 
  signUpWithEmail, 
  loginWithEmail, 
  loginWithApple, 
  createUserProfile 
} from "./firebase";
import Sharingan from "./components/Sharingan";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [step, setStep] = useState(1); // 1 = login/register, 2 = onboarding
  const [heardFrom, setHeardFrom] = useState("");
  const [codingDuration, setCodingDuration] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const user = await loginWithEmail(email, password);
      setStep(2); // move to onboarding
      onLogin(user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      const user = await signUpWithEmail(email, password, username);
      await createUserProfile(user.uid, { username, email, xp: 0, completedLessons: [] });
      setStep(2);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAppleLogin = async () => {
    try {
      const user = await loginWithApple();
      // if new user, create profile
      await createUserProfile(user.uid, { username: user.displayName || "Apple User", email: user.email, xp: 0, completedLessons: [] });
      setStep(2);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOnboardingSubmit = async () => {
    try {
      // save onboarding answers
      await createUserProfile(auth.currentUser.uid, { heardFrom, codingDuration });
      alert("Welcome to ZeninLabs! 🎉");
    } catch (err) {
      setError(err.message);
    }
  };

  // Step 1: Login/Register form
  if (step === 1)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
        <Sharingan className="mb-6 w-20 h-20 animate-spin" />
        <div className="w-[380px] p-8 bg-black/50 rounded-3xl">
          <h1 className="text-4xl font-black italic text-center mb-6">ZENINLABS</h1>

          <input
            placeholder="Username (for registration)"
            className="w-full p-3 mb-3 rounded bg-black/50"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            placeholder="Email"
            className="w-full p-3 mb-3 rounded bg-black/50"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-6 rounded bg-black/50"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 mb-3">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-green-600 py-3 rounded mb-2 hover:bg-green-700 transition"
          >
            Login
          </button>

          <button
            onClick={handleRegister}
            className="w-full bg-red-600 py-3 rounded mb-2 hover:bg-red-700 transition"
          >
            Register
          </button>

          <button
            onClick={handleAppleLogin}
            className="w-full border py-3 rounded hover:bg-white/10 transition"
          >
            Sign in with Apple
          </button>
        </div>
      </div>
    );

  // Step 2: Onboarding
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="w-[380px] p-8 bg-black/50 rounded-3xl">
        <h2 className="text-2xl font-bold mb-4">Welcome to ZeninLabs!</h2>
        <p className="mb-2">How did you hear about ZeninLabs?</p>
        <input
          placeholder="e.g. Social Media, Friend, School"
          className="w-full p-3 mb-4 rounded bg-black/50"
          onChange={(e) => setHeardFrom(e.target.value)}
        />

        <p className="mb-2">How long will you be coding daily?</p>
        <input
          placeholder="e.g. 1-2 hours"
          className="w-full p-3 mb-6 rounded bg-black/50"
          onChange={(e) => setCodingDuration(e.target.value)}
        />

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <button
          onClick={handleOnboardingSubmit}
          className="w-full bg-green-600 py-3 rounded hover:bg-green-700 transition"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}
