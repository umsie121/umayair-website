// KCL BSOC case study: the mark is rebuilt in vector as you scroll (scrubbed), from the old stamp
// through the brief, the flag, one petal, ten petals, the band, the map, one colour and the small test.
// Geometry matches the finished logo (petal tips on r 432, band 389–611, centre disc r 163).
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // The step being read: mid-screen on desktop, just under the pinned figure on phones
  const PHONE = matchMedia('(max-width: 900px)').matches;
  const STEP_BAND = PHONE ? '-62% 0px -26% 0px' : '-45% 0px -45% 0px';
  let playTobfig = () => {};
  const NS = 'http://www.w3.org/2000/svg';
  const E = (tag, a, parent) => { const el = document.createElementNS(NS, tag); for (const k in a) el.setAttribute(k, a[k]); parent.appendChild(el); return el; };
  const PETAL = 'M500,500 Q666,284 500,68 Q334,284 500,500 Z';

  // Ten petals for the stage (all start stacked at 0°) and for the one-colour mark
  const petals = [...Array(10)].map(() => E('path', { d: PETAL, fill: 'url(#pg)', 'fill-opacity': 0, stroke: '#a9d6ff', 'stroke-width': 5, opacity: 0 }, $('#petals')));
  [...Array(10)].forEach((_, k) => E('path', { d: PETAL, transform: `rotate(${k * 36} 500 500)` }, $('#monoPetals')));
  const cons = $('#cons');
  const rays = [...Array(10)].map((_, k) => { const a = (-90 + k * 36) * Math.PI / 180; return E('path', { d: `M500,500 L${500 + 432 * Math.cos(a)},${500 + 432 * Math.sin(a)}`, pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1, opacity: .6 }, cons); });

  const FIGS = ['Fig. 1 — The old mark', 'Fig. 2 — The brief', 'Fig. 3 — The flag', 'Fig. 4 — One petal', 'Fig. 5 — Ten petals, 36° apart',
    'Fig. 6 — The band', 'Fig. 7 — The country', 'Fig. 8 — One colour', 'Fig. 9 — At profile-picture size'];

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
    // 1 · the old mark, critiqued
    tl.fromTo('.om', { opacity: 0 }, { opacity: 1, duration: .2, stagger: .25 }, .15);
    // 2 · the brief
    tl.to('#old', { opacity: 0, duration: .2 }, 1.0).to('#brief', { opacity: 1, duration: .2 }, 1.1)
      .fromTo('.bl', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: .15, stagger: .1 }, 1.2);
    // 3 · the flag pulls into a circle, its disc to the centre
    tl.to('#brief', { opacity: 0, duration: .15 }, 2.0).to(['#field', '#sun'], { opacity: 1, duration: .15 }, 2.1)
      .to('#field', { attr: { x: 20, y: 20, width: 960, height: 960, rx: 480 }, duration: .5, ease: 'power2.inOut' }, 2.35)
      .to('#sun', { attr: { cx: 500, cy: 500, r: 120 }, duration: .5, ease: 'power2.inOut' }, 2.35);
    // 4 · blueprint: guide circle, rays, one petal drawn
    tl.to('#bp', { opacity: 1, duration: .2 }, 3.0).to('#field', { opacity: .18, duration: .2 }, 3.0).to('#sun', { opacity: 0, duration: .2 }, 3.0)
      .to('#cons .dl', { attr: { 'stroke-dashoffset': 0 }, duration: .3 }, 3.1)
      .to(rays, { attr: { 'stroke-dashoffset': 0 }, duration: .15, stagger: .03 }, 3.25)
      .to('#pen', { attr: { 'stroke-dashoffset': 0 }, duration: .35 }, 3.55);
    // 5 · ten copies, then the flag's colours
    tl.set(petals, { opacity: 1 }, 4.0).to('#pen', { opacity: 0, duration: .1 }, 4.0);
    petals.forEach((p, k) => tl.fromTo(p, { rotation: 0, svgOrigin: '500 500' }, { rotation: k * 36, svgOrigin: '500 500', duration: .45, ease: 'power2.inOut', immediateRender: false }, 4.05 + k * .01));
    tl.to('#bp', { opacity: 0, duration: .2 }, 4.6).to(cons, { opacity: 0, duration: .2 }, 4.6).to('#field', { opacity: 1, duration: .2 }, 4.6)
      .to(petals, { attr: { 'fill-opacity': 1, stroke: '#ffffff' }, duration: .25 }, 4.65);
    // 6 · the band and the name
    tl.to('#bandRect', { attr: { x: 0, width: 1000 }, duration: .35, ease: 'power2.inOut' }, 5.1)
      .fromTo('#tKCL', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: .25 }, 5.4).fromTo('#tBSOC', { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: .25 }, 5.45);
    // 7 · the centre disc and the map
    tl.to('#disc', { attr: { r: 163 }, duration: .3, ease: 'back.out(1.6)' }, 6.1).fromTo('#mapG', { opacity: 0, scale: .7, svgOrigin: '500 500' }, { opacity: 1, scale: 1, svgOrigin: '500 500', duration: .3 }, 6.35);
    // 8 · one colour: white on maroon, petals as line art
    tl.to('#bframe', { backgroundColor: '#5c1230', duration: .3 }, 7.1)
      .to('#field', { attr: { fill: '#ffffff' }, duration: .3 }, 7.1)
      .to(petals, { attr: { 'fill-opacity': 0, stroke: '#7a1631', 'stroke-width': 16 }, duration: .3 }, 7.15)
      .to('#bandRect', { attr: { fill: '#7a1631' }, duration: .3 }, 7.15).to(['#tKCL', '#tBSOC'], { attr: { fill: '#ffffff' }, duration: .3 }, 7.15)
      .to('#disc', { attr: { fill: '#7a1631' }, duration: .3 }, 7.15).to('#mapG', { opacity: 0, duration: .2 }, 7.2).to('#mapW', { opacity: 1, duration: .2 }, 7.2);
    // 9 · tested small
    tl.to('#bsvg', { scale: .5, opacity: 0, duration: .3 }, 8.05).to('#bframe', { backgroundColor: '#e8e3d6', duration: .3 }, 8.05)
      .to('#bsmall', { opacity: 1, duration: .25 }, 8.25).to({}, { duration: .5 }, 8.5);

    // Desktop: scrubbed with the scroll. Phones: each step snaps under the figure and its part plays through.
    if (!PHONE) ScrollTrigger.create({
      trigger: '#mark', start: 'top top', end: 'bottom bottom', scrub: .5,
      onUpdate: st => { tl.progress(st.progress); $('#bfig').textContent = FIGS[Math.min(8, Math.floor(st.progress * 9))]; $('#bsmall').classList.toggle('on', st.progress > .93); }
    });
    playTobfig = k => {
      gsap.to(tl, { time: Math.min(tl.duration(), k + 1) - .001, duration: 1.1, ease: 'power2.out', overwrite: true });
      $('#bfig').textContent = FIGS[k]; $('#bsmall').classList.toggle('on', k === 8);
    };
    if (reduced) tl.progress(1);
  }

  const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const steps = $$('.bstep'); steps.forEach(s => s.classList.toggle('is-active', s === e.target)); if (PHONE) playTobfig(steps.indexOf(e.target)); }), { rootMargin: STEP_BAND });
  $$('.bstep').forEach(s => io.observe(s));

  $$('.spread .h2, .spread .lede, .plate, .hoodie').forEach(el => el.classList.add('reveal'));
  const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.reveal').forEach(el => rio.observe(el));

  if (window.Lenis && !reduced) {
    const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  }
})();
