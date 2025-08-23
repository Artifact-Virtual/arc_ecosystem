import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import SbtHero from './components/SbtHero';
import SbtCore from './components/SbtCore';
import SbtConstellation from './components/SbtConstellation';
import SbtCredentials from './components/SbtCredentials';
import SbtDecay from './components/SbtDecay';
import SbtJoin from './components/SbtJoin';


interface SbtIdentityProps {
  onBack: () => void;
}

const SbtIdentity: React.FC<SbtIdentityProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('sbt-home');
  const mainRef = useRef<HTMLElement>(null);

  const sbtLinks = [
    { name: 'Home', href: '#sbt-home', id: 'sbt-home' },
    { name: 'Concepts', href: '#sbt-core', id: 'sbt-core' },
    { name: 'Constellation', href: '#sbt-constellation', id: 'sbt-constellation' },
    { name: 'Credentials', href: '#sbt-credentials', id: 'sbt-credentials' },
    { name: 'Decay', href: '#sbt-decay', id: 'sbt-decay' },
    { name: 'Join', href: '#sbt-join', id: 'sbt-join' },
  ];

  const sbtTheme = {
    textColor: 'text-sbt-teal',
    indicatorBgColor: 'bg-sbt-teal',
    indicatorShadow: 'shadow-[0_0_10px_#14b8a6]',
    buyButtonClasses: 'bg-sbt-teal/80 hover:bg-sbt-teal text-white font-semibold py-2 px-4 rounded-sm text-xs transition-all duration-300 tracking-widest uppercase',
  };

  useEffect(() => {
    document.body.classList.add('horizontal-scroll');
    return () => {
        document.body.classList.remove('horizontal-scroll');
    };
  }, []);

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    let scrollTimeout: number;
    const handleScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = window.setTimeout(() => {
            const scrollLeft = container.scrollLeft;
            const width = container.clientWidth;
            const activeIndex = Math.round(scrollLeft / width);
            const activeId = sbtLinks[activeIndex]?.id;
            if (activeId && activeSection !== activeId) {
                setActiveSection(activeId);
            }
        }, 150);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    handleScroll();

    return () => {
        clearTimeout(scrollTimeout);
        container.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection, sbtLinks]);


  return (
    <>
      <Header 
        activeSection={activeSection} 
        onBackToArc={onBack} 
        links={sbtLinks}
        logoText="SOULBOUND"
        theme={sbtTheme}
        backButtonPosition="left"
        horizontalScroll={true}
      />
      <main id="sbt-main-container" ref={mainRef} className="horizontal-scroll-container">
        <section id="sbt-home" className="section"><SbtHero /></section>
        <section id="sbt-core" className="section"><SbtCore /></section>
        <section id="sbt-constellation" className="section"><SbtConstellation /></section>
        <section id="sbt-credentials" className="section"><SbtCredentials /></section>
        <section id="sbt-decay" className="section"><SbtDecay /></section>
        <section id="sbt-join" className="section"><SbtJoin /></section>
      </main>
    </>
  );
};

export default SbtIdentity;