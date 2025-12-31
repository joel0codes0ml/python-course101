
import React, { useState } from 'react';
import Sharingan from './Sharingan';

const Survey = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ source: '', languages: [], goal: '' });

  const next = () => {
    if (step < 3) setStep(step + 1);
    else {
        localStorage.setItem("zn_survey_done", "true");
        onComplete(data);
    }
  };

  return (
    <div className="h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-[#0f172a] p-12 rounded-[3rem] border border-slate-800 text-center relative">
        <div className="flex justify-center mb-8">
           <Sharingan size="w-12 h-12" />
        </div>

        {step === 1 && (
          <div className="animate-in">
            <h2 className="text-2xl font-black text-white mb-2">HOW DID YOU FIND US?</h2>
            <p className="text-slate-500 text-sm mb-8 font-bold uppercase tracking-tighter italic">"Your path was led by fate..."</p>
            <div className="grid grid-cols-2 gap-4">
              {['TikTok', 'GitHub', 'Google', 'Sensei Referal'].map(s => (
                <button key={s} onClick={() => {setData({...data, source: s}); next();}} className="p-5 bg-[#020617] border border-slate-800 rounded-2xl hover:border-blue-500 text-sm font-bold text-white transition-all">{s}</button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in">
            <h2 className="text-2xl font-black text-white mb-2">WHAT WILL YOU MASTER?</h2>
            <p className="text-slate-500 text-sm mb-8 font-bold uppercase tracking-tighter italic">"Choose your Jutsu..."</p>
            <div className="grid grid-cols-3 gap-3">
              {['Python', 'SQL', 'HTML', 'Go', 'C++', 'CSS'].map(l => (
                <button key={l} onClick={() => setData({...data, languages: [...data.languages, l]})} 
                  className={`p-4 rounded-xl border font-bold text-xs transition-all ${data.languages.includes(l) ? 'bg-blue-600 border-blue-400' : 'bg-[#020617] border-slate-800'}`}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={next} className="mt-8 w-full py-4 bg-white text-black font-black rounded-2xl uppercase text-xs tracking-widest">Continue</button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in">
            <h2 className="text-2xl font-black text-white mb-2">TRAINING INTENSITY?</h2>
            <p className="text-slate-500 text-sm mb-8 font-bold uppercase tracking-tighter italic">"How many minutes of training daily?"</p>
            <div className="space-y-3">
              {['10 Minutes (Casual)', '30 Minutes (Warrior)', '60+ Minutes (Legend)'].map(g => (
                <button key={g} onClick={() => {setData({...data, goal: g}); next();}} className="w-full p-5 bg-[#020617] border border-slate-800 rounded-2xl hover:border-red-500 text-sm font-black text-white text-left">{g}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Survey;
