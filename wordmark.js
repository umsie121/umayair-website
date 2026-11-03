// The wordmark: "umayair" set in Inter Tight, where a heartbeat runs along the baseline and its
// peak shoots up the stem of the i. The top of the spike is the i's dot.
//   <span data-wordmark="nav|foot|bar|intro" data-lead="0.6"></span>
// Idle marks loop a faint pulse along the trace and beat the dot. The intro mark is played once by
// Wordmark.intro(el), which returns a GSAP timeline: draw the trace, pop the dot at the peak,
// lift the letters off the line, then let the line go.
(() => {
  'use strict';
  const WORD = ['u', 'm', 'a', 'y', 'a', 'ı', 'r']; // dotless i: the dot is ours
  const BEAT = 3.2; // seconds, matches --beat in the CSS

  function mount(el) {
    if (el.dataset.wmReady) return;
    el.dataset.wmReady = '1';
    el.classList.add('wm', 'wm--' + (el.dataset.wordmark || 'nav'));
    el.setAttribute('role', 'img'); el.setAttribute('aria-label', 'umayair');
    el.innerHTML =
      `<svg class="wm__ecg" aria-hidden="true"><path class="wm__base" /><path class="wm__pulse" pathLength="1000" /></svg><i class="wm__dot"></i>` +
      `<span class="wm__word" aria-hidden="true">${WORD.map((c, k) =>
        `<span class="wm__clip${c === 'ı' ? ' wm__clip--i' : ''}"><span class="wm__l${c === 'ı' ? ' wm__i' : ''}" style="--k:${k}">${c}</span></span>`).join('')}<span class="wm__base-probe"></span></span>`;
    draw(el);
  }

  // Build the trace in the element's own pixel space, from where the letters actually landed.
  function draw(el) {
    const box = el.getBoundingClientRect(); if (!box.width) return;
    const em = parseFloat(getComputedStyle(el).fontSize);
    const lead = parseFloat(el.dataset.lead || 0) * em;
    const b = el.querySelector('.wm__base-probe').getBoundingClientRect().top - box.top; // baseline
    const i = el.querySelector('.wm__i').getBoundingClientRect();
    const u = em; // shorthand: offsets below are in em so the heartbeat scales with the type
    // Centre on the stem's ink, not the glyph box (its side-bearings and the tight tracking pull the box off-centre)
    const iEl = el.querySelector('.wm__i'), cs = getComputedStyle(iEl);
    const ctx = (draw.ctx ||= document.createElement('canvas').getContext('2d'));
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = ctx.measureText('ı');
    const ink = (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2;
    const ix = (Number.isFinite(ink) && m.actualBoundingBoxRight ? i.left + ink : i.left + i.width / 2) - box.left, top = b - .7 * u; // the dot sits where a tittle would
    const dot = el.querySelector('.wm__dot');
    dot.style.left = ix + 'px'; dot.style.top = top + 'px';
    const d = [
      `M${-lead} ${b}`, `H${ix - .95 * u}`,
      `Q${ix - .8 * u} ${b - .1 * u} ${ix - .65 * u} ${b}`, // P wave
      `H${ix - .2 * u}`, `L${ix - .12 * u} ${b + .07 * u}`, // Q
      `L${ix} ${top}`,                                        // R: up the stem to the dot
      `L${ix + .12 * u} ${b + .14 * u}`, `L${ix + .2 * u} ${b}`, // S
      `H${ix + .38 * u}`, `Q${ix + .56 * u} ${b - .12 * u} ${ix + .74 * u} ${b}`, // T wave
      `H${box.width + lead}`
    ].join(' ');
    const svg = el.querySelector('.wm__ecg');
    svg.setAttribute('viewBox', `${-lead} 0 ${box.width + lead * 2} ${box.height}`);
    svg.style.left = -lead + 'px'; svg.style.width = box.width + lead * 2 + 'px';
    el.querySelectorAll('.wm__ecg path').forEach(p => p.setAttribute('d', d));
    // Time the dot's beat to the moment the sweeping pulse reaches the peak.
    const base = el.querySelector('.wm__base'), len = base.getTotalLength();
    let at = 0; for (let s = 0; s <= 200; s++) { const pt = base.getPointAtLength(len * s / 200); if (pt.y < top + 1) { at = s / 200; break; } }
    el.style.setProperty('--peak', (at * .6 * BEAT).toFixed(3) + 's');
    el.dataset.peak = at;
  }

  function intro(el) {
    const g = window.gsap, base = el.querySelector('.wm__base');
    const len = base.getTotalLength(), at = +el.dataset.peak || .5;
    const letters = [...el.querySelectorAll('.wm__l')];
    const iIdx = letters.findIndex(l => l.classList.contains('wm__i'));
    el.classList.add('is-intro');
    g.set(base, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
    g.set(letters, { yPercent: 110 });
    g.set(el.querySelector('.wm__dot'), { scale: 0 });
    const draw = 2.1;
    // power1.inOut covers distance unevenly, so find the time at which the trace reaches the peak
    const peakT = at < .5 ? Math.sqrt(at / 2) : 1 - Math.sqrt((1 - at) / 2);
    return g.timeline({ onComplete: () => el.classList.remove('is-intro') })
      .to(base, { strokeDashoffset: 0, duration: draw, ease: 'power1.inOut' }, 0)
      .to(el.querySelector('.wm__dot'), { scale: 1, duration: .7, ease: 'back.out(4)' }, draw * peakT - .02)
      .to(letters, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: i => Math.abs(i - iIdx) * .07 }, draw * peakT + .12)
      .to(base, { opacity: 0, duration: .9, ease: 'power2.out' }, draw - .1);
  }

  const all = () => document.querySelectorAll('[data-wordmark]');
  const redraw = () => all().forEach(draw);
  all().forEach(mount);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(redraw);
  let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(redraw, 150); });
  window.Wordmark = { mount, draw, intro, redraw };
})();
