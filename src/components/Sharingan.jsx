import React from 'react';

export default function Sharingan({ width = 80, height = 80, animate = true }) {
  // Container style (The Red Eye)
  const containerStyle = {
    width: `${width}px`,
    height: `${height}px`,
    position: 'relative',
    borderRadius: '50%',
    backgroundColor: '#cc0000',
    border: '2px solid black',
    boxShadow: '0 0 20px rgba(204, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  };

  // The central black pupil
  const pupilStyle = {
    width: '25%',
    height: '25%',
    backgroundColor: 'black',
    borderRadius: '50%',
    zIndex: 10,
    boxShadow: 'inset 0 0 5px rgba(255,255,255,0.2)'
  };

  return (
    <div style={containerStyle}>
      {/* Pupil */}
      <div style={pupilStyle}></div>

      {/* Tomoe Design (The 3 Commas) */}
      {[0, 120, 240].map((deg) => (
        <div 
          key={deg} 
          style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            transform: `rotate(${deg}deg)` 
          }}
        >
          {/* The Tomoe Dot */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '15%',
            height: '15%',
            backgroundColor: 'black',
            borderRadius: '50%'
          }}>
            {/* The Tomoe Tail (Comma Effect) */}
            <div style={{
              position: 'absolute',
              width: '120%',
              height: '150%',
              borderLeft: '2px solid black',
              borderRadius: '50%',
              top: '-2px',
              left: '50%'
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}
