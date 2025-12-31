import React from 'react';

const Mascot = ({ message, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 flex items-end animate-bounce" style={{ zIndex: 1000 }}>
      <div className="bg-white text-black p-4 rounded-t-2xl rounded-l-2xl shadow-xl border-2 border-blue-500 max-w-xs mb-10">
        <p className="text-sm font-medium">🤖 {message}</p>
      </div>
      <img 
        src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" // Replace with your mascot image
        alt="Mascot" 
        className="w-20 h-20 ml-[-20px]"
      />
    </div>
  );
};

export default Mascot;
