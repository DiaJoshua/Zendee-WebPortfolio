/* ═══════════════════════════════════════════════
   Berry Zendee 🎀🍓 — sound engine v3
   ♪ "berry bounce" (happy lil bop, C major, 120bpm)
   + hover/click sfx + sprinkle extras
   everything toggleable · prefs remembered 💾
   ═══════════════════════════════════════════════ */
(() => {
  "use strict";

  /* ── saved preferences ── */
  let musicOn = false;
  let sfxOn = true;
  try {
    musicOn = localStorage.getItem("zendee-music") === "on";
    sfxOn = localStorage.getItem("zendee-sfx") !== "off";
  } catch (e) {}

  /* ── web audio (created lazily on first tap — browser rule) ── */
  let actx = null,
    musicBus,
    sfxBus,
    noiseBuf;

  function audio() {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      actx = new AC();
      const master = actx.createGain();
      master.gain.value = 0.9;
      master.connect(actx.destination);
      musicBus = actx.createGain();
      musicBus.gain.value = 0.22;
      musicBus.connect(master);
      sfxBus = actx.createGain();
      sfxBus.gain.value = 0.5;
      sfxBus.connect(master);
    }
    if (actx.state === "suspended") actx.resume();
    return actx;
  }
  const ready = () => actx && actx.state === "running";

  /* note name → frequency */
  const SEMI = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };
  const nf = (n) => {
    const m = /^([A-G]#?)(\d)$/.exec(n);
    return 440 * Math.pow(2, (SEMI[m[1]] + 12 * (+m[2] + 1) - 69) / 12);
  };
  const mf = (m) => 440 * Math.pow(2, (m - 69) / 12);

  /* one bouncy plucked note */
  function pluck(freq, t, dur, type, vol, bus) {
    const o = actx.createOscillator(),
      g = actx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(bus);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  function noise() {
    if (!noiseBuf) {
      noiseBuf = actx.createBuffer(1, (actx.sampleRate * 0.3) | 0, actx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return noiseBuf;
  }
  function thump(t) {
    /* soft kick */
    const o = actx.createOscillator(),
      g = actx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(46, t + 0.11);
    g.gain.setValueAtTime(0.55, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    o.connect(g);
    g.connect(musicBus);
    o.start(t);
    o.stop(t + 0.2);
  }
  function snap(t) {
    /* clap */
    const s = actx.createBufferSource();
    s.buffer = noise();
    const f = actx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 1900;
    f.Q.value = 0.9;
    const g = actx.createGain();
    g.gain.setValueAtTime(0.3, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    s.connect(f);
    f.connect(g);
    g.connect(musicBus);
    s.start(t);
    s.stop(t + 0.12);
  }
  function tss(t, v) {
    /* hat */
    const s = actx.createBufferSource();
    s.buffer = noise();
    const f = actx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 6800;
    const g = actx.createGain();
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    s.connect(f);
    f.connect(g);
    g.connect(musicBus);
    s.start(t);
    s.stop(t + 0.06);
  }

  /* ── ♪ "berry bounce" — 8 bars, C · G · Am · F, loops forever ── */
  const BPM = 120,
    SPB = 60 / BPM,
    STEP = SPB / 2,
    STEPS = 64;

  /* melody: [beat, note, length-in-beats] */
  const LEAD = [
    [0, "E5", 0.5], [0.5, "G5", 0.5], [1, "C6", 1], [2, "G5", 0.5], [2.5, "E5", 0.5], [3, "G5", 1],
    [4, "D5", 0.5], [4.5, "G5", 0.5], [5, "B5", 1], [6, "A5", 0.5], [6.5, "G5", 0.5], [7, "D5", 1],
    [8, "C5", 0.5], [8.5, "E5", 0.5], [9, "A5", 1], [10, "E5", 0.5], [10.5, "C5", 0.5], [11, "E5", 1],
    [12, "A5", 0.5], [12.5, "G5", 0.5], [13, "F5", 1], [14, "C5", 0.5], [14.5, "D5", 0.5], [15, "E5", 0.5], [15.5, "D5", 0.5],
    [16, "E5", 0.5], [16.5, "G5", 0.5], [17, "C6", 1], [18, "B5", 0.5], [18.5, "C6", 0.5], [19, "D6", 1],
    [20, "D6", 0.5], [20.5, "B5", 0.5], [21, "G5", 1], [22, "A5", 0.5], [22.5, "B5", 0.5], [23, "A5", 1],
    [24, "A5", 0.5], [24.5, "C6", 0.5], [25, "A5", 1], [26, "G5", 0.5], [26.5, "F5", 0.5], [27, "G5", 1],
    [28, "G5", 0.5], [28.5, "E5", 0.5], [29, "D5", 1], [30, "D5", 0.5], [30.5, "E5", 0.5], [31, "D5", 0.5], [31.5, "B4", 0.5],
  ];
  const leadMap = {};
  LEAD.forEach(([b, n, d]) => {
    (leadMap[b * 2] = leadMap[b * 2] || []).push([nf(n), d]);
  });

  const ROOTS = [36, 43, 45, 41, 36, 43, 41, 43]; /* C G Am F · C G F G */
  const BOUNCE = [0, 12, 7, 12, 0, 12, 7, 12];
  const TRIADS = [
    ["C4", "E4", "G4"], ["B3", "D4", "G4"], ["A3", "C4", "E4"], ["A3", "C4", "F4"],
    ["C4", "E4", "G4"], ["B3", "D4", "G4"], ["A3", "C4", "F4"], ["B3", "D4", "G4"],
  ];
  const GLITTER = ["C6", "E6", "G6", "C7"];

  let playing = false,
    timer = null,
    stepIdx = 0,
    nextT = 0;

  function playStep(s, t) {
    const bar = (s >> 3) % 8,
      off = s % 8;
    /* bouncy bass */
    pluck(mf(ROOTS[bar] + BOUNCE[off]), t, 0.2, "triangle", 0.3, musicBus);
    /* melody (+ a whisper of chiptune sheen) */
    (leadMap[s] || []).forEach(([f, d]) => {
      pluck(f, t, Math.max(d * SPB * 0.9, 0.12), "triangle", 0.19, musicBus);
      pluck(f, t, Math.max(d * SPB * 0.55, 0.1), "square", 0.045, musicBus);
    });
    /* off-beat chord stabs = the bounce */
    if (off === 2 || off === 6) {
      TRIADS[bar].forEach((n) => pluck(nf(n), t, 0.18, "triangle", 0.06, musicBus));
      snap(t);
    }
    if (off === 0 || off === 4) thump(t);
    tss(t, off % 2 ? 0.05 : 0.08);
    /* sparkle run at each turnaround ✨ */
    if (s === 30 || s === 62)
      GLITTER.forEach((n, i) => pluck(nf(n), t + i * 0.125, 0.3, "sine", 0.06, musicBus));
  }

  function tick() {
    while (nextT < actx.currentTime + 0.12) {
      playStep(stepIdx % STEPS, nextT);
      stepIdx++;
      nextT += STEP;
    }
  }

  /* ── player controls ── */
  const player = document.getElementById("player");
  const musicBtn = document.getElementById("musicBtn");
  const sfxBtn = document.getElementById("sfxBtn");

  function startMusic() {
    if (playing || !audio()) return;
    playing = true;
    stepIdx = 0;
    nextT = actx.currentTime + 0.06;
    timer = setInterval(tick, 25);
    player.classList.add("playing");
    musicBtn.textContent = "⏸";
    musicBtn.setAttribute("aria-label", "Pause music");
  }
  function stopMusic() {
    playing = false;
    clearInterval(timer);
    player.classList.remove("playing");
    musicBtn.textContent = "▶";
    musicBtn.setAttribute("aria-label", "Play music");
  }

  musicBtn.addEventListener("click", () => {
    playing ? stopMusic() : startMusic();
    try {
      localStorage.setItem("zendee-music", playing ? "on" : "off");
    } catch (e) {}
    chime(playing ? ["C6", "E6"] : ["E6", "C6"], 0.06, 0.1);
  });

  /* browsers block true autoplay — resume saved music on first tap */
  addEventListener(
    "pointerdown",
    (e) => {
      if (sfxOn || musicOn) audio();
      if (musicOn && !playing && !e.target.closest("#musicBtn")) startMusic();
    },
    { once: true }
  );

  /* ── sfx 🔔 ── */
  function blip(f1, f2, dur, vol) {
    if (!sfxOn || !ready()) return;
    const t = actx.currentTime;
    const o = actx.createOscillator(),
      g = actx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(f1, t);
    o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(sfxBus);
    o.start(t);
    o.stop(t + dur + 0.03);
  }
  function chime(notes, gap, vol) {
    if (!sfxOn || !audio()) return;
    const t0 = actx.currentTime;
    notes.forEach((n, i) => {
      const t = t0 + i * (gap || 0.07);
      const o = actx.createOscillator(),
        g = actx.createGain();
      o.type = "sine";
      o.frequency.value = nf(n);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol || 0.12, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o.connect(g);
      g.connect(sfxBus);
      o.start(t);
      o.stop(t + 0.4);
    });
  }
  const hoverPop = () => blip(480 + Math.random() * 280, 940, 0.07, 0.09);
  const clickPop = () => blip(880, 330, 0.09, 0.2);
  const tink = () => blip(1300 + Math.random() * 500, 2100, 0.06, 0.07);

  function syncSfxBtn() {
    sfxBtn.textContent = sfxOn ? "🔔" : "🔕";
    sfxBtn.classList.toggle("off", !sfxOn);
    sfxBtn.setAttribute("aria-pressed", String(sfxOn));
  }
  sfxBtn.addEventListener("click", () => {
    sfxOn = !sfxOn;
    try {
      localStorage.setItem("zendee-sfx", sfxOn ? "on" : "off");
    } catch (e) {}
    syncSfxBtn();
    if (sfxOn) chime(["C6", "G6"], 0.06, 0.1);
    showToast(sfxOn ? "sound effects on 🔔" : "sound effects off 🔕");
  });
  syncSfxBtn();

  /* soft pop while hovering pretty things (desktop only) */
  if (matchMedia("(hover: hover)").matches) {
    let lastHover = 0;
    const HOVERABLE =
      "a, button, .card, .skill, .chip, .gallery-item, .cert-card, .resume-card, input";
    document.addEventListener("mouseover", (e) => {
      if (!sfxOn || !ready()) return;
      const el = e.target.closest(HOVERABLE);
      if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return;
      const now = performance.now();
      if (now - lastHover < 70) return;
      lastHover = now;
      hoverPop();
    });
  }

  /* bubble pop on clicks (little tink for sparkle clicks) */
  addEventListener("click", (e) => {
    if (!sfxOn) return;
    audio();
    if (e.target.closest(".player")) return; /* player has its own sounds */
    if (e.target.closest("a, button, .card, .skill, label, input[type=submit]")) clickPop();
    else if (!e.target.closest(".lightbox, .nav, form, input, .theme-btn, .cmdk, .kbd-btn")) tink();
  });

  /* add to the ⌘K command palette */
  if (typeof cmdkActions !== "undefined") {
    cmdkActions.push(
      { label: "🎶 play / pause music", hint: "music", run: () => musicBtn.click() },
      { label: "🔔 toggle sound effects", hint: "sfx", run: () => sfxBtn.click() }
    );
  }

  /* ═══════════ sprinkle extras ✨ ═══════════ */
  const DROPS = ["🍓", "🌸", "🎀", "✨"];

  /* ── cursor sparkle trail ── */
  if (!reducedMotion && matchMedia("(hover: hover)").matches) {
    let tx = 0,
      ty = 0,
      tLast = 0;
    addEventListener(
      "pointermove",
      (e) => {
        const now = performance.now();
        const dx = e.clientX - tx,
          dy = e.clientY - ty;
        if (now - tLast < 60 || dx * dx + dy * dy < 1100) return;
        tLast = now;
        tx = e.clientX;
        ty = e.clientY;
        const s = document.createElement("span");
        s.className = "trail";
        s.textContent = Math.random() < 0.75 ? "✨" : "💗";
        s.style.left = e.clientX + "px";
        s.style.top = e.clientY + "px";
        s.style.fontSize = 7 + Math.random() * 7 + "px";
        document.body.appendChild(s);
        s.addEventListener("animationend", () => s.remove());
      },
      { passive: true }
    );
  }

  /* ── falling strawberries over the hero 🍓 ── */
  const hero = document.querySelector(".hero");
  if (hero && !reducedMotion) {
    let drops = 0;
    setInterval(() => {
      if (document.hidden || drops > 12) return;
      drops++;
      const d = document.createElement("span");
      d.className = "berry-fall";
      d.textContent = DROPS[(Math.random() * DROPS.length) | 0];
      d.style.left = Math.random() * 96 + "%";
      d.style.fontSize = 12 + Math.random() * 14 + "px";
      d.style.setProperty("--dx", (Math.random() - 0.5) * 120 + "px");
      d.style.setProperty("--rot", (Math.random() - 0.5) * 300 + "deg");
      d.style.animationDuration = 7 + Math.random() * 5 + "s";
      hero.appendChild(d);
      d.addEventListener("animationend", () => {
        d.remove();
        drops--;
      });
    }, 900);
  }

  /* ── secret: click the 🎀 logo five times ── */
  const brand = document.querySelector(".brand");
  let bows = 0,
    bowTimer;
  brand.addEventListener("click", () => {
    bows++;
    clearTimeout(bowTimer);
    bowTimer = setTimeout(() => (bows = 0), 2200);
    if (bows < 5) return;
    bows = 0;
    showToast("you found the secret! 🎀✨");
    chime(["C5", "E5", "G5", "C6", "E6", "G6"], 0.08, 0.13);
    if (reducedMotion) return;
    for (let i = 0; i < 70; i++) {
      const r = document.createElement("span");
      r.className = "rain";
      r.textContent = DROPS[i % DROPS.length];
      r.style.left = Math.random() * 100 + "vw";
      r.style.fontSize = 12 + Math.random() * 16 + "px";
      r.style.setProperty("--rrot", (Math.random() - 0.5) * 540 + "deg");
      r.style.animationDuration = 1.7 + Math.random() * 1.9 + "s";
      r.style.animationDelay = Math.random() * 0.9 + "s";
      document.body.appendChild(r);
      r.addEventListener("animationend", () => r.remove());
    }
  });
})();
