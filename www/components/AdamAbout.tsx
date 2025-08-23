import React, { useState } from 'react';

const CapitalIcon = () => (
    <svg xmlns="http://www.w.org/2000/svg" className="h-8 w-8 text-adam-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v.01M12 18v-2m0-10V5m0 7h.01M7 12h.01M17 12h.01M7 12a5 5 0 015-5m5 5a5 5 0 00-5-5m0 10a5 5 0 005-5m-5 5a5 5 0 01-5-5" />
    </svg>
);

const ReputationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-adam-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ImpactIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-adam-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.737 16.525l-.425.425a2 2 0 01-2.828 0 2 2 0 010-2.828l.425-.425M16.263 16.525l.425.425a2 2 0 002.828 0 2 2 0 000-2.828l-.425-.425" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
    </svg>
);

const TriadCard: React.FC<{ icon: React.ReactNode; title: string; description: string, formula: string; delay: number }> = ({ icon, title, description, formula, delay }) => {
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { currentTarget: card } = e;
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const rotateX = -10 * ((y - height / 2) / (height / 2));
        const rotateY = 10 * ((x - width / 2) / (width / 2));
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };
    
    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    return (
        <div 
            className="glass-pane rounded-lg p-6 group transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${delay}s`, transition: 'transform 0.2s ease-out' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex items-center space-x-4">
                {icon}
                <h3 className="text-xl font-light text-gray-200 tracking-widest uppercase">{title}</h3>
            </div>
            <p className="mt-4 text-adam-light-gray font-light text-sm leading-relaxed min-h-[84px]">{description}</p>
            <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 tracking-widest uppercase">Weight Formula</p>
                <p className="font-mono text-xs text-adam-blue mt-2 bg-black/30 p-2 rounded-sm">{formula}</p>
            </div>
        </div>
    );
};

const AdamAbout: React.FC = () => {
  return (
    <div id="adam-about" className="w-full h-full flex items-center justify-center p-8 md:p-16 bg-transparent">
      <div className="max-w-7xl w-full flex flex-col items-center text-center">
        <div className="animate-fade-in-down">
          <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase leading-tight">
            The Governance <span className="text-adam-blue" style={{textShadow: '0 0 15px var(--adam-glow)'}}>Triad</span>
          </h2>
          <p className="mt-6 text-adam-light-gray font-light max-w-3xl mx-auto text-lg leading-relaxed">
            ADAM Protocol moves beyond simple token voting, composing three distinct layers of power to create a resilient, context-aware, and plutocracy-resistant system.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full relative">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-adam-medium-ray/50 to-transparent -translate-y-1/2 hidden md:block"></div>
            
             <TriadCard 
                icon={<CapitalIcon />}
                title="Capital" 
                description="Economic alignment via staked ARCx, with influence boosted by commitment duration and shaped by Quadratic Voting."
                formula="f_token = QV(sqrt(stake_days_weight · stake_amount))"
                delay={0.2}
            />
             <TriadCard
                icon={<ReputationIcon />}
                title="Reputation" 
                description="Soulbound Identity (SBTs) grant power to verified contributors, creating a meritocracy of builders with time-decayed influence." 
                formula="f_id = Σ(role_weight · activity_decay(Δt))"
                delay={0.4}
            />
             <TriadCard
                icon={<ImpactIcon />}
                title="Impact" 
                description="Verifiable Real-World Asset (RWA) proofs give a voice to tangible outcomes, weighted by significance and recency." 
                formula="f_rwa,k = impact_score_k · recency_decay_k(Δt)"
                delay={0.6}
            />
        </div>
      </div>
    </div>
  );
};

export default AdamAbout;