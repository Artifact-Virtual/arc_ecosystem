import React from 'react';

const WireframeLogo = () => (
    <svg width="100%" height="100%" viewBox="0 0 210 100" className="absolute inset-0 z-0 opacity-20">
        <defs>
            <linearGradient id="grad-sbt" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#14b8a6', stopOpacity: 0}} />
                <stop offset="50%" style={{stopColor: '#14b8a6', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#14b8a6', stopOpacity: 0}} />
            </linearGradient>
        </defs>
        {/* S */}
        <path d="M 50 15 C 20 15, 20 50, 50 50 C 80 50, 80 85, 50 85" stroke="url(#grad-sbt)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 180, strokeDashoffset: 180, animationDelay: '0.5s'}} />

        {/* B */}
        <path d="M 90 10 L 90 90 L 115 90 C 135 90, 135 70, 115 70 L 90 70" stroke="url(#grad-sbt)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 160, strokeDashoffset: 160, animationDelay: '1.0s'}}/>
        <path d="M 90 50 L 110 50 C 130 50, 130 30, 110 30 L 90 30" stroke="url(#grad-sbt)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 70, strokeDashoffset: 70, animationDelay: '1.5s'}}/>

        {/* T */}
        <path d="M 150 10 H 200" stroke="url(#grad-sbt)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 50, strokeDashoffset: 50, animationDelay: '1.8s'}}/>
        <path d="M 175 10 L 175 90" stroke="url(#grad-sbt)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 80, strokeDashoffset: 80, animationDelay: '2.1s'}}/>
    </svg>
);


const SbtHero: React.FC = () => {
    
  const scrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.querySelector('#sbt-core')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full h-full flex items-center justify-center text-center p-8 bg-adam-black relative overflow-hidden">
      <WireframeLogo />
      
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl md:text-8xl font-thin text-gray-200 tracking-[0.2em] uppercase animate-fade-in-down">
          SOULBOUND IDENTITY
        </h1>
        <p className="text-md md:text-xl text-gray-400 mt-6 max-w-2xl mx-auto font-light animate-fade-in-up tracking-wider">
          Your On-Chain Reputation Constellation.
        </p>
        <a href="#sbt-core" onClick={scrollToAbout} 
           className="mt-12 border border-sbt-teal/50 text-sbt-teal font-light py-3 px-10 rounded-sm text-sm uppercase tracking-[0.2em] hover:bg-sbt-teal/20 hover:shadow-glow-teal transition-all duration-300 animate-fade-in-up"
           style={{animationDelay: '0.6s'}}>
          Explore Reputation
        </a>
      </div>
    </div>
  );
};

export default SbtHero;