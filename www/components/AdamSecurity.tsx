import React, { useState, useEffect } from 'react';

const SecurityCard: React.FC<{ title: string; description: string, delay: number }> = ({ title, description, delay }) => {

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { currentTarget: card } = e;
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const rotateX = -8 * ((y - height / 2) / (height / 2));
        const rotateY = 8 * ((x - width / 2) / (width / 2));
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };
    
    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    return (
        <div className="glass-pane rounded-lg p-6 h-full animate-fade-in-up" 
             style={{ animationDelay: `${delay}s`, transition: 'transform 0.2s ease-out' }}
             onMouseMove={handleMouseMove}
             onMouseLeave={handleMouseLeave}
        >
            <h3 className="text-xl font-light text-gray-200 tracking-widest uppercase">{title}</h3>
            <p className="mt-4 text-adam-light-gray font-light text-sm leading-relaxed min-h-[100px]">{description}</p>
            <div className="w-1/4 h-[1px] bg-adam-blue mt-6"></div>
        </div>
    );
};

const ThreatSimulation: React.FC = () => {
    const [simulating, setSimulating] = useState(false);

    useEffect(() => {
        if (simulating) {
            const timer = setTimeout(() => setSimulating(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [simulating]);

    return (
        <div className="mt-12 w-full max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: '1s'}}>
            <div className="glass-pane p-6 rounded-lg">
                <div className="flex justify-between items-center">
                    <h4 className="text-md font-light tracking-[0.2em] uppercase text-gray-300">Council Veto Simulator</h4>
                    <button
                        onClick={() => setSimulating(true)}
                        disabled={simulating}
                        className="text-xs text-adam-blue border border-adam-blue/50 px-4 py-2 rounded-md hover:bg-adam-blue/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {simulating ? 'Vetoing...' : 'Simulate Veto'}
                    </button>
                </div>
                <div className="mt-6 h-16 w-full bg-black/20 rounded-md overflow-hidden p-2">
                    <svg width="100%" height="100%" viewBox="0 0 400 64">
                        <text x="20" y="38" fill="#4b5563" className="text-sm tracking-wider">Proposal</text>
                        <text x="320" y="38" fill="#4b5563" className="text-sm tracking-wider">Execution</text>
                        
                        {simulating && (
                            <g>
                                {/* Threat path */}
                                <path d="M 100 32 H 300" stroke="#ef4444" strokeWidth="4" className="animate-threat-move" />

                                {/* Shield */}
                                <g className="animate-shield-activate" style={{ animationDelay: '0.8s' }}>
                                    <path d="M 300 12 C 280 32, 280 32, 300 52" stroke="var(--adam-primary)" strokeWidth="2" fill="var(--adam-glow)" />
                                    <path d="M 300 12 L 300 52" stroke="var(--adam-primary)" strokeWidth="1" opacity="0.5" />
                                </g>

                                {/* Blocked Text */}
                                <text x={200} y={20} fill="var(--adam-primary)" textAnchor="middle" className="text-xs animate-fade-in" style={{ animationDelay: '1.2s' }}>CANCELLED BY DUAL QUORUM</text>
                            </g>
                        )}
                        {!simulating && (
                             <path d="M 100 32 H 300" stroke="#4b5563" strokeWidth="1" strokeDasharray="3 3" />
                        )}
                    </svg>
                </div>
            </div>
        </div>
    )
}

const AdamSecurity: React.FC = () => {
  return (
    <div id="adam-security" className="w-full h-full flex flex-col items-center justify-center p-8 md:p-16 bg-transparent">
        <div className="text-center w-full max-w-7xl mx-auto mb-12 animate-fade-in-down">
            <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase">
                Security by <span className="text-adam-blue" style={{textShadow: '0 0 15px var(--adam-glow)'}}>Design</span>
            </h2>
            <p className="mt-4 text-gray-400 font-light max-w-2xl mx-auto">
                A system engineered with explicit mitigations for known governance attack vectors.
            </p>
        </div>

        <div className="max-w-5xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SecurityCard 
                    title="Oracle & RWA Integrity"
                    description="Secured via multi-sig oracle sets, slashable operator stake, and a bonded dispute game to challenge fraudulent data."
                    delay={0.2}
                />
                <SecurityCard 
                    title="Collusion Resistance"
                    description="Achieved via MACI (Minimum Anti-Collusion Infrastructure) for private voting, making vote-buying and coercion ineffective."
                    delay={0.4}
                />
                 <SecurityCard 
                    title="Council Failsafes"
                    description="The Emergency Council is bytecode-limited to only pause() or cancel() actions. It cannot move funds and requires a dual-quorum of token and SBT holders."
                    delay={0.6}
                />
                 <SecurityCard 
                    title="Liveness & Spam Prevention"
                    description="Guaranteed via proposer bonds that slash on spam, strict proposal concurrency caps, and cooldown periods for identical topics."
                    delay={0.8}
                />
            </div>
            <ThreatSimulation />
        </div>
    </div>
  );
};

export default AdamSecurity;