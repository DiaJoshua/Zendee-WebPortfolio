/* Marie Zendee — creative layer. Reading progress, drifting petals, reveal on
   scroll, counting numbers, and gentle card tilt. Buildless and dependency-free.
   Everything here is decorative: with calm motion or a system reduced-motion
   preference, each effect quietly turns itself off. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const calm = () => motionQuery.matches || document.documentElement.classList.contains('calm-motion');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

  /* ---------- Reading progress ---------- */
  const line = $('#progressLine');
  let progressFrame = 0;
  function paintProgress() {
    progressFrame = 0;
    const height = document.documentElement.scrollHeight - innerHeight;
    const ratio = height > 0 ? Math.min(1, Math.max(0, scrollY / height)) : 0;
    line.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
  }
  const scheduleProgress = () => { if (!progressFrame) progressFrame = requestAnimationFrame(paintProgress); };
  if (line) {
    paintProgress();
    addEventListener('scroll', scheduleProgress, { passive: true });
    addEventListener('resize', scheduleProgress, { passive: true });
  }

  /* ---------- Drifting petals ---------- */
  const field = $('#petalField');
  function petals() {
    if (!field) return;
    field.replaceChildren();
    if (calm()) return;
    const shapes = ['🍓', '✿', '🍓', '❀', '✦'];
    const count = innerWidth < 820 ? 5 : 9;
    for (let index = 0; index < count; index++) {
      const petal = document.createElement('i');
      petal.textContent = shapes[index % shapes.length];
      petal.style.left = (4 + Math.random() * 92).toFixed(2) + '%';
      petal.style.fontSize = (11 + Math.random() * 10).toFixed(0) + 'px';
      petal.style.animationDuration = (22 + Math.random() * 22).toFixed(1) + 's';
      petal.style.animationDelay = '-' + (Math.random() * 30).toFixed(1) + 's';
      petal.style.opacity = (0.22 + Math.random() * 0.24).toFixed(2);
      field.append(petal);
    }
  }
  petals();
  // The preferences panel toggles calm motion on the documentElement; react only
  // when that state actually flips, not on every unrelated class change.
  let wasCalm = calm();
  const calmListeners = [petals];
  const onCalmChange = () => {
    const now = calm();
    if (now === wasCalm) return;
    wasCalm = now;
    calmListeners.forEach(fn => fn());
  };
  motionQuery.addEventListener?.('change', onCalmChange);
  new MutationObserver(onCalmChange).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = [
    ...$$('.section-heading'),
    ...$$('.project-card'),
    ...$$('.identity-grid > *'),
    ...$$('.identity-boards button'),
    ...$$('.about-image'),
    ...$$('.about-copy'),
    ...$$('.photo-section-inner > *'),
    ...$$('.contact-card')
  ];
  revealTargets.forEach((node, index) => {
    node.setAttribute('data-reveal', '');
    node.style.transitionDelay = Math.min(index % 6, 5) * 70 + 'ms';
  });
  if ('IntersectionObserver' in window) {
    const watcher = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        watcher.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealTargets.forEach(node => watcher.observe(node));
  } else {
    revealTargets.forEach(node => node.classList.add('revealed'));
  }

  /* ---------- Numbers that count themselves in ---------- */
  const counters = $$('[data-count]');
  function countUp(node) {
    const target = Number(node.dataset.count) || 0;
    if (calm() || !('IntersectionObserver' in window)) { node.textContent = String(target); return; }
    const duration = 900;
    const start = performance.now();
    const step = now => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    node.textContent = '0';
    requestAnimationFrame(step);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    const numberWatcher = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        numberWatcher.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(node => numberWatcher.observe(node));
  }

  /* ---------- A gentle tilt on the work cards ---------- */
  if (finePointer.matches) {
    $$('.project-card .project-open').forEach(card => {
      let tiltFrame = 0;
      const reset = () => { card.style.transform = ''; };
      card.addEventListener('pointermove', event => {
        if (calm() || tiltFrame) return;
        tiltFrame = requestAnimationFrame(() => {
          tiltFrame = 0;
          const box = card.getBoundingClientRect();
          const x = (event.clientX - box.left) / box.width - 0.5;
          const y = (event.clientY - box.top) / box.height - 0.5;
          card.style.transform = 'perspective(900px) rotateX(' + (-y * 4).toFixed(2) + 'deg) rotateY(' + (x * 5).toFixed(2) + 'deg) translateY(-4px)';
        });
      });
      card.addEventListener('pointerleave', reset);
      card.addEventListener('blur', reset);
    });
  }


  /* ---------- The roles she actually works in, typed out ---------- */
  const typeNode = $('#typewriter');
  if (typeNode) {
    const roles = ['Brand Assistant', 'Visual Content Developer', 'Graphic Artist'];
    const still = 'Brand Assistant · Visual Content Developer · Graphic Artist';
    let roleIndex = 0, letters = roles[0].length, removing = true, timer = 0;
    const stop = () => { clearTimeout(timer); timer = 0; };
    function tick() {
      if (calm()) { stop(); typeNode.textContent = still; return; }
      const word = roles[roleIndex];
      letters += removing ? -1 : 1;
      typeNode.textContent = word.slice(0, letters);
      let wait = removing ? 45 : 85;
      if (!removing && letters >= word.length) { removing = true; wait = 1700; }
      else if (removing && letters <= 0) { removing = false; roleIndex = (roleIndex + 1) % roles.length; wait = 320; }
      timer = setTimeout(tick, wait);
    }
    const run = () => {
      stop();
      if (calm() || document.hidden) { typeNode.textContent = calm() ? still : typeNode.textContent; return; }
      timer = setTimeout(tick, 1600);
    };
    run();
    document.addEventListener('visibilitychange', run);
    calmListeners.push(run);
  }

  /* ---------- Manila, by daylight ---------- */
  const clockIcon = $('#clockIcon');
  if (clockIcon) {
    const setIcon = () => {
      const hour = Number(new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Manila', hour: 'numeric', hour12: false
      }).format(new Date()));
      clockIcon.textContent = hour >= 6 && hour < 18 ? '☀️' : '🌙';
    };
    setIcon();
    setInterval(setIcon, 60000);
  }

  /* ---------- Marquee speed follows its own width ---------- */
  $$('.marquee-band').forEach(band => {
    const track = $('.marquee-track', band);
    const group = $('.marquee-group', band);
    if (!track || !group) return;
    const tune = () => {
      const width = group.getBoundingClientRect().width;
      if (width > 0) track.style.animationDuration = Math.max(18, Math.round(width / 55)) + 's';
    };
    tune();
    addEventListener('resize', tune, { passive: true });
  });
})();
