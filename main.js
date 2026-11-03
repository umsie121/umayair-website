(() => {
  'use strict';
  const doc = document.documentElement;
  doc.classList.add('js');
  // Always start at the top so the intro plays over the hero, not mid-page.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash.startsWith('#/work/')) scrollTo(0, 0);
  const hasGsap = typeof window.gsap !== 'undefined';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const P = window.PROJECTS || [];
  const pad = n => String(n).padStart(2, '0');
  const img = name => `assets/work/${name}.webp`;
  // A project film: muted, looping, buffered up front so it's already moving when you reach it.
  // In the overlay it loops with controls; in the grid it plays once when it comes into view and
  // stops on the finished logo (end), just before the film's loop-back fade.
  const filmTag = (p, controls) => controls
    ? `<video src="${p.video.src}" poster="${p.video.poster}" ${reducedMotion() ? '' : 'autoplay'} muted loop playsinline preload="auto" controls aria-label="${p.title} film"></video>`
    : `<video src="${p.video.src}" poster="${p.video.poster}" muted playsinline preload="auto"${p.video.end ? ` data-end="${p.video.end}"` : ''} aria-label="${p.title} film"></video>`;
  function reducedMotion() { return matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /* ---------------- Text splitting ---------------- */
  $$('.split-chars').forEach(el => {
    el.innerHTML = [...el.textContent].map((c, i) => `<span class="char" style="--ci:${i}">${c}</span>`).join('');
  });
  $$('.split-words').forEach(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="word">${w}</span>`).join(' ');
  });

  /* ---------------- Live London clock + greeting ---------------- */
  const londonParts = () => {
    const f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const [h, m, s] = f.format(new Date()).split(':');
    return { h: +h, hh: h, mm: m, ss: s };
  };
  const tick = () => {
    const t = londonParts();
    $$('[data-clock]').forEach(el => (el.textContent = `London ${t.hh}:${t.mm}`));
    $$('[data-clock-full]').forEach(el => (el.textContent = `${t.hh}:${t.mm}:${t.ss}`));
  };
  tick(); setInterval(tick, 1000);
  const hr = londonParts().h;
  $('#greeting').textContent = hr < 5 ? 'Up late' : hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
  $('#year').textContent = new Date().getFullYear();

  /* ---------------- Render projects ---------------- */
  const track = $('#hscrollTrack');
  const featured = P.filter(p => p.featured);
  track.innerHTML = featured.map((p, i) => `
    <article class="feature" data-slug="${p.slug}" data-cursor="view" style="--c1:${p.colors[0]};--c2:${p.colors[1]}" tabindex="0" role="button" aria-label="Open ${p.title}">
      <div class="feature__bg"></div>
      <div class="feature__img"${p.video ? ` style="--ar:${p.video.ar}"` : ''}>${p.video ? filmTag(p) : `<img src="${img(p.images[0])}" alt="${p.title} — ${p.cat}" loading="lazy" />`}</div>
      <div class="feature__info">
        <span class="feature__num">${pad(i + 1)} / ${pad(featured.length)}</span>
        <h3 class="feature__title">${p.title}</h3>
        <p class="feature__tag">${p.tagline}</p>
        <div class="feature__meta"><span>${p.cat}</span>${p.year ? `<span>${p.year}</span>` : ''}</div>
      </div>
    </article>`).join('') + `
    <div class="feature feature--end">
      <p class="mono" style="color:var(--ink-3);margin:0">+ ${P.length - featured.length} more below</p>
      <h3>That's the <span class="serif-i grad-text">highlights.</span></h3>
      <a href="#index" class="btn magnetic" data-cursor="hover"><span>See the rest ↓</span></a>
    </div>`;

  // Grid films: play through once on first sight, then hold on the logo
  const films = new Map();
  const playOnce = v => {
    if (films.has(v)) return films.get(v).go();
    const end = +v.dataset.end || Infinity, s = { held: false, seen: false };
    const stop = () => { s.held = true; v.pause(); v.currentTime = end; };
    const watch = () => { if (s.held) return; if (v.currentTime >= end - .04) return stop(); v.requestVideoFrameCallback ? v.requestVideoFrameCallback(watch) : setTimeout(watch, 40); };
    s.go = () => { if (!s.held && v.paused) v.play().then(watch).catch(() => {}); };
    // Chrome sometimes cuts off one of several films starting together; pick it back up while it's on screen
    v.addEventListener('pause', () => setTimeout(() => s.seen && s.go(), 500));
    v.addEventListener('ended', () => (s.held = true));
    films.set(v, s); s.seen = true; s.go();
  };
  const filmIO = new IntersectionObserver(es => es.forEach(e => {
    const s = films.get(e.target);
    if (s) s.seen = e.isIntersecting;
    if (e.isIntersecting) playOnce(e.target);
  }), { threshold: .4 });
  if (!reducedMotion()) $$('video', track).forEach(v => filmIO.observe(v));

  // Size each frame to its artwork's own proportions so logos are never cropped.
  $$('.feature__img img', track).forEach(im => {
    const fit = () => im.naturalWidth && im.parentElement.style.setProperty('--ar', im.naturalWidth / im.naturalHeight);
    im.complete ? fit() : im.addEventListener('load', fit);
  });

  const others = P.filter(p => !p.featured); // the archive lists only what isn't in the grid above
  $('#indexList').innerHTML = others.map((p, i) => `
    <li class="index__item" style="--c1:${p.colors[0]};--c2:${p.colors[1]}">
      <button data-slug="${p.slug}" data-img="${img(p.images[0])}" data-cursor="view">
        <span class="index__n">${pad(i + 1)}</span>
        <span class="index__title">${p.title}</span>
        <span class="index__cat">${p.cat}</span>
        <span class="index__year">${p.year}</span>
      </button>
    </li>`).join('');
  $('#indexCount').textContent = pad(others.length);
  $('#projectCount').textContent = P.length;

  /* ---------------- Sketchbook (Instagram posts, hosted here) ---------------- */
  const POSTS = window.POSTS || [];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtDate = iso => { const [y, m, d] = iso.split('-'); return `${+d} ${MONTHS[m - 1]} ${y}`; };
  $('#sketchGrid').innerHTML = POSTS.map((p, i) => `
    <button class="sketch__item" data-i="${i}" data-cursor="view" aria-label="${p.kind}: ${p.cap.replace(/"/g, '&quot;')}">
      <img src="assets/ig/${p.id}.webp" alt="" loading="lazy" />
      <span class="sketch__meta mono"><span>${p.kind}</span><span>${p.date.slice(0, 4)}</span></span>
    </button>`).join('');

  const lb = $('#lightbox');
  const openLb = i => {
    const p = POSTS[i];
    $('#lbImg').src = `assets/ig/${p.id}.webp`;
    $('#lbMeta').textContent = `${p.kind} · ${fmtDate(p.date)}`;
    $('#lbCap').textContent = p.cap;
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); lenis?.stop(); $('#lbClose').focus({ preventScroll: true });
  };
  const closeLb = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); lenis?.start(); };
  $('#sketchGrid').addEventListener('click', e => { const b = e.target.closest('.sketch__item'); b && openLb(+b.dataset.i); });
  lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('#lbClose')) closeLb(); });
  addEventListener('keydown', e => e.key === 'Escape' && lb.classList.contains('open') && closeLb());

  /* ---------------- Workshop (3D print log) ---------------- */
  const PR = window.PRINTS || { items: [], tags: {} };
  const hrs = m => m < 60 ? m + ' min' : (m / 60 < 10 ? Math.round(m / 6) / 10 : Math.round(m / 60)) + ' h';
  const totalMin = PR.items.reduce((n, p) => n + p.m, 0);
  const longest = PR.items.reduce((a, b) => (b.m > a.m ? b : a), PR.items[0] || { m: 0, t: '' });
  const sinceD = new Date(PR.since);
  $('#shopSince').textContent = `${sinceD.getDate()} ${MONTHS[sinceD.getMonth()]} ${sinceD.getFullYear()}`;
  // A fixed snapshot (prints.js is never synced), so the range is stated, not "until now"
  const untilD = new Date(PR.items.reduce((a, p) => (p.at > a ? p.at : a), PR.since));
  $('#shopUntil').textContent = `${untilD.getDate()} ${MONTHS[untilD.getMonth()]} ${untilD.getFullYear()}`;
  $('#shopStats').innerHTML = [
    [PR.items.length, 'things printed'],
    [Math.round(totalMin / 60), 'hours on the bed'],
    [PR.items.reduce((n, p) => n + p.n, 0), 'successful runs'],
    [Math.round(longest.m / 60), `hours, longest print (${longest.t})`]
  ].map(([v, l]) => `<div><dt class="mono">${l}</dt><dd data-count="${v}">${v}</dd></div>`).join('');

  // Hours printed per week, oldest on the left.
  const weekMs = 7 * 864e5, start = sinceD.getTime();
  const weeks = [];
  PR.items.forEach(p => { const w = Math.floor((Date.parse(p.at) - start) / weekMs); weeks[w] = (weeks[w] || 0) + p.m; });
  const peak = Math.max(...weeks.filter(Boolean), 1);
  $('#shopBars').innerHTML = Array.from(weeks, (m = 0, i) =>
    `<span style="--h:${Math.max(.03, m / peak)}" title="Week of ${fmtDate(new Date(start + i * weekMs).toISOString().slice(0, 10))}: ${hrs(m)}"></span>`).join('');

  const tagCount = {};
  PR.items.forEach(p => (tagCount[p.tag] = (tagCount[p.tag] || 0) + 1));
  const topTags = Object.keys(tagCount).filter(t => t !== 'Misc').sort((a, b) => tagCount[b] - tagCount[a]).slice(0, 8);
  $('#shopFilters').innerHTML = [`<button class="is-on" data-tag="" data-cursor="hover">All <i>${PR.items.length}</i></button>`]
    .concat(topTags.map(t => `<button data-tag="${t}" data-cursor="hover" style="--tc:${PR.tags[t]}">${t} <i>${tagCount[t]}</i></button>`)).join('');
  // The prints sit in a drawer, a page at a time
  const PER = 18; let shopTag = '', shopPage = 0;
  const printCard = (p, d) => `
    <li class="print pop" style="--tc:${PR.tags[p.tag] || '#8e8e93'};--d:${d}" tabindex="0">
      <div class="print__img">${p.img ? `<img src="assets/prints/${p.id}.jpg" alt="${p.t}" loading="lazy" />` : '<span class="print__none" aria-hidden="true">◇</span>'}</div>
      <div class="print__info"><b>${p.t}</b><span class="mono">${hrs(p.m)}${p.n > 1 ? ` · ×${p.n}` : ''} · ${fmtDate(p.at).replace(/ \d{4}$/, '')}</span></div>
    </li>`;
  const renderPrints = () => {
    const list = PR.items.filter(p => !shopTag || p.tag === shopTag), pages = Math.ceil(list.length / PER);
    shopPage = Math.min(shopPage, Math.max(0, pages - 1));
    $('#shopGrid').innerHTML = list.slice(shopPage * PER, shopPage * PER + PER).map((p, i) => printCard(p, i)).join('');
    $('#shopPages').innerHTML = pages < 2 ? '' :
      `<button data-page="${shopPage - 1}" ${shopPage ? '' : 'disabled'} aria-label="Previous page">←</button>` +
      Array.from({ length: pages }, (_, k) => `<button data-page="${k}" class="${k === shopPage ? 'is-on' : ''}" aria-label="Page ${k + 1}">${k + 1}</button>`).join('') +
      `<button data-page="${shopPage + 1}" ${shopPage < pages - 1 ? '' : 'disabled'} aria-label="Next page">→</button>`;
    window.ScrollTrigger?.refresh();
  };
  $('#shopToggleN').textContent = PR.items.length;
  $('#shopToggle').addEventListener('click', () => {
    const open = $('#shopDrawer').hidden;
    $('#shopDrawer').hidden = !open; $('#shopToggle').setAttribute('aria-expanded', open);
    $('#shopToggleLabel').textContent = open ? 'Hide the prints' : 'Show the prints';
    if (open) renderPrints(); else window.ScrollTrigger?.refresh();
  });
  $('#shopFilters').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#shopFilters button').forEach(x => x.classList.toggle('is-on', x === b));
    shopTag = b.dataset.tag; shopPage = 0; renderPrints();
  });
  $('#shopPages').addEventListener('click', e => {
    const b = e.target.closest('button[data-page]'); if (!b || b.disabled) return;
    shopPage = +b.dataset.page; renderPrints();
    const top = $('#shopFilters').getBoundingClientRect().top + scrollY - 100;
    lenis ? lenis.scrollTo(top) : scrollTo({ top, behavior: 'smooth' });
  });

  /* ---------------- Hello, in every language I can at least say hello in ---------------- */
  const HELLO = [['Hello', 'English'], ['As-salamu alaykum', 'Arabic'], ['Hola', 'Spanish'], ['কেমন আছেন?', 'Bangla'], ['Bonjour', 'French'],
    ['你好', 'Mandarin'], ['안녕하세요', 'Korean'], ['สวัสดี', 'Thai'], ['नमस्ते', 'Hindi'], ['آداب', 'Urdu'], ['வணக்கம்', 'Tamil'], ['Bok', 'Croatian'],
    ['Ciao', 'Italian'], ['Olá', 'Portuguese'], ['Γειά σου', 'Greek'], ['Moien', 'Luxembourgish'], ['Merhaba', 'Turkish'], ['Apa khabar', 'Malay'],
    ['Halo', 'Indonesian'], ['Om Swastiastu', 'Balinese'], ['Ndewo', 'Igbo'], ['કેમ છો', 'Gujarati'], ['Hallo', 'German']];
  const say = $('#helloSay'), lang = $('#helloLang');
  if (say && !reducedMotion()) {
    let h = 0, timer = null;
    const swap = () => {
      h = (h + 1) % HELLO.length;
      gsap.to([say, lang], { yPercent: -60, opacity: 0, duration: .35, ease: 'power2.in', onComplete: () => {
        say.textContent = HELLO[h][0]; lang.textContent = HELLO[h][1];
        gsap.fromTo([say, lang], { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .55, ease: 'expo.out', stagger: .05 });
      } });
    };
    new IntersectionObserver(([e]) => { clearInterval(timer); if (e.isIntersecting) timer = setInterval(swap, 1700); }).observe(say);
  }

  /* ---------------- WebGL flowing gradient ---------------- */
  const FRAG = `
    precision highp float;
    uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uHue; uniform float uIntensity;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y); }
    float fbm(vec2 p){ float v=0., a=.5; mat2 r=mat2(.8,.6,-.6,.8); for(int i=0;i<5;i++){ v+=a*noise(p); p=r*p*2.02; a*=.5; } return v; }
    vec3 hueShift(vec3 c, float a){ const vec3 k=vec3(.57735); float ca=cos(a); return c*ca + cross(k,c)*sin(a) + k*dot(k,c)*(1.-ca); }
    void main(){
      vec2 uv = gl_FragCoord.xy / uRes; vec2 p = uv; p.x *= uRes.x / uRes.y;
      float t = uTime * .06;
      vec2 m = uMouse; m.x *= uRes.x / uRes.y;
      vec2 q = vec2(fbm(p*1.4 + t), fbm(p*1.4 - t + 3.1));
      vec2 r = vec2(fbm(p*1.8 + 3.*q + vec2(1.7,9.2) + t*1.3), fbm(p*1.8 + 3.*q + vec2(8.3,2.8) - t));
      float d = distance(p, m); r += .25 * exp(-d*3.5);
      float f = fbm(p*1.2 + 2.6*r);
      vec3 ink = vec3(.027,.027,.043);
      vec3 violet = vec3(.48,.36,1.); vec3 rose = vec3(1.,.37,.48); vec3 gold = vec3(1.,.79,.29); vec3 teal = vec3(.09,.77,.66);
      vec3 col = mix(ink, violet, smoothstep(.2,.75,f));
      col = mix(col, rose, smoothstep(.45,.95, r.x) * .85);
      col = mix(col, gold, smoothstep(.62,1.05, r.y*f*1.6) * .7);
      col = mix(col, teal, smoothstep(.55,.9, q.y) * .25);
      col = hueShift(col, uHue);
      float vig = smoothstep(1.25, .2, distance(uv, vec2(.55,.75)));
      col = mix(ink, col, vig * uIntensity);
      col += (hash(gl_FragCoord.xy + uTime) - .5) * .025;
      gl_FragColor = vec4(col, 1.);
    }`;
  const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a,0.,1.); }`;

  function gradientCanvas(canvas, intensity) {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) { canvas.style.background = 'radial-gradient(80% 80% at 70% 20%, #7b5cff55, transparent 60%), radial-gradient(60% 60% at 20% 80%, #ff5e7a44, transparent 60%)'; return; }
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = n => gl.getUniformLocation(prog, n);
    const uRes = U('uRes'), uTime = U('uTime'), uMouse = U('uMouse'), uHue = U('uHue'), uInt = U('uIntensity');
    // The palette drifts with London's time of day — warmer at dusk, cooler at night.
    const hour = londonParts().h;
    gl.uniform1f(uHue, Math.sin((hour / 24) * Math.PI * 2) * 0.35);
    gl.uniform1f(uInt, intensity);
    const mouse = { x: .7, y: .6, tx: .7, ty: .6 };
    let visible = true, w = 0, h = 0;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 1.5) * 0.6; // render low-res, it's a soft gradient
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height); gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize(); addEventListener('resize', resize);
    addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width; mouse.ty = 1 - (e.clientY - r.top) / r.height;
    });
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(canvas);
    const start = performance.now();
    const loop = now => {
      requestAnimationFrame(loop);
      if (!visible) return;
      mouse.x += (mouse.tx - mouse.x) * .04; mouse.y += (mouse.ty - mouse.y) * .04;
      gl.uniform1f(uTime, reduced ? 20 : (now - start) / 1000 + 20);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    requestAnimationFrame(loop);
  }
  gradientCanvas($('#gl'), 1);
  gradientCanvas($('#gl2'), .75);

  /* ---------------- Custom cursor + archive preview ---------------- */
  const cursor = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring');
  const preview = $('.preview'), previewInner = $('.preview__inner');
  const pos = { x: innerWidth / 2, y: innerHeight / 2 }, rp = { ...pos }, pp = { ...pos };
  if (finePointer) {
    document.body.classList.add('has-cursor');
    addEventListener('pointermove', e => {
      if (!cursor.classList.contains('is-live')) { rp.x = pp.x = e.clientX; rp.y = pp.y = e.clientY; cursor.classList.add('is-live'); }
      pos.x = e.clientX; pos.y = e.clientY;
    });
    document.documentElement.addEventListener('mouseleave', () => cursor.classList.remove('is-live'));
    const follow = () => {
      rp.x += (pos.x - rp.x) * .18; rp.y += (pos.y - rp.y) * .18;
      pp.x += (pos.x - pp.x) * .1; pp.y += (pos.y - pp.y) * .1;
      dot.style.transform = `translate(${pos.x}px,${pos.y}px)`;
      ring.style.transform = `translate(${rp.x}px,${rp.y}px)`;
      const rot = Math.max(-12, Math.min(12, (pos.x - pp.x) * .15));
      preview.style.left = pp.x + 'px'; preview.style.top = pp.y + 'px';
      previewInner.style.transform = `rotate(${rot}deg)`;
      requestAnimationFrame(follow);
    };
    follow();
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor], a, button');
      cursor.classList.toggle('is-view', !!t && t.dataset.cursor === 'view');
      cursor.classList.toggle('is-hover', !!t && t.dataset.cursor !== 'view');
    });
    let lastSrc = '';
    $$('.index__item button').forEach(b => {
      b.addEventListener('pointerenter', () => {
        if (b.dataset.img !== lastSrc) {
          lastSrc = b.dataset.img;
          const im = new Image(); im.src = lastSrc; im.alt = '';
          im.style.opacity = 0; previewInner.appendChild(im);
          requestAnimationFrame(() => (im.style.opacity = 1));
          while (previewInner.children.length > 3) previewInner.firstChild.remove();
        }
        preview.classList.add('on');
      });
      b.addEventListener('pointerleave', () => preview.classList.remove('on'));
    });
  }

  /* ---------------- Magnetic + tilt ---------------- */
  if (finePointer && !reduced) {
    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .3, y = (e.clientY - r.top - r.height / 2) * .35;
        el.style.transform = `translate(${x}px,${y}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)'; el.style.transform = '';
        setTimeout(() => (el.style.transition = ''), 600);
      });
    });
    $$('.tilt').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateY(${(px - .5) * 10}deg) rotateX(${(.5 - py) * 10}deg)`;
        el.style.setProperty('--mx', px * 100 + '%'); el.style.setProperty('--my', py * 100 + '%');
      });
      el.addEventListener('pointerleave', () => {
        el.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1)'; el.style.transform = '';
        setTimeout(() => (el.style.transition = ''), 800);
      });
    });
  }

  /* ---------------- Nav: hide on scroll down, active section ---------------- */
  const nav = $('#nav'); let lastY = 0;
  // Mobile wayfinding: a progress bar along the top and a pill naming the section you're in
  const whereSecs = $$('main .label.mono').map(l => ({ el: l.closest('section'), num: l.querySelector('span').textContent.replace(/[()]/g, ''), name: l.textContent.replace(/\(\d+\)/, '').trim() })).filter(s => s.el);
  const wherePill = $('#wherePill'), whereBar = $('#whereBar'), whereFill = $('#whereFill');
  $('#wherePill em').textContent = '/ ' + String(whereSecs.length).padStart(2, '0');
  let whereAt = -1;
  const where = y => {
    if (innerWidth > 860) return;
    const p = Math.min(1, Math.max(0, y / (document.documentElement.scrollHeight - innerHeight)));
    whereBar.style.transform = `scaleX(${p})`; whereFill.style.strokeDashoffset = 1 - p;
    let i = -1; whereSecs.forEach((s, k) => { if (s.el.getBoundingClientRect().top < innerHeight * .5) i = k; });
    wherePill.classList.toggle('on', i >= 0 && !menuOpen);
    if (i >= 0 && i !== whereAt) {
      whereAt = i; $('#whereNum').textContent = whereSecs[i].num; $('#whereName').textContent = whereSecs[i].name;
      window.gsap && gsap.fromTo('#whereName', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .45, ease: 'expo.out' });
    }
  };
  wherePill.addEventListener('click', () => setMenu(true));
  const onScroll = y => {
    where(y);
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && !menuOpen);
    lastY = y;
  };
  const sections = ['work', 'about', 'journey', 'now'].map(id => document.getElementById(id));
  const navObserver = new IntersectionObserver(entries => entries.forEach(e => {
    const link = $(`.nav__links a[href="#${e.target.id}"]`);
    if (e.isIntersecting) $$('.nav__links a').forEach(a => a.classList.toggle('active', a === link));
    else link?.classList.remove('active');
  }), { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => s && navObserver.observe(s));

  /* ---------------- Mobile menu ---------------- */
  const burger = $('#burger'), menu = $('#menu'); let menuOpen = false;
  const setMenu = open => {
    menuOpen = open; menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open); menu.setAttribute('aria-hidden', !open);
    open ? lenis?.stop() : lenis?.start();
    wherePill.classList.toggle('on', !open && whereAt >= 0);
  };
  burger.addEventListener('click', () => setMenu(!menuOpen));
  $$('#menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------------- Smooth scroll ---------------- */
  let lenis = null;
  if (typeof window.Lenis !== 'undefined' && !reduced) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ({ scroll }) => { onScroll(scroll); hasGsap && ScrollTrigger.update(); });
    if (hasGsap) { gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  } else {
    addEventListener('scroll', () => onScroll(scrollY), { passive: true });
  }
  // Chrome restores the old scroll position after load; undo that so the intro starts at the top.
  const toTop = () => { if (!location.hash) { scrollTo(0, 0); lenis?.scrollTo(0, { immediate: true, force: true }); } };
  toTop(); addEventListener('load', () => { toTop(); setTimeout(toTop, 0); });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = id === '#top' ? 0 : document.querySelector(id);
    if (target === null) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(target, { offset: 0, duration: 1.6 }) : (target === 0 ? scrollTo({ top: 0, behavior: 'smooth' }) : target.scrollIntoView({ behavior: 'smooth' }));
  });

  /* ---------------- Copy email ---------------- */
  const copyBtn = $('#copyEmail');
  copyBtn.addEventListener('click', async () => {
    const hint = $('.contact__email-hint', copyBtn);
    try { await navigator.clipboard.writeText(copyBtn.dataset.email); hint.textContent = 'Copied ✓ — speak soon'; }
    catch { location.href = 'mailto:' + copyBtn.dataset.email; }
    setTimeout(() => (hint.textContent = 'Click to copy'), 2400);
  });

  /* ---------------- Project overlay (hash-routed) ---------------- */
  const overlay = $('#overlay'), panel = $('#ovPanel');
  let current = -1, lastFocus = null;
  const openProject = (slug, push = true) => {
    const i = P.findIndex(p => p.slug === slug);
    if (i < 0) return;
    const p = P[i]; current = i;
    // Case studies: the overlay becomes the full case study page, with just the close button on top
    const frame = $('#ovFrame');
    overlay.classList.toggle('is-story', !!p.story);
    if (p.story) { if (!frame.src.endsWith(p.story)) frame.src = p.story; cursor && (cursor.style.opacity = 0); }
    else if (frame.src) frame.removeAttribute('src');
    panel.style.setProperty('--c1', p.colors[0]); panel.style.setProperty('--c2', p.colors[1]);
    $('#ovIdx').textContent = pad(i + 1); $('#ovCat').textContent = p.cat; $('#ovYear').textContent = p.year ? ' / ' + p.year : '';
    $('#ovTitle').textContent = p.title;
    $('#ovText').innerHTML = `<p class="tagline">${p.tagline}</p>` + p.text.map(t => `<p>${t}</p>`).join('');
    $('#ovMedia').innerHTML = (p.video ? filmTag(p, true) : '') + p.images.map(n => `<img src="${img(n)}" alt="${p.title}" loading="lazy" />`).join('');
    $('#ovNextTitle').textContent = P[(i + 1) % P.length].title;
    requestAnimationFrame(() => $('#ovText').classList.toggle('is-tall', $('#ovText').offsetHeight > innerHeight - 120)); // too tall to stick: scroll with the panel
    panel.scrollTop = 0;
    if (!overlay.classList.contains('open')) {
      lastFocus = document.activeElement;
      overlay.classList.add('open'); overlay.setAttribute('aria-hidden', 'false');
      lenis?.stop(); document.body.style.overflow = 'hidden';
      setTimeout(() => $('#ovClose').focus({ preventScroll: true }), 50);
    }
    if (p.story) { if (push) history.pushState({ slug }, '', '#/work/' + slug); return; }
    if (hasGsap && !reduced) {
      gsap.fromTo('#ovTitle', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: .15 });
      gsap.fromTo('#ovMedia img, #ovText > *', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: .06, delay: .25 });
    }
    if (push) history.pushState({ slug }, '', '#/work/' + slug);
  };
  const closeProject = (push = true) => {
    if (!overlay.classList.contains('open')) return;
    overlay.classList.remove('open'); overlay.setAttribute('aria-hidden', 'true');
    lenis?.start(); document.body.style.overflow = '';
    if (cursor) cursor.style.opacity = '';
    setTimeout(() => { if (!overlay.classList.contains('open')) { $('#ovFrame').removeAttribute('src'); overlay.classList.remove('is-story'); } }, 900);
    cursor?.classList.remove('is-view', 'is-hover');
    lastFocus?.focus?.({ preventScroll: true });
    if (push) history.pushState({}, '', location.pathname + location.search);
  };
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-slug]');
    if (t) { e.preventDefault(); openProject(t.dataset.slug); }
  });
  $$('.feature[data-slug]').forEach(f => f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(f.dataset.slug); } }));
  $('#ovClose').addEventListener('click', () => closeProject());
  $('.overlay__bg').addEventListener('click', () => closeProject());
  $('#ovNext').addEventListener('click', () => openProject(P[(current + 1) % P.length].slug));
  $('#ovPrev').addEventListener('click', () => openProject(P[(current - 1 + P.length) % P.length].slug));
  addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeProject();
    if (overlay.classList.contains('is-story')) return;
    if (e.key === 'ArrowRight') $('#ovNext').click();
    if (e.key === 'ArrowLeft') $('#ovPrev').click();
  });
  const route = () => {
    const m = location.hash.match(/^#\/work\/([\w-]+)/);
    m ? openProject(m[1], false) : closeProject(false);
  };
  addEventListener('message', e => { if (e.origin === location.origin && e.data === 'close-story') closeProject(); });
  addEventListener('popstate', route);
  addEventListener('hashchange', route);

  /* ---------------- Loader + choreography ---------------- */
  const loader = $('#loader');
  const finishIntro = () => {
    document.body.classList.remove('is-loading');
    route();
  };

  if (!hasGsap) {
    loader.remove(); $$('.reveal-up').forEach(el => (el.style.cssText = 'opacity:1;transform:none'));
    $$('.manifesto__text .word').forEach(w => w.classList.add('lit'));
    finishIntro(); return;
  }

  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add('is-loading');
  lenis?.stop();

  gsap.set('.hero__title .char', { yPercent: 115 });
  gsap.set('.hero__role > *', { y: 40, opacity: 0 });

  const counter = { v: 0 };
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro
    .add(window.Wordmark.intro($('.loader [data-wordmark]')).timeScale(reduced ? 8 : 1), 0)
    .to(counter, {
      v: 100, duration: reduced ? .2 : 2.6, ease: 'power2.inOut',
      onUpdate() {
        $('#loaderCount').textContent = String(Math.round(counter.v)).padStart(3, '0');
      }
    }, 0)
    .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '+=.15')
    .add(() => { loader.remove(); lenis?.start(); finishIntro(); })
    .to('.hero__title .char', { yPercent: 0, duration: 1.4, stagger: .055 }, '-=.55')
    .to('.hero__role > *', { y: 0, opacity: 1, duration: 1.1, stagger: .08 }, '-=1.1')
    .to('.hero .reveal-up', { y: 0, opacity: 1, duration: 1.1, stagger: .1 }, '-=.9')
    .from('.hero__bottom', { opacity: 0, y: 20, duration: 1 }, '-=.8')
    .fromTo('.nav', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, clearProps: 'transform,opacity' }, '-=1');
  gsap.set(loader, { clipPath: 'inset(0 0 0% 0)' });

  if (reduced) return;

  // Hero parallax out
  gsap.to('.hero__inner', { yPercent: -18, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__gl', { yPercent: 25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Marquee: one continuous GSAP loop. Scrolling only changes its speed (eased), so it never restarts
  // or jumps. (Changing a CSS animation's duration mid-run recomputes its position, which caused the jump.)
  const mq = $('.marquee__track');
  mq.style.animation = 'none';
  const loop = gsap.to(mq, { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });
  ScrollTrigger.create({
    trigger: '.marquee', start: 'top bottom', end: 'bottom top',
    onUpdate: s => {
      gsap.to(loop, { timeScale: 1 + Math.min(3, Math.abs(s.getVelocity()) / 700), duration: .25, overwrite: true,
        onComplete: () => gsap.to(loop, { timeScale: 1, duration: 1.2, ease: 'power2.out' }) });
    }
  });

  // Manifesto: words light up as you read
  const mwords = $$('.manifesto__text .word');
  ScrollTrigger.create({
    trigger: '.manifesto__text', start: 'top 80%', end: 'bottom 45%', scrub: true,
    onUpdate: s => { const n = Math.round(s.progress * mwords.length); mwords.forEach((w, i) => w.classList.toggle('lit', i < n)); }
  });

  // Generic reveals
  $$('.about__copy p, .chips, .label, .display, .cap, .now__card, .status, .index__head, .also__card').forEach(el => {
    gsap.from(el, { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  $$('.fact').forEach((el, i) => {
    gsap.from(el, { y: 90, rotation: i % 2 ? 7 : -7, scale: .9, opacity: 0, duration: 1.3, ease: 'back.out(1.5)', scrollTrigger: { trigger: el, start: 'top 90%' } });
  });
  gsap.from('.about__portrait', { clipPath: 'inset(100% 0 0 0)', scale: 1.15, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.about', start: 'top 80%' } });
  gsap.from('.index__item', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: .05, scrollTrigger: { trigger: '.index__list', start: 'top 85%' } });
  gsap.from('.contact__title .word', { yPercent: 100, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .06, scrollTrigger: { trigger: '.contact', start: 'top 70%' } });
  gsap.from('.footer__big', { yPercent: 40, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 95%' } });

  // Journey: glowing progress line and nodes
  const jb = $('.journey__body');
  ScrollTrigger.create({
    trigger: jb, start: 'top 65%', end: 'bottom 65%', scrub: true,
    onUpdate: s => jb.style.setProperty('--prog', s.progress)
  });
  $$('.journey__list li').forEach(li => {
    ScrollTrigger.create({ trigger: li, start: 'top 65%', onEnter: () => li.classList.add('seen'), onLeaveBack: () => li.classList.remove('seen') });
    gsap.from(li.children, { x: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .08, scrollTrigger: { trigger: li, start: 'top 85%' } });
  });

  // Sketchbook: tiles rise in, columns drift at different speeds
  ScrollTrigger.batch('.sketch__item', {
    start: 'top 92%', once: true,
    onEnter: els => gsap.from(els, { y: 80, opacity: 0, rotate: () => gsap.utils.random(-4, 4), duration: 1.2, ease: 'expo.out', stagger: .07 })
  });

  // Workshop: count up, bars grow
  $$('#shopStats dd').forEach(dd => {
    const o = { v: 0 }, to = +dd.dataset.count;
    gsap.to(o, { v: to, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: '#shopStats', start: 'top 85%' }, onUpdate: () => (dd.textContent = Math.round(o.v)) });
  });
  gsap.from('#shopBars span', { scaleY: 0, duration: 1.2, ease: 'expo.out', stagger: .04, scrollTrigger: { trigger: '#shopBars', start: 'top 90%' } });

  // Featured work: a grid with every film playing; each row fades in level as it arrives
  ScrollTrigger.batch($$('.feature', track), {
    start: 'top 92%', once: true,
    onEnter: els => gsap.from(els, { opacity: 0, duration: .8, ease: 'power2.out', clearProps: 'opacity' })
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
