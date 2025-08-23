import React from 'react';

const WireframeLogo = () => (
    <svg width="100%" height="100%" viewBox="0 0 210 100" className="absolute inset-0 z-0 opacity-25">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: 'var(--adam-primary)', stopOpacity: 0}} />
                <stop offset="50%" style={{stopColor: 'var(--adam-primary)', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'var(--adam-primary)', stopOpacity: 0}} />
            </linearGradient>
        </defs>
        {/* A */}
        <path d="M 10 90 L 30 10 L 50 90" stroke="url(#grad1)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 125, strokeDashoffset: 125, animationDelay: '0.5s'}} />
        <path d="M 20 50 H 40" stroke="url(#grad1)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 20, strokeDashoffset: 20, animationDelay: '0.8s'}}/>

        {/* D */}
        <path d="M 60 10 L 60 90" stroke="url(#grad1)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 80, strokeDashoffset: 80, animationDelay: '1.0s'}} />
        <path d="M 60 10 C 100 10, 100 90, 60 90" stroke="url(#grad1)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 130, strokeDashoffset: 130, animationDelay: '1.3s'}}/>

        {/* A */}
        <path d="M 110 90 L 130 10 L 150 90" stroke="url(#grad1)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 125, strokeDashoffset: 125, animationDelay: '1.6s'}} />
        <path d="M 120 50 H 140" stroke="url(#grad1)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 20, strokeDashoffset: 20, animationDelay: '1.9s'}}/>
        
        {/* M */}
        <path d="M 160 90 L 160 10 L 180 50 L 200 10 L 200 90" stroke="url(#grad1)" strokeWidth="0.5" fill="none" className="animate-path-draw" style={{strokeDasharray: 210, strokeDashoffset: 210, animationDelay: '2.1s'}}/>
    </svg>
);


const AdamHero: React.FC = () => {
    
  const scrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.querySelector('#adam-about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full h-full flex items-center justify-center text-center p-8 bg-transparent relative overflow-hidden">
      <WireframeLogo />
      
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl md:text-8xl font-thin text-gray-200 tracking-[0.2em] uppercase animate-fade-in-down" style={{textShadow: '0 0 15px rgba(255,255,255,0.1)'}}>
          ADAM Protocol
        </h1>
        <p className="text-md md:text-xl text-gray-400 mt-6 max-w-2xl mx-auto font-light animate-fade-in-up tracking-wider">
          A Constitutional Intelligence Framework for On-Chain Governance.
        </p>
        <a href="#adam-about" onClick={scrollToAbout} 
           className="mt-12 border border-adam-blue/50 text-adam-blue font-light py-3 px-10 rounded-sm text-sm uppercase tracking-[0.2em] hover:bg-adam-blue/20 hover:text-white hover:shadow-glow-blue transition-all duration-300 animate-fade-in-up group relative"
           style={{animationDelay: '0.6s'}}>
          <span className="absolute -inset-0.5 rounded-sm bg-adam-blue opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300"></span>
          Explore The Constitution
        </a>
      </div>
    </div>
  );
};

export default AdamHero;