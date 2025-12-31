
import React from 'react';

const Sharingan = ({ size = "w-10 h-10", pulse = false }) => {
  return (
    <div className={`${size} relative rounded-full bg-red-600 border-2 border-black shadow-[0_0_15px_rgba(220,38,38,0.5)] flex items-center justify-center ${pulse ? 'animate-pulse' : ''}`}>
      {/* Pupil */}
      <div className="w-2 h-2 bg-black rounded-full z-10 shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
      {/* Inner Ring */}
      <div className="absolute inset-1.5 border border-black/30 rounded-full"></div>
      {/* Tomoe 1 */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full after:content-[''] after:absolute after:w-2 after:h-1 after:border-t-2 after:border-black after:rounded-full after:-rotate-45 after:-left-1"></div>
      {/* Tomoe 2 */}
      <div className="absolute bottom-1 right-2 w-1.5 h-1.5 bg-black rounded-full rotate-[120deg]"></div>
      {/* Tomoe 3 */}
      <div className="absolute bottom-1 left-2 w-1.5 h-1.5 bg-black rounded-full rotate-[240deg]"></div>
    </div>
  );
};

export default Sharingan;
