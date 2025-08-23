import React from 'react';

const PersistenceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sbt-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);
const VerifiabilityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sbt-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);
const ComposabilityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sbt-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
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

const SbtCore: React.FC = () => {
  return (
    <div id="sbt-core" className="w-full h-full flex items-center justify-center p-8 md:p-16 bg-adam-black">
      <div className="max-w-7xl w-full flex flex-col items-center text-center">
        <div className="animate-fade-in-down">
          <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase leading-tight">
            Core <span className="text-sbt-teal">Principles</span>
          </h2>
          <p className="mt-6 text-adam-light-gray font-light max-w-3xl mx-auto text-lg leading-relaxed">
            Soulbound Identity is built on a foundation of cryptographic principles that ensure a robust and trustworthy reputation system.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full relative">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-adam-medium-gray to-transparent -translate-y-1/2 hidden md:block"></div>
            <div className="absolute left-1/3 top-1/2 w-[33%] h-[1px] bg-sbt-teal hidden md:block" style={{transform: 'translateY(-50%)'}}></div>
             <TriadCard 
                icon={<PersistenceIcon />}
                title="Persistence" 
                description="Credentials are non-transferable (soulbound) and permanently recorded on-chain, creating an immutable history of contributions."
                delay={0.2}
            />
             <TriadCard
                icon={<VerifiabilityIcon />}
                title="Verifiability" 
                description="Each credential is cryptographically signed and issued by a verified authority (e.g., the ADAM governor), ensuring authenticity."
                delay={0.4}
            />
             <TriadCard
                icon={<ComposabilityIcon />}
                title="Composability" 
                description="The identity system is modular. New roles and credentials can be added via governance, allowing reputation to evolve with the ecosystem."
                delay={0.6}
            />
        </div>
      </div>
    </div>
  );
};

export default SbtCore;