import React, { useState, useMemo, useEffect } from 'react';

const GOVERNANCE_CONSTANTS = {
    weights: { alpha_token: 0.5, beta_identity: 0.2, gamma: { energy: 0.2, carbon: 0.1 } },
    caps: { max_component_share: 0.6, W_max: 10000 },
    curves: {
        stake_days: { D0_days: 30, cap_sd: 2.0 },
        decay: { T_decay_days: 90, floor: 0.25 },
        rwa_recency: { energy_R_days: 60, carbon_R_days: 90 }
    },
    sbt: { core: 500, rwa_curator: 350 },
    rwa: { energy_impact: 1000, carbon_impact: 800 }
};

const proposals = {
  TREASURY: {
    name: 'Treasury Grant',
    quorum: 8,
    description: 'Allocate funds from the treasury for a project or initiative.',
    layers: ["TOKEN", "SBT"]
  },
  PARAMS: {
    name: 'Parameter Change',
    quorum: 6,
    description: 'Update a protocol parameter, like a fee or a threshold.',
    layers: ["TOKEN", "SBT"]
  },
  ENERGY: {
    name: 'Energy RWA Topic',
    quorum: 7,
    description: 'Vote on a proposal related to the energy RWA category.',
    layers: ["TOKEN", "SBT", "RWA_ENERGY"]
  },
  CARBON: {
    name: 'Carbon RWA Topic',
    quorum: 7,
    description: 'Vote on a proposal related to the carbon RWA category.',
    layers: ["TOKEN", "SBT", "RWA_CARBON"]
  }
};

const calculateVotingPower = (state: any) => {
    const { D0_days, cap_sd } = GOVERNANCE_CONSTANTS.curves.stake_days;
    const { T_decay_days, floor } = GOVERNANCE_CONSTANTS.curves.decay;
    const { energy_R_days, carbon_R_days } = GOVERNANCE_CONSTANTS.curves.rwa_recency;
    
    // 1. Calculate f_token (Capital)
    const stake_days_weight = Math.min(1 + Math.log(1 + state.stakeDays / D0_days), cap_sd);
    const f_token = Math.sqrt(state.stakedArcx * stake_days_weight);

    // 2. Calculate f_id (Reputation)
    const activity_decay = Math.max(Math.exp(-state.lastContributionDays / T_decay_days), floor);
    let f_id = 0;
    if (state.sbt.core) f_id += GOVERNANCE_CONSTANTS.sbt.core * activity_decay;
    if (state.sbt.rwa) f_id += GOVERNANCE_CONSTANTS.sbt.rwa_curator * activity_decay;
    
    // 3. Calculate f_rwa,k (Impact)
    const recency_decay_energy = Math.exp(-state.proofRecency.energy / energy_R_days);
    const recency_decay_carbon = Math.exp(-state.proofRecency.carbon / carbon_R_days);
    let f_rwa_energy = state.rwa.energy ? GOVERNANCE_CONSTANTS.rwa.energy_impact * recency_decay_energy : 0;
    let f_rwa_carbon = state.rwa.carbon ? GOVERNANCE_CONSTANTS.rwa.carbon_impact * recency_decay_carbon : 0;
    
    // 4. Calculate raw weighted components based on proposal topic eligibility
    const tokenComponent = GOVERNANCE_CONSTANTS.weights.alpha_token * f_token;
    const idComponent = GOVERNANCE_CONSTANTS.weights.beta_identity * f_id;
    let rwaComponent = 0;
    if (state.proposal.layers.includes("RWA_ENERGY")) {
        rwaComponent += GOVERNANCE_CONSTANTS.weights.gamma.energy * f_rwa_energy;
    }
    if (state.proposal.layers.includes("RWA_CARBON")) {
        rwaComponent += GOVERNANCE_CONSTANTS.weights.gamma.carbon * f_rwa_carbon;
    }

    // 5. Apply component capping (anti-plutocracy)
    let totalRaw = tokenComponent + idComponent + rwaComponent;
    if (totalRaw === 0) return { totalPower: 0, breakdown: { token: 0, id: 0, rwa: 0 } };

    const { max_component_share } = GOVERNANCE_CONSTANTS.caps;
    const cappedToken = Math.min(tokenComponent, totalRaw * max_component_share);
    const cappedId = Math.min(idComponent, totalRaw * max_component_share);
    const cappedRwa = Math.min(rwaComponent, totalRaw * max_component_share);

    // 6. Final Voting Power is the sum of capped components
    const totalPower = cappedToken + cappedId + cappedRwa;
    const breakdown = {
        token: (cappedToken / totalPower) * 100 || 0,
        id: (cappedId / totalPower) * 100 || 0,
        rwa: (cappedRwa / totalPower) * 100 || 0,
    };
    return { totalPower, breakdown };
};

