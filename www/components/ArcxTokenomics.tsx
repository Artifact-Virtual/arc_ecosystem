import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TokenomicsData } from '../types';

const data: TokenomicsData[] = [
  { name: 'Liquidity Pool', value: 51 },
  { name: 'Ecosystem Fund', value: 29 },
  { name: 'Team Allocation', value: 10 },
  { name: 'Marketing & CEX', value: 10 },
];

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa'];

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-md p-3 border border-white/10 rounded-sm shadow-lg">
        <p className="text-gray-200 font-light text-sm tracking-wider">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const ArcxTokenomics: React.FC = () => {
  return (
    <div id="arcx-tokenomics" className="w-full h-full flex items-center justify-center p-8 md:p-16 bg-adam-black">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
        
        <div className="lg:col-span-2 w-full h-80 md:h-96 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="90%"
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#0a0a0a"
                  strokeWidth={3}
                  paddingAngle={2}
                  isAnimationActive={true}
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-gray-500 text-sm tracking-widest uppercase">Total Supply</p>
                <p className="text-arcx-orange text-3xl font-mono">1.1M ARCx</p>
            </div>
        </div>

        <div className="text-gray-300 lg:col-span-3">
            <h2 className="text-4xl md:text-6xl font-thin text-gray-200 tracking-[0.2em] uppercase">
                Tokenomics
            </h2>
            <p className="mt-4 text-adam-light-gray font-light max-w-xl">
                A fixed-supply token designed for long-term decentralization and ecosystem health. All allocations are subject to programmatic vesting schedules.
            </p>
            <div className="mt-8 pt-6">
                <ul className="space-y-4">
                {data.map((item, index) => (
                    <li key={item.name} className="flex items-center font-light text-md tracking-wider animate-fade-in-right" style={{animationDelay: `${0.2 + index * 0.1}s`}}>
                    <span
                        className="w-3 h-3 rounded-full mr-4"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    <span className="text-gray-400">{item.name}</span>
                    <span className="flex-grow border-b border-dashed border-adam-medium-gray/50 mx-4"></span>
                    <span className="ml-auto text-gray-200 font-mono">{item.value}%</span>
                    </li>
                ))}
                </ul>
                <div className="mt-8 border-t border-white/10 pt-4 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
                     <p className="text-xs font-light tracking-wider text-gray-500">Status: <span className="text-green-400">Minting Finalized. All Contracts Renounced.</span></p>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default ArcxTokenomics;