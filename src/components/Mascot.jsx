import React from 'react';

export default function Sharingan({ size = "w-12 h-12", animate = true }) {
  return (
    <div className={`${size} relative rounded-full bg-[#cc0000] border-2 border-black shadow-[0_0_15px_rgba(204,0,0,0.4)] flex items-center justify-center ${animate ? 'animate-pulse' : ''}`}>
      {/* Pupil */}
      <div className="w-1/4 h-1/4 bg-black rounded-full z-10 shadow-inner"></div>
      {/* Tomoe Ring */}
      <div className="absolute inset-1 border border-black/20 rounded-full"></div>
      {/* 3 Tomoe Dots */}
      {[0, 120, 240].map((deg) => (
        <div 
          key={deg} 
          className="absolute w-full h-full" 
          style={{ transform: `rotate(${deg}deg)` }}
        >
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full after:content-[''] after:absolute after:w-1.5 after:h-2 after:border-l-2 after:border-black after:rounded-full after:-top-0.5 after:left-1"></div>
        </div>
      ))}
    </div>
  );
}
