import React from 'react';

const credentials = [
  {
    title: 'Core Contributor',
    description: 'Awarded to individuals who make significant and consistent code or design contributions to the ecosystem.',
    impact: 'High weight in technical parameter change proposals.',
    delay: 0.2,
  },
  {
    title: 'RWA Curator',
    description: 'Granted to trusted entities responsible for verifying and curating Real-World Asset (RWA) data sources.',
    impact: 'Exclusive voting rights on RWA-specific topics.',
    delay: 0.4,
  },
  {
    title: 'Oracle Operator',
    description: 'A role for node operators who provide reliable, decentralized data feeds for the RWA Registry.',
    impact: 'Boosted influence in oracle-related security proposals.',
    delay: 0.6,
  },
  {
    title: 'Delegate',
    description: 'Elected by the community to represent them in governance, increasing their voting power via delegation.',
    impact: 'Can propose and vote with aggregated voting power.',
    delay: 0.8,
  },
];

const CredentialCard: React.FC<typeof credentials[0]> = ({ title, description, impact, delay }) => (
    <div className="bg-adam-slate/50 backdrop-blur-sm p-6 panel-border h-full animate-fade-in-up" style={{ animationDelay: `${delay}s`}}>
        <h3 className="text-xl font-light text-gray-200 tracking-widest uppercase">{title}</h3>
        <p className="mt-4 text-adam-light-gray font-light text-sm leading-relaxed min-h-[80px]">{description}</p>
        <div className="mt-4 pt-4 border-t border-white/10 text-xs">
            <span className="text-gray-500 tracking-widest uppercase mr-2">Governance Impact:</span>
            <span className="text-sbt-teal font-light">{impact}</span>
        </div>
    </div>
);

const SbtCredentials: React.FC = () => {
  return (
    <div id="sbt-credentials" className="w-full h-full flex flex-col items-center justify-center p-8 md:p-16 bg-adam-black">
        <div className="text-center w-full max-w-7xl mx-auto mb-12 animate-fade-in-down">
            <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase">
                Verifiable <span className="text-sbt-teal">Credentials</span>
            </h2>
            <p className="mt-4 text-gray-400 font-light max-w-2xl mx-auto">
                A non-exhaustive list of roles that can be earned through contribution, granting specific rights and influence within the governance system.
            </p>
        </div>

        <div className="max-w-5xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {credentials.map(cred => <CredentialCard key={cred.title} {...cred} />)}
            </div>
        </div>
    </div>
  );
};

export default SbtCredentials;