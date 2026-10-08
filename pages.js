/* Per-page behaviour. Picks the right init by <body data-page="…">. */
(() => {
  const { PRODUCTS, state, $, $$, esc, money, cardHTML, candleSVG, cartSummary, subscribe, store } = window.SC;
  const params = new URLSearchParams(location.search);

  // Instagram tiles on the home page. To show a real post, drop the photo into
  // assets/instagram/ and set `img` (and optionally `url` to the post link).
  // Entries with img: null render as a branded placeholder.
  const INSTAGRAM_PROFILE = 'https://www.instagram.com/scampy_candles/';
  const INSTAGRAM_POSTS = [
    { img: null, url: null, alt: '' },
    { img: null, url: null, alt: '' },
    { img: null, url: null, alt: '' },
    { img: null, url: null, alt: '' },
    { img: null, url: null, alt: '' },
    { img: null, url: null, alt: '' },
  ];
  const PAW = '<svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true"><ellipse cx="14" cy="28" rx="7" ry="9" transform="rotate(-18 14 28)"/><ellipse cx="26" cy="15" rx="7" ry="10" transform="rotate(-6 26 15)"/><ellipse cx="40" cy="15" rx="7" ry="10" transform="rotate(6 40 15)"/><ellipse cx="52" cy="28" rx="7" ry="9" transform="rotate(18 52 28)"/><path d="M32 30c-9 0-17 9-17 17 0 6 4 9 9 9 3 0 5-1 8-1s5 1 8 1c5 0 9-3 9-9 0-8-8-17-17-17Z"/></svg>';

  const pages = {
    // ---------- Home ----------
    home() {
      $('#insta').innerHTML = INSTAGRAM_POSTS.map((post, i) => `
        <a class="insta__tile${post.img ? '' : ' is-empty'}" href="${esc(post.url || INSTAGRAM_PROFILE)}" target="_blank" rel="noopener" aria-label="Instagram objava ${i + 1}">
          ${post.img ? `<img src="${esc(post.img)}" alt="${esc(post.alt)}" loading="lazy">` : PAW}
        </a>`).join('');

      const grid = $('#featured');
      const featured = PRODUCTS.filter((p) => p.category === 'pokloncici').slice(0, 3);
      const render = () => { grid.innerHTML = featured.map(cardHTML).join(''); };
      subscribe(render);
      render();
      bindNewsletter();
    },

    // ---------- Shop ----------
    shop() {
      const grid = $('#grid');
      const empty = $('#empty');
      const view = { filter: 'all', query: '' };

      const render = () => {
        const q = view.query.trim().toLowerCase();
        const list = PRODUCTS.filter((p) =>
          (view.filter === 'all' || p.category === view.filter) &&
          (!q || `${p.name} ${p.family} ${p.desc}`.toLowerCase().includes(q)));
        grid.innerHTML = list.map(cardHTML).join('');
        empty.hidden = list.length > 0;
        $('#result-count').textContent = `${list.length} ${list.length === 1 ? 'proizvod' : 'proizvoda'}`;
      };

      $('#filters').addEventListener('click', (e) => {
        const b = e.target.closest('[data-filter]');
        if (!b) return;
        view.filter = b.dataset.filter;
        $$('#filters .chip').forEach((c) => c.classList.toggle('is-active', c === b));
        render();
      });

      window.SC.setSearchHandler((value) => { view.query = value; render(); });
      const q = params.get('q');
      if (q) { view.query = q; window.SC.openSearch(q); }

      subscribe(render);
      render();
    },

    // ---------- Product ----------
    product() {
      const SC = window.SC;
      const root = $('#product');
      const p = PRODUCTS.find((x) => x.id == params.get('id'));
      if (!p) {
        root.innerHTML = '<div class="notfound"><p>Ova sveća nije pronađena.</p><a class="btn btn--solid" href="prodavnica.html">Nazad u prodavnicu</a></div>';
        return;
      }
      document.title = `${p.name} · Scampy Candles`;
      $('#crumb-name').textContent = p.name;

      const MAX = SC.MAX_QTY;
      const sel = {};            // chosen options
      let qty = 1;
      let missing = [];          // option keys the customer still has to pick
      const meta = [p.family, p.size].filter(Boolean).join(' · ');

      root.innerHTML = `
        <div class="pdp__media" style="--tone:${p.color}">
          ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ''}
          <div id="pdp-art" style="display:contents"></div>
        </div>
        <div class="pdp__info">
          <p class="eyebrow">${meta}</p>
          <h1 class="pdp__name">${p.name}</h1>
          <div id="pdp-price"></div>
          <p class="pdp__desc">${p.desc}</p>
          ${p.options ? '<div id="pdp-opts"></div>' : `
            <dl class="notes">
              ${Object.entries(p.notes || {}).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
              ${p.burn ? `<div><dt>Vreme gorenja</dt><dd>oko ${p.burn} sati</dd></div>` : ''}
              <div><dt>Vosak</dt><dd>100% sojin, pamučni fitilj</dd></div>
            </dl>`}
          <div class="pdp__buy">
            <div class="qty qty--lg">
              <button type="button" data-q="-1" aria-label="Manje">−</button>
              <input type="number" id="pdp-qty" inputmode="numeric" min="1" max="${MAX}" value="1" aria-label="Količina">
              <button type="button" data-q="1" aria-label="Više">+</button>
            </div>
            <button class="btn btn--solid" id="pdp-add" type="button">Dodaj u korpu</button>
          </div>
          ${p.bulkMin ? `<div class="quick" aria-label="Brz izbor količine">${[10, 25, p.bulkMin, 100].map((n) => `<button type="button" class="chip" data-qset="${n}">${n} kom</button>`).join('')}</div>` : ''}
          <p class="muted pdp__ship">Dostava 2–3 radna dana · besplatna preko ${money(SC.FREE_OVER)}</p>
        </div>`;

      const renderArt = () => { $('#pdp-art').innerHTML = SC.productSVG(p, sel); };

      const renderPrice = () => {
        const inCart = SC.cartSummary().perProduct[p.id] || 0;
        const eff = qty + inCart;
        const unit = SC.unitPrice(p, eff);
        const total = Math.round(unit * qty * 100) / 100;
        let html = `<p class="pdp__price">${money(unit)}${p.bulkMin ? ' <small>po komadu</small>' : ''}</p>`;
        if (p.bulkMin) {
          html += `
            <div class="tiers">
              <div class="${eff < p.bulkMin ? 'is-on' : ''}"><span>1–${p.bulkMin - 1} kom</span><strong>${money(SC.unitPrice(p, 1))}</strong></div>
              <div class="${eff >= p.bulkMin ? 'is-on' : ''}"><span>${p.bulkMin}+ kom</span><strong>${money(p.price)}</strong></div>
            </div>
            <p class="pdp__hint">${eff < p.bulkMin
              ? `Poruči još ${p.bulkMin - eff} kom za cenu od ${money(p.price)} po komadu.`
              : 'Imaš cenu na veliko 🐾'}${inCart ? ` U korpi već imaš ${inCart} kom.` : ''}</p>`;
        }
        html += `<p class="pdp__total">Ukupno za ${qty} kom: <strong>${money(total)}</strong></p>`;
        $('#pdp-price').innerHTML = html;
      };

      const renderOpts = () => {
        if (!p.options) return;
        $('#pdp-opts').innerHTML = p.options.map((o) => {
          const err = missing.includes(o.key);
          let control = '';
          if (o.type === 'choice') {
            control = `<div class="opt__chips">${o.choices.map((c) =>
              `<button type="button" class="chip${sel[o.key] === c ? ' is-active' : ''}" data-opt="${o.key}" data-val="${esc(c)}" aria-pressed="${sel[o.key] === c}">${esc(c)}</button>`).join('')}</div>`;
          } else if (o.type === 'swatch') {
            control = `<div class="opt__chips">${o.choices.map((c) =>
              `<button type="button" class="swatch${sel[o.key] === c.name ? ' is-active' : ''}" style="--sw:${c.hex}" data-opt="${o.key}" data-val="${esc(c.name)}" aria-label="${esc(c.name)}" aria-pressed="${sel[o.key] === c.name}" title="${esc(c.name)}"></button>`).join('')}</div>`;
          } else {
            control = `<input class="opt__text" type="text" id="opt-${o.key}" maxlength="${o.maxLength}" placeholder="${esc(o.placeholder || '')}" value="${esc(sel[o.key] || '')}">
              <span class="opt__count"><span id="opt-${o.key}-n">${(sel[o.key] || '').length}</span>/${o.maxLength}</span>`;
          }
          const shown = o.type === 'text' ? (o.optional ? '(nije obavezno)' : '') : (sel[o.key] || '');
          return `
            <fieldset class="opt${err ? ' has-error' : ''}" data-group="${o.key}">
              <legend>${o.label} <span class="opt__val">${esc(shown)}</span></legend>
              ${control}
              ${err ? `<p class="opt__err">Izaberi: ${o.label.toLowerCase()}</p>` : ''}
            </fieldset>`;
        }).join('');
      };

      const setQty = (n) => {
        qty = Math.max(1, Math.min(MAX, Math.floor(n) || 1));
        $('#pdp-qty').value = qty;
        renderPrice();
      };

      root.addEventListener('click', (e) => {
        const q = e.target.closest('[data-q]');
        if (q) return setQty(qty + Number(q.dataset.q));
        const qs = e.target.closest('[data-qset]');
        if (qs) return setQty(Number(qs.dataset.qset));

        const opt = e.target.closest('[data-opt]');
        if (opt) {
          sel[opt.dataset.opt] = opt.dataset.val;
          missing = missing.filter((k) => k !== opt.dataset.opt);
          renderOpts();
          renderArt();
          return;
        }

        if (e.target.closest('#pdp-add')) {
          if (p.options) {
            missing = p.options.filter((o) => !o.optional && !sel[o.key]).map((o) => o.key);
            if (missing.length) {
              renderOpts();
              $('.opt.has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              SC.toast('Izaberi sve opcije pre dodavanja u korpu');
              return;
            }
          }
          const opts = {};
          (p.options || []).forEach((o) => {
            const v = (sel[o.key] || '').trim();
            if (v) opts[o.key] = v;
          });
          SC.addToCart(p.id, qty, opts);
          SC.openCart();
        }
      });

      root.addEventListener('input', (e) => {
        if (e.target.id === 'pdp-qty') {
          const n = Math.floor(Number(e.target.value));
          if (n >= 1) { qty = Math.min(MAX, n); renderPrice(); }
        } else if (e.target.matches('.opt__text')) {
          const key = e.target.id.replace('opt-', '');
          sel[key] = e.target.value;
          $(`#opt-${key}-n`).textContent = e.target.value.length;
        }
      });
      root.addEventListener('change', (e) => { if (e.target.id === 'pdp-qty') setQty(Number(e.target.value)); });

      const related = $('#related');
      const renderRelated = () => {
        const others = PRODUCTS.filter((x) => x.id !== p.id);
        const same = others.filter((x) => x.category === p.category);
        related.innerHTML = [...same, ...others.filter((x) => !same.includes(x))].slice(0, 3).map(cardHTML).join('');
      };

      subscribe(() => { renderPrice(); renderRelated(); });
      renderArt();
      renderOpts();
      renderPrice();
      renderRelated();
    },

    about() {},

    // ---------- Contact ----------
    contact() {
      const form = $('#contact-form');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.hidden = true;
        $('#contact-ok').hidden = false;
      });
    },

    // ---------- Checkout ----------
    checkout() {
      const empty = $('#checkout-empty');
      const wrap = $('#checkout-wrap');
      const form = $('#checkout-form');

      const renderSummary = () => {
        const s = cartSummary();
        empty.hidden = s.count > 0;
        wrap.hidden = s.count === 0;
        if (!s.count) return;

        $('#sum-items').innerHTML = s.rows.map(({ p, qty, opts, sum }) => `
          <div class="sum-line">
            <div class="line__thumb" style="--tone:${p.color}">${window.SC.productSVG(p, opts)}<span class="sum-qty">${qty}</span></div>
            <div><strong>${p.name}</strong><br><span class="muted">${esc(window.SC.describeOpts(p, opts).join(' · ') || p.size)}</span></div>
            <div>${money(sum)}</div>
          </div>`).join('');
        $('#sum-sub').textContent = money(s.subtotal);
        $('#sum-ship').textContent = s.shipping === 0 ? 'Besplatna' : money(s.shipping);
        $('#sum-total').textContent = money(s.total);
      };
      subscribe(renderSummary);
      renderSummary();

      // Prefill from last order so returning customers don't retype
      const saved = store.get('sc.customer', null);
      if (saved) Object.entries(saved).forEach(([k, v]) => { if (form.elements[k]) form.elements[k].value = v; });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        const s = cartSummary();
        if (!s.count) return;

        const data = Object.fromEntries(new FormData(form).entries());
        const order = {
          id: `SC-${Math.floor(100000 + Math.random() * 900000)}`,
          date: new Date().toISOString(),
          currency: state.currency,
          payment: 'Pouzećem',
          customer: data,
          items: s.rows.map(({ p, qty, opts, unit }) => ({
            id: p.id, name: p.name, size: p.size, qty, unit,
            details: window.SC.describeOpts(p, opts),
          })),
          subtotal: s.subtotal,
          shipping: s.shipping,
          total: s.total,
        };
        store.set('sc.lastOrder', order);
        store.set('sc.customer', data);
        window.SC.clearCart();
        location.href = 'hvala.html';
      });
    },

    // ---------- Thank you ----------
    thanks() {
      const order = store.get('sc.lastOrder', null);
      if (!order) { location.replace('index.html'); return; }
      const m = (n) => money(n, order.currency);
      const c = order.customer;
      $('#order-id').textContent = order.id;
      $('#order-email').textContent = c.email;
      $('#order-items').innerHTML = order.items.map((i) => `
        <div class="sum-line sum-line--plain">
          <div><strong>${esc(i.name)}</strong> <span class="muted">× ${i.qty}${i.size ? ` · ${esc(i.size)}` : ''}</span>
            ${i.details?.length ? `<br><span class="muted line__opts">${esc(i.details.join(' · '))}</span>` : ''}</div>
          <div>${m((i.unit ?? i.price) * i.qty)}</div>
        </div>`).join('');
      $('#order-sub').textContent = m(order.subtotal);
      $('#order-ship').textContent = order.shipping === 0 ? 'Besplatna' : m(order.shipping);
      $('#order-total').textContent = m(order.total);
      $('#order-address').innerHTML = [
        `${esc(c.firstName)} ${esc(c.lastName)}`,
        esc(c.address),
        `${esc(c.zip)} ${esc(c.city)}`,
        esc(c.phone),
      ].join('<br>');
    },
  };

  function bindNewsletter() {
    const f = $('#newsletter');
    if (!f) return;
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      f.hidden = true;
      $('#newsletter-ok').hidden = false;
    });
  }

  (pages[document.body.dataset.page] || (() => {}))();
})();
