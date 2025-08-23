import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import AdamBackground from './components/AdamBackground';

// ADAM Protocol Ecosystem Components
import AdamHero from './components/AdamHero';
import AdamAbout from './components/AdamAbout';
import AdamArchitecture from './components/AdamArchitecture';
import AdamSecurity from './components/AdamSecurity';
import AdamLifecycle from './components/AdamLifecycle';
import AdamSandbox from './components/AdamSandbox';
import AdamParameters from './components/AdamParameters';
import AdamJoin from './components/AdamJoin';

interface AdamProtocolProps {
  onBack: () => void;
}

const AdamProtocol: React.FC<AdamProtocolProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('adam-home');
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const adamLinks = [
    { name: 'Home', href: '#adam-home', id: 'adam-home' },
    { name: 'About', href: '#adam-about', id: 'adam-about' },
    { name: 'Architecture', href: '#adam-architecture', id: 'adam-architecture' },
    { name: 'Lifecycle', href: '#adam-lifecycle', id: 'adam-lifecycle' },
    { name: 'Parameters', href: '#adam-parameters', id: 'adam-parameters' },
    { name: 'Sandbox', href: '#adam-sandbox', id: 'adam-sandbox' },
    { name: 'Security', href: '#adam-security', id: 'adam-security' },
    { name: 'Join', href: '#adam-join', id: 'adam-join' },
  ];

  const adamTheme = {
    textColor: 'text-adam-blue',
    indicatorBgColor: 'bg-adam-blue',
    indicatorShadow: 'shadow-[0_0_10px_#4361ee]',
    buyButtonClasses: 'bg-adam-blue/80 hover:bg-adam-blue text-white font-semibold py-2 px-4 rounded-sm text-xs transition-all duration-300 tracking-widest uppercase',
  };


  useEffect(() => {
    const mainContainer = mainContainerRef.current;
    if (!mainContainer) return;

    const options = {
      root: mainContainer,
      rootMargin: "-20% 0px -50% 0px",
      threshold: 0.1,
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    const sections = mainContainer.querySelectorAll('.section');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black relative">
      <AdamBackground />
      <Header 
        activeSection={activeSection} 
        onBackToArc={onBack} 
        links={adamLinks}
        logoText="ADAM"
        theme={adamTheme}
      />
      <main ref={mainContainerRef} className="w-full h-full overflow-y-auto overflow-x-hidden snap-y snap-proximity">
        {/* ADAM Protocol Ecosystem */}
        <section id="adam-home" className="section snap-start"><AdamHero /></section>
        <section id="adam-about" className="section snap-start"><AdamAbout /></section>
        <section id="adam-architecture" className="section snap-start"><AdamArchitecture /></section>
        <section id="adam-lifecycle" className="section snap-start"><AdamLifecycle /></section>
        <section id="adam-parameters" className="section snap-start"><AdamParameters /></section>
        <section id="adam-sandbox" className="section snap-start"><AdamSandbox /></section>
        <section id="adam-security" className="section snap-start"><AdamSecurity /></section>
        <section id="adam-join" className="section snap-start"><AdamJoin /></section>
      </main>
    </div>
  );
};

export default AdamProtocol;