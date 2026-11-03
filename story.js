// Case study: smooth scroll, the heartbeat logo, and the pinned diagram that rebuilds the
// Submissions mark one step at a time. Geometry is in the same 1600×1600 space as the final
// logo image, so the last vector step lines up exactly with the real artwork.
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // The step being read: mid-screen on desktop, just under the pinned figure on phones
  const PHONE = matchMedia('(max-width: 900px)').matches;
  const STEP_BAND = PHONE ? '-62% 0px -26% 0px' : '-45% 0px -45% 0px';
  let playTopfig = () => {};

  // Each face of the cube is three strips: black top, gold band, black body.
  // 'cube' is an isometric view; 'mark' is the flattened corner-on view (measured from the logo).
  const SHAPES = {
    cube: {
      topFace: '800,330 1180,500 800,670 420,500',
      lTop: '420,500 800,670 800,769 420,599', lBand: '420,599 800,769 800,811 420,641', lBody: '420,641 800,811 800,1130 420,960',
      rTop: '800,670 1180,500 1180,599 800,769', rBand: '800,769 1180,599 1180,641 800,811', rBody: '800,811 1180,641 1180,960 800,1130'
    },
    mark: {
      topFace: '801,313 801,313 801,313 801,313',
      lTop: '332,487 801,313 801,459 332,632', lBand: '332,632 801,459 801,522 332,694', lBody: '332,694 801,522 801,1002 332,1160',
      rTop: '801,313 1270,487 1270,632 801,459', rBand: '801,459 1270,632 1270,694 801,522', rBody: '801,522 1270,694 1270,1160 801,1002'
    }
  };
  const FIGS = [
    'Fig. 1 — The Ka‘bah, as a cube',
    'Fig. 2 — First drafts, 2020',
    'Fig. 3 — Seen from the corner',
    'Fig. 4 — The band becomes a gap',
    'Fig. 5 — The final mark',
    'Fig. 6 — Three readings of one shape',
    'Fig. 7 — The final mark at 60 pixels'
  ];
  const frame = $('.stage__frame'), ids = Object.keys(SHAPES.cube);
  const set = (shape, dur) => ids.forEach(id => {
    const el = document.getElementById(id);
    if (!window.gsap || dur === 0) el.setAttribute('points', SHAPES[shape][id]);
    else gsap.to(el, { attr: { points: SHAPES[shape][id] }, duration: dur, ease: 'expo.inOut' });
  });
  const solid = on => { // flat black faces, gold left out, top face gone
    $$('.f-top, .f-left, .f-right').forEach(el => (el.style.fill = on ? '#131313' : ''));
    $$('.f-band').forEach(el => { el.style.transition = 'opacity .8s, fill .8s'; el.style.opacity = on ? 0 : 1; });
    $('#topFace').style.opacity = on ? 0 : 1;
  };
  $$('.stage__svg polygon').forEach(el => (el.style.transition = 'fill .8s, opacity .8s'));

  let readTimer = null, critTimer = null;
  const show = i => {
    $('#stageFig').textContent = FIGS[i];
    const dur = reduced ? 0 : 1.2;
    set(i >= 2 ? 'mark' : 'cube', dur);
    solid(i >= 3);
    frame.classList.toggle('is-yellow', i >= 3 && i < 6);
    // The drafts: fanned out, then the front one critiqued. The last step checks the final mark at app-icon size
    $('#stageDrafts').classList.toggle('on', i === 1);
    clearTimeout(critTimer); $('#stageDrafts').classList.remove('is-crit'); $('#crit').classList.remove('on');
    if (i === 1) critTimer = setTimeout(() => { $('#stageDrafts').classList.add('is-crit'); $('#crit').classList.add('on'); }, reduced ? 0 : 1100);
    $('#small').classList.toggle('on', i === 6);
    $('.stage__svg').style.opacity = i === 1 || i === 6 ? 0 : 1;
    $('#noteCorner').classList.toggle('on', i === 2);
    $('#noteGap').classList.toggle('on', i === 3);
    $('#stageFinal').classList.toggle('on', i === 4 || i === 5);
    $('#readings').classList.toggle('on', i === 5);
    clearInterval(readTimer);
    if (i === 5) { // cycle the three readings
      let r = 0; const tick = () => { $$('.reading').forEach(g => g.classList.toggle('on', +g.dataset.r === r)); r = (r + 1) % 3; };
      tick(); readTimer = setInterval(tick, 2200);
    }
    $$('.step[data-step]').forEach(s => s.classList.toggle('is-active', +s.dataset.step === i));
  };
  set('cube', 0); show(0);

  // Which step is in the middle of the screen
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && show(+e.target.dataset.step)), { rootMargin: STEP_BAND });
  $$('.step[data-step]').forEach(s => io.observe(s));


  // Part three: one portrait built up as you scroll (scrubbed), then the whole set.
  // Layers are the portrait's flat colours, largest first; the outlines come from the same layers.
  const psvg = $('#psvg');
  let ptl = null;
  if (psvg && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const NS = 'http://www.w3.org/2000/svg';
    const E = (tag, a = {}, parent = psvg) => { const el = document.createElementNS(NS, tag); for (const k in a) el.setAttribute(k, a[k]); parent.appendChild(el); return el; };
    const COLS = ['#e3dcf2', '#c5bfde', '#d9a072', '#3d2b1a'], BP = '#a9d6ff';
    const defs = E('defs');
    const pat = E('pattern', { id: 'pgrid', width: 80, height: 80, patternUnits: 'userSpaceOnUse' }, defs);
    E('path', { d: 'M80,0 H0 V80', fill: 'none', stroke: BP, 'stroke-width': 1.5, opacity: .25 }, pat);
    const f = E('filter', { id: 'pout', x: '-5%', y: '-5%', width: '110%', height: '110%' }, defs);
    E('feMorphology', { in: 'SourceAlpha', operator: 'dilate', radius: 3, result: 'd' }, f);
    E('feComposite', { in: 'd', in2: 'SourceAlpha', operator: 'out', result: 'o' }, f);
    E('feFlood', { 'flood-color': BP }, f); E('feComposite', { in2: 'o', operator: 'in' }, f);
    const bp = E('g'); E('rect', { width: 1600, height: 1600, fill: '#163a5a' }, bp); E('rect', { width: 1600, height: 1600, fill: 'url(#pgrid)' }, bp);
    const guide = E('g', { fill: 'none', stroke: BP, 'stroke-width': 3 });
    const dash = (d, a = {}) => E('path', { d, pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1, ...a }, guide);
    const axis = dash('M800,120 V1600', { opacity: .5 });
    const head = dash('M610,640 A190,250 0 1 1 990,640 A190,250 0 1 1 610,640', { opacity: .6 });
    const shoulders = dash('M260,1600 Q300,1180 800,1130 Q1300,1180 1340,1600', { opacity: .6 });
    const art = E('g');
    const layers = COLS.map((c, i) => ({
      out: E('image', { href: `assets/story/portrait/u-${i}.webp`, width: 1600, height: 1600, filter: 'url(#pout)', opacity: 0 }, art),
      fill: E('image', { href: `assets/story/portrait/u-${i}.webp`, width: 1600, height: 1600, opacity: 0 }, art)
    }));
    // fills go under the outlines
    layers.forEach(l => art.insertBefore(l.fill, art.firstChild));
    const real = E('image', { href: 'assets/work/submissions-illustrations-5.webp', width: 1600, height: 1600, opacity: 0 }, art);
    const sw = E('g'); const dots = COLS.map((c, i) => E('circle', { cx: 1140 + i * 70, cy: 1490, r: 0, fill: c, stroke: '#131313', 'stroke-opacity': .2, 'stroke-width': 3 }, sw));
    const yellowDot = E('circle', { cx: 1070, cy: 1490, r: 0, fill: '#fbc528', stroke: '#131313', 'stroke-opacity': .2, 'stroke-width': 3 }, sw);
    const note = E('g', { fill: 'none', stroke: '#131313', 'stroke-width': 3, opacity: 0 });
    E('ellipse', { cx: 800, cy: 700, rx: 210, ry: 250, 'stroke-dasharray': '14 12' }, note);
    E('path', { d: 'M1010,700 H1210' }, note);
    const t = E('text', { x: 1220, y: 690, fill: '#131313', stroke: 'none', 'font-family': 'JetBrains Mono, monospace', 'font-size': 34 }, note); t.textContent = 'no eyes,';
    const t2 = E('text', { x: 1220, y: 735, fill: '#131313', stroke: 'none', 'font-family': 'JetBrains Mono, monospace', 'font-size': 34 }, note); t2.textContent = 'no mouth';
    const set = $$('#pset img');
    const FIGS = ['Fig. 12 — Line work', 'Fig. 13 — Four colours and the yellow', 'Fig. 14 — Left blank on purpose', 'Fig. 15 — Light and shade', 'Fig. 16 — The team'];

    ptl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
    ptl.to(axis, { attr: { 'stroke-dashoffset': 0 }, duration: .3 }, .05).to(head, { attr: { 'stroke-dashoffset': 0 }, duration: .35 }, .15)
      .to(shoulders, { attr: { 'stroke-dashoffset': 0 }, duration: .35 }, .25);
    layers.forEach((l, i) => ptl.to(l.out, { opacity: 1, duration: .15 }, .35 + i * .14));
    // 1 → 2: blueprint gives way to yellow, colours fill in largest first
    ptl.to(bp, { opacity: 0, duration: .3 }, 1.0).to(guide, { opacity: 0, duration: .3 }, 1.0).to(yellowDot, { attr: { r: 24 }, duration: .1 }, 1.05);
    layers.forEach((l, i) => {
      ptl.fromTo(l.fill, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .16 }, 1.15 + i * .17)
        .to(dots[i], { attr: { r: 24 }, duration: .1 }, 1.15 + i * .17)
        .to(l.out, { opacity: 0, duration: .16 }, 1.2 + i * .17);
    });
    // 2 → 3: the face that isn't there
    ptl.to(note, { opacity: 1, duration: .25 }, 2.1).to(note, { opacity: 0, duration: .2 }, 2.8);
    // 3 → 4: light and shade
    ptl.to(real, { opacity: 1, duration: .6 }, 3.1).to(sw, { opacity: 0, duration: .3 }, 3.5);
    // 4 → 5: the portrait joins the rest of the team
    ptl.to(psvg, { scale: .27, yPercent: -15, duration: .5 }, 4.05).to(psvg, { opacity: 0, duration: .05 }, 4.55)
      .fromTo(set, { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .3, stagger: .06 }, 4.3)
      .to({}, { duration: .2 }, 4.8);
    // Desktop: scrubbed with the scroll. Phones: each step snaps under the figure and its part plays through.
    if (!PHONE) ScrollTrigger.create({
      trigger: '#portraits', start: 'top top', end: 'bottom bottom', scrub: .5,
      onUpdate: st => { ptl.progress(st.progress); $('#pfig').textContent = FIGS[Math.min(4, Math.floor(st.progress * 5))]; }
    });
    playTopfig = k => {
      gsap.to(ptl, { time: Math.min(ptl.duration(), k + 1) - .001, duration: 1.1, ease: 'power2.out', overwrite: true });
      $('#pfig').textContent = FIGS[k];
    };
    const pio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const steps = $$('.pstep'); steps.forEach(s => s.classList.toggle('is-active', s === e.target)); if (PHONE) playTopfig(steps.indexOf(e.target)); }), { rootMargin: STEP_BAND });
    $$('.pstep').forEach(s => pio.observe(s));
  }

  // Gentle reveals for book content
  $$('.spread .h2, .spread .lede, .pull, .flow li, .plate, .wall img, .timeline li, .stats div, .rubin, .part h2').forEach(el => el.classList.add('reveal'));
  const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 7) * 40 + 'ms'; rio.observe(el); });

  // Smooth scroll, same feel as the main site
  if (window.Lenis && !reduced) {
    const lenis = new Lenis({ lerp: .16, wheelMultiplier: 1.25 });
    if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  }
})();
