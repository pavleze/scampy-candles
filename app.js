(() => {
  const RATE = 117.2; // 1 EUR → RSD (mock)

  const PRODUCTS = [
    { id: 1, name: 'Lavanda & Med',        family: 'Cvetno',    size: '200 g', price: 14.9, color: '#cdbfe0', tag: 'Bestseler' },
    { id: 2, name: 'Vanila & Karamel',     family: 'Slatko',    size: '200 g', price: 15.9, color: '#ecd3a3', tag: 'Novo' },
    { id: 3, name: 'Cedar & Amber',        family: 'Drvenasto', size: '300 g', price: 19.9, color: '#c9a77c' },
    { id: 4, name: 'Bela čaj ruža',        family: 'Cvetno',    size: '200 g', price: 14.9, color: '#efc9cf' },
    { id: 5, name: 'Eukaliptus & Mesec',   family: 'Svež',      size: '200 g', price: 14.9, color: '#bcd5c7' },
    { id: 6, name: 'Cimet & Jabuka',       family: 'Slatko',    size: '300 g', price: 19.9, color: '#e0a98b', tag: 'Sezonski' },
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---------- Safe storage ----------
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
  };

  const state = {
    currency: store.get('sc.currency', 'EUR'),
    cart: store.get('sc.cart', {}),   // { [id]: qty }
    filter: 'all',
    query: '',
  };

  // ---------- Money ----------
  const money = (eur) => state.currency === 'EUR'
    ? `${eur.toFixed(2).replace('.', ',')} €`
    : `${Math.round(eur * RATE).toLocaleString('sr-RS')} RSD`;

  // ---------- Candle illustration ----------
  const candleSVG = (c) => `
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <ellipse cx="60" cy="108" rx="34" ry="5" fill="rgba(0,0,0,.08)"/>
      <path d="M60 22c6 8 9 13 9 18a9 9 0 0 1-18 0c0-5 3-10 9-18Z" fill="#f2c26b"/>
      <path d="M60 30c3 4 4 7 4 9a4 4 0 0 1-8 0c0-2 1-5 4-9Z" fill="#fff4d6"/>
      <rect x="59" y="46" width="2" height="9" rx="1" fill="#4a3b2e"/>
      <path d="M32 58h56v38a10 10 0 0 1-10 10H42a10 10 0 0 1-10-10V58Z" fill="${c}"/>
      <path d="M32 58h56v7a28 7 0 0 1-56 0v-7Z" fill="rgba(255,255,255,.35)"/>
      <rect x="40" y="76" width="40" height="18" rx="2" fill="rgba(255,255,255,.72)"/>
      <circle cx="60" cy="85" r="4" fill="#c2a67b"/>
    </svg>`;

  // ---------- Product grid ----------
  const grid = $('#grid');
  const empty = $('#empty');

  function renderGrid() {
    const q = state.query.trim().toLowerCase();
    const list = PRODUCTS.filter((p) =>
      (state.filter === 'all' || p.family === state.filter) &&
      (!q || `${p.name} ${p.family}`.toLowerCase().includes(q)));

    grid.innerHTML = list.map((p) => `
      <article class="card">
        <div class="card__media" style="--tone:${p.color}">
          ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ''}
          ${candleSVG(p.color)}
        </div>
        <div class="card__body">
          <p class="card__family">${p.family} · ${p.size}</p>
          <h3 class="card__name">${p.name}</h3>
          <div class="card__row">
            <span class="card__price" data-price="${p.price}">${money(p.price)}</span>
            <button class="btn btn--small" type="button" data-add="${p.id}">Dodaj</button>
          </div>
        </div>
      </article>`).join('');
    empty.hidden = list.length > 0;
  }

  $('#filters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    state.filter = b.dataset.filter;
    $$('#filters .chip').forEach((c) => c.classList.toggle('is-active', c === b));
    renderGrid();
  });

  grid.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    const id = b.dataset.add;
    state.cart[id] = (state.cart[id] || 0) + 1;
    saveCart();
    renderCart();
    const p = PRODUCTS.find((x) => x.id == id);
    toast(`${p.name} je u korpi`);
    bump();
  });

  // ---------- Currency ----------
  function setCurrency(cur) {
    state.currency = cur;
    store.set('sc.currency', cur);
    $$('.currency button').forEach((b) => b.classList.toggle('is-active', b.dataset.currency === cur));
    renderGrid();
    renderCart();
  }
  $('.currency').addEventListener('click', (e) => {
    const b = e.target.closest('[data-currency]');
    if (b) setCurrency(b.dataset.currency);
  });

  // ---------- Cart ----------
  const drawer = $('#drawer');
  const overlay = $('#overlay');
  const itemsEl = $('#drawer-items');
  const countEl = $('#cart-count');

  const saveCart = () => store.set('sc.cart', state.cart);

  function renderCart() {
    const rows = Object.entries(state.cart)
      .map(([id, qty]) => ({ p: PRODUCTS.find((x) => x.id == id), qty }))
      .filter((r) => r.p && r.qty > 0);

    const count = rows.reduce((n, r) => n + r.qty, 0);
    const total = rows.reduce((s, r) => s + r.qty * r.p.price, 0);

    countEl.textContent = count;
    countEl.hidden = count === 0;
    $('#drawer-total').textContent = money(total);
    $('#checkout').disabled = count === 0;

    itemsEl.innerHTML = rows.length ? rows.map(({ p, qty }) => `
      <div class="line">
        <div class="line__thumb" style="--tone:${p.color}">${candleSVG(p.color)}</div>
        <div class="line__info">
          <strong>${p.name}</strong>
          <span class="muted">${p.size} · ${money(p.price)}</span>
          <div class="qty">
            <button type="button" data-dec="${p.id}" aria-label="Manje">−</button>
            <span>${qty}</span>
            <button type="button" data-inc="${p.id}" aria-label="Više">+</button>
          </div>
        </div>
        <div class="line__sum">${money(p.price * qty)}</div>
      </div>`).join('')
      : '<p class="drawer__empty">Korpa je prazna.<br>Dodaj neku sveću 🕯️</p>';
  }

  itemsEl.addEventListener('click', (e) => {
    const inc = e.target.closest('[data-inc]');
    const dec = e.target.closest('[data-dec]');
    if (inc) state.cart[inc.dataset.inc] += 1;
    if (dec) {
      const id = dec.dataset.dec;
      state.cart[id] -= 1;
      if (state.cart[id] <= 0) delete state.cart[id];
    }
    if (inc || dec) { saveCart(); renderCart(); }
  });

  function openCart() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('is-on'));
    document.body.classList.add('no-scroll');
  }
  function closeCart() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-on');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { overlay.hidden = true; }, 300);
  }
  $('#cart-btn').addEventListener('click', openCart);
  $('#drawer-close').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  $('#checkout').addEventListener('click', () => toast('Plaćanje stiže uskoro 🐾'));

  function bump() {
    const b = $('#cart-btn');
    b.classList.remove('bump');
    void b.offsetWidth;
    b.classList.add('bump');
  }

  // ---------- Search ----------
  const searchForm = $('#search');
  const searchInput = $('#search-input');
  const searchBtn = $('#search-btn');

  function toggleSearch(force) {
    const open = force ?? searchForm.hidden;
    searchForm.hidden = !open;
    searchBtn.setAttribute('aria-expanded', String(open));
    if (open) searchInput.focus();
    else { searchInput.value = ''; state.query = ''; renderGrid(); }
  }
  searchBtn.addEventListener('click', () => toggleSearch());
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $('#prodavnica').scrollIntoView({ behavior: 'smooth' });
  });
  searchInput.addEventListener('input', () => {
    state.query = searchInput.value;
    renderGrid();
  });

  // ---------- Mobile menu ----------
  const menuBtn = $('#menu-btn');
  const nav = $('#nav');
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      nav.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // ---------- Header shadow on scroll + active link ----------
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const links = $$('.nav a');
  const targets = links.map((a) => $(a.getAttribute('href')));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${en.target.id}`));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach((t) => t && io.observe(t));
  }

  // ---------- Newsletter ----------
  $('#newsletter').addEventListener('submit', (e) => {
    e.preventDefault();
    e.target.hidden = true;
    $('#newsletter-ok').hidden = false;
  });

  // ---------- Toast ----------
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 2200);
  }

  // ---------- Esc closes things ----------
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (drawer.classList.contains('is-open')) closeCart();
    else if (!searchForm.hidden) toggleSearch(false);
  });

  // ---------- Init ----------
  setCurrency(state.currency);
})();
