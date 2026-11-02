// Case study: smooth scroll, the heartbeat logo, and the pinned diagram that rebuilds the
// Submissions mark one step at a time. Geometry is in the same 1600×1600 space as the final
// logo image, so the last vector step lines up exactly with the real artwork.
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    'Fig. 6 — Three readings of one shape'
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

  let readTimer = null;
  const show = i => {
    $('#stageFig').textContent = FIGS[i];
    const dur = reduced ? 0 : 1.2;
    set(i >= 2 ? 'mark' : 'cube', dur);
    solid(i >= 3);
    frame.classList.toggle('is-yellow', i >= 3);
    $('#stageDrafts').classList.toggle('on', i === 1);
    $('.stage__svg').style.opacity = i === 1 ? .12 : 1;
    $('#noteCorner').classList.toggle('on', i === 2);
    $('#noteGap').classList.toggle('on', i === 3);
    $('#stageFinal').classList.toggle('on', i >= 4);
    $('#readings').classList.toggle('on', i === 5);
    clearInterval(readTimer);
    if (i === 5) { // cycle the three readings
      let r = 0; const tick = () => { $$('.reading').forEach(g => g.classList.toggle('on', +g.dataset.r === r)); r = (r + 1) % 3; };
      tick(); readTimer = setInterval(tick, 2200);
    }
    $$('.step').forEach(s => s.classList.toggle('is-active', +s.dataset.step === i));
  };
  set('cube', 0); show(0);

  // Which step is in the middle of the screen
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && show(+e.target.dataset.step)), { rootMargin: '-45% 0px -45% 0px' });
  $$('.step').forEach(s => io.observe(s));

  // Gentle reveals for book content
  $$('.spread .h2, .spread .lede, .pull, .flow li, .plate, .wall img, .timeline li, .stats div, .rubin, .part h2').forEach(el => el.classList.add('reveal'));
  const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 7) * 40 + 'ms'; rio.observe(el); });

  // Smooth scroll, same feel as the main site
  if (window.Lenis && !reduced) {
    const lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  }
})();
