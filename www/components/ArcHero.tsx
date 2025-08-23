import React, { useState, useEffect } from 'react';
import NoiseBackground from './NoiseBackground';

interface ArcHeroProps {
    onEnterAdam: () => void;
    onEnterArcx: () => void;
    onEnterSbt: () => void;
}

const CapitalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v.01M12 18v-2m0-10V5m0 7h.01M7 12h.01M17 12h.01M7 12a5 5 0 015-5m5 5a5 5 0 00-5-5m0 10a5 5 0 005-5m-5 5a5 5 0 01-5-5" />
    </svg>
);

const ReputationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const GovernanceIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-2m0-14v2m8.9-3.3-1.4 1.4M4.5 17.9l1.4-1.4M21.6 12h-2M4.4 12H2.4m15.5-6.1-1.4-1.4M6.9 6.1 5.5 4.7M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
    </svg>
);

interface PillarCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick?: () => void;
    themeClasses: {
        iconColor: string;
        hoverBorderColor: string;
        hoverShadow: string;
    };
}

const PillarCard: React.FC<PillarCardProps> = ({ title, description, icon, onClick, themeClasses }) => (
    <div 
        onClick={onClick}
        className={`relative w-full h-full bg-black/30 backdrop-blur-lg p-6 panel-border group transition-all duration-500 hover:bg-black/50 ${onClick ? `cursor-pointer ${themeClasses.hoverShadow} hover:!scale-105` : 'cursor-default'}`}
    >
        <div className="flex items-center space-x-4 mb-4">
            <div className={`transition-colors duration-300 ${themeClasses.iconColor}`}>{icon}</div>
            <h3 className="text-xl font-light text-gray-200 tracking-widest uppercase">{title}</h3>
        </div>
        <p className="text-sm font-light text-gray-400 leading-relaxed">{description}</p>
        <div className={`absolute -inset-px rounded-sm border-2 border-transparent ${themeClasses.hoverBorderColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
    </div>
);


const ArcHero: React.FC<ArcHeroProps> = ({ onEnterAdam, onEnterArcx, onEnterSbt }) => {
    const [transformStyle, setTransformStyle] = useState({});
    const title = "THE ARC";

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY, currentTarget } = e;
            if (!currentTarget) return;
            const { clientWidth, clientHeight } = currentTarget as HTMLElement;
            
            const xRotation = 15 * ((clientY - clientHeight / 2) / clientHeight);
            const yRotation = -15 * ((clientX - clientWidth / 2) / clientWidth);
            
            setTransformStyle({
                transform: `perspective(1200px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`,
                transition: 'transform 0.1s ease-out'
            });
        };

        const container = document.getElementById('arc-hero-container');
        container?.addEventListener('mousemove', handleMouseMove);

        return () => {
            container?.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div id="arc-hero-container" className="w-full h-screen flex flex-col items-center justify-center text-center p-4 md:p-8 relative overflow-hidden">
            <NoiseBackground />

            <div style={transformStyle} className="relative z-10 flex flex-col items-center w-full max-w-7xl">
                <h1 className="text-6xl md:text-9xl font-thin text-gray-200 tracking-[0.3em] uppercase">
                     {title.split('').map((char, index) => (
                        <span key={index} className="animate-glow-in opacity-0" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </h1>
                <p className="text-md md:text-xl text-gray-400 mt-6 max-w-3xl mx-auto font-light animate-fade-in-up opacity-0 tracking-wider" style={{animationDelay: '1.2s'}}>
                    A foundational ecosystem for constitutional intelligence, unifying capital, identity, and impact.
                </p>

                <div className="relative w-full flex flex-col md:flex-row items-stretch justify-center gap-6 lg:gap-8 mt-16 min-h-[20rem]" style={{ transformStyle: 'preserve-3d' }}>
                     {/* ARCx - Left Pillar */}
                     <div className="w-full md:w-1/3 animate-fade-in-up opacity-0" style={{ animationDelay: '1.5s', transform: 'md:rotateY(20deg) md:scale(0.95)'}}>
                         <PillarCard 
                            title="ARCx"
                            description="The economic layer. Powers governance and aligns incentives through staking and capital commitment."
                            icon={<CapitalIcon />}
                            onClick={onEnterArcx}
                            themeClasses={{ iconColor: 'text-arcx-orange', hoverBorderColor: 'group-hover:border-arcx-orange', hoverShadow: 'group-hover:!shadow-glow-orange' }}
                        />
                     </div>
                     
                     {/* ADAM Protocol - Center Pillar */}
                     <div className="w-full md:w-1/3 order-first md:order-none z-10 animate-fade-in-up opacity-0" style={{ animationDelay: '1.3s', transform: 'md:scale(1.05) md:translateZ(40px)'}}>
                        <PillarCard 
                            title="ADAM Protocol"
                            description="The governance layer. The on-chain constitutional framework that orchestrates the entire system."
                            icon={<GovernanceIcon />}
                            onClick={onEnterAdam}
                            themeClasses={{ iconColor: 'text-adam-blue', hoverBorderColor: 'group-hover:border-adam-blue', hoverShadow: 'group-hover:!shadow-glow-blue' }}
                        />
                     </div>

                     {/* Identity (SBT) - Right Pillar */}
                      <div className="w-full md:w-1/3 animate-fade-in-up opacity-0" style={{ animationDelay: '1.7s', transform: 'md:rotateY(-20deg) md:scale(0.95)'}}>
                         <PillarCard 
                            title="Soulbound NF/TT"
                            description="The reputation layer. Soulbound NF/TTs represent contribution, expertise, and merit."
                            icon={<ReputationIcon />}
                            onClick={onEnterSbt}
                            themeClasses={{ iconColor: 'text-sbt-teal', hoverBorderColor: 'group-hover:border-sbt-teal', hoverShadow: 'group-hover:!shadow-glow-teal' }}
                        />
                     </div>
                </div>
            </div>
        </div>
    );
};

export default ArcHero;