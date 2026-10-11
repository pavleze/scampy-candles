/* Shared across all pages: data, cart, currency, header, footer, cart drawer. */
(() => {
  const RATE = 117.2;      // 1 EUR → RSD (mock)
  const SHIPPING = 3.5;    // EUR
  const FREE_OVER = 40;    // EUR

  const SMALL_ORDER_MARKUP = 1.10;   // gift candles cost 10% more below their bulk quantity

  const COLORS = [
    { name: 'Bela',   hex: '#f6f3ee' }, { name: 'Krem',   hex: '#eadfc8' },
    { name: 'Roze',   hex: '#efc3cb' }, { name: 'Crvena', hex: '#c8444f' },
    { name: 'Lila',   hex: '#c6b4df' }, { name: 'Plava',  hex: '#a9c4e4' },
    { name: 'Zelena', hex: '#b4d3bc' }, { name: 'Žuta',   hex: '#f1dc8d' },
  ];
  const RIBBONS = [
    { name: 'Bela',   hex: '#f6f3ee' }, { name: 'Zlatna', hex: '#d4b062' },
    { name: 'Roze',   hex: '#efa3b4' }, { name: 'Crvena', hex: '#c8444f' },
    { name: 'Lila',   hex: '#a98bd0' }, { name: 'Plava',  hex: '#7ea3d6' },
    { name: 'Zelena', hex: '#7fb08f' }, { name: 'Crna',   hex: '#2b2b2b' },
  ];
  const GIFT_SCENTS = ['Bez mirisa', 'Vanila', 'Jabuka', 'Kokos', 'Bundeva', 'Limun', 'Malina', 'Kafa', 'Cimet'];

  // Options a customer picks on a gift candle's page.
  const PLAIN_PACK = 'Samo sveća';             // the only packaging that has no text
  const CARD_PACK = 'Kartončić sa posvetom';   // 4th packaging choice: a card with the customer's text, tied to the wick

  const GIFT_OPTIONS = [
    { key: 'pack',       label: 'Pakovanje',     type: 'choice', choices: ['U kartonskoj kutijici', 'U tilu', CARD_PACK, PLAIN_PACK] },
    { key: 'color',      label: 'Boja sveće',    type: 'swatch', choices: COLORS },
    { key: 'scent',      label: 'Miris',         type: 'choice', choices: GIFT_SCENTS },
    // Not shown as its own row: its text field appears under Pakovanje when the card is chosen.
    { key: 'dedication', label: 'Posveta',       type: 'text', optional: true, maxLength: 140, placeholder: 'Ime/imena, posveta npr. „Hvala što ste bili sa nama“, datum' },
    { key: 'ribbon',     label: 'Boja mašnice',  type: 'swatch', choices: RIBBONS },
    { key: 'note',       label: 'Napomena',      type: 'note', optional: true, maxLength: 300, placeholder: 'Ako imaš još neku želju ili pitanje, ostavi ovde' },
  ];

  const GIFT_DESC = 'Mali poklon za goste na venčanjima, krštenjima i rođendanima. Boju sveće, miris, pakovanje, mašnicu i posvetu biraš sam/a.';
  // `price` is the per-piece price from `bulkMin` pieces up; below that it is 10% higher.
  // Quantity tiers: from `from` pieces up, the base price is multiplied by `mult` (counted over all variants of the candle).
  const TIERS_BASIC = [{ from: 1, mult: 1.10 }, { from: 50, mult: 1 }];
  const TIERS_FULL  = [{ from: 1, mult: 1.10 }, { from: 50, mult: 1 }, { from: 150, mult: 0.90 }, { from: 250, mult: 0.85 }];
  const TIERS_FULL_40 = [{ from: 1, mult: 1.10 }, { from: 40, mult: 1 }, { from: 150, mult: 0.90 }, { from: 250, mult: 0.85 }];   // base tier starts at 40

  const gift = (id, name, shape, price, color, images = [], extra = {}) => ({
    id, name, shape, price, color, bulkMin: 50, minQty: 10, defaultQty: 50,   // at least 10 pieces per item
    category: 'pokloncici', family: 'Poklončić', size: '',
    desc: GIFT_DESC, options: GIFT_OPTIONS,
    // Real photos live in assets/products/. The first one is the main picture.
    // A candle without photos shows the drawn placeholders instead.
    images: images.map((f) => `assets/products/${f}`),
    tiers: TIERS_BASIC,
    ...extra,
  });

  const PRODUCTS = [
    gift(7,  'Mali meda',             'bear',       1.45, '#eadfc8', ['mali-meda-1.jpg', 'mali-meda-2.jpg', 'mali-meda-3.jpg'], {
      // price per piece from 50 pieces, by packaging. Base is the box (1.70):
      // tulle and card are 10% below it, the plain candle is 15% below it (1.445, rounded to the cent).
      packPrices: { [PLAIN_PACK]: 1.45, [CARD_PACK]: 1.53, 'U tilu': 1.53, 'U kartonskoj kutijici': 1.70 },
      tiers: TIERS_FULL,
    }),
    gift(8,  'Meda sa srcem',         'bear-heart', 2.13, '#efc3cb', ['meda-sa-srcem-1.jpg', 'meda-sa-srcem-2.jpg', 'meda-sa-srcem-3.jpg'], {
      // base tier is 40–149 pieces. Box (2.50) is the base: tulle and card are 10% below it (2.25),
      // the plain candle is 15% below it (2.125, rounded up to 2.13). Same −10% / −15% steps from 150 / 250.
      packPrices: { [PLAIN_PACK]: 2.13, [CARD_PACK]: 2.25, 'U tilu': 2.25, 'U kartonskoj kutijici': 2.50 },
      tiers: TIERS_FULL_40,
      bulkMin: 40,
    }),
    gift(9,  'Lavić',                 'lion',       1.7, '#f1dc8d', ['lavic-1.jpg', 'lavic-2.jpg', 'lavic-3.jpg']),
    gift(10, 'Bubble',                'bubble',     2.0, '#a9c4e4', ['bubble-1.jpg', 'bubble-2.jpg']),
    gift(11, 'Božur',                 'peony',      2.0, '#efc3cb', ['bozur-1.jpg', 'bozur-2.jpg', 'bozur-3.jpg']),
    gift(12, 'Always & Forever srce', 'heart',      2.0, '#c8444f', ['always-forever-srce-1.jpg', 'always-forever-srce-2.jpg']),
    gift(13, 'Dijamant srce',         'diamond',    2.0, '#c6b4df', ['dijamant-srce-1.jpg']),
    // TODO: prices for Astronaut and Limun are placeholders until confirmed.
    gift(14, 'Astronaut',             'astronaut',  2.0, '#a9c4e4', ['astronaut-1.jpg', 'astronaut-2.jpg']),
    gift(15, 'Limun',                 'lemon',      2.0, '#f1dc8d', ['limun-1.jpg', 'limun-2.jpg', 'limun-3.jpg']),
    // TODO: price for Cvetno srce is a placeholder.
    gift(17, 'Cvetno srce',           'heart',      2.0, '#efc3cb', ['cvetno-srce-1.jpg']),
    // TODO: price for Pahulja is a placeholder.
    gift(16, 'Pahulja',               'snowflake',  2.0, '#cfe3f2', ['pahulja-1.jpg', 'pahulja-2.jpg']),

    // Mock scented candles (placeholders until the real range is added)
    { id: 1, category: 'mirisne', name: 'Lavanda & Med',      family: 'Cvetno',    size: '200 g', price: 14.9, color: '#cdbfe0', tag: 'Bestseler', burn: 45,
      desc: 'Smirujući miris lavande sa toplom notom domaćeg meda. Savršena za večernje opuštanje.',
      notes: { 'Gornje note': 'lavanda, bergamot', 'Srednje note': 'med, kamilica', 'Donje note': 'bela mošusna nota' } },
    { id: 2, category: 'mirisne', name: 'Vanila & Karamel',   family: 'Slatko',    size: '200 g', price: 15.9, color: '#ecd3a3', tag: 'Novo', burn: 45,
      desc: 'Kremasta vanila i slani karamel. Miris kao iz kuhinje u kojoj se peku kolači.',
      notes: { 'Gornje note': 'mleko, šećer', 'Srednje note': 'vanila, karamel', 'Donje note': 'tonka pasulj' } },
    { id: 3, category: 'mirisne', name: 'Cedar & Amber',      family: 'Drvenasto', size: '300 g', price: 19.9, color: '#c9a77c', burn: 65,
      desc: 'Duboka, topla drvenasta kompozicija. Dobro dođe u većim prostorijama i hladnim danima.',
      notes: { 'Gornje note': 'bors, citrus', 'Srednje note': 'cedar, ćilibar', 'Donje note': 'sandalovina' } },
    { id: 4, category: 'mirisne', name: 'Bela čaj ruža',      family: 'Cvetno',    size: '200 g', price: 14.9, color: '#efc9cf', burn: 45,
      desc: 'Nežna ruža sa belim čajem. Lagana, elegantna i nikad previše nametljiva.',
      notes: { 'Gornje note': 'beli čaj, pelargonija', 'Srednje note': 'ruža, božur', 'Donje note': 'mošus' } },
    { id: 5, category: 'mirisne', name: 'Eukaliptus & Mesec', family: 'Svež',      size: '200 g', price: 14.9, color: '#bcd5c7', burn: 45,
      desc: 'Hladan eukaliptus i mirisni vazduh planinskog jutra. Čisti, sveži i bistri.',
      notes: { 'Gornje note': 'eukaliptus, nana', 'Srednje note': 'zeleni čaj', 'Donje note': 'bela šuma' } },
    { id: 6, category: 'mirisne', name: 'Cimet & Jabuka',     family: 'Slatko',    size: '300 g', price: 19.9, color: '#e0a98b', tag: 'Sezonski', burn: 65,
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
    cart: store.get('sc.cart2', []),   // [{ key, id, qty, opts }]
  };

  const listeners = [];
  const subscribe = (fn) => listeners.push(fn);
  const emit = () => listeners.forEach((fn) => fn());

  // ---------- Money ----------
  const money = (eur, cur = state.currency) => cur === 'EUR'
    ? `${eur.toFixed(2).replace('.', ',')} €`
    : `${Math.ceil(eur * RATE - 1e-7).toLocaleString('sr-RS')} RSD`;   // dinars also round up

  const shippingFor = (subtotal) => (subtotal === 0 || subtotal >= FREE_OVER ? 0 : SHIPPING);

  // ---------- Pricing ----------
  // Per-piece price for a product, given how many pieces of it are ordered in total.
  const round2 = (n) => Math.ceil(n * 100 - 1e-7) / 100;    // always round UP to the next cent (the 1e-7 ignores float noise like 1.8700000000000001)
  const basePriceOf = (p, pack) => p.packPrices?.[pack] ?? p.price;
  const tierMult = (p, qty) => (p.tiers || []).reduce((m, t) => (qty >= t.from ? t.mult : m), p.tiers?.[0]?.mult ?? 1);
  // Per-piece price for a product, packaging and total ordered quantity.
  const unitPrice = (p, qty, pack) => (p.tiers ? round2(basePriceOf(p, pack) * tierMult(p, qty)) : p.price);
  // The next cheaper tier, if any (for the "order more" hint).
  const nextTier = (p, qty) => (p.tiers || []).find((t) => t.from > qty) || null;

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

  // Simple figurine illustrations for the gift candles (placeholders until real photos).
  const bow = (x, y, c) => `<path d="M${x} ${y}l-14-8v16ZM${x} ${y}l14-8v16Z" fill="${c}"/><circle cx="${x}" cy="${y}" r="4" fill="${c}"/>`;
  const FACE = '<circle cx="50" cy="50" r="3" fill="#3b2f2a" stroke="none"/><circle cx="70" cy="50" r="3" fill="#3b2f2a" stroke="none"/><ellipse cx="60" cy="59" rx="4" ry="3" fill="#3b2f2a" stroke="none"/>';
  const HEART = 'M60 104C20 76 20 40 44 38 54 37 60 44 60 50 60 44 66 37 76 38 100 40 100 76 60 104Z';

  function giftSVG(shape, c = '#efc3cb', r = '#d4b062') {
    let body = '';
    switch (shape) {
      case 'bear':
      case 'bear-heart':
        body = `<circle cx="36" cy="32" r="12" fill="${c}"/><circle cx="84" cy="32" r="12" fill="${c}"/>
          <circle cx="36" cy="32" r="6" fill="rgba(255,255,255,.4)" stroke="none"/><circle cx="84" cy="32" r="6" fill="rgba(255,255,255,.4)" stroke="none"/>
          <ellipse cx="60" cy="94" rx="28" ry="22" fill="${c}"/><circle cx="60" cy="54" r="28" fill="${c}"/>
          <ellipse cx="60" cy="63" rx="12" ry="9" fill="rgba(255,255,255,.55)" stroke="none"/>${FACE}
          ${shape === 'bear-heart' ? '<path d="M60 108C44 97 41 89 44 84 48 78 57 79 60 86 63 79 72 78 76 84 79 89 76 97 60 108Z" fill="rgba(255,255,255,.85)" stroke="none"/>' : ''}
          ${bow(60, 79, r)}`;
        break;
      case 'lion': {
        const tufts = Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return `<circle cx="${(60 + Math.cos(a) * 34).toFixed(1)}" cy="${(56 + Math.sin(a) * 34).toFixed(1)}" r="10" fill="${c}"/>`;
        }).join('');
        body = `<ellipse cx="60" cy="100" rx="24" ry="16" fill="${c}"/>${tufts}
          <circle cx="60" cy="56" r="38" fill="rgba(0,0,0,.16)" stroke="none"/><circle cx="60" cy="56" r="27" fill="${c}"/>
          <ellipse cx="60" cy="64" rx="11" ry="8" fill="rgba(255,255,255,.55)" stroke="none"/>${FACE}${bow(60, 92, r)}`;
        break;
      }
      case 'bubble': {
        const dots = [56, 74, 92].flatMap((y) => [42, 60, 78].map((x) => `<circle cx="${x}" cy="${y}" r="9.5" fill="rgba(255,255,255,.35)"/>`)).join('');
        body = `<path d="M60 14c4 6 6 9 6 12a6 6 0 0 1-12 0c0-3 2-6 6-12Z" fill="#f2c26b" stroke="none"/>
          <rect x="28" y="40" width="64" height="62" rx="12" fill="${c}"/>${dots}${bow(88, 44, r)}`;
        break;
      }
      case 'peony': {
        const ring = (n, cy, rx, ry, off, fill) => Array.from({ length: n }, (_, i) =>
          `<ellipse cx="60" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${(i * 360) / n + off} 60 62)" fill="${fill}"/>`).join('');
        body = `${ring(8, 40, 13, 22, 0, c)}${ring(8, 46, 9, 15, 22.5, 'rgba(255,255,255,.3)')}
          <circle cx="60" cy="62" r="9" fill="rgba(0,0,0,.14)" stroke="none"/>${bow(60, 100, r)}`;
        break;
      }
      case 'heart':
        body = `<path d="${HEART}" fill="${c}"/><ellipse cx="42" cy="54" rx="7" ry="12" transform="rotate(-30 42 54)" fill="rgba(255,255,255,.3)" stroke="none"/>
          <text x="60" y="80" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-style="italic" font-size="16" fill="rgba(255,255,255,.92)" stroke="none">A&amp;F</text>${bow(60, 40, r)}`;
        break;
      case 'diamond':
        body = `<clipPath id="sc-heart-clip"><path d="${HEART}"/></clipPath><path d="${HEART}" fill="${c}"/>
          <g clip-path="url(#sc-heart-clip)" stroke="rgba(255,255,255,.55)" stroke-width="1.2" fill="none">
            <path d="M14 56H106M44 36L60 104M76 36L60 104M26 44L60 104M94 44L60 104M60 50V104M30 70H90"/></g>${bow(60, 40, r)}`;
        break;
      case 'snowflake': {
        const arm = 'M60 60V22M60 34l-9-8M60 34l9-8M60 46l-7-6M60 46l7-6';
        const arms = (stroke, w) => Array.from({ length: 6 }, (_, i) =>
          `<path d="${arm}" transform="rotate(${i * 60} 60 60)" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`).join('');
        body = `${arms('rgba(0,0,0,.16)', 9)}${arms(c, 6)}<circle cx="60" cy="60" r="8" fill="${c}"/>${bow(60, 60, r)}`;
        break;
      }
      default:
        return candleSVG(c);
    }
    return `<svg viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="112" rx="34" ry="4" fill="rgba(0,0,0,.08)"/>
      <g stroke="rgba(0,0,0,.14)" stroke-width="1" stroke-linejoin="round">${body}</g></svg>`;
  }

  const optHex = (p, key, name) => p.options?.find((o) => o.key === key)?.choices.find((c) => c.name === name)?.hex;
  const productSVG = (p, opts = {}) => (p.shape
    ? giftSVG(p.shape, optHex(p, 'color', opts.color) || p.color, optHex(p, 'ribbon', opts.ribbon) || '#d4b062')
    : candleSVG(p.color));

  // The figurine shown inside its packaging (view: 'plain' | 'box' | 'tulle').
  function packSVG(p, opts = {}, view = 'plain') {
    const fig = productSVG(p, opts);
    if (view === 'plain' || !p.shape) return fig;
    if (view === 'duo') {
      const at = (x) => fig.replace('<svg ', `<svg x="${x}" y="28" width="62" height="62" `);
      return `<svg viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="96" rx="48" ry="4" fill="rgba(0,0,0,.08)"/>${at(2)}${at(56)}</svg>`;
    }
    if (view === 'trio') {
      const at = (x, y) => fig.replace('<svg ', `<svg x="${x}" y="${y}" width="52" height="52" `);
      return `<svg viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="100" rx="50" ry="4" fill="rgba(0,0,0,.08)"/>${at(34, 20)}${at(6, 52)}${at(62, 52)}</svg>`;
    }
    if (view === 'close') {
      return `<svg viewBox="0 0 120 120" aria-hidden="true">${fig.replace('<svg ', '<svg x="-26" y="-22" width="172" height="172" ')}</svg>`;
    }
    const ribbon = optHex(p, 'ribbon', opts.ribbon) || '#d4b062';
    const inner = fig.replace('<svg ', '<svg x="22" y="6" width="76" height="76" ');
    const front = view === 'box'
      ? `<path d="M22 62h76l-4 42H26Z" fill="#c9a77c" stroke="rgba(0,0,0,.18)"/>
         <path d="M22 62h76v7H22Z" fill="#b8935f" stroke="rgba(0,0,0,.18)"/>
         <rect x="44" y="80" width="32" height="14" rx="2" fill="rgba(255,255,255,.8)"/>
         <circle cx="60" cy="87" r="3.5" fill="#c2a67b"/>`
      : `<path d="M28 58Q60 48 92 58L80 100Q60 108 40 100Z" fill="rgba(255,255,255,.6)" stroke="rgba(0,0,0,.16)"/>
         <path d="M40 66l6 30M60 62v38M80 66l-6 30" stroke="rgba(0,0,0,.08)" fill="none"/>
         <path d="M60 100l-13-8v16ZM60 100l13-8v16Z" fill="${ribbon}" stroke="rgba(0,0,0,.14)"/><circle cx="60" cy="100" r="4" fill="${ribbon}" stroke="rgba(0,0,0,.14)"/>`;
    return `<svg viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="110" rx="36" ry="4" fill="rgba(0,0,0,.08)"/>${inner}${front}</svg>`;
  }

  // Small picture for the cart and checkout: the photo if there is one, else the figurine in the chosen colors.
  const thumbHTML = (p, opts = {}) => (p.images?.length
    ? `<img src="${esc(p.images[0])}" alt="" loading="lazy">`
    : productSVG(p, opts));

  // Photo if the product has one, otherwise the illustration.
  const mediaHTML = (p) => (p.images?.length
    ? `<img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy">`
    : productSVG(p));

  // "Pakovanje: Kartonsko pakovanje", "Posveta: „…“" …
  const describeOpts = (p, opts = {}) => (p.options || [])
    .filter((o) => opts[o.key])
    .map((o) => `${o.label}: ${o.type === 'text' ? `„${opts[o.key]}“` : opts[o.key]}`);

  const cardHTML = (p) => {
    const meta = [p.family, p.size].filter(Boolean).join(' · ');
    const isGift = !!p.options;
    return `
    <article class="card">
      <a class="card__media" href="proizvod.html?id=${p.id}" style="--tone:${p.color}" aria-label="${esc(p.name)}">
        ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ''}
        ${mediaHTML(p)}
      </a>
      <div class="card__body">
        <p class="card__family">${meta}</p>
        <h3 class="card__name"><a href="proizvod.html?id=${p.id}">${p.name}</a></h3>
        <div class="card__row">
          <span class="card__price">${money(isGift ? unitPrice(p, p.defaultQty || p.minQty || 1, p.options[0].choices[0]) : p.price)}${isGift ? `<small class="card__bulk">po komadu · ${p.defaultQty || p.minQty} kom, ${p.options[0].choices[0].toLowerCase()}</small>` : ''}</span>
          ${isGift
            ? `<a class="btn btn--small" href="proizvod.html?id=${p.id}">Odaberi</a>`
            : `<button class="btn btn--small" type="button" data-add="${p.id}">Dodaj</button>`}
        </div>
      </div>
    </article>`;
  };

  // ---------- Cart ----------
  const saveCart = () => store.set('sc.cart2', state.cart);
  const minQtyOf = (id) => PRODUCTS.find((x) => x.id == id)?.minQty || 1;
  // carts saved before the minimum existed: lift them to it
  state.cart.forEach((l) => { l.qty = Math.max(l.qty, minQtyOf(l.id)); });
  const MAX_QTY = 999;
  const lineKey = (id, opts) => `${id}|${JSON.stringify(Object.keys(opts).sort().map((k) => [k, opts[k]]))}`;

  function cartSummary() {
    const lines = state.cart
      .map((l) => ({ ...l, p: PRODUCTS.find((x) => x.id == l.id) }))
      .filter((l) => l.p && l.qty > 0);
    // Bulk pricing counts every variant of the same product together.
    const perProduct = {};
    lines.forEach((l) => { perProduct[l.id] = (perProduct[l.id] || 0) + l.qty; });
    const rows = lines.map((l) => {
      const unit = unitPrice(l.p, perProduct[l.id], l.opts?.pack);
      return { ...l, unit, sum: round2(unit * l.qty) };
    });
    const count = rows.reduce((n, r) => n + r.qty, 0);
    const subtotal = round2(rows.reduce((t, r) => t + r.sum, 0));
    const shipping = shippingFor(subtotal);
    return { rows, count, subtotal, shipping, total: round2(subtotal + shipping), perProduct };
  }

  function addToCart(id, qty = 1, opts = {}) {
    const key = lineKey(id, opts);
    const line = state.cart.find((l) => l.key === key);
    const min = minQtyOf(id);
    if (line) line.qty = Math.min(MAX_QTY, line.qty + qty);
    else state.cart.push({ key, id: Number(id), qty: Math.min(MAX_QTY, Math.max(qty, min)), opts });
    saveCart();
    emit();
    const p = PRODUCTS.find((x) => x.id == id);
    if (p) toast(`${p.name} je u korpi`);
    const b = $('#cart-btn');
    if (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  }

  function setQty(key, qty) {
    const line = state.cart.find((l) => l.key === key);
    if (!line) return;
    const n = Math.floor(qty) || 0;
    if (n <= 0) state.cart = state.cart.filter((l) => l.key !== key);          // 0 = remove
    else line.qty = Math.min(MAX_QTY, Math.max(n, minQtyOf(line.id)));
    saveCart();
    emit();
  }

  function clearCart() { state.cart = []; saveCart(); emit(); }

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
        <p><a href="https://www.instagram.com/scampy_candles/" target="_blank" rel="noopener">Instagram</a></p>
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

    // Don't rebuild the list while the user is typing a quantity.
    if (itemsEl.contains(document.activeElement) && document.activeElement.matches('[data-qty]')) return;

    itemsEl.innerHTML = rows.length ? rows.map(({ p, qty, key, opts, unit, sum }) => {
      const parts = describeOpts(p, opts);
      return `
      <div class="line" data-key="${esc(key)}">
        <div class="line__thumb" style="--tone:${p.color}">${thumbHTML(p, opts)}</div>
        <div class="line__info">
          <a href="proizvod.html?id=${p.id}"><strong>${p.name}</strong></a>
          ${parts.length ? `<span class="line__opts">${esc(parts.join(' · '))}</span>` : ''}
          <span class="muted">${money(unit)} / kom${p.minQty > 1 ? ` · min. ${p.minQty} kom` : ''}</span>
          <div class="qty">
            <button type="button" data-dec aria-label="Manje">−</button>
            <input type="number" inputmode="numeric" min="${p.minQty || 1}" max="${MAX_QTY}" value="${qty}" data-qty aria-label="Količina">
            <button type="button" data-inc aria-label="Više">+</button>
          </div>
          <button type="button" class="line__remove" data-remove>Ukloni</button>
        </div>
        <div class="line__sum">${money(sum)}</div>
      </div>`;
    }).join('')
      : '<p class="drawer__empty">Korpa je prazna.<br>Dodaj neku sveću 🕯️</p>';
  }

  itemsEl.addEventListener('click', (e) => {
    const line = e.target.closest('.line');
    if (!line) return;
    const key = line.dataset.key;
    const cur = state.cart.find((l) => l.key === key)?.qty || 0;
    const min = minQtyOf(state.cart.find((l) => l.key === key)?.id);
    if (e.target.closest('[data-inc]')) setQty(key, cur + 1);
    else if (e.target.closest('[data-dec]')) setQty(key, Math.max(cur - 1, min));
    else if (e.target.closest('[data-remove]')) setQty(key, 0);
  });
  itemsEl.addEventListener('change', (e) => {
    const input = e.target.closest('[data-qty]');
    if (input) setQty(input.closest('.line').dataset.key, Number(input.value));
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
    if (!b) return;
    const p = PRODUCTS.find((x) => x.id == b.dataset.add);
    if (p?.options) location.href = `proizvod.html?id=${p.id}`;   // needs choices first
    else addToCart(p.id);
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
    money, shippingFor, unitPrice, nextTier, round2, candleSVG, productSVG, thumbHTML, packSVG, describeOpts, cardHTML,
    SMALL_ORDER_MARKUP, MAX_QTY, CARD_PACK, PLAIN_PACK, minQtyOf,
    cartSummary, addToCart, setQty, clearCart, openCart, closeCart,
    subscribe, toast,
    openSearch: (value) => toggleSearch(true, value),
    setSearchHandler: (fn) => { search.handler = fn; },
  };
})();
