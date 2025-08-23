import React from 'react';

const configData = {
  "weights": {
    "alpha_token": 0.5,
    "beta_identity": 0.2,
    "gamma": { "energy": 0.2, "carbon": 0.1 }
  },
  "caps": { "max_component_share": 0.6, "W_max": 10000 },
  "curves": {
    "stake_days": { "D0_days": 30, "cap_sd": 2.0 },
    "decay": { "T_decay_days": 90, "floor": 0.25 },
    "rwa_recency": { "energy_R_days": 60, "carbon_R_days": 90 }
  },
  "topics": {
    "TREASURY": { "quorum": 0.08, "supermajority": 0.60, "timelockDays": 7 },
    "PARAMS":   { "quorum": 0.06, "supermajority": 0.55, "timelockDays": 5 },
    "ENERGY":   { "quorum": 0.07, "supermajority": 0.58, "timelockDays": 7 },
  },
  "emergency": { "dualQuorum": { "tokenPct": 0.04, "sbtPct": 0.20 }, "actions": ["pause","cancel"] },
  "bonds": { "proposerFlat_PARAMS": "1000 ARCx" }
};

const syntaxHighlight = (json: object) => {
    let jsonString = JSON.stringify(json, null, 2);
    jsonString = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return jsonString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = 'code-variable'; // number
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'code-keyword'; // key
            } else {
                cls = 'code-string'; // string
            }
        } else if (/true|false/.test(match)) {
            cls = 'code-function'; // boolean
        } else if (/null/.test(match)) {
            cls = 'code-comment'; // null
        }
        return `<span class="${cls}">${match}</span>`;
    });
}

const AdamParameters: React.FC = () => {
    const highlightedJson = syntaxHighlight(configData);

  return (
    <div id="adam-parameters" className="w-full h-full flex items-center justify-center p-8 md:p-16 bg-transparent">
        <div className="max-w-4xl w-full flex flex-col items-center text-center">
            <div className="animate-fade-in-down">
                <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase leading-tight">
                    On-Chain <span className="text-adam-blue" style={{textShadow: '0 0 15px var(--adam-glow)'}}>Parameters</span>
                </h2>
                <p className="mt-6 text-adam-light-gray font-light max-w-3xl mx-auto text-lg leading-relaxed">
                    The entire governance system is defined by a set of on-chain constants. These parameters are transparent and can only be modified through a formal governance vote.
                </p>
            </div>
            <div className="mt-12 w-full glass-pane rounded-lg text-left shadow-inner-glow animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="p-4 border-b border-white/10 flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <p className="text-sm font-light tracking-widest uppercase text-gray-400 ml-auto">Governance.json</p>
                </div>
                <pre className="p-6 text-sm font-mono overflow-x-auto">
                    <code dangerouslySetInnerHTML={{ __html: highlightedJson }} />
                </pre>
            </div>
        </div>
    </div>
  );
};

export default AdamParameters;