// "Do not click": the Family Frame's Bedroom HQ easter egg, rebuilt for the whole site.
// Static burst → a terminal that types its way in → the screen tears and switches off like a CRT →
// the site comes back in night vision with a reticle and a live feed → "Self destruct" puts it all back.
// Purely cosmetic. Sound is synthesised (Web Audio) and only ever starts from the click.
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let on = false, ac = null, timers = [];
  const later = (ms, f) => timers.push(setTimeout(f, ms));
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  const el = (cls, html = '', tag = 'div') => { const d = document.createElement(tag); d.className = cls; d.innerHTML = html; return d; };

  // --- Sound: tiny synth, quiet by default
  const audio = () => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); } catch (e) { ac = null; } return ac; };
  const tone = (f, d, type = 'sine', v = .05, f2) => {
    const a = audio(); if (!a) return; const t = a.currentTime, o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + d + .02);
  };
  const noise = (d, v = .06, hp = 800) => {
    const a = audio(); if (!a) return; const t = a.currentTime, b = a.createBuffer(1, a.sampleRate * d, a.sampleRate), ch = b.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = b; f.type = 'highpass'; f.frequency.value = hp; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    s.connect(f).connect(g).connect(a.destination); s.start(t);
  };
  const sfx = {
    key: () => noise(.025, .05, 2500), blip: () => tone(900 + Math.random() * 500, .04, 'square', .02),
    tick: () => tone(1800, .02, 'square', .015), glitch: () => noise(.12, .07, 300), enter: () => tone(140, .09, 'triangle', .09),
    boom: () => { noise(.9, .16, 40); tone(90, .9, 'sine', .2, 30); }, beep: f => tone(f, .18, 'square', .04),
    on: () => tone(60, .5, 'sawtooth', .07, 240), siren: d => tone(420, d, 'sawtooth', .025, 900)
  };
  const say = (t, rate = .92) => { try { const u = new SpeechSynthesisUtterance(t); u.rate = rate; u.pitch = .7; u.volume = .8; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { } };

  // --- TV static, full screen
  function staticBurst(ms, label) {
    return new Promise(done => {
      const wrap = el('hq-static', `<canvas width="160" height="100"></canvas>${label ? `<p>${label}</p>` : ''}`);
      document.body.appendChild(wrap);
      const ctx = wrap.firstChild.getContext('2d'), img = ctx.createImageData(160, 100), px = new Uint32Array(img.data.buffer);
      const end = performance.now() + ms; let band = 0; sfx.glitch();
      const draw = () => {
        band = (band + 6) % 100;
        for (let i = 0; i < px.length; i++) { const y = (i / 160) | 0; let g = (Math.random() * 255) | 0; if (y >= band && y < band + 4) g = 180 + ((Math.random() * 75) | 0); px[i] = 0xff000000 | (g << 16) | (g << 8) | g; }
        ctx.putImageData(img, 0, 0);
        if (performance.now() < end) requestAnimationFrame(draw); else { wrap.remove(); done(); }
      };
      draw();
    });
  }

  // --- The terminal
  const hex = () => { let s = '0x' + ('000' + ((Math.random() * 65536) | 0).toString(16)).slice(-4) + '  '; for (let i = 0; i < 16; i++) s += ('0' + ((Math.random() * 256) | 0).toString(16)).slice(-2) + (i === 7 ? '  ' : ' '); return s; };
  const row = (k, label, v) => '  ' + (k + '         ').slice(0, 9) + label + ' ' + '.'.repeat(Math.max(3, 30 - label.length - v.length)) + ' ' + v;
  function script() {
    const P = window.PROJECTS || [], prints = (window.PRINTS && window.PRINTS.items) || [];
    const yday = new Date(Date.now() - 864e5).toDateString().toLowerCase();
    return [
      { k: 'wait', ms: 350 }, { k: 'cmd', t: 'ssh visitor@umayair.com' },
      { k: 'out', t: 'connecting to umayair.com (185.199.108.153) ...', c: 'dim' },
      { k: 'out', t: 'handshake ......................... ok' }, { k: 'out', t: 'cipher ............................ aes-256-gcm' },
      { k: 'out', t: 'host key .......................... verified' }, { k: 'hex', n: 9 }, { k: 'glitch', n: 3 }, { k: 'bar', t: 'decrypting session' },
      { k: 'out', t: '' }, { k: 'out', t: 'hq v19.93 // last login: ' + yday, c: 'amber' },
      { k: 'cmd', t: 'hq status --all' },
      { k: 'out', t: row('WORK', 'projects', String(P.length || 16)) },
      { k: 'out', t: row('A1', 'prints logged', String(prints.length || 84)) },
      { k: 'out', t: row('FRAME', 'family display', 'online') },
      { k: 'out', t: row('ODJO', 'front desk', 'answering') },
      { k: 'out', t: row('LANG', 'spoken', '5 (+17)') },
      { k: 'out', t: row('STETH', 'location', 'a drawer') },
      { k: 'out', t: row('DOOR', 'bedroom', 'secure') },
      { k: 'glitch', n: 2 }, { k: 'cmd', t: 'sudo hq --mode=ops --display=full' },
      { k: 'out', t: '[sudo] magic word for visitor: ********', c: 'dim' }, { k: 'out', t: 'ok.' }, { k: 'wait', ms: 300 },
      { k: 'out', t: 'ENTERING UMAYAIR.COM NOW.', c: 'big' }, { k: 'wait', ms: 1100 }
    ];
  }
  function boot() {
    return new Promise(done => {
      const box = el('hq-boot', '<div class="hq-screen"><div class="hq-term"></div></div>');
      document.body.appendChild(box);
      const screen = box.firstChild, term = screen.firstChild;
      const cursor = el('hq-line cmd', '', 'div'); const caret = el('hq-caret', '', 'i');
      const push = (t, c = '') => { const l = el('hq-line ' + c); l.textContent = t || ' '; term.insertBefore(l, cursor); while (term.children.length > 26) term.firstChild.remove(); return l; };
      term.appendChild(cursor); cursor.appendChild(caret);
      const typed = document.createTextNode(''); cursor.insertBefore(typed, caret);
      const jolt = k => {
        const r = a => (Math.random() * 2 - 1) * a, f = Math.random();
        const flip = k > 1 ? (f < .16 ? ' rotate(180deg)' : f < .28 ? ' scale(-1,1)' : '') : '';
        screen.style.transform = `translate(${r(30 * k) | 0}px,${r(8 * k) | 0}px) skewX(${r(3 * k).toFixed(1)}deg)${flip}`;
        box.classList.toggle('rgb', Math.random() < .6); box.classList.toggle('inv', Math.random() < .3);
      };
      const shake = (n, k, then) => { let i = 0; const go = () => { jolt(k + i * (k > 1 ? .35 : 0)); if (i % 2 === 0) sfx.glitch(); if (++i < n) later(80, go); else { screen.style.transform = ''; box.classList.remove('rgb', 'inv'); later(40, then); } }; go(); };
      const steps = script(); let i = 0;
      const next = () => {
        const st = steps[i++];
        if (!st) { // tear, collapse to a line, a dot, dark
          return shake(6, 1.4, () => {
            box.classList.add('fx-line'); sfx.enter();
            later(160, () => { box.classList.replace('fx-line', 'fx-dot'); later(200, () => { box.classList.replace('fx-dot', 'fx-dark'); later(380, () => { box.remove(); done(); }); }); });
          });
        }
        if (st.k === 'wait') return later(st.ms, next);
        if (st.k === 'glitch') return shake(st.n, .8, next);
        if (st.k === 'out') { if (st.c === 'big') { sfx.siren(1.4); say('Entering umayair dot com, now.'); } else if (st.t) sfx.blip(); push(st.t, st.c); return later(st.t ? 70 : 30, next); }
        if (st.k === 'hex') { let n = 0; const b = () => { push(hex(), 'hex'); sfx.tick(); if (++n < st.n) later(28, b); else later(120, next); }; return b(); }
        if (st.k === 'bar') { let b = 0, l = push(''); const fill = () => { l.textContent = st.t + '  [' + '#'.repeat(b) + '.'.repeat(24 - b) + '] ' + Math.round(b / 24 * 100) + '%'; if (b % 3 === 0) sfx.tick(); if (b++ < 24) later(30 + Math.random() * 40, fill); else later(150, next); }; return fill(); }
        let c = 0; typed.data = '$ ';
        const key = () => { c++; typed.data = '$ ' + st.t.slice(0, c); sfx.key(); if (c < st.t.length) later(40 + Math.random() * 70, key); else later(240, () => { sfx.enter(); typed.data = ''; push('$ ' + st.t, 'cmd'); later(140, next); }); };
        later(260, key);
      };
      next();
    });
  }

  // --- Live HQ: night vision over the real page, a reticle that follows you, a feed ticker
  let hud = null, nv = null, moveFn = null, keyFn = null;
  function live() {
    document.documentElement.classList.add('hq');
    nv = el('hq-nv'); document.body.appendChild(nv); // its own layer: a backdrop filter inside the animated HUD would only see the HUD
    hud = el('hq-hud', `<div class="hq-scan"></div>
      <i class="hq-corner tl"></i><i class="hq-corner tr"></i><i class="hq-corner bl"></i><i class="hq-corner br"></i>
      <div class="hq-reticle"><i class="h"></i><i class="v"></i><i class="ring"></i><span class="hq-xy"></span></div>
      <p class="hq-top">BEDROOM HQ // UMAYAIR.COM</p>
      <p class="hq-feed"><span class="hq-rec">●</span> LIVE · <span class="hq-tick"></span></p>
      <button class="hq-destruct" type="button">Self destruct</button>`);
    document.body.appendChild(hud);
    const ret = hud.querySelector('.hq-reticle'), xy = hud.querySelector('.hq-xy'), tick = hud.querySelector('.hq-tick');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    moveFn = e => { mx = e.clientX; my = e.clientY; }; addEventListener('pointermove', moveFn, { passive: true });
    keyFn = e => { if (e.key === 'Escape') destruct(); }; addEventListener('keydown', keyFn);
    const follow = () => { if (!hud) return; rx += (mx - rx) * .12; ry += (my - ry) * .12; ret.style.transform = `translate(${rx}px,${ry}px)`; xy.textContent = `X ${String(Math.round(rx)).padStart(4, '0')} · Y ${String(Math.round(ry + scrollY)).padStart(5, '0')}`; requestAnimationFrame(follow); };
    follow();
    const feed = () => { const s = [...document.querySelectorAll('section[id]')].find(x => { const r = x.getBoundingClientRect(); return r.top < innerHeight * .5 && r.bottom > innerHeight * .5; }); return [
      'CAM_01 // FEED NOMINAL', 'SECTOR // ' + (s ? s.id.toUpperCase() : 'HERO'), 'OPERATOR VISITOR // CLEARANCE 00', 'PRINTER // A1 IDLE', 'DOOR // SECURE', 'UPLINK // OK']; };
    let k = 0; const ticker = () => { if (!hud) return; const f = feed(); tick.textContent = f[k++ % f.length]; later(3000, ticker); }; ticker();
    const blink = () => { if (!hud) return; hud.classList.toggle('blink'); later(1000, blink); }; blink();
    const glitch = () => { later(6000 + Math.random() * 6000, () => { if (!hud) return; const kind = Math.random() < .5 ? 'shift' : 'rgb'; hud.classList.add('g-' + kind); nv.classList.toggle('g-rgb', kind === 'rgb'); sfx.glitch(); later(180, () => { hud && hud.classList.remove('g-' + kind); nv && nv.classList.remove('g-rgb'); glitch(); }); }); }; glitch();
    hud.querySelector('.hq-destruct').addEventListener('click', destruct);
    sfx.on(); later(400, () => say('Live view online.'));
    hud.querySelector('.hq-destruct').focus({ preventScroll: true });
  }

  // --- Self destruct: 3, 2, 1, flash, static, back to normal
  function destruct() {
    if (!hud || hud.dataset.going) return; hud.dataset.going = '1';
    const cd = el('hq-countdown', '<div><p>HQ SELF-DESTRUCT SEQUENCE</p><b>3</b><p class="dim">RETURNING TO CIVILIAN MODE</p></div>');
    document.body.appendChild(cd); const num = cd.querySelector('b');
    sfx.siren(2.7); say('Self destruct. Three. Two. One.', 1.05);
    [3, 2, 1].forEach((n, i) => later(i * 900, () => { num.textContent = n; sfx.beep(n === 1 ? 1320 : 990); }));
    later(2700, () => { cd.classList.add('flash'); cd.innerHTML = ''; sfx.boom(); });
    later(3050, () => { teardown(); cd.remove(); staticBurst(reduced ? 150 : 600).then(() => { on = false; }); });
  }
  function teardown() {
    document.documentElement.classList.remove('hq');
    removeEventListener('pointermove', moveFn); removeEventListener('keydown', keyFn);
    hud && hud.remove(); nv && nv.remove(); hud = nv = null;
  }

  async function start() {
    if (on) return; on = true; clear(); audio();
    document.getElementById('ovClose')?.click(); // land on the page itself, not the project panel
    if (reduced) { live(); return; }
    await staticBurst(900, 'SIGNAL INTERRUPTED');
    await boot();
    live();
  }
  document.addEventListener('click', e => { const b = e.target.closest('[data-hq]'); if (b) { e.preventDefault(); start(); } });
})();
