import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ArcxHero from './components/ArcxHero';
import ArcxCore from './components/ArcxCore';
import ArcxStaking from './components/ArcxStaking';
import ArcxTokenomics from './components/ArcxTokenomics';
import ArcxAcquire from './components/ArcxAcquire';
import ArcxJoin from './components/ArcxJoin';

interface ArcxTokenProps {
  onBack: () => void;
}

const ArcxToken: React.FC<ArcxTokenProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('arcx-home');
  const mainRef = useRef<HTMLElement>(null);

  const arcxLinks = [
    { name: 'Home', href: '#arcx-home', id: 'arcx-home' },
    { name: 'Concepts', href: '#arcx-core', id: 'arcx-core' },
    { name: 'Staking', href: '#arcx-staking', id: 'arcx-staking' },
    { name: 'Tokenomics', href: '#arcx-tokenomics', id: 'arcx-tokenomics' },
    { name: 'Acquire', href: '#arcx-acquire', id: 'arcx-acquire' },
    { name: 'Join', href: '#arcx-join', id: 'arcx-join' },
  ];

  const arcxTheme = {
    textColor: 'text-arcx-orange',
    indicatorBgColor: 'bg-arcx-orange',
    indicatorShadow: 'shadow-[0_0_10px_#f97316]',
    buyButtonClasses: 'bg-arcx-orange/80 hover:bg-arcx-orange text-white font-semibold py-2 px-4 rounded-sm text-xs transition-all duration-300 tracking-widest uppercase',
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
            // For RTL scroll, scrollLeft is 0 or negative in modern browsers.
            // We use Math.abs() to get the positive distance scrolled from the start (the right edge).
            const activeIndex = Math.round(Math.abs(scrollLeft) / width);
            const activeId = arcxLinks[activeIndex]?.id;
            if (activeId && activeSection !== activeId) {
                setActiveSection(activeId);
            }
        }, 150);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set initial section
    const initialSection = arcxLinks.find(link => window.location.hash === link.href);
    if (initialSection) {
      document.querySelector(initialSection.href)?.scrollIntoView();
    }
    handleScroll();

    return () => {
        clearTimeout(scrollTimeout);
        container.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection, arcxLinks]);

  return (
    <>
      <Header 
        activeSection={activeSection} 
        onBackToArc={onBack} 
        links={arcxLinks}
        logoText="ARCx"
        theme={arcxTheme}
        backButtonPosition="right"
        horizontalScroll={true}
      />
      <main id="arcx-main-container" ref={mainRef} className="horizontal-scroll-container rtl">
        <section id="arcx-home" className="section"><ArcxHero /></section>
        <section id="arcx-core" className="section"><ArcxCore /></section>
        <section id="arcx-staking" className="section"><ArcxStaking /></section>
        <section id="arcx-tokenomics" className="section"><ArcxTokenomics /></section>
        <section id="arcx-acquire" className="section"><ArcxAcquire /></section>
        <section id="arcx-join" className="section"><ArcxJoin /></section>
      </main>
    </>
  );
};

export default ArcxToken;