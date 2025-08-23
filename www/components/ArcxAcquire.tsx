import React, { useState } from 'react';

const ArcxAcquire: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const contractAddress = '0xA4093669DAFbD123E37d52e0939b3aB3C2272f44';
    const buyLink = "https://app.uniswap.org/explore/tokens/base/0xA4093669DAFbD123E37d52e0939b3aB3C2272f44";

    const handleCopy = () => {
        navigator.clipboard.writeText(contractAddress).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

  return (
    <div id="arcx-acquire" className="w-full h-full flex items-center justify-center p-8 md:p-16 bg-adam-black">
        <div className="max-w-2xl w-full flex flex-col items-center text-center">
            <div className="animate-fade-in-down">
                <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase leading-tight">
                    Acquire <span className="text-arcx-orange">ARCx</span>
                </h2>
                <p className="mt-6 text-adam-light-gray font-light max-w-3xl mx-auto text-lg leading-relaxed">
                   Join the ecosystem by acquiring ARCx, the native asset for governance and utility.
                </p>
            </div>
            <div className="mt-12 w-full animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                 <a href={buyLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-arcx-orange/80 hover:bg-arcx-orange text-white font-semibold py-4 px-12 rounded-sm text-md transition-all duration-300 tracking-widest uppercase hover:shadow-glow-orange">
                    Buy on Uniswap
                </a>
            </div>
            <div className="mt-8 w-full max-w-md animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                <p className="text-xs text-gray-500 tracking-widest mb-2">CONTRACT ADDRESS</p>
                <div className="bg-adam-dark/50 p-3 panel-border rounded-sm flex items-center justify-between">
                    <p className="font-mono text-sm text-gray-300 truncate mr-4">{contractAddress}</p>
                    <button onClick={handleCopy} className="text-xs text-arcx-orange border border-arcx-orange/50 px-4 py-2 rounded-sm hover:bg-arcx-orange/10 transition-all w-24 flex-shrink-0">
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ArcxAcquire;