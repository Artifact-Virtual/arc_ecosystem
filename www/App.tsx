import React, { useState } from 'react';
import ArcHero from './components/ArcHero';
import AdamProtocol from './AdamProtocol';
import ArcxToken from './ArcxToken';
import SbtIdentity from './SbtIdentity';

const App: React.FC = () => {
  const [view, setView] = useState<'arc' | 'adam' | 'arcx' | 'sbt'>('arc');

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className={`absolute inset-0 transition-opacity duration-1000 ${view === 'arc' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {view === 'arc' && <ArcHero onEnterAdam={() => setView('adam')} onEnterArcx={() => setView('arcx')} onEnterSbt={() => setView('sbt')}/>}
      </div>
      
      <div className={`absolute inset-0 transition-opacity duration-1000 ${view !== 'arc' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
         {view === 'adam' && <AdamProtocol onBack={() => setView('arc')} />}
         {view === 'arcx' && <ArcxToken onBack={() => setView('arc')} />}
         {view === 'sbt' && <SbtIdentity onBack={() => setView('arc')} />}
     </div>
    </div>
  );
};

export default App;