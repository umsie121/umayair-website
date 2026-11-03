// Odjo case study: the mark is rebuilt as you scroll (scrubbed), from the old search icon, through
// the usual AI look and the forest palette, to one leaf turned around a centre, joined into one stem.
// Leaf geometry sits on the real mark (centre 500,494; tips on r 371), so the last step lands on it.
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const E = (tag, a, parent) => { const el = document.createElementNS(NS, tag); for (const k in a) el.setAttribute(k, a[k]); parent.appendChild(el); return el; };
  const LEAF = 'M418,520 C585,440 620,265 500,123 C380,265 415,440 582,520';
  const ANGLES = [0, -69, 69, -128, 128];
  const CHANNELS = ['Calls', 'WhatsApp', 'Email', 'Web forms', 'Documents'];

  const leaves = ANGLES.map(() => E('path', { d: LEAF, stroke: '#cfe3c4', 'stroke-width': 5, pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1, opacity: 0 }, $('#oleaves')));
  const chan = $('#ochan');
  ANGLES.forEach((a, k) => {
    const r = a * Math.PI / 180, x = 500 + 445 * Math.sin(r), y = 494 - 445 * Math.cos(r);
    E('text', { x, y: y + 9, 'text-anchor': Math.abs(a) < 10 ? 'middle' : a < 0 ? 'end' : 'start', class: 'olabel olabel--w' }, chan).textContent = CHANNELS[k].toUpperCase();
  });
  E('text', { x: 500, y: 935, 'text-anchor': 'middle', class: 'olabel olabel--w' }, chan).textContent = 'ONE RECORD';

  const FIGS = ['Fig. 1 — The old mark', 'Fig. 2 — The usual AI look', 'Fig. 3 — From the forest', 'Fig. 4 — One leaf',
    'Fig. 5 — Five leaves, one centre', 'Fig. 6 — Joined, with one stem', 'Fig. 7 — Every channel, one root', 'Fig. 8 — At app-icon size'];

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
    // 1 · the old mark, critiqued
    tl.fromTo('.om', { opacity: 0 }, { opacity: 1, duration: .2, stagger: .3 }, .15);
    // 2 · the usual AI look
    tl.to('#old', { opacity: 0, duration: .2 }, 1.0).to('#usual', { opacity: 1, duration: .15 }, 1.1)
      .fromTo('.ut', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .15, stagger: .07 }, 1.15);
    // 3 · go organic
    tl.to('#usual', { opacity: 0, duration: .2 }, 2.0).to('#oframe', { backgroundColor: '#3b4e3c', duration: .3 }, 2.0)
      .to('#organic', { opacity: 1, duration: .1 }, 2.15)
      .fromTo('#oforest', { attr: { 'stroke-dashoffset': 1 }, fillOpacity: 0 }, { attr: { 'stroke-dashoffset': 0 }, duration: .5, immediateRender: false }, 2.15)
      .to('#oforest', { fillOpacity: .35, duration: .2 }, 2.6);
    // 4 · blueprint, one leaf
    tl.to('#organic', { opacity: 0, duration: .2 }, 3.0).to('#ogridR', { opacity: 1, duration: .2 }, 3.05)
      .to('#oguide', { attr: { 'stroke-dashoffset': 0 }, duration: .35 }, 3.1).to('#ohub', { opacity: 1, duration: .1 }, 3.35)
      .set(leaves[0], { opacity: 1 }, 3.45).to(leaves[0], { attr: { 'stroke-dashoffset': 0 }, duration: .4 }, 3.45);
    // 5 · turned around one centre
    tl.set(leaves.slice(1), { opacity: 1, attr: { 'stroke-dashoffset': 0 } }, 4.0);
    leaves.forEach((p, k) => k && tl.fromTo(p, { rotation: 0, svgOrigin: '500 494' }, { rotation: ANGLES[k], svgOrigin: '500 494', duration: .5, ease: 'power2.inOut', immediateRender: false }, 4.05 + k * .02));
    // 6 · joined, thickened, one stem
    tl.to(['#ogridR', '#ocons'], { opacity: 0, duration: .2 }, 5.0)
      .to(leaves, { attr: { stroke: '#ffffff', 'stroke-width': 35 }, duration: .3 }, 5.05)
      .to('#ostem', { attr: { 'stroke-dashoffset': 0 }, duration: .35, ease: 'power2.out' }, 5.4);
    // 7 · the real mark, every channel labelled
    tl.to('#oreal', { opacity: 1, duration: .25 }, 6.05).to([leaves, '#ostem'], { opacity: 0, duration: .2 }, 6.2)
      .to('#ochan', { opacity: 1, duration: .25 }, 6.3).to('#osvg', { scale: .82, transformOrigin: '50% 50%', duration: .3 }, 6.1);
    // 8 · tested small
    tl.to('#osvg', { scale: .4, opacity: 0, duration: .3 }, 7.05).to('#oframe', { backgroundColor: '#e8e3d6', duration: .3 }, 7.05)
      .to('#osmall', { opacity: 1, duration: .25 }, 7.25).to({}, { duration: .5 }, 7.5);

    ScrollTrigger.create({
      trigger: '#mark', start: 'top top', end: 'bottom bottom', scrub: .5,
      onUpdate: st => { tl.progress(st.progress); $('#ofig').textContent = FIGS[Math.min(7, Math.floor(st.progress * 8))]; $('#osmall').classList.toggle('on', st.progress > .93); }
    });
    if (reduced) tl.progress(1);
  }

  // The forest: outline draws, then Hyde Parks drop in at the same scale, and the numbers count up
  const M = window.ODJO_MAP;
  if (M) {
    $('#fEF').setAttribute('d', M.ef); $('#oforest').setAttribute('d', M.ef);
    const hp = $('#fHP'), parks = [];
    for (let k = 0; k < 17; k++) {
      const g = E('g', { transform: `translate(${710 + (k % 3) * 150} ${150 + Math.floor(k / 3) * 100})` }, hp);
      parks.push(E('path', { d: M.hp, class: 'fm-hp' }, g));
    }
    const facts = $$('[data-count]');
    const fmt = (f, v) => (f.dataset.plain ? String(Math.round(v)) : Math.round(v).toLocaleString('en-GB'));
    const run = () => {
      if (!window.gsap || reduced) {
        $('#fEF').style.strokeDashoffset = 0; $('#fHPn').textContent = 17;
        facts.forEach(f => (f.textContent = fmt(f, +f.dataset.count)));
        return;
      }
      const n = { v: 0 };
      gsap.timeline()
        .fromTo('#fEF', { attr: { 'stroke-dashoffset': 1 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 2.2, ease: 'power2.inOut' })
        .to('#fEF', { fillOpacity: .9, duration: .8 }, '-=.4')
        .fromTo(parks, { scale: 0, transformOrigin: '50% 50%', opacity: 0 }, { scale: 1, opacity: 1, duration: .45, ease: 'back.out(1.7)', stagger: .09 }, '-=.6')
        .to(n, { v: 17, duration: 17 * .09 + .3, ease: 'none', onUpdate: () => ($('#fHPn').textContent = Math.round(n.v)) }, '<');
      facts.forEach((f, i) => {
        const c = { v: 0 };
        gsap.to(c, { v: +f.dataset.count, duration: 1.8, delay: .3 + i * .15, ease: 'power2.out', onUpdate: () => (f.textContent = fmt(f, c.v)) });
      });
    };
    const fio = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); fio.disconnect(); } }, { rootMargin: '0px 0px -25% 0px' });
    fio.observe($('#fmap'));
  }

  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && $$('.ostep').forEach(s => s.classList.toggle('is-active', s === e.target))), { rootMargin: '-45% 0px -45% 0px' });
  $$('.ostep').forEach(s => io.observe(s));

  $$('.spread .h2, .spread .lede, .use, .forest__facts > div').forEach(el => el.classList.add('reveal'));
  const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.reveal').forEach(el => rio.observe(el));

  if (window.Lenis && !reduced) {
    const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  }
})();
