import React, { useState } from 'react';

const modules = {
  governor: {
    id: 'governor', cx: 350, cy: 70, title: 'Governor',
    icon: (p: any) => <path {...p} d="M12 21v-2m0-14v2m8.9-3.3-1.4 1.4M4.5 17.9l1.4-1.4M21.6 12h-2M4.4 12H2.4m15.5-6.1-1.4-1.4M6.9 6.1 5.5 4.7M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />,
    description: 'Core decision-making contract managing proposals. Integrates MACI for collusion-resistant, private vote tallying.',
    code: `function propose(
  address[] targets,
  bytes[] calldata
) public returns (uint256) {
  // ...creates proposal
}`
  },
  eligibility: {
    id: 'eligibility', cx: 150, cy: 200, title: 'Eligibility',
    icon: (p: any) => <path {...p} d="M15.75 5.25a3 3 0 0 1 3 3m3 0a8.25 8.25 0 0 1-8.25 8.25H9a8.25 8.25 0 0 1-8.25-8.25A3 3 0 0 1 3.75 9m12 0c0-1.657-1.343-3-3-3s-3 1.343-3 3m0 0a3 3 0 0 0-3 3" />,
    description: 'Deterministic on-chain module verifying voter criteria (e.g., SBTs, RWA proofs) for specific proposal topics.',
    code: `function canVote(
  uint256 proposalId,
  address voter
) external view returns (bool, ...) {
  // ...returns eligibility & weights
}`
  },
  sbt: {
    id: 'sbt', cx: 350, cy: 200, title: 'Identity SBT',
    icon: (p: any) => <path {...p} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Z" />,
    description: 'Manages soulbound contributor credentials, providing the reputation component (f_id) based on roles and on-chain activity.',
    code: `function setRoleWeight(
  bytes32 role,
  uint256 weight
) external {
  // ...updates identity weight
}`
  },
  rwa: {
    id: 'rwa', cx: 550, cy: 200, title: 'RWA Registry',
    icon: (p: any) => <path {...p} d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c-4.805 0-8.716-3.91-8.716-8.716C3.284 7.91 7.195 4 12 4c4.805 0 8.716 3.91 8.716 8.716 0 4.806-3.91 8.716-8.716 8.716Zm0-9.45a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />,
    description: 'Manages RWA schemas and oracle sets, providing impact scores (f_rwa) for verified real-world contributions.',
    code: `function impactOf(
  address voter,
  uint256 topicId
) external view returns (uint256) {
  // ...returns attested impact
}`
  },
  timelock: {
    id: 'timelock', cx: 350, cy: 330, title: 'Timelock',
    icon: (p: any) => <path {...p} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
    description: 'Mandatory delay controller for passed proposals, featuring per-topic delays and a challenge window for final security review.',
    code: `function queue(
  address target,
  bytes calldata
) public {
  // ...waits for minDelay
}`
  },
  executor: {
    id: 'executor', cx: 600, cy: 330, title: 'Executor',
    icon: (p: any) => <path {...p} d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />,
    description: 'A Gnosis Safe-based execution layer that autonomously calls target contracts to enact approved on-chain changes.',
    code: `function execute(
  address target,
  bytes calldata
) public payable {
  // ...calls target contract
}`
  },
};

const connections = [
    { from: modules.eligibility, to: modules.governor, delay: 0.2 },
    { from: modules.sbt, to: modules.governor, delay: 0.3 },
    { from: modules.rwa, to: modules.governor, delay: 0.4 },
    { from: modules.governor, to: modules.timelock, delay: 0.5 },
    { from: modules.timelock, to: modules.executor, delay: 0.6 },
];

const InfoPanel: React.FC<{module: typeof modules[keyof typeof modules] | null}> = ({ module }) => {
    if (!module) {
        return <div className="w-full h-[450px]"></div>;
    }
    
    return (
        <div key={module.id} className="w-full h-[450px] glass-pane rounded-lg p-6 flex flex-col shadow-2xl animate-fade-in overflow-y-auto">
            <div className="flex items-center gap-4">
                <div className="text-adam-blue p-2 bg-black/20 rounded-md flex-shrink-0">
                    {module.icon({stroke:"currentColor", strokeWidth: 0.5, fill: "none", className: "w-8 h-8"})}
                </div>
                <h3 className="text-2xl font-light text-gray-200 tracking-widest uppercase">{module.title}</h3>
            </div>
            <p className="mt-4 text-sm text-adam-light-gray font-light leading-relaxed">{module.description}</p>
            <div className="mt-6">
                <h4 className="text-sm font-light tracking-[0.2em] uppercase text-gray-500 border-b border-white/10 pb-2">Code Edge</h4>
                <pre className="mt-3 bg-black/30 p-4 rounded-md text-xs font-mono overflow-x-auto shadow-inner-glow">
                    <code>{module.code.trim()}</code>
                </pre>
            </div>
        </div>
    )
}

const AdamArchitecture: React.FC = () => {
    const [activeModule, setActiveModule] = useState<any>(modules.governor);

  return (
    <div id="adam-architecture" className="w-full h-full flex flex-col items-center justify-center p-8 md:p-16 bg-transparent overflow-hidden">
       <div className="text-center w-full max-w-7xl mx-auto mb-8 animate-fade-in-down">
            <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase">
                System <span className="text-adam-blue" style={{textShadow: '0 0 15px var(--adam-glow)'}}>Architecture</span>
            </h2>
            <p className="mt-4 text-adam-light-gray font-light max-w-2xl mx-auto">
                An interactive blueprint of the on-chain modules that power ADAM Protocol governance.
            </p>
        </div>

      <div className="w-full max-w-7xl flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Left 2/3 for SVG */}
        <div className="w-full h-[450px] lg:col-span-2 relative">
            <svg width="100%" height="100%" viewBox="0 0 700 400">
                <defs>
                    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="var(--adam-primary)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="var(--adam-primary)" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glow-filter">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {connections.map(({ from, to, delay }, i) => (
                    <path
                        key={i}
                        d={`M${from.cx},${from.cy} C${from.cx},${(from.cy + to.cy) / 2} ${to.cx},${(from.cy + to.cy) / 2} ${to.cx},${to.cy}`}
                        stroke="var(--adam-primary)" strokeWidth="0.5" strokeOpacity="0.5" fill="none"
                        className="animate-path-draw"
                        style={{ strokeDasharray: 300, strokeDashoffset: 300, animationDelay: `${delay}s` }}
                    />
                ))}
                {Object.values(modules).map(module => (
                    <g key={module.id} className="cursor-pointer group" onMouseEnter={() => setActiveModule(module)}>
                        {activeModule?.id === module.id && <circle cx={module.cx} cy={module.cy} r="50" fill="url(#glow)" />}
                        <circle cx={module.cx} cy={module.cy} r="30" fill="#000" 
                            stroke={activeModule?.id === module.id ? "var(--adam-primary)" : "rgba(255,255,255,0.2)"}
                            strokeWidth="1" className="transition-all duration-300 group-hover:stroke-adam-blue group-hover:scale-110"
                            filter={activeModule?.id === module.id ? "url(#glow-filter)" : "none"}
                        />
                        <g transform={`translate(${module.cx-12}, ${module.cy-12})`} 
                           className={`transition-colors duration-300 ${activeModule?.id === module.id ? 'text-adam-blue' : 'text-gray-500'} group-hover:text-adam-blue`}>
                            {module.icon({stroke:"currentColor", strokeWidth: 0.5, fill: "none", className: "w-6 h-6"})}
                        </g>
                    </g>
                ))}
            </svg>
        </div>
        
        {/* Right 1/3 for Info Panel */}
        <div className="w-full">
            <InfoPanel module={activeModule} />
        </div>
      </div>
    </div>
  );
};

export default AdamArchitecture;