const AdamSandbox: React.FC = () => {
    const [stakedArcx, setStakedArcx] = useState(5000);
    const [stakeDays, setStakeDays] = useState(365);
    const [lastContributionDays, setLastContributionDays] = useState(10);
    const [sbt, setSbt] = useState({ core: true, rwa: false });
    const [rwa, setRwa] = useState({ energy: true, carbon: false });
    const [proofRecency, setProofRecency] = useState({ energy: 5, carbon: 30 });
    const [selectedProposalKey, setSelectedProposalKey] = useState('TREASURY');
    const selectedProposal = proposals[selectedProposalKey as keyof typeof proposals];

    const { totalPower, breakdown } = useMemo(
        () => calculateVotingPower({ stakedArcx, stakeDays, lastContributionDays, sbt, rwa, proofRecency, proposal: selectedProposal }),
        [stakedArcx, stakeDays, lastContributionDays, sbt, rwa, proofRecency, selectedProposal]
    );

    const isRwaEnergyEligible = selectedProposal.layers.includes('RWA_ENERGY');
    const isRwaCarbonEligible = selectedProposal.layers.includes('RWA_CARBON');

  return (
    <div id="adam-sandbox" className="w-full h-full flex flex-col items-center justify-center p-8 bg-transparent overflow-hidden">
        <div className="text-center w-full max-w-7xl mx-auto mb-10 animate-fade-in-down">
            <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase">
                Governance <span className="text-adam-blue" style={{textShadow: '0 0 15px var(--adam-glow)'}}>Sandbox</span>
            </h2>
            <p className="mt-4 text-adam-light-gray font-light max-w-xl mx-auto">
                Simulate your influence. Adjust your profile to see how the canonical weighting formula calculates your voting power.
            </p>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 glass-pane p-8 rounded-lg">
            {/* Left Column: User Profile */}
            <div className="animate-fade-in-left space-y-4">
                <h3 className="text-2xl font-light tracking-[0.2em] uppercase text-gray-300 border-b border-white/10 pb-3">Your Profile</h3>
                <div>
                    <div className="flex justify-between items-baseline"><label className="text-sm tracking-wider text-gray-400">ARCx Staked</label><span className="font-mono text-adam-blue">{stakedArcx.toLocaleString()} ARCx</span></div>
                    <input type="range" min="100" max="100000" step="100" value={stakedArcx} onChange={(e) => setStakedArcx(Number(e.target.value))} className="mt-2 w-full" />
                </div>
                <div>
                    <div className="flex justify-between items-baseline"><label className="text-sm tracking-wider text-gray-400">Stake Duration</label><span className="font-mono text-adam-blue">{stakeDays} Days</span></div>
                    <input type="range" min="1" max="1095" step="1" value={stakeDays} onChange={(e) => setStakeDays(Number(e.target.value))} className="mt-2 w-full" />
                </div>
                <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-baseline"><label className="text-sm tracking-wider text-gray-400">Last Contribution</label><span className="font-mono text-adam-blue">{lastContributionDays} Days Ago</span></div>
                    <input type="range" min="0" max="365" step="1" value={lastContributionDays} onChange={(e) => setLastContributionDays(Number(e.target.value))} className="mt-2 w-full" />
                </div>
                <div>
                    <label className="text-sm tracking-wider text-gray-400">Identity SBTs</label>
                    <div className="mt-2 space-y-2"><label className="flex items-center text-sm font-light text-gray-300"><input type="checkbox" checked={sbt.core} onChange={(e) => setSbt({...sbt, core: e.target.checked})} className="mr-3 h-4 w-4 bg-transparent border-gray-600 text-adam-blue focus:ring-adam-blue rounded-sm" />Core Contributor</label><label className="flex items-center text-sm font-light text-gray-300"><input type="checkbox" checked={sbt.rwa} onChange={(e) => setSbt({...sbt, rwa: e.target.checked})} className="mr-3 h-4 w-4 bg-transparent border-gray-600 text-adam-blue focus:ring-adam-blue rounded-sm" />RWA Curator</label></div>
                </div>
                <div className="border-t border-white/10 pt-4">
                    <label className="text-sm tracking-wider text-gray-400">RWA Proofs</label>
                    <div className={`mt-2 space-y-2 transition-opacity ${isRwaEnergyEligible ? 'opacity-100' : 'opacity-40'}`}>
                        <label className="flex items-center text-sm font-light text-gray-300"><input type="checkbox" checked={rwa.energy} onChange={(e) => setRwa({...rwa, energy: e.target.checked})} disabled={!isRwaEnergyEligible} className="mr-3 h-4 w-4 bg-transparent border-gray-600 text-adam-blue focus:ring-adam-blue disabled:opacity-50 rounded-sm" />Energy Proof</label>
                        <div className={`pl-7 ${!isRwaEnergyEligible && 'hidden'}`}>
                            <div className="flex justify-between items-baseline text-xs"><label className="tracking-wider text-gray-500">Proof Recency</label><span className="font-mono text-adam-blue/70">{proofRecency.energy} Days Old</span></div>
                            <input type="range" min="0" max="180" step="1" value={proofRecency.energy} onChange={(e) => setProofRecency({...proofRecency, energy: Number(e.target.value)})} className="mt-1 w-full" />
                        </div>
                    </div>
                     <div className={`mt-2 space-y-2 transition-opacity ${isRwaCarbonEligible ? 'opacity-100' : 'opacity-40'}`}>
                        <label className="flex items-center text-sm font-light text-gray-300"><input type="checkbox" checked={rwa.carbon} onChange={(e) => setRwa({...rwa, carbon: e.target.checked})} disabled={!isRwaCarbonEligible} className="mr-3 h-4 w-4 bg-transparent border-gray-600 text-adam-blue focus:ring-adam-blue disabled:opacity-50 rounded-sm" />Carbon Proof</label>
                         <div className={`pl-7 ${!isRwaCarbonEligible && 'hidden'}`}>
                            <div className="flex justify-between items-baseline text-xs"><label className="tracking-wider text-gray-500">Proof Recency</label><span className="font-mono text-adam-blue/70">{proofRecency.carbon} Days Old</span></div>
                            <input type="range" min="0" max="180" step="1" value={proofRecency.carbon} onChange={(e) => setProofRecency({...proofRecency, carbon: Number(e.target.value)})} className="mt-1 w-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Proposal & Results */}
            <div className="bg-black/30 p-6 rounded-lg panel-border flex flex-col justify-between animate-fade-in-right shadow-inner-glow">
                <div>
                     <h3 className="text-2xl font-light tracking-[0.2em] uppercase text-gray-300 border-b border-white/10 pb-3">Proposal Simulation</h3>
                     <div className="mt-4">
                        <label className="text-xs tracking-widest text-gray-500 uppercase">Select Proposal Topic</label>
                        <select value={selectedProposalKey} onChange={(e) => setSelectedProposalKey(e.target.value)} className="w-full mt-1 bg-adam-slate panel-border rounded-md p-2 text-sm focus:ring-adam-blue focus:border-adam-blue appearance-none">
                            {Object.entries(proposals).map(([key, prop]) => <option key={key} value={key}>{prop.name}</option>)}
                        </select>
                     </div>
                     <div className="mt-4 bg-black/30 p-4 rounded-md">
                        <p className="text-sm text-gray-300">{selectedProposal.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Eligible Layers: <span className="font-mono text-adam-blue">{selectedProposal.layers.join(', ')}</span></p>
                     </div>
                </div>
                 <div className="mt-6 border-t-2 border-adam-blue/30 pt-4">
                    <p className="text-sm tracking-widest text-gray-400 uppercase text-center">Calculated Voting Power (W)</p>
                    <p className="text-4xl lg:text-5xl font-mono text-adam-blue my-2 text-center animate-pulse-bright">{totalPower.toFixed(2)}</p>
                    <div className="space-y-2 mt-4">
                        <div className="w-full h-4 bg-black/30 rounded-full overflow-hidden flex"><div className="h-full bg-adam-blue" style={{ width: `${breakdown.token}%` }}></div><div className="h-full bg-adam-blue-dark" style={{ width: `${breakdown.id}%` }}></div><div className="h-full bg-adam-medium-gray" style={{ width: `${breakdown.rwa}%`}}></div></div>
                        <div className="flex justify-between text-xs font-light"><span className="flex items-center"><span className="w-2 h-2 rounded-full bg-adam-blue mr-2"></span>Capital: {breakdown.token.toFixed(1)}%</span><span className="flex items-center"><span className="w-2 h-2 rounded-full bg-adam-blue-dark mr-2"></span>Reputation: {breakdown.id.toFixed(1)}%</span><span className="flex items-center"><span className="w-2 h-2 rounded-full bg-adam-medium-gray mr-2"></span>Impact: {breakdown.rwa.toFixed(1)}%</span></div>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default AdamSandbox;