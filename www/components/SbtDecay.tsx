import React from 'react';

const SbtDecay: React.FC = () => {
  return (
    <div id="sbt-decay" className="w-full h-full flex flex-col items-center justify-center p-8 md:p-16 bg-adam-dark overflow-hidden">
        <div className="text-center w-full max-w-7xl mx-auto mb-12 animate-fade-in-down">
            <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase">
                Time <span className="text-sbt-teal">Decay</span>
            </h2>
            <p className="mt-4 text-gray-400 font-light max-w-2xl mx-auto">
                To ensure the governance system values recent and relevant contributions, the influence of all credentials decays over time, encouraging sustained participation.
            </p>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Chart */}
            <div className="w-full h-64 bg-black/20 panel-border p-4 rounded-sm animate-fade-in-left">
                <svg width="100%" height="100%" viewBox="0 0 300 150">
                    <defs>
                        <linearGradient id="decay-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                        </linearGradient>
                        <style>{`
                            .decay-path {
                                stroke-dasharray: 400;
                                stroke-dashoffset: 400;
                                animation: path-draw 2s ease-out 0.5s forwards;
                            }
                            .decay-fill {
                                opacity: 0;
                                animation: fade-in 1s ease-out 1.5s forwards;
                            }
                        `}</style>
                    </defs>
                    
                    {/* Axis */}
                    <line x1="20" y1="130" x2="280" y2="130" stroke="#4a4a4a" strokeWidth="0.5" />
                    <line x1="20" y1="20" x2="20" y2="130" stroke="#4a4a4a" strokeWidth="0.5" />
                    <text x="150" y="145" textAnchor="middle" fill="#888" className="text-[8px]">Time (Days)</text>
                    <text x="10" y="80" transform="rotate(-90 10 80)" textAnchor="middle" fill="#888" className="text-[8px]">Influence</text>
                    <text x="20" y="140" textAnchor="middle" fill="#888" className="text-[7px]">0</text>
                    <text x="280" y="140" textAnchor="middle" fill="#888" className="text-[7px]">365</text>
                    <text x="15" y="25" textAnchor="end" fill="#888" className="text-[7px]">100%</text>

                    {/* Decay Curve */}
                    <path d="M 20 20 Q 150 20, 280 120" stroke="#14b8a6" strokeWidth="1.5" fill="none" className="decay-path" />
                    <path d="M 20 20 Q 150 20, 280 120 L 280 130 L 20 130 Z" fill="url(#decay-grad)" className="decay-fill" />

                    {/* Floor line */}
                    <line x1="20" y1="105" x2="280" y2="105" stroke="#4a4a4a" strokeWidth="0.5" strokeDasharray="2 2" />
                    <text x="285" y="107" textAnchor="start" fill="#888" className="text-[7px]">25% Floor</text>
                </svg>
            </div>

            {/* Explanation */}
            <div className="text-gray-300 animate-fade-in-right">
                <h3 className="text-xl font-light tracking-widest uppercase text-gray-200">Decay Formula</h3>
                <p className="font-mono text-sm text-sbt-teal mt-2 bg-black/30 p-3 rounded-sm">Weight(t) = max(e^(-t / T_decay), floor)</p>
                <ul className="mt-4 space-y-3 text-sm font-light text-adam-light-gray">
                    <li><strong className="text-gray-300">T_decay:</strong> The decay half-life, set by governance (e.g., 90 days).</li>
                    <li><strong className="text-gray-300">floor:</strong> A minimum influence level (e.g., 25%) ensuring long-term contributors retain a voice.</li>
                </ul>
            </div>
        </div>
    </div>
  );
};

export default SbtDecay;