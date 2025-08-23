import React from 'react';

const StakingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-arcx-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.5a2.5 2.5 0 0 1 5 0V12a2.5 2.5 0 0 1-5 0V9.5Z" />
    </svg>
);
const UtilityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-arcx-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 5.25-2.25 2.25m0 0-2.25 2.25m2.25-2.25 2.25 2.25m-2.25-2.25-2.25-2.25m-2.25 2.25-2.25-2.25m2.25 2.25 2.25-2.25m-2.25 2.25-2.25 2.25m2.25-2.25-2.25-2.25m9 5.25-2.25 2.25m0 0-2.25 2.25m2.25-2.25 2.25 2.25m-2.25-2.25-2.25-2.25m-2.25 2.25-2.25-2.25m2.25 2.25 2.25-2.25m2.25-2.25-2.25 2.25m-2.25-2.25-2.25-2.25" />
    </svg>
);
const GovernanceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-arcx-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75v16.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m17.663 6.337-11.326 11.326" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m6.337 6.337 11.326 11.326" />
    </svg>
);

const TriadCard: React.FC<{ icon: React.ReactNode; title: string; description: string; delay: number }> = ({ icon, title, description, delay }) => {
    return (
        <div 
            className="bg-adam-slate/50 backdrop-blur-sm p-6 panel-border group transition-all duration-300 animate-fade-in-up relative overflow-hidden hover:bg-adam-slate"
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="flex items-center space-x-4">
                {icon}
                <h3 className="text-xl font-light text-gray-200 tracking-widest uppercase">{title}</h3>
            </div>
            <p className="mt-4 text-adam-light-gray font-light text-sm leading-relaxed min-h-[84px]">{description}</p>
        </div>
    );
};

const ArcxCore: React.FC = () => {
  return (
    <div id="arcx-core" className="w-full h-full flex items-center justify-center p-8 md:p-16 bg-adam-black">
      <div className="max-w-7xl w-full flex flex-col items-center text-center">
        <div className="animate-fade-in-down">
          <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase leading-tight">
            Core <span className="text-arcx-orange">Concepts</span>
          </h2>
          <p className="mt-6 text-adam-light-gray font-light max-w-3xl mx-auto text-lg leading-relaxed">
            ARCx is designed as a multi-faceted tool to secure the ecosystem, incentivize participation, and drive collective decision-making.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full relative">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-adam-medium-gray to-transparent -translate-y-1/2 hidden md:block"></div>
            <div className="absolute left-1/3 top-1/2 w-[33%] h-[1px] bg-arcx-orange hidden md:block" style={{transform: 'translateY(-50%)'}}></div>
             <TriadCard 
                icon={<StakingIcon />}
                title="Staking" 
                description="Lock ARCx to receive sARCx (staked ARCx), a liquid token that grants governance power and access to ecosystem yield."
                delay={0.2}
            />
             <TriadCard
                icon={<UtilityIcon />}
                title="Utility" 
                description="ARCx serves as the primary token for bonding in governance proposals, slashing, and dispute resolution mechanisms."
                delay={0.4}
            />
             <TriadCard
                icon={<GovernanceIcon />}
                title="Governance" 
                description="Staked ARCx forms the capital-weighted layer of the ADAM Protocol's governance, ensuring economically-aligned decision making."
                delay={0.6}
            />
        </div>
      </div>
    </div>
  );
};

export default ArcxCore;