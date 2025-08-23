import React, { useState } from 'react';

const flowSteps = [
  {
    id: 'submission',
    title: '1. Submission',
    icon: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6h.008a2.25 2.25 0 0 1 2.242 2.15 2.25 2.25 0 0 0-.1.664M6.75 18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0 1 1.123-.08" />
      </svg>
    ),
    description: 'A proposal is posted with a slashable bond to deter spam and enters the "Submitted" state.',
  },
  {
    id: 'review',
    title: '2. Review',
    icon: (props: any) => (
       <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
    description: 'An off-chain deliberation period for community review of the proposal\'s validity, security, and alignment.',
  },
  {
    id: 'voting',
    title: '3. Voting',
    icon: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    description: 'Eligible voters cast private ballots using MACI. The proposal must meet both quorum and supermajority thresholds.',
  },
  {
    id: 'timelock',
    title: '4. Timelock',
    icon: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    description: 'A passed proposal is queued in a timelock contract, creating a mandatory delay before execution.',
  },
   {
    id: 'challenge',
    title: '5. Challenge Window',
    icon: (props: any) => (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    ),
    description: 'During the timelock, the Emergency Council can veto the proposal if a critical flaw is discovered.',
  },
  {
    id: 'execution',
    title: '6. Execution',
    icon: (props: any) => (
       <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
    description: 'After all checks pass, the proposal is executed autonomously by the Executor, enacting the on-chain change.',
  },
];


const AdamLifecycle: React.FC = () => {
    const [activeStep, setActiveStep] = useState(flowSteps[0]);

  return (
    <div id="adam-lifecycle" className="w-full h-full flex flex-col items-center justify-center p-8 bg-transparent overflow-hidden">
        <div className="text-center w-full max-w-7xl mx-auto mb-10 animate-fade-in-down">
            <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase">
                Proposal <span className="text-adam-blue" style={{textShadow: '0 0 15px var(--adam-glow)'}}>Lifecycle</span>
            </h2>
            <p className="mt-4 text-adam-light-gray font-light max-w-xl mx-auto">
                A proposal's journey from idea to on-chain execution, secured by checks and balances.
            </p>
        </div>

        <div className="w-full max-w-5xl flex-grow flex flex-col md:flex-row items-center justify-center gap-12">
            {/* Stepper Navigation */}
            <div className="flex md:flex-col justify-center items-center space-x-4 md:space-x-0 md:space-y-2 relative">
                 <div className="absolute top-1/2 left-0 md:top-0 md:left-1/2 w-full md:w-[1px] h-[1px] md:h-full bg-white/10 -translate-y-1/2 md:-translate-x-1/2"></div>
                {flowSteps.map((step, index) => (
                    <div key={step.id} className="relative z-10">
                        <button 
                            onClick={() => setActiveStep(step)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300
                            ${activeStep.id === step.id 
                                ? 'bg-adam-blue border-adam-blue shadow-blue-hard scale-110' 
                                : 'bg-adam-slate border-white/20 hover:border-adam-blue/50'}`}
                            aria-label={`Go to step ${index + 1}: ${step.title}`}
                            >
                            <step.icon className={`w-6 h-6 ${activeStep.id === step.id ? 'text-black' : 'text-gray-400'}`} />
                        </button>
                    </div>
                ))}
            </div>
            
            {/* Main Content Display */}
            <div className="w-full h-[400px] glass-pane rounded-lg p-8 flex flex-col justify-center animate-flow-step-grow relative shadow-inner-glow">
                 <div key={activeStep.id} className="animate-fade-in">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-black/20 rounded-md">
                            <activeStep.icon className="w-10 h-10 text-adam-blue" />
                        </div>
                        <h3 className="text-3xl font-light tracking-[0.2em] uppercase text-gray-200">{activeStep.title}</h3>
                    </div>
                    <p className="mt-6 text-adam-light-gray font-light leading-relaxed max-w-xl">{activeStep.description}</p>
                 </div>
            </div>

        </div>
    </div>
  );
};

export default AdamLifecycle;