// main.js

document.addEventListener('DOMContentLoaded', () => {

  const appState = {
    currentView: 'arc-view',
    adam: {
      observer: null,
      activeSection: 'adam-home',
    },
    arcx: {
      scrollTimeout: null,
      activeSection: 'arcx-home',
    },
    sbt: {
      scrollTimeout: null,
      activeSection: 'sbt-home',
    }
  };

  const views = {
    arc: document.getElementById('arc-view'),
    adam: document.getElementById('adam-view'),
    arcx: document.getElementById('arcx-view'),
    sbt: document.getElementById('sbt-view'),
  };

  const pillarCards = document.querySelectorAll('.pillar-card');

  // --- VIEW SWITCHING ---
  function switchView(targetViewId) {
    if (appState.currentView === targetViewId) return;

    const currentView = document.getElementById(appState.currentView);
    const targetView = document.getElementById(targetViewId);

    if (currentView) currentView.classList.remove('active');
    if (targetView) targetView.classList.add('active');
    
    appState.currentView = targetViewId;

    document.body.classList.toggle('horizontal-scroll', targetViewId === 'arcx-view' || targetViewId === 'sbt-view');
  }

  pillarCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetViewId = card.getAttribute('data-target');
      if (targetViewId) {
        switchView(targetViewId);
      }
    });
  });
  
  // --- CANVAS BACKGROUNDS ---
  function initArcNoise(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Simplified noise effect for performance
    let w, h, id;
    function setup() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        id = ctx.createImageData(w, h);
    }
    function draw() {
        let r;
        for (let i=0; i < id.data.length; i+=4) {
            r = Math.random() * 40;
            id.data[i] = r;
            id.data[i+1] = r;
            id.data[i+2] = r;
            id.data[i+3] = 255;
        }
        ctx.putImageData(id, 0, 0);
    }
    setup();
    setInterval(draw, 100);
    window.addEventListener('resize', setup);
  }

  function initAdamParticles(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let particles = [];
    const mouse = { x: null, y: null };
    
    function setup() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      particles = [];
      const particleCount = (canvas.width * canvas.height) / 25000;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.clientWidth,
          y: Math.random() * canvas.clientHeight,
          size: Math.random() * 1.5 + 0.5,
          baseX: this.x,
          baseY: this.y,
          density: (Math.random() * 30) + 1,
        });
      }
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(67, 97, 238, 0.5)';
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    
    setup();
    animate();
    window.addEventListener('resize', setup);
  }

  // --- HEADER GENERATION & LOGIC ---
  const linksData = {
    adam: [
      { name: 'Home', href: '#adam-home', id: 'adam-home' },
      { name: 'About', href: '#adam-about', id: 'adam-about' },
      { name: 'Architecture', href: '#adam-architecture', id: 'adam-architecture' },
      { name: 'Lifecycle', href: '#adam-lifecycle', id: 'adam-lifecycle' },
      { name: 'Parameters', href: '#adam-parameters', id: 'adam-parameters' },
      { name: 'Sandbox', href: '#adam-sandbox', id: 'adam-sandbox' },
      { name: 'Security', href: '#adam-security', id: 'adam-security' },
      { name: 'Join', href: '#adam-join', id: 'adam-join' },
    ],
    arcx: [
      { name: 'Home', href: '#arcx-home', id: 'arcx-home' },
      { name: 'Concepts', href: '#arcx-core', id: 'arcx-core' },
      { name: 'Staking', href: '#arcx-staking', id: 'arcx-staking' },
      { name: 'Tokenomics', href: '#arcx-tokenomics', id: 'arcx-tokenomics' },
      { name: 'Acquire', href: '#arcx-acquire', id: 'arcx-acquire' },
      { name: 'Join', href: '#arcx-join', id: 'arcx-join' },
    ],
    sbt: [
      { name: 'Home', href: '#sbt-home', id: 'sbt-home' },
      { name: 'Concepts', href: '#sbt-core', id: 'sbt-core' },
      { name: 'Constellation', href: '#sbt-constellation', id: 'sbt-constellation' },
      { name: 'Credentials', href: '#sbt-credentials', id: 'sbt-credentials' },
      { name: 'Decay', href: '#sbt-decay', id: 'sbt-decay' },
      { name: 'Join', href: '#sbt-join', id: 'sbt-join' },
    ]
  };

  function createHeader(theme, logoText, links, backButtonPosition = 'left') {
    const buyLink = "https://app.uniswap.org/explore/tokens/base/0xA4093669DAFbD123E37d52e0939b3aB3C2272f44";
    const backButtonHTML = `
      <button class="back-button" aria-label="Back to The Arc">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
      </button>`;
    
    const linksHTML = links.map(link => `
      <a href="${link.href}" data-id="${link.id}">${link.name}</a>
    `).join('');

    return `
      <div class="header-inner">
        <div class="header-left">
          ${backButtonPosition === 'left' ? backButtonHTML : ''}
          <a href="${links[0].href}" class="header-logo" data-theme="${theme}">${logoText}</a>
        </div>
        <nav class="header-nav">
          <div class="header-nav-links" data-theme="${theme}">${linksHTML}</div>
          <div class="header-nav-indicator" data-theme="${theme}"></div>
        </nav>
        <div class="header-right">
          <a href="${buyLink}" target="_blank" rel="noopener noreferrer" class="buy-button" data-theme="${theme}">Buy ARCx</a>
          ${backButtonPosition === 'right' ? backButtonHTML : ''}
          <!-- Mobile Menu Button Here -->
        </div>
      </div>
    `;
  }
  
  function updateHeaderIndicator(header, activeSectionId) {
      const activeLink = header.querySelector(`.header-nav-links a[data-id="${activeSectionId}"]`);
      const indicator = header.querySelector('.header-nav-indicator');
      if (activeLink && indicator) {
          indicator.style.left = `${activeLink.offsetLeft}px`;
          indicator.style.width = `${activeLink.offsetWidth}px`;
          
          header.querySelectorAll('.header-nav-links a').forEach(a => a.classList.remove('active'));
          activeLink.classList.add('active');
      }
  }

  // --- ADAM PROTOCOL LOGIC ---
  function initAdam() {
    const header = views.adam.querySelector('header');
    header.innerHTML = createHeader('adam', 'ADAM', linksData.adam, 'left');
    
    const mainContainer = views.adam.querySelector('.main-scroll-container');
    const sections = views.adam.querySelectorAll('.section');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          appState.adam.activeSection = id;
          updateHeaderIndicator(header, id);
        }
      });
    }, { root: mainContainer, threshold: 0.4 });

    sections.forEach(section => observer.observe(section));

    header.addEventListener('click', (e) => {
      if (e.target.matches('.header-nav-links a')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
      }
      if (e.target.closest('.back-button')) {
        switchView('arc-view');
      }
    });
    
    updateHeaderIndicator(header, 'adam-home');
  }

  // --- ARCX TOKEN LOGIC ---
  function initArcx() {
    const header = views.arcx.querySelector('header');
    header.innerHTML = createHeader('arcx', 'ARCx', linksData.arcx, 'right');
    const mainContainer = views.arcx.querySelector('.horizontal-scroll-container');

    mainContainer.addEventListener('scroll', () => {
      clearTimeout(appState.arcx.scrollTimeout);
      appState.arcx.scrollTimeout = setTimeout(() => {
        const scrollLeft = mainContainer.scrollLeft;
        const width = mainContainer.clientWidth;
        const activeIndex = Math.round(Math.abs(scrollLeft) / width);
        const activeId = linksData.arcx[activeIndex]?.id;
        if (activeId && appState.arcx.activeSection !== activeId) {
            appState.arcx.activeSection = activeId;
            updateHeaderIndicator(header, activeId);
        }
      }, 150);
    });

    header.addEventListener('click', (e) => {
      if (e.target.matches('.header-nav-links a')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
      if (e.target.closest('.back-button')) {
        switchView('arc-view');
      }
    });
    updateHeaderIndicator(header, 'arcx-home');
  }

  // --- SBT IDENTITY LOGIC ---
  function initSbt() {
    const header = views.sbt.querySelector('header');
    header.innerHTML = createHeader('sbt', 'SOULBOUND', linksData.sbt, 'left');
    const mainContainer = views.sbt.querySelector('.horizontal-scroll-container');

     mainContainer.addEventListener('scroll', () => {
      clearTimeout(appState.sbt.scrollTimeout);
      appState.sbt.scrollTimeout = setTimeout(() => {
        const scrollLeft = mainContainer.scrollLeft;
        const width = mainContainer.clientWidth;
        const activeIndex = Math.round(scrollLeft / width);
        const activeId = linksData.sbt[activeIndex]?.id;
        if (activeId && appState.sbt.activeSection !== activeId) {
            appState.sbt.activeSection = activeId;
            updateHeaderIndicator(header, activeId);
        }
      }, 150);
    });

    header.addEventListener('click', (e) => {
      if (e.target.matches('.header-nav-links a')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
      if (e.target.closest('.back-button')) {
        switchView('arc-view');
      }
    });
    updateHeaderIndicator(header, 'sbt-home');
  }

  // --- INITIALIZATION ---
  initArcNoise(document.getElementById('arc-noise-background'));
  initAdamParticles(document.getElementById('adam-particle-background'));
  initAdam();
  initArcx();
  initSbt();

});
