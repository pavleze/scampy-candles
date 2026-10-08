/* Per-page behaviour. Picks the right init by <body data-page="…">. */
(() => {
  const { PRODUCTS, state, $, $$, esc, money, cardHTML, candleSVG, cartSummary, subscribe, store } = window.SC;
  const params = new URLSearchParams(location.search);

  const pages = {
    // ---------- Home ----------
    home() {
      const grid = $('#featured');
      const featured = PRODUCTS.filter((p) => p.tag).slice(0, 3);
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
          (view.filter === 'all' || p.family === view.filter) &&
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
      const root = $('#product');
      const p = PRODUCTS.find((x) => x.id == params.get('id'));
      if (!p) {
        root.innerHTML = '<div class="notfound"><p>Ova sveća nije pronađena.</p><a class="btn btn--solid" href="prodavnica.html">Nazad u prodavnicu</a></div>';
        return;
      }
      document.title = `${p.name} · Scampy Candles`;
      let qty = 1;

      const render = () => {
        root.innerHTML = `
          <div class="pdp__media" style="--tone:${p.color}">
            ${p.tag ? `<span class="card__tag">${p.tag}</span>` : ''}
            ${candleSVG(p.color)}
          </div>
          <div class="pdp__info">
            <p class="eyebrow">${p.family} · ${p.size}</p>
            <h1 class="pdp__name">${p.name}</h1>
            <p class="pdp__price">${money(p.price)}</p>
            <p class="pdp__desc">${p.desc}</p>
            <dl class="notes">
              ${Object.entries(p.notes).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
              <div><dt>Vreme gorenja</dt><dd>oko ${p.burn} sati</dd></div>
              <div><dt>Vosak</dt><dd>100% sojin, pamučni fitilj</dd></div>
            </dl>
            <div class="pdp__buy">
              <div class="qty qty--lg">
                <button type="button" data-q="-1" aria-label="Manje">−</button>
                <span id="pdp-qty">${qty}</span>
                <button type="button" data-q="1" aria-label="Više">+</button>
              </div>
              <button class="btn btn--solid" id="pdp-add" type="button">Dodaj u korpu</button>
            </div>
            <p class="muted pdp__ship">Dostava 2–3 radna dana · besplatna preko ${money(window.SC.FREE_OVER)}</p>
          </div>`;
      };

      root.addEventListener('click', (e) => {
        const q = e.target.closest('[data-q]');
        if (q) {
          qty = Math.max(1, Math.min(20, qty + Number(q.dataset.q)));
          $('#pdp-qty').textContent = qty;
        }
        if (e.target.closest('#pdp-add')) {
          window.SC.addToCart(p.id, qty);
          window.SC.openCart();
        }
      });

      const related = $('#related');
      const renderRelated = () => {
        related.innerHTML = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 3).map(cardHTML).join('');
      };

      subscribe(() => { render(); renderRelated(); });
      render();
      renderRelated();
      $('#crumb-name').textContent = p.name;
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

        $('#sum-items').innerHTML = s.rows.map(({ p, qty }) => `
          <div class="sum-line">
            <div class="line__thumb" style="--tone:${p.color}">${candleSVG(p.color)}<span class="sum-qty">${qty}</span></div>
            <div><strong>${p.name}</strong><br><span class="muted">${p.size}</span></div>
            <div>${money(p.price * qty)}</div>
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
          items: s.rows.map(({ p, qty }) => ({ id: p.id, name: p.name, size: p.size, price: p.price, qty })),
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
          <div><strong>${esc(i.name)}</strong> <span class="muted">× ${i.qty} · ${esc(i.size)}</span></div>
          <div>${m(i.price * i.qty)}</div>
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
