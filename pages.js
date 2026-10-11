/* Per-page behaviour. Picks the right init by <body data-page="…">. */
(() => {
  const { PRODUCTS, state, $, $$, esc, money, cardHTML, candleSVG, cartSummary, subscribe, store } = window.SC;
  const params = new URLSearchParams(location.search);

  // Instagram tiles on the home page. To show a real post, drop the photo into
  // assets/instagram/ and set `img` (and optionally `url` to the post link).
  // Entries with img: null render as a branded placeholder.
  const INSTAGRAM_PROFILE = 'https://www.instagram.com/scampy_candles/';
  const INSTAGRAM_POSTS = [
    { img: 'assets/instagram/objava-1.jpg', url: 'https://www.instagram.com/reel/DdLyVzqs3TT/', alt: 'Bubble – poklončići, sveće od sojinog voska' },
    { img: 'assets/instagram/objava-2.jpg', url: 'https://www.instagram.com/reel/DOp_nfvjGih/', alt: 'Always & Forever srce – ručno livene sveće' },
    { img: 'assets/instagram/objava-3.jpg', url: 'https://www.instagram.com/reel/DJ13S1zMxB4/', alt: 'Poklončići za rođendane i krštenja' },
    { img: 'assets/instagram/objava-4.jpg', url: 'https://www.instagram.com/reel/DQYsi3rjK4x/', alt: 'Božur – poklončići za venčanja' },
    { img: 'assets/instagram/objava-5.jpg', url: 'https://www.instagram.com/p/DKZQ87sszFq/', alt: 'Medvedići za krštenje' },
    { img: 'assets/instagram/objava-6.jpg', url: 'https://www.instagram.com/reel/DbTedtmMZ6i/', alt: 'Capri Lemon – sveća u obliku limuna' },
  ];
  const PAW = '<svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true"><ellipse cx="14" cy="28" rx="7" ry="9" transform="rotate(-18 14 28)"/><ellipse cx="26" cy="15" rx="7" ry="10" transform="rotate(-6 26 15)"/><ellipse cx="40" cy="15" rx="7" ry="10" transform="rotate(6 40 15)"/><ellipse cx="52" cy="28" rx="7" ry="9" transform="rotate(18 52 28)"/><path d="M32 30c-9 0-17 9-17 17 0 6 4 9 9 9 3 0 5-1 8-1s5 1 8 1c5 0 9-3 9-9 0-8-8-17-17-17Z"/></svg>';

  const pages = {
    // ---------- Home ----------
    home() {
      $('#insta').innerHTML = INSTAGRAM_POSTS.map((post, i) => `
        <a class="insta__tile${post.img ? '' : ' is-empty'}" href="${esc(post.url || INSTAGRAM_PROFILE)}" target="_blank" rel="noopener" aria-label="Instagram objava ${i + 1}">
          ${post.img ? `<img src="${esc(post.img)}" alt="${esc(post.alt)}" loading="lazy">` : PAW}
        </a>`).join('');

      // Hero pictures: change by themselves every HERO_SECONDS seconds (the ring in style.css uses the same number), or with the dots
      (() => {
        const HERO_SECONDS = 6;
        const slides = $$('.hero-bg span');
        const dotsBox = $('#hero-dots');
        if (slides.length < 2 || !dotsBox) return;
        let current = 0;
        let timer;
        dotsBox.innerHTML = slides.map((_, i) => `<button type="button" class="hero-dot" data-i="${i}" aria-label="Slika ${i + 1}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle class="track" cx="12" cy="12" r="10"/><circle class="bar" cx="12" cy="12" r="10"/></svg></button>`).join('');
        const dots = $$('.hero-dot', dotsBox);
        const show = (i) => {
          current = (i + slides.length) % slides.length;
          slides.forEach((s, k) => s.classList.toggle('is-on', k === current));
          $('.hero-wrap').classList.toggle('is-mono', slides[current].hasAttribute('data-mono'));   // black-and-white picture: neutral shade instead of brown
          dots.forEach((d) => d.classList.remove('is-on'));
          void dotsBox.offsetWidth;                          // restart the ring animation, also when the same dot is clicked again
          dots.forEach((d, k) => { d.classList.toggle('is-on', k === current); d.setAttribute('aria-current', String(k === current)); });
        };
        const start = () => {
          clearInterval(timer);
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
          timer = setInterval(() => show(current + 1), HERO_SECONDS * 1000);
        };
        dotsBox.addEventListener('click', (e) => {
          const d = e.target.closest('.hero-dot');
          if (!d) return;
          show(Number(d.dataset.i));
          start();                                   // after a manual change the 10 seconds begin again
        });
        $('.hero-bg').classList.add('is-ready');
        show(0);
        start();
      })();

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
      const CATS = window.SC.CATEGORIES;
      const wanted = params.get('c');
      const view = { filter: CATS.some((c) => c.key === wanted) ? wanted : 'all', query: '' };

      // one chip per collection
      $('#filters').innerHTML = [{ key: 'all', label: 'Sve' }, ...CATS].map((c) =>
        `<button type="button" class="chip${c.key === view.filter ? ' is-active' : ''}" data-filter="${c.key}">${esc(c.label)}</button>`).join('');

      const render = () => {
        const q = view.query.trim().toLowerCase();
        const list = PRODUCTS.filter((p) =>
          (view.filter === 'all' || p.category === view.filter) &&
          (!q || `${p.name} ${window.SC_T(p.name)} ${p.family} ${p.desc}`.toLowerCase().includes(q)));   // finds both Serbian and English names
        grid.innerHTML = list.map(cardHTML).join('');
        empty.hidden = list.length > 0;
        if (!list.length) {
          empty.textContent = q ? 'Nema rezultata. Probajte drugu reč.' : 'Ova kolekcija uskoro stiže. Javite nam se ako želite da je naručite.';
        }
        $('#result-count').textContent = list.length ? `${list.length} ${list.length === 1 ? 'proizvod' : 'proizvoda'}` : '';
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
      const MIN = p.minQty || 1;
      let qty = Math.max(MIN, p.defaultQty || MIN);   // gift candles open with 50 pieces
      let missing = [];     // required options still to pick

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
            ${isGift ? '' : '<div id="pdp-qty-slot"></div>'}
            <button class="btn btn--solid" id="pdp-add" type="button"></button>
          </div>
          ${MIN > 1 && !isGift ? `<p class="opt__help">Minimalna količina: ${MIN} kom po stavci.</p>` : ''}
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

      const tileHTML = (s, i, more = 0) => `
        <button type="button" class="tile" style="--tone:${p.color};--i:${i}" data-tile="${i}" aria-label="Uvećajte sliku ${i + 1}">
          ${i === 0 && p.tag ? `<span class="card__tag">${p.tag}</span>` : ''}
          ${slideHTML(s)}
          ${more > 0 ? `<span class="tile__more">+${more}</span>` : ''}
        </button>`;

      const bentoEl = $('#pdp-bento');
      const stride = () => {
        const t = bentoEl.querySelector('.tile');
        return t ? t.offsetWidth + (parseFloat(getComputedStyle(bentoEl).columnGap) || 0) : 0;
      };

      const renderGallery = () => {
        const list = slides();
        const strip = phone.matches;                      // phone: swipeable strip with every picture
        const shown = strip ? list : list.slice(0, SHOWN);
        const more = strip ? 0 : list.length - SHOWN;
        const keep = bentoEl.scrollLeft;                  // stay on the same picture when the colors change
        bentoEl.className = `bento bento--${Math.min(shown.length, 6)}${p.images?.length ? ' bento--photos' : ''}${introPlayed ? '' : ' bento--intro'}`;
        introPlayed = true;
        bentoEl.innerHTML = shown.map((s, i) => tileHTML(s, i, more > 0 && i === SHOWN - 1 ? more : 0)).join('');
        if (strip) bentoEl.scrollLeft = keep;
        $('#pdp-count').textContent = list.length > 1 ? `${strip ? Math.round(keep / (stride() || 1)) + 1 : 1} / ${list.length}` : '';
      };

      // Phone strip: just keep the counter in sync (1 to n, no looping).
      bentoEl.addEventListener('scroll', () => {
        if (!phone.matches) return;
        const s = stride();
        if (!s) return;
        const n = slides().length;
        $('#pdp-count').textContent = `${Math.min(Math.round(bentoEl.scrollLeft / s) + 1, n)} / ${n}`;
      }, { passive: true });
      phone.addEventListener('change', () => { bentoEl.scrollLeft = 0; renderGallery(); });

      // ----- price list window: your own picture if there is one, otherwise a table -----
      const slug = (str) => str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const priceImg = `assets/cenovnik/${slug(p.name)}.jpg`;
      const priceModal = document.createElement('div');
      priceModal.className = 'modal';
      priceModal.hidden = true;
      priceModal.innerHTML = `<div class="modal__box" role="dialog" aria-modal="true" aria-label="Cene po količini">
        <button type="button" class="modal__close" aria-label="Zatvori">×</button>
        <h3 class="modal__title">Cene po komadu · ${p.name}</h3>
        <div class="modal__body"></div></div>`;
      document.body.appendChild(priceModal);
      const priceTable = () => {
        const tiers = p.tiers;
        const rows = tiers.map((t, i) => {
          const from = i === 0 ? MIN : t.from;
          const to = tiers[i + 1] ? tiers[i + 1].from - 1 : null;
          return { label: to ? `${from}–${to} kom` : `${from}+ kom`, qty: from };
        });
        // packagings with the same price share one column (e.g. "Kartončić sa posvetom / U tilu")
        const groups = [];
        Object.keys(p.packPrices || { x: 0 }).forEach((k) => {
          const g = groups.find((x) => p.packPrices && x.price === p.packPrices[k]);
          if (g) g.names.push(k);
          else groups.push({ price: p.packPrices?.[k], names: [p.packPrices ? k : null], pack: k });
        });
        const head = groups.map((g) => `<th>${g.names[0] ? g.names.map(esc).join(' / ') : 'Cena po komadu'}</th>`).join('');
        const body = rows.map((r) => `<tr><td>${r.label}</td>${groups.map((g) => `<td><strong>${money(SC.unitPrice(p, r.qty, p.packPrices ? g.pack : undefined))}</strong></td>`).join('')}</tr>`).join('');
        return `<div class="ptable-wrap"><table class="ptable"><thead><tr><th>Količina</th>${head}</tr></thead><tbody>${body}</tbody></table></div>
          ${p.packPrices ? '' : '<p class="opt__help">Cena važi za sva pakovanja.</p>'}`;
      };
      const openPrices = () => {
        const body = $('.modal__body', priceModal);
        body.innerHTML = priceTable();
        priceModal.hidden = false;
        const img = new Image();                                  // a picture in assets/cenovnik/ replaces the table
        img.onload = () => { if (!priceModal.hidden) body.innerHTML = `<img class="modal__img" src="${priceImg}" alt="Cene po količini">`; };
        img.src = priceImg;
      };
      priceModal.addEventListener('click', (e) => { if (e.target === priceModal || e.target.closest('.modal__close')) priceModal.hidden = true; });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') priceModal.hidden = true; });
      subscribe(() => { if (!priceModal.hidden && !$('.modal__img', priceModal)) $('.modal__body', priceModal).innerHTML = priceTable(); });

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
        const unit = SC.unitPrice(p, eff, sel.pack);
        const total = Math.round(unit * qty * 100) / 100;
        let html = `<p class="pdp__price">${money(unit)} <small>/ kom</small></p>`;
        if (p.tiers) {
          const more = SC.nextTier(p, eff);
          html += `<p class="pdp__tier${more ? '' : ' is-on'}">${more ? 'Sa većom količinom cena po komadu je manja' : 'Najniža cena ✓'} · <button type="button" class="linkbtn" data-prices>pogledajte cene</button></p>`;
        }
        $('#pdp-price').innerHTML = html;
        $('#pdp-add').textContent = `Dodajte u korpu · ${money(total)}`;
      };

      // ----- options -----
      const qtyControl = () => `<div class="qty qty--lg">
          <button type="button" data-q="-1" aria-label="Manje">−</button>
          <input type="number" id="pdp-qty" inputmode="numeric" min="${MIN}" max="${MAX}" value="${qty}" aria-label="Količina">
          <button type="button" data-q="1" aria-label="Više">+</button>
        </div>`;
      // gift candles: the counter sits right under the packaging
      const qtyRow = () => `<div class="opt opt--qty"><div class="opt__label">Količina${MIN > 1 ? ` <span class="opt__hint">· minimalno ${MIN} kom</span>` : ''}</div>${qtyControl()}</div>`;

      const swatchGroup = (o) => `<div class="opt__chips">${o.choices.map((c) => `
        <button type="button" class="swatch${sel[o.key] === c.name ? ' is-active' : ''}" style="--sw:${c.hex}" data-opt="${o.key}" data-val="${esc(c.name)}" aria-label="${esc(c.name)}" aria-pressed="${sel[o.key] === c.name}" title="${esc(c.name)}"></button>`).join('')}</div>`;

      const cardOn = () => sel.pack === SC.CARD_PACK;                      // text is required
      const textOn = () => !!sel.pack && sel.pack !== SC.PLAIN_PACK;      // every packaging except "Samo sveća" takes a text

      const renderOpts = () => {
        if (!isGift) return;
        $('#pdp-opts').innerHTML = p.options.map((o) => {
          if (o.type === 'text') return '';                 // lives under Pakovanje (see below)
          if (o.type === 'date') {                           // celebration date; past days can't be picked
            const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
            return `
              <div class="opt">
                <div class="opt__label">${o.label}</div>
                <input class="opt__date" type="date" id="opt-${o.key}" min="${today}" value="${esc(sel[o.key] || '')}" aria-label="${o.label}">
              </div>`;
          }
          if (o.type === 'note') {                           // free note, always shown
            return `
              <div class="opt">
                <div class="opt__label">${o.label}</div>
                <textarea class="opt__text" id="opt-${o.key}" rows="1" maxlength="${o.maxLength}" placeholder="${esc(o.placeholder || '')}" aria-label="${o.label}">${esc(sel[o.key] || '')}</textarea>
              </div>`;
          }
          const askText = o.key === 'pack' && textOn();
          const needsText = askText && missing.includes('dedication');
          const err = missing.includes(o.key) || needsText;
          let control;
          let shown = '';
          if (o.type === 'choice' && o.choices.length <= 4) {
            control = `<div class="seg${o.choices.length === 4 ? ' seg--4' : ''}">${o.choices.map((c) =>
              `<button type="button" class="${sel[o.key] === c ? 'is-active' : ''}" data-opt="${o.key}" data-val="${esc(c)}" aria-pressed="${sel[o.key] === c}">${esc(c)}</button>`).join('')}</div>`;
          } else if (o.type === 'choice') {
            control = `<select class="opt__select" data-select="${o.key}" aria-label="${o.label}">
              <option value="">Izaberite…</option>
              ${o.choices.map((c) => `<option value="${esc(c)}"${sel[o.key] === c ? ' selected' : ''}>${esc(c)}</option>`).join('')}</select>`;
          } else {
            control = swatchGroup(o);
            shown = sel[o.key] || '';
          }
          if (askText) {
            const t = p.options.find((x) => x.type === 'text');
            control += `<textarea class="opt__text" id="opt-${t.key}" rows="1" maxlength="${t.maxLength}" placeholder="${esc(t.placeholder || '')}" aria-label="Tekst posvete">${esc(sel[t.key] || '')}</textarea>
              <p class="opt__help">Detalje možemo dogovoriti i telefonom posle poručivanja, nakon čega šaljemo predloge dizajna.</p>`;
          }
          return `
            <div class="opt${err ? ' has-error' : ''}">
              <div class="opt__label">${o.label}${shown ? ` <span class="opt__val">· ${esc(shown)}</span>` : ''}${err ? ` <span class="opt__err">· ${needsText && !missing.includes(o.key) ? 'upišite tekst posvete' : 'izaberite'}</span>` : ''}</div>
              ${control}
            </div>${o.key === 'pack' ? qtyRow() : ''}`;
        }).join('');
        growAll();
      };

      // text boxes start small and grow while the customer types
      const grow = (el) => {
        if (!el.value) { el.style.height = ''; return; }          // empty: the CSS height (one line) applies
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
      };
      const growAll = () => $$('textarea.opt__text', root).forEach(grow);

      const setQty = (n) => {
        qty = Math.max(MIN, Math.min(MAX, Math.floor(n) || MIN));
        $('#pdp-qty').value = qty;
        renderPrice();
      };

      root.addEventListener('click', (e) => {
        const q = e.target.closest('[data-q]');
        if (q) return setQty(qty + Number(q.dataset.q));
        if (e.target.closest('[data-prices]')) return openPrices();
        const qs = e.target.closest('[data-qset]');
        if (qs) return setQty(Number(qs.dataset.qset));
        const tile = e.target.closest('[data-tile]');
        if (tile) return showLightbox(Number(tile.dataset.tile));
        const opt = e.target.closest('[data-opt]');
        if (opt) {
          const hadText = textOn();
          sel[opt.dataset.opt] = opt.dataset.val;
          if (opt.dataset.opt === 'pack' && !textOn()) delete sel.dedication;
          if (opt.dataset.opt === 'pack' && !cardOn()) missing = missing.filter((k) => k !== 'dedication');
          missing = missing.filter((k) => k !== opt.dataset.opt);
          renderOpts();
          if (opt.dataset.opt === 'pack') renderPrice();
          if (opt.dataset.opt === 'pack' && textOn() && !hadText) $('#opt-dedication')?.focus();
          if (!p.images?.length) renderGallery();   // photos don't depend on the options, so leave them alone (no reload flash)
          return;
        }

        if (e.target.closest('#pdp-add')) {
          if (isGift) {
            missing = p.options.filter((o) => !o.optional && !sel[o.key]).map((o) => o.key);
            if (cardOn() && !(sel.dedication || '').trim()) missing.push('dedication');   // card chosen but no text yet
            if (missing.length) {
              renderOpts();
              $('.opt.has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              SC.toast('Izaberite označene opcije');
              return;
            }
          }
          const opts = {};
          (p.options || []).forEach((o) => {
            const v = (sel[o.key] || '').trim();
            if (v && (o.key !== 'dedication' || textOn())) opts[o.key] = v;
          });
          SC.addToCart(p.id, qty, opts);
          SC.openCart();
        }
      });

      root.addEventListener('change', (e) => { if (e.target.id === 'opt-date') sel.date = e.target.value; });
      root.addEventListener('input', (e) => {
        if (e.target.id === 'opt-date') { sel.date = e.target.value; return; }
        if (e.target.id === 'pdp-qty') {
          const n = Math.floor(Number(e.target.value));
          if (n >= 1) { qty = Math.max(MIN, Math.min(MAX, n)); renderPrice(); }   // field is tidied on blur, so "5" → "50" can be typed
        } else if (e.target.matches('.opt__text')) {
          sel[e.target.id.replace('opt-', '')] = e.target.value;
          grow(e.target);
          if (e.target.id === 'opt-dedication' && e.target.value.trim() && missing.includes('dedication')) {   // clear the warning without redrawing (keeps focus)
            missing = missing.filter((k) => k !== 'dedication');
            const row = e.target.closest('.opt');
            row.classList.remove('has-error');
            row.querySelector('.opt__err')?.remove();
          }
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
        // the next three candles after this one in the same category, wrapping around at the end
        const pool = PRODUCTS.filter((x) => x.category === p.category);
        const at = pool.indexOf(p);
        const picks = [];
        for (let k = 1; k < pool.length && picks.length < 3; k++) picks.push(pool[(at + k) % pool.length]);
        for (const x of PRODUCTS) if (picks.length < 3 && x !== p && !picks.includes(x)) picks.push(x);   // small category: fill from the rest
        const html = picks.map(cardHTML).join('');
        if (html !== related.dataset.html) { related.innerHTML = html; related.dataset.html = html; }
      };

      subscribe(() => { renderPrice(); renderRelated(); });
      renderGallery();
      if (!isGift) $('#pdp-qty-slot').innerHTML = qtyControl();   // other candles: counter next to the button
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
      $('#order-ship').textContent = 'Plaća se kuriru';
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
