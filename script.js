/* =========================================================
   SAIKUMAR BIRADAR — PORTFOLIO
   Vanilla JS — no dependencies
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     0. LOADING SCREEN
  --------------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('loaded'), 400);
  });
  // Fallback in case 'load' fires late
  setTimeout(() => loader.classList.add('loaded'), 2500);

  /* ---------------------------------------------------------
     1. CUSTOM CURSOR + MOUSE GLOW
  --------------------------------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  if (!isTouch) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('[data-cursor-hover], a, button, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
  }

  // Mouse glow canvas
  const glowCanvas = document.getElementById('mouseGlow');
  const glowCtx = glowCanvas.getContext('2d');
  function resizeGlow(){
    glowCanvas.width = window.innerWidth;
    glowCanvas.height = window.innerHeight;
  }
  resizeGlow();
  window.addEventListener('resize', resizeGlow);

  let glowX = mouseX, glowY = mouseY;
  window.addEventListener('mousemove', (e) => { glowX = e.clientX; glowY = e.clientY; });

  function drawGlow(){
    glowCtx.clearRect(0, 0, glowCanvas.width, glowCanvas.height);
    if (!isTouch) {
      const radius = 260;
      const grad = glowCtx.createRadialGradient(glowX, glowY, 0, glowX, glowY, radius);
      grad.addColorStop(0, 'rgba(0,229,255,0.10)');
      grad.addColorStop(0.5, 'rgba(139,92,246,0.05)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      glowCtx.fillStyle = grad;
      glowCtx.beginPath();
      glowCtx.arc(glowX, glowY, radius, 0, Math.PI * 2);
      glowCtx.fill();
    }
    requestAnimationFrame(drawGlow);
  }
  drawGlow();

  /* ---------------------------------------------------------
     2. PARTICLE / NETWORK BACKGROUND
  --------------------------------------------------------- */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function initParticles(){
    const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 16000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  const colors = ['rgba(0,229,255,', 'rgba(139,92,246,', 'rgba(59,130,246,'];

  function drawParticles(){
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const linkDist = 130;

    for (let i = 0; i < particles.length; i++){
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

      for (let j = i + 1; j < particles.length; j++){
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDist){
          ctx.strokeStyle = `rgba(0,229,255,${(1 - dist / linkDist) * 0.14})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      const c = colors[i % colors.length];
      ctx.fillStyle = c + '0.7)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  drawParticles();

  /* ---------------------------------------------------------
     3. SCROLL PROGRESS BAR
  --------------------------------------------------------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }

  /* ---------------------------------------------------------
     4. NAVBAR: scroll state, active link, mobile menu
  --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkEls = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  function updateNavbarState(){
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('mobile-open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });

  navLinkEls.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      navToggle.classList.remove('open');
    });
  });

  function updateActiveLink(){
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) currentId = sec.id;
    });
    navLinkEls.forEach(link => {
      link.classList.toggle('active', link.dataset.section === currentId);
    });
  }

  /* ---------------------------------------------------------
     5. BACK TO TOP FAB
  --------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  function updateFab(){
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Combined scroll listener (throttled via rAF) ---------- */
  let scrollTicking = false;
  function onScroll(){
    if (!scrollTicking){
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNavbarState();
        updateActiveLink();
        updateFab();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------------------------------------------------------
     6. TYPING ANIMATION (hero roles)
  --------------------------------------------------------- */
  const roles = ['Computer Engineer', 'Full Stack Developer', 'MERN Stack Developer', 'Java Developer', 'Problem Solver'];
  const typingEl = document.getElementById('typingText');
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop(){
    const current = roles[roleIndex];
    if (!deleting){
      charIndex++;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length){
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0){
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  typeLoop();

  /* ---------------------------------------------------------
     7. SCROLL REVEAL (IntersectionObserver)
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------
     8. ANIMATED COUNTERS
  --------------------------------------------------------- */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const isDecimal = el.dataset.decimal === 'true';
      const duration = 1600;
      const start = performance.now();

      function tick(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (isDecimal ? value.toFixed(2) : Math.floor(value)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = (isDecimal ? target.toFixed(2) : target) + suffix;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------------------------------------------------------
     9. ANIMATED SKILL BARS
  --------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-bar');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const level = entry.target.dataset.level;
        const fill = entry.target.querySelector('.bar-fill');
        requestAnimationFrame(() => { fill.style.width = level + '%'; });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach(el => skillObserver.observe(el));

  /* ---------------------------------------------------------
     10. 3D CARD TILT EFFECT
  --------------------------------------------------------- */
  if (!isTouch){
    document.querySelectorAll('.tilt-el').forEach(card => {
      let rafId = null;
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * 10;
        const rotateX = (0.5 - py) * 10;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* ---------------------------------------------------------
     11. RIPPLE BUTTON EFFECT
  --------------------------------------------------------- */
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      circle.className = 'ripple-circle';
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

  /* ---------------------------------------------------------
     12. PROJECT FILTERING
  --------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('filtered-out', !match);
      });
    });
  });

  /* ---------------------------------------------------------
     13. CONTACT FORM (front-end only simulation)
  --------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const sendBtn = document.getElementById('sendBtn');
  const formStatus = document.getElementById('formStatus');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()){
      formStatus.textContent = 'Please fill in every field before sending.';
      formStatus.classList.remove('success');
      return;
    }
    sendBtn.classList.add('sending');
    formStatus.textContent = '';

    setTimeout(() => {
      sendBtn.classList.remove('sending');
      formStatus.textContent = 'Message sent — I\u2019ll get back to you soon.';
      formStatus.classList.add('success');
      form.reset();
    }, 1300);
  });

  /* ---------------------------------------------------------
     14. FOOTER YEAR
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     15. SMOOTH SCROLL FOR IN-PAGE ANCHORS (offset for navbar)
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - (navH - 1);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
