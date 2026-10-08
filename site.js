/* Shared across all pages: data, cart, currency, header, footer, cart drawer. */
(() => {
  const RATE = 117.2;      // 1 EUR → RSD (mock)
  const SHIPPING = 3.5;    // EUR
  const FREE_OVER = 40;    // EUR

  const PRODUCTS = [
    { id: 1, name: 'Lavanda & Med',      family: 'Cvetno',    size: '200 g', price: 14.9, color: '#cdbfe0', tag: 'Bestseler', burn: 45,
      desc: 'Smirujući miris lavande sa toplom notom domaćeg meda. Savršena za večernje opuštanje.',
      notes: { 'Gornje note': 'lavanda, bergamot', 'Srednje note': 'med, kamilica', 'Donje note': 'bela mošusna nota' } },
    { id: 2, name: 'Vanila & Karamel',   family: 'Slatko',    size: '200 g', price: 15.9, color: '#ecd3a3', tag: 'Novo', burn: 45,
      desc: 'Kremasta vanila i slani karamel. Miris kao iz kuhinje u kojoj se peku kolači.',
      notes: { 'Gornje note': 'mleko, šećer', 'Srednje note': 'vanila, karamel', 'Donje note': 'tonka pasulj' } },
    { id: 3, name: 'Cedar & Amber',      family: 'Drvenasto', size: '300 g', price: 19.9, color: '#c9a77c', burn: 65,
      desc: 'Duboka, topla drvenasta kompozicija. Dobro dođe u većim prostorijama i hladnim danima.',
      notes: { 'Gornje note': 'bors, citrus', 'Srednje note': 'cedar, ćilibar', 'Donje note': 'sandalovina' } },
    { id: 4, name: 'Bela čaj ruža',      family: 'Cvetno',    size: '200 g', price: 14.9, color: '#efc9cf', burn: 45,
      desc: 'Nežna ruža sa belim čajem. Lagana, elegantna i nikad previše nametljiva.',
      notes: { 'Gornje note': 'beli čaj, pelargonija', 'Srednje note': 'ruža, božur', 'Donje note': 'mošus' } },
    { id: 5, name: 'Eukaliptus & Mesec', family: 'Svež',      size: '200 g', price: 14.9, color: '#bcd5c7', burn: 45,
      desc: 'Hladan eukaliptus i mirisni vazduh planinskog jutra. Čisti, sveži i bistri.',
      notes: { 'Gornje note': 'eukaliptus, nana', 'Srednje note': 'zeleni čaj', 'Donje note': 'bela šuma' } },
    { id: 6, name: 'Cimet & Jabuka',     family: 'Slatko',    size: '300 g', price: 19.9, color: '#e0a98b', tag: 'Sezonski', burn: 65,
      desc: 'Pečena jabuka, cimet i karanfilić. Jesen u tegli, dostupna samo ove sezone.',
      notes: { 'Gornje note': 'jabuka, narandža', 'Srednje note': 'cimet, karanfilić', 'Donje note': 'vanila' } },
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
  };

  const state = {
    currency: store.get('sc.currency', 'EUR'),
    cart: store.get('sc.cart', {}),   // { [id]: qty }
  };

  const listeners = [];
  const subscribe = (fn) => listeners.push(fn);
  const emit = () => listeners.forEach((fn) => fn());

  // ---------- Money ----------
  const money = (eur, cur = state.currency) => cur === 'EUR'
    ? `${eur.toFixed(2).replace('.', ',')} €`
    : `${Math.round(eur * RATE).toLocaleString('sr-RS')} RSD`;

  const shippingFor = (subtotal) => (subtotal === 0 || subtotal >= FREE_OVER ? 0 : SHIPPING);

  // ---------- Illustration ----------
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

  const cardHTML = (p) => `
    <article class="card">
      <a class="card__media" href="proizvod.html?id=${p.id}" style="--tone:${p.color}" aria-label="${esc(p.name)}">
        ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ''}
        ${candleSVG(p.color)}
      </a>
      <div class="card__body">
        <p class="card__family">${p.family} · ${p.size}</p>
        <h3 class="card__name"><a href="proizvod.html?id=${p.id}">${p.name}</a></h3>
        <div class="card__row">
          <span class="card__price">${money(p.price)}</span>
          <button class="btn btn--small" type="button" data-add="${p.id}">Dodaj</button>
        </div>
      </div>
    </article>`;

  // ---------- Cart ----------
  const saveCart = () => store.set('sc.cart', state.cart);

  function cartSummary() {
    const rows = Object.entries(state.cart)
      .map(([id, qty]) => ({ p: PRODUCTS.find((x) => x.id == id), qty }))
      .filter((r) => r.p && r.qty > 0);
    const count = rows.reduce((n, r) => n + r.qty, 0);
    const subtotal = rows.reduce((s, r) => s + r.qty * r.p.price, 0);
    const shipping = shippingFor(subtotal);
    return { rows, count, subtotal, shipping, total: subtotal + shipping };
  }

  function addToCart(id, qty = 1, { silent = false } = {}) {
    state.cart[id] = (state.cart[id] || 0) + qty;
    saveCart();
    emit();
    const p = PRODUCTS.find((x) => x.id == id);
    if (!silent && p) toast(`${p.name} je u korpi`);
    const b = $('#cart-btn');
    if (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  }

  function clearCart() { state.cart = {}; saveCart(); emit(); }

  // ---------- Toast ----------
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 2200);
  }

  // ---------- Layout ----------
  const PAGE = document.body.dataset.page || '';
  const NAV = [
    ['home', 'index.html', 'Početna'],
    ['shop', 'prodavnica.html', 'Prodavnica'],
    ['about', 'o-nama.html', 'O nama'],
    ['contact', 'kontakt.html', 'Kontakt'],
  ];

  const headerHTML = `
    <div class="header__bar">
      <button class="icon-btn menu-btn" id="menu-btn" aria-label="Meni" aria-expanded="false" aria-controls="nav">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
      <a class="brand" href="index.html" aria-label="Scampy Candles – početna">
        <img src="assets/seal.png" alt="" width="34" height="34">
        <span>Scampy Candles</span>
      </a>
      <nav class="nav" id="nav" aria-label="Glavni meni">
        ${NAV.map(([key, href, label]) => `<a href="${href}"${key === PAGE ? ' class="is-active" aria-current="page"' : ''}>${label}</a>`).join('')}
      </nav>
      <div class="header__actions">
        <div class="currency" role="group" aria-label="Valuta">
          <button type="button" data-currency="EUR">EUR</button>
          <button type="button" data-currency="RSD">RSD</button>
        </div>
        <button class="icon-btn" id="search-btn" aria-label="Pretraga" aria-expanded="false" aria-controls="search">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>
        </button>
        <button class="icon-btn cart-btn" id="cart-btn" aria-label="Korpa">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>
          <span class="cart-count" id="cart-count" hidden>0</span>
        </button>
      </div>
    </div>
    <form class="search" id="search" role="search" hidden>
      <input type="search" id="search-input" placeholder="Pretraži sveće (npr. lavanda, vanila…)" aria-label="Pretraga" autocomplete="off">
    </form>`;

  const footerHTML = `
    <div class="footer__grid">
      <div>
        <p class="footer__brand">Scampy Candles</p>
        <p class="muted">Pawsitively handcrafted, with love.</p>
      </div>
      <div>
        <h3>Kontakt</h3>
        <p><a href="mailto:hello@scampycandles.com">hello@scampycandles.com</a></p>
        <p>+381 60 000 0000</p>
        <p class="muted">Pon–Pet, 10–18h</p>
      </div>
      <div>
        <h3>Stranice</h3>
        ${NAV.map(([, href, label]) => `<p><a href="${href}">${label}</a></p>`).join('')}
      </div>
      <div>
        <h3>Pratite nas</h3>
        <p><a href="#">Instagram</a></p>
        <p><a href="#">TikTok</a></p>
        <p><a href="#">Facebook</a></p>
      </div>
    </div>
    <p class="footer__copy">© 2025 Scampy Candles · est 2025</p>`;

  const drawerHTML = `
    <div class="overlay" id="overlay" hidden></div>
    <aside class="drawer" id="drawer" aria-label="Korpa" aria-hidden="true">
      <div class="drawer__head">
        <h2>Tvoja korpa</h2>
        <button class="icon-btn" id="drawer-close" aria-label="Zatvori">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div class="drawer__items" id="drawer-items"></div>
      <div class="drawer__foot">
        <div class="drawer__total"><span>Ukupno</span><strong id="drawer-total">0</strong></div>
        <a class="btn btn--solid btn--block" id="checkout" href="checkout.html">Nastavi na plaćanje</a>
        <p class="muted drawer__note" id="drawer-note"></p>
      </div>
    </aside>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`;

  $('#site-header').innerHTML = headerHTML;
  $('#site-footer').innerHTML = footerHTML;
  document.body.insertAdjacentHTML('beforeend', drawerHTML);

  // ---------- Currency ----------
  function renderCurrency() {
    $$('.currency button').forEach((b) => b.classList.toggle('is-active', b.dataset.currency === state.currency));
  }
  $('.currency').addEventListener('click', (e) => {
    const b = e.target.closest('[data-currency]');
    if (!b || b.dataset.currency === state.currency) return;
    state.currency = b.dataset.currency;
    store.set('sc.currency', state.currency);
    emit();
  });

  // ---------- Drawer ----------
  const drawer = $('#drawer');
  const overlay = $('#overlay');
  const itemsEl = $('#drawer-items');

  function renderDrawer() {
    const { rows, count, subtotal } = cartSummary();
    const countEl = $('#cart-count');
    countEl.textContent = count;
    countEl.hidden = count === 0;
    $('#drawer-total').textContent = money(subtotal);
    $('#checkout').classList.toggle('is-disabled', count === 0);
    $('#checkout').setAttribute('aria-disabled', String(count === 0));
    const left = FREE_OVER - subtotal;
    $('#drawer-note').textContent = count === 0 ? ''
      : left > 0 ? `Još ${money(left)} do besplatne dostave.` : 'Imaš besplatnu dostavu 🐾';

    itemsEl.innerHTML = rows.length ? rows.map(({ p, qty }) => `
      <div class="line">
        <div class="line__thumb" style="--tone:${p.color}">${candleSVG(p.color)}</div>
        <div class="line__info">
          <a href="proizvod.html?id=${p.id}"><strong>${p.name}</strong></a>
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
    if (inc || dec) { saveCart(); emit(); }
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
  $('#checkout').addEventListener('click', (e) => { if (cartSummary().count === 0) e.preventDefault(); });

  // Any "Dodaj" button on any page
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (b) addToCart(b.dataset.add);
  });

  // ---------- Search ----------
  const searchForm = $('#search');
  const searchInput = $('#search-input');
  const searchBtn = $('#search-btn');
  const search = { handler: null };

  function toggleSearch(force, value) {
    const open = force ?? searchForm.hidden;
    searchForm.hidden = !open;
    searchBtn.setAttribute('aria-expanded', String(open));
    if (open) {
      if (value != null) searchInput.value = value;
      searchInput.focus();
    } else {
      searchInput.value = '';
      if (search.handler) search.handler('');
    }
  }
  searchBtn.addEventListener('click', () => toggleSearch());
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!search.handler) location.href = `prodavnica.html?q=${encodeURIComponent(searchInput.value.trim())}`;
  });
  searchInput.addEventListener('input', () => { if (search.handler) search.handler(searchInput.value); });

  // ---------- Mobile menu ----------
  const menuBtn = $('#menu-btn');
  const nav = $('#nav');
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  // ---------- Header shadow ----------
  const header = $('#site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (drawer.classList.contains('is-open')) closeCart();
    else if (!searchForm.hidden) toggleSearch(false);
  });

  // ---------- Wire up ----------
  subscribe(renderCurrency);
  subscribe(renderDrawer);
  renderCurrency();
  renderDrawer();

  window.SC = {
    PRODUCTS, FREE_OVER, SHIPPING, state, $, $$, esc, store,
    money, shippingFor, candleSVG, cardHTML,
    cartSummary, addToCart, clearCart, openCart, closeCart,
    subscribe, toast,
    openSearch: (value) => toggleSearch(true, value),
    setSearchHandler: (fn) => { search.handler = fn; },
  };
})();
