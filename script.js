(() => {
  const MIN_VISIBLE_MS = 3000; // loader stays at least this long so the animation can play
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Already played this session: skip straight to the site.
  if (document.documentElement.classList.contains('seen')) {
    loader.remove();
    document.body.classList.remove('is-loading');
    return;
  }
  try { sessionStorage.setItem('sc.seen', '1'); } catch { /* ignore */ }

  const bar = document.getElementById('loader-progress');
  const start = performance.now();

  // Split the title into per-letter spans for the staggered reveal.
  document.querySelectorAll('.word').forEach((word, w) => {
    const offset = w === 0 ? 0 : 6; // second word continues the stagger
    [...word.dataset.text].forEach((letter, i) => {
      const span = document.createElement('span');
      span.className = 'ch';
      span.textContent = letter;
      span.style.animationDelay = `${0.7 + (offset + i) * 0.07}s`;
      word.appendChild(span);
    });
  });

  // Progress: real asset loading drives the bar, capped until the window load event.
  const images = [...document.images].filter((img) => !img.complete);
  let loaded = 0;
  const total = images.length + 1; // +1 for window load
  const bump = () => {
    loaded += 1;
    bar.style.transform = `scaleX(${Math.min(loaded / total, 1)})`;
  };
  images.forEach((img) => {
    img.addEventListener('load', bump, { once: true });
    img.addEventListener('error', bump, { once: true });
  });

  const finish = () => {
    bar.style.transform = 'scaleX(1)';
    const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - start));
    setTimeout(() => {
      loader.classList.add('is-done');
      document.body.classList.remove('is-loading');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, wait);
  };

  const onLoad = () => {
    bump();
    // Wait for web fonts too, so the title doesn't swap mid-animation.
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(finish);
  };

  if (document.readyState === 'complete') onLoad();
  else window.addEventListener('load', onLoad, { once: true });
})();
