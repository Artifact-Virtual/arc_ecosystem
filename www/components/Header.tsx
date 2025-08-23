import React, { useState, useEffect, useRef } from 'react';

interface Link {
  name: string;
  href: string;
  id: string;
}

interface Theme {
  textColor: string;
  indicatorBgColor: string;
  indicatorShadow: string;
  buyButtonClasses: string;
}

interface HeaderProps {
    activeSection: string;
    onBackToArc: () => void;
    links: Link[];
    logoText: string;
    theme: Theme;
    backButtonPosition?: 'left' | 'right';
    horizontalScroll?: boolean;
}


const Header: React.FC<HeaderProps> = ({ activeSection, onBackToArc, links, logoText, theme, backButtonPosition = 'left', horizontalScroll = false }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const navRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<{ [key: string]: HTMLAnchorElement | null }>({});


    useEffect(() => {
        const activeLink = linksRef.current[activeSection];
        if (activeLink) {
            setIndicatorStyle({
                left: activeLink.offsetLeft,
                width: activeLink.offsetWidth,
            });
        }
    }, [activeSection, links]);
    
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        setMenuOpen(false); // Close mobile menu on click
        const section = document.querySelector(sectionId);
        if(section) {
            if (horizontalScroll) {
                section.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            } else {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const buyLink = "https://app.uniswap.org/explore/tokens/base/0xA4093669DAFbD123E37d52e0939b3aB3C2272f44";

    const BackButton = () => (
        <button onClick={onBackToArc} className="text-gray-400 hover:text-white transition-colors" aria-label="Back to The Arc">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
        </button>
    );

    return (
        <>
            <header className="fixed top-0 left-0 w-full h-20 bg-black/20 backdrop-blur-lg z-50 border-b border-white/5">
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                         {backButtonPosition === 'left' && <BackButton />}
                        <a href={links[0].href} onClick={(e) => scrollToSection(e, links[0].href)} className={`${theme.textColor} font-light text-2xl tracking-[0.3em]`}>
                            {logoText}
                        </a>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center relative" ref={navRef}>
                        <div className="flex items-center space-x-8">
                            {links.map(link => (
                                <a key={link.name}
                                   href={link.href}
                                   ref={el => { if(el) linksRef.current[link.id] = el; }}
                                   onClick={(e) => scrollToSection(e, link.href)}
                                   className={`text-sm uppercase tracking-widest transition-colors duration-300 py-2 ${activeSection === link.id ? 'text-white' : 'text-adam-light-gray hover:text-white'}`}>
                                    {link.name}
                                </a>
                            ))}
                        </div>
                        <div className={`absolute bottom-0 h-[2px] ${theme.indicatorBgColor} ${theme.indicatorShadow} transition-all duration-500 ease-in-out`} style={indicatorStyle}></div>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <a href={buyLink} target="_blank" rel="noopener noreferrer" className={`hidden sm:block ${theme.buyButtonClasses}`}>
                            Buy ARCx
                        </a>
                         {backButtonPosition === 'right' && <div className="hidden lg:block"><BackButton /></div>}
                        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-white z-50 p-2" aria-label="Toggle menu">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={!menuOpen ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`lg:hidden fixed inset-0 bg-adam-black z-40 transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                <nav className="mt-20 pt-10 flex flex-col items-center justify-start h-full space-y-8">
                    {links.map(link => (
                        <a key={link.name}
                           href={link.href}
                           onClick={(e) => scrollToSection(e, link.href)}
                           className={`text-2xl uppercase tracking-widest ${activeSection === link.id ? theme.textColor : 'text-adam-light-gray'}`}>
                            {link.name}
                        </a>
                    ))}
                    <a href={buyLink} target="_blank" rel="noopener noreferrer" className={`sm:hidden ${theme.buyButtonClasses} py-3 px-6 text-sm mt-8`}>
                        Buy ARCx
                    </a>
                </nav>
            </div>
        </>
    );
};
export default Header;