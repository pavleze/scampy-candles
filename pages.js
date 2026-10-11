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
      const isGift = !!p.options;
      const sel = isGift ? { pack: p.options[0].choices[0] } : {};   // packaging pre-selected
      let qty = 1;
      let missing = [];     // required options still to pick
      let showDedication = false;

      root.innerHTML = `
        <div class="pdp__gallery">
          <div class="bento" id="pdp-bento"></div>
          <span class="bento__count" id="pdp-count" aria-hidden="true"></span>
        </div>
        <div class="pdp__info">
          <h1 class="pdp__name">${p.name}</h1>
          <div id="pdp-price"></div>
          ${isGift ? '<div id="pdp-opts"></div>' : `
            <p class="pdp__desc">${p.desc}</p>
            <dl class="notes">
              ${Object.entries(p.notes || {}).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
              ${p.burn ? `<div><dt>Vreme gorenja</dt><dd>oko ${p.burn} sati</dd></div>` : ''}
            </dl>`}
          <div class="pdp__buy">
            <div class="qty qty--lg">
              <button type="button" data-q="-1" aria-label="Manje">−</button>
              <input type="number" id="pdp-qty" inputmode="numeric" min="1" max="${MAX}" value="1" aria-label="Količina">
              <button type="button" data-q="1" aria-label="Više">+</button>
            </div>
            <button class="btn btn--solid" id="pdp-add" type="button"></button>
          </div>
        </div>`;

      // ----- gallery -----
      const slides = () => {
        if (p.images?.length) return p.images.map((src) => ({ img: src, label: p.name }));
        // Placeholder pictures until real photos are added (6 per candle).
        return [
          { view: 'plain', label: 'Samo sveća' }, { view: 'tulle', label: 'U tilu' },
          { view: 'box', label: 'U kartonskoj kutijici' }, { view: 'duo', label: 'Dva komada' },
          { view: 'close', label: 'Detalj' }, { view: 'trio', label: 'Set' },
        ];
      };
      const SHOWN = 6;
      let introPlayed = false;
      const slideHTML = (s) => (s.img ? `<img src="${esc(s.img)}" alt="${esc(s.label)}" loading="lazy">` : SC.packSVG(p, sel, s.view));
      const phone = window.matchMedia('(max-width: 820px)');
      let slideAt = 0;          // real picture index currently in view (phone strip)

      const tileHTML = (s, i, { clone = false, more = 0 } = {}) => `
        <button type="button" class="tile" style="--tone:${p.color};--i:${i}" data-tile="${i}"${clone ? ' data-clone tabindex="-1" aria-hidden="true"' : ''} aria-label="Uvećaj sliku ${i + 1}">
          ${i === 0 && p.tag ? `<span class="card__tag">${p.tag}</span>` : ''}
          ${slideHTML(s)}
          ${more > 0 ? `<span class="tile__more">+${more}</span>` : ''}
        </button>`;

      const stride = () => {
        const t = $('#pdp-bento .tile');
        return t ? t.offsetWidth + (parseFloat(getComputedStyle($('#pdp-bento')).columnGap) || 0) : 0;
      };
      const loops = () => phone.matches && slides().length > 1;

      const renderGallery = () => {
        const list = slides();
        const bento = $('#pdp-bento');
        const strip = phone.matches;
        const shown = strip ? list : list.slice(0, SHOWN);
        const more = strip ? 0 : list.length - SHOWN;
        bento.className = `bento bento--${Math.min(shown.length, 6)}${p.images?.length ? ' bento--photos' : ''}${introPlayed ? '' : ' bento--intro'}`;
        introPlayed = true;
        let html = shown.map((s, i) => tileHTML(s, i, { more: more > 0 && i === SHOWN - 1 ? more : 0 })).join('');
        if (loops()) {
          // clones at both ends make the strip circular
          html = tileHTML(list[list.length - 1], list.length - 1, { clone: true }) + html + tileHTML(list[0], 0, { clone: true });
        }
        bento.innerHTML = html;
        $('#pdp-count').textContent = list.length > 1 ? `${slideAt + 1} / ${list.length}` : '';
        if (loops()) bento.scrollLeft = (slideAt + 1) * stride();
      };

      // Phone strip: keep the counter in sync and wrap around at both ends.
      let loopTimer;
      const bentoEl = $('#pdp-bento');
      bentoEl.addEventListener('scroll', () => {
        if (!loops()) return;
        const n = slides().length;
        const s = stride();
        if (!s) return;
        const i = Math.round(bentoEl.scrollLeft / s);          // 0 = clone of last, 1..n = real, n+1 = clone of first
        slideAt = (((i - 1) % n) + n) % n;
        $('#pdp-count').textContent = `${slideAt + 1} / ${n}`;
        clearTimeout(loopTimer);
        loopTimer = setTimeout(() => {
          const j = Math.round(bentoEl.scrollLeft / s);
          const target = j <= 0 ? n * s : j >= n + 1 ? s : null;
          if (target === null) return;
          bentoEl.style.scrollSnapType = 'none';
          bentoEl.scrollLeft = target;
          requestAnimationFrame(() => { bentoEl.style.scrollSnapType = ''; });
        }, 120);
      }, { passive: true });
      phone.addEventListener('change', () => { slideAt = 0; renderGallery(); });

      // Lightbox
      let lightboxAt = 0;
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.hidden = true;
      lightbox.innerHTML = '<button type="button" class="lightbox__close" aria-label="Zatvori">×</button><button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Prethodna">‹</button><div class="lightbox__stage"></div><button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Sledeća">›</button>';
      document.body.appendChild(lightbox);
      const showLightbox = (i) => {
        const list = slides();
        lightboxAt = (i + list.length) % list.length;
        const stage = $('.lightbox__stage', lightbox);
        stage.style.setProperty('--tone', p.color);
        stage.innerHTML = slideHTML(list[lightboxAt]);
        lightbox.hidden = false;
      };
      lightbox.addEventListener('click', (e) => {
        if (e.target.closest('.lightbox__nav--prev')) showLightbox(lightboxAt - 1);
        else if (e.target.closest('.lightbox__nav--next')) showLightbox(lightboxAt + 1);
        else if (!e.target.closest('.lightbox__stage')) lightbox.hidden = true;
      });
      document.addEventListener('keydown', (e) => {
        if (lightbox.hidden) return;
        if (e.key === 'Escape') lightbox.hidden = true;
        if (e.key === 'ArrowLeft') showLightbox(lightboxAt - 1);
        if (e.key === 'ArrowRight') showLightbox(lightboxAt + 1);
      });

      // ----- price + button -----
      const renderPrice = () => {
        const inCart = SC.cartSummary().perProduct[p.id] || 0;
        const eff = qty + inCart;
        const unit = SC.unitPrice(p, eff);
        const total = Math.round(unit * qty * 100) / 100;
        let html = `<p class="pdp__price">${money(unit)} <small>/ kom</small></p>`;
        if (p.bulkMin) {
          const need = p.bulkMin - inCart;
          html += eff < p.bulkMin
            ? `<p class="pdp__tier">${money(p.price)} / kom od ${p.bulkMin} kom · <button type="button" class="linkbtn" data-qset="${need}">podesi na ${need}</button></p>`
            : '<p class="pdp__tier is-on">Cena na veliko ✓</p>';
        }
        $('#pdp-price').innerHTML = html;
        $('#pdp-add').textContent = `Dodaj u korpu · ${money(total)}`;
      };

      // ----- options -----
      const swatchGroup = (o) => `<div class="opt__chips">${o.choices.map((c) => `
        <button type="button" class="swatch${sel[o.key] === c.name ? ' is-active' : ''}" style="--sw:${c.hex}" data-opt="${o.key}" data-val="${esc(c.name)}" aria-label="${esc(c.name)}" aria-pressed="${sel[o.key] === c.name}" title="${esc(c.name)}"></button>`).join('')}</div>`;

      const renderOpts = () => {
        if (!isGift) return;
        $('#pdp-opts').innerHTML = p.options.map((o) => {
          const err = missing.includes(o.key);
          let control;
          let shown = '';
          if (o.type === 'choice' && o.choices.length <= 3) {
            control = `<div class="seg">${o.choices.map((c) =>
              `<button type="button" class="${sel[o.key] === c ? 'is-active' : ''}" data-opt="${o.key}" data-val="${esc(c)}" aria-pressed="${sel[o.key] === c}">${esc(c)}</button>`).join('')}</div>`;
          } else if (o.type === 'choice') {
            control = `<select class="opt__select" data-select="${o.key}" aria-label="${o.label}">
              <option value="">Izaberi…</option>
              ${o.choices.map((c) => `<option value="${esc(c)}"${sel[o.key] === c ? ' selected' : ''}>${esc(c)}</option>`).join('')}</select>`;
          } else if (o.type === 'swatch') {
            control = swatchGroup(o);
            shown = sel[o.key] || '';
          } else if (showDedication || sel[o.key]) {
            control = `<input class="opt__text" type="text" id="opt-${o.key}" maxlength="${o.maxLength}" placeholder="${esc(o.placeholder || '')}" value="${esc(sel[o.key] || '')}">`;
          } else {
            return `<div class="opt opt--inline"><button type="button" class="linkbtn" data-ded>＋ Dodaj posvetu</button></div>`;
          }
          return `
            <div class="opt${err ? ' has-error' : ''}">
              <div class="opt__label">${o.label}${shown ? ` <span class="opt__val">· ${esc(shown)}</span>` : ''}${err ? ' <span class="opt__err">· izaberi</span>' : ''}</div>
              ${control}
            </div>`;
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
        const tile = e.target.closest('[data-tile]');
        if (tile) return showLightbox(Number(tile.dataset.tile));
        if (e.target.closest('[data-ded]')) {
          showDedication = true;
          renderOpts();
          return $('#opt-dedication')?.focus();
        }

        const opt = e.target.closest('[data-opt]');
        if (opt) {
          sel[opt.dataset.opt] = opt.dataset.val;
          missing = missing.filter((k) => k !== opt.dataset.opt);
          renderOpts();
          renderGallery();
          return;
        }

        if (e.target.closest('#pdp-add')) {
          if (isGift) {
            missing = p.options.filter((o) => !o.optional && !sel[o.key]).map((o) => o.key);
            if (missing.length) {
              renderOpts();
              $('.opt.has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              SC.toast('Izaberi označene opcije');
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
          sel[e.target.id.replace('opt-', '')] = e.target.value;
        }
      });
      root.addEventListener('change', (e) => {
        if (e.target.id === 'pdp-qty') setQty(Number(e.target.value));
        const s = e.target.closest('[data-select]');
        if (s) {
          sel[s.dataset.select] = s.value;
          missing = missing.filter((k) => k !== s.dataset.select);
          renderOpts();
        }
      });

      const related = $('#related');
      const renderRelated = () => {
        const others = PRODUCTS.filter((x) => x.id !== p.id);
        const same = others.filter((x) => x.category === p.category);
        related.innerHTML = [...same, ...others.filter((x) => !same.includes(x))].slice(0, 3).map(cardHTML).join('');
      };

      subscribe(() => { renderPrice(); renderRelated(); });
      renderGallery();
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
            <div class="line__thumb" style="--tone:${p.color}">${window.SC.thumbHTML(p, opts)}<span class="sum-qty">${qty}</span></div>
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
