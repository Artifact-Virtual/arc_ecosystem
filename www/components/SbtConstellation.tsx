import React from 'react';

const credentials = [
  { name: 'Core Contributor', angle: 0, delay: 0.5 },
  { name: 'RWA Curator', angle: 60, delay: 0.7 },
  { name: 'Oracle Operator', angle: 120, delay: 0.9 },
  { name: 'Early Adopter', angle: 180, delay: 1.1 },
  { name: 'Voter LVL 5', angle: 240, delay: 1.3 },
  { name: 'Delegate', angle: 300, delay: 1.5 },
];

const SbtConstellation: React.FC = () => {
  return (
    <div id="sbt-constellation" className="w-full h-full flex flex-col items-center justify-center p-8 md:p-16 bg-adam-dark overflow-hidden">
      <div className="text-center w-full max-w-7xl mx-auto mb-12 animate-fade-in-down">
        <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase">
          Reputation <span className="text-sbt-teal">Constellation</span>
        </h2>
        <p className="mt-4 text-gray-400 font-light max-w-2xl mx-auto">
          Your identity is a composite of verifiable credentials, forming a unique on-chain constellation of your contributions and roles.
        </p>
      </div>

      <div className="w-full max-w-2xl h-96 relative">
        <style>{`
          @keyframes star-pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 10px 2px var(--sbt-glow); }
            50% { transform: scale(1.1); box-shadow: 0 0 20px 5px var(--sbt-glow-intense); }
          }
          @keyframes center-pulse {
            0%, 100% { transform: scale(1) translate(-50%, -50%); box-shadow: 0 0 20px 5px var(--sbt-glow); }
            50% { transform: scale(1.05) translate(-50%, -50%); box-shadow: 0 0 35px 10px var(--sbt-glow-intense); }
          }
          .star-pulse { animation: star-pulse 4s ease-in-out infinite; }
          .center-pulse { animation: center-pulse 5s ease-in-out infinite; }
        `}</style>

        <svg className="absolute inset-0 w-full h-full opacity-50" width="100%" height="100%" viewBox="0 0 500 400">
            {credentials.map(cred => {
                const angleRad = (cred.angle * Math.PI) / 180;
                const x2 = 250 + 180 * Math.cos(angleRad);
                const y2 = 200 + 120 * Math.sin(angleRad);
                return (
                     <line 
                        key={cred.name}
                        x1="250" y1="200" x2={x2} y2={y2}
                        stroke="#14b8a6" strokeWidth="0.5"
                        className="animate-path-draw"
                        style={{ strokeDasharray: 220, strokeDashoffset: 220, animationDelay: `${cred.delay}s` }}
                     />
                )
            })}
        </svg>

        {/* Central Identity Node */}
        <div 
            className="absolute top-1/2 left-1/2 w-32 h-32 bg-adam-slate rounded-full flex flex-col items-center justify-center text-center panel-border center-pulse animate-fade-in"
            style={{ transform: 'translate(-50%, -50%)', animationDelay: '0.2s' }}
        >
            <p className="text-sbt-teal text-lg font-light tracking-widest">IDENTITY</p>
            <p className="text-xs text-gray-500 mt-1">0x12...aBcd</p>
        </div>

        {/* Credential Nodes */}
        {credentials.map(cred => {
            const angleRad = (cred.angle * Math.PI) / 180;
            const x = 50 + 50 * Math.cos(angleRad);
            const y = 50 + 30 * Math.sin(angleRad);
            return (
                <div 
                    key={cred.name}
                    className="absolute w-32 h-10 bg-adam-slate rounded-sm flex items-center justify-center text-center panel-border star-pulse animate-fade-in"
                    style={{ 
                        left: `${x}%`, 
                        top: `${y}%`,
                        transform: `translate(-50%, -50%)`,
                        animationDelay: `${cred.delay}s`,
                    }}
                >
                    <p className="text-xs text-gray-300 font-light tracking-wider">{cred.name}</p>
                </div>
            )
        })}
      </div>
    </div>
  );
};

export default SbtConstellation;