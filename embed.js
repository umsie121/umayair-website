// Case studies open inside the home page's project overlay (in an iframe). When embedded, the page
// drops its own top bar, and its "back to work" links, plus Esc, close the overlay instead.
(() => {
  if (window.self === window.top) return;
  document.documentElement.classList.add('embed');
  const close = () => parent.postMessage('close-story', location.origin);
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  addEventListener('click', e => {
    const a = e.target.closest('a[href^="index.html"]');
    if (a) { e.preventDefault(); close(); }
  });
})();
