import React from 'react';

const WireframeLogo = () => (
    <svg width="100%" height="100%" viewBox="0 0 240 100" className="absolute inset-0 z-0 opacity-20">
        <defs>
            <linearGradient id="grad-arcx" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#f97316', stopOpacity: 0}} />
                <stop offset="50%" style={{stopColor: '#f97316', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#f97316', stopOpacity: 0}} />
            </linearGradient>
        </defs>
        {/* A */}
        <path d="M 10 90 L 30 10 L 50 90" stroke="url(#grad-arcx)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 125, strokeDashoffset: 125, animationDelay: '0.5s'}} />
        <path d="M 20 50 H 40" stroke="url(#grad-arcx)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 20, strokeDashoffset: 20, animationDelay: '0.8s'}}/>

        {/* R */}
        <path d="M 60 90 L 60 10 L 85 10 C 95 10, 95 30, 85 30 L 60 30" stroke="url(#grad-arcx)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 150, strokeDashoffset: 150, animationDelay: '1.0s'}} />
        <path d="M 75 30 L 95 90" stroke="url(#grad-arcx)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 65, strokeDashoffset: 65, animationDelay: '1.3s'}}/>

        {/* C */}
        <path d="M 140 15 C 110 15, 110 85, 140 85" stroke="url(#grad-arcx)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 110, strokeDashoffset: 110, animationDelay: '1.6s'}} />

        {/* X */}
        <path d="M 160 10 L 200 90" stroke="url(#grad-arcx)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 90, strokeDashoffset: 90, animationDelay: '1.9s'}}/>
        <path d="M 200 10 L 160 90" stroke="url(#grad-arcx)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 90, strokeDashoffset: 90, animationDelay: '2.1s'}}/>
    </svg>
);


const ArcxHero: React.FC = () => {
    
  const scrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.querySelector('#arcx-core')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full h-full flex items-center justify-center text-center p-8 bg-adam-black relative overflow-hidden">
      <WireframeLogo />
      
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl md:text-8xl font-thin text-gray-200 tracking-[0.2em] uppercase animate-fade-in-down">
          ARCx
        </h1>
        <p className="text-md md:text-xl text-gray-400 mt-6 max-w-2xl mx-auto font-light animate-fade-in-up tracking-wider">
          The Economic Engine of The Arc Ecosystem.
        </p>
        <a href="#arcx-core" onClick={scrollToAbout} 
           className="mt-12 border border-arcx-orange/50 text-arcx-orange font-light py-3 px-10 rounded-sm text-sm uppercase tracking-[0.2em] hover:bg-arcx-orange/20 hover:shadow-glow-orange transition-all duration-300 animate-fade-in-up"
           style={{animationDelay: '0.6s'}}>
          Explore Features
        </a>
      </div>
    </div>
  );
};

export default ArcxHero;