/* English version of the site.
 *
 * The pages are written in Serbian. When the visitor picks English (saved as `sc.lang`), this file translates
 * every text it knows: text nodes, placeholders, aria-labels, titles and alt texts. It also translates content
 * that other scripts add later (cart, product options, messages), so those scripts need no changes.
 *
 * To translate a new text, add `'Serbian text': 'English text'` to DICT. Patterns with numbers go to RULES.
 * Product names stay as they are (they are the brand's own names).
 */
(() => {
  let lang = 'sr';
  try { lang = JSON.parse(localStorage.getItem('sc.lang')) || 'sr'; } catch { /* default */ }
  window.SC_LANG = lang;
  window.SC_T = (s) => s;                  // replaced below when English is on
  if (lang !== 'en') return;               // Serbian is the source text: nothing to do

  document.documentElement.lang = 'en';
  document.documentElement.classList.add('i18n-pending');   // hidden until the first pass is done (no flash of Serbian)

  const DICT = {
    // ----- names of the candles -----
    'Mali meda': 'Little Bear', 'Meda sa srcem': 'Bear with a Heart', 'Lavić': 'Little Lion', 'Bubble': 'Bubble', 'Božur': 'Peony',
    'Always & Forever srce': 'Always & Forever Heart', 'Dijamant srce': 'Diamond Heart', 'Astronaut': 'Astronaut', 'Pahulja': 'Snowflake', 'Cvetno srce': 'Flower Heart',

    // ----- navigation, header, footer, cart -----
    'Početna': 'Home', 'Prodavnica': 'Shop', 'O nama': 'About us', 'Kontakt': 'Contact',
    'Scampy Candles – početna': 'Scampy Candles – home', 'Glavni meni': 'Main menu', 'Meni': 'Menu',
    'Jezik': 'Language', 'Valuta': 'Currency', 'Pretraga': 'Search', 'Korpa': 'Cart', 'Zatvori': 'Close',
    'Pretražite sveće (npr. vanila, limun…)': 'Search candles (e.g. vanilla, lemon…)',
    'Stranice': 'Pages', 'Pratite nas': 'Follow us', 'Pon–Pet, 10–18h': 'Mon–Fri, 10 am–6 pm',
    'Vaša korpa': 'Your cart', 'Korpa je prazna.': 'Your cart is empty.', 'Dodajte neku sveću 🕯️': 'Add a candle 🕯️',
    'Ukupno': 'Total', 'Nastavite na plaćanje': 'Proceed to checkout', 'Ukloni': 'Remove',
    'Poštarinu plaćate kuriru.': 'Postage is paid to the courier.', 'Poštarinu plaćate kuriru': 'Postage is paid to the courier',
    'Manje': 'Less', 'Više': 'More',

    // ----- home -----
    'Nova kolekcija': 'New collection', 'Jesen 2025': 'Autumn 2025',
    'Sveće od sojinog voska sa pamučnim fitiljem, ručno livene u malim serijama, sa mirisima koji greju dom. Deo svake prodaje ide azilima za napuštene životinje.':
      'Soy wax candles with cotton wicks, hand-poured in small batches, with scents that warm the home. A part of every sale goes to shelters for abandoned animals.',
    'Pogledajte prodavnicu': 'Visit the shop', 'Naša priča': 'Our story', 'Zašto Scampy': 'Why Scampy',
    '100% sojin vosak': '100% soy wax', 'Čisto sagorevanje, bez parafina': 'Clean burning, no paraffin',
    'Ručno livene': 'Hand-poured', 'Male serije, velika pažnja': 'Small batches, great care',
    'Za šape': 'For paws', '5% svake prodaje ide azilima': '5% of every sale goes to shelters',
    'Dostava 2–3 dana': 'Delivery in 2–3 days',
    'Poklončići za goste': 'Guest favours', 'Mali pokloni sa velikim srcem': 'Small gifts with a big heart',
    'Za venčanja, krštenja i rođendane. Boju, miris, pakovanje i posvetu birate sami.': 'For weddings, christenings and birthdays. You choose the color, scent, packaging and message yourself.',
    'Poklončić za goste': 'Guest favour', 'Odaberite': 'Choose', 'Sve sveće': 'All candles',
    'Sveće sa srcem (i šapom)': 'Candles with heart (and a paw)',
    'Scampy je počeo u maloj kuhinji, sa jednim loncem voska i jednim vrlo radoznalim psom. Danas svaku sveću i dalje ručno livamo, od sojinog voska sa pamučnim fitiljem i mirisima koje smo sami birali.':
      'Scampy started in a small kitchen, with one pot of wax and one very curious dog. Today we still pour every candle by hand, from soy wax with a cotton wick and scents we chose ourselves.',
    'Pročitajte celu priču →': 'Read the full story →',
    'Utisci': 'Reviews', 'Šta kažu naši kupci': 'What our customers say',
    '„Lavanda miriše savršeno, a pakovanje je tako lepo da sam je poklonila.“': '“The lavender smells perfect, and the packaging is so beautiful that I gave it as a gift.”',
    '„Gori satima i ravnomerno. Vanila & karamel je moj omiljeni.“': '“It burns for hours and evenly. Vanilla & caramel is my favourite.”',
    '„Divno što deo prodaje ide azilima. Naručiću opet sigurno.“': '“It is wonderful that part of the sales goes to shelters. I will definitely order again.”',
    'Zapratite nas na Instagramu': 'Follow us on Instagram',
    'Budite u toku': 'Stay in the loop', 'Prijavite se i dobijte 10% popusta na prvu porudžbinu.': 'Sign up and get 10% off your first order.',
    'Prijavite me': 'Sign me up', 'ime@email.com': 'name@email.com',
    'Hvala! Javljamo se uskoro 🐾': 'Thank you! We will be in touch soon 🐾',
    'Scampy Candles · Ručno rađene sojine sveće': 'Scampy Candles · Handmade soy candles',
    'Ručno rađene sojine sveće. Pawsitively handcrafted, with love.': 'Handmade soy candles. Pawsitively handcrafted, with love.',

    // ----- shop -----
    'Ručno livene, od sojinog voska sa pamučnim fitiljem.': 'Hand-poured, made of soy wax with a cotton wick.',
    'Sve': 'All', 'Kolekcija': 'Collection', 'Classic kolekcija': 'Classic collection', 'Sezonska kolekcija': 'Seasonal collection', 'Buketi': 'Bouquets',
    'Ova kolekcija uskoro stiže. Javite nam se ako želite da je naručite.': 'This collection is coming soon. Get in touch if you would like to order it.',
    'Nema rezultata. Probajte drugu reč.': 'No results. Try another word.',
    'Prodavnica · Scampy Candles': 'Shop · Scampy Candles',
    'Sve Scampy sveće na jednom mestu: cvetne, slatke, drvenaste i sveže.': 'All Scampy candles in one place.',
    'u kartonskoj kutijici': 'in a cardboard box', 'u tilu': 'in tulle', 'kartončić sa posvetom': 'card with a message', 'samo sveća': 'candle only',

    // ----- about -----
    'Scampy je počeo u maloj kuhinji, sa jednim loncem voska i jednim vrlo radoznalim psom po imenu Scampy. Dok je on čuvao stražu, nastale su prve sveće.':
      'Scampy started in a small kitchen, with one pot of wax and one very curious dog called Scampy. While he stood guard, the first candles were made.',
    'Danas svaku sveću i dalje ručno livamo, od sojinog voska sa pamučnim fitiljem i mirisima koje smo sami birali. Zato svaka ima malo drugačiji karakter.':
      'Today we still pour every candle by hand, from soy wax with a cotton wick and scents we chose ourselves. That is why each one has a slightly different character.',
    'prodatih sveća': 'candles sold', 'autorskih mirisa': 'signature scents', 'za azile': 'for shelters',
    'Naše vrednosti': 'Our values', 'Od čega pravimo sveće': 'What we make our candles from',
    'Sojin vosak': 'Soy wax', 'Prirodan, obnovljiv i čist. Sagoreva sporije i ravnomernije od parafina.': 'Natural, renewable and clean. Burns slower and more evenly than paraffin.',
    'Male serije': 'Small batches', 'Livamo ih ručno, nekoliko desetina odjednom, da bi svaka dobila pažnju.': 'We pour them by hand, a few dozen at a time, so each one gets attention.',
    'Pet posto svake prodaje odlazi azilima za napuštene životinje u Srbiji.': 'Five percent of every sale goes to shelters for abandoned animals in Serbia.',
    'Probajte neku od njih': 'Try one of them', 'Pogledajte celu kolekciju i nađite svoj miris.': 'Browse the whole collection and find your scent.',
    'O nama · Scampy Candles': 'About us · Scampy Candles',
    'Priča iza Scampy Candles: ručno rađene sojine sveće i 5% prodaje za azile.': 'The story behind Scampy Candles: handmade soy candles and 5% of sales for shelters.',

    // ----- contact -----
    'Javite nam se': 'Get in touch', 'Pitanja o porudžbini, poklon paketi ili saradnja. Odgovaramo u roku od jednog radnog dana.': 'Questions about an order, gift packages or collaboration. We reply within one working day.',
    'Podaci': 'Details', 'Telefon': 'Phone', 'Radno vreme': 'Opening hours', 'Ime': 'Name', 'Poruka': 'Message',
    'Pošaljite poruku': 'Send message', 'Hvala na poruci! Javljamo se uskoro 🐾': 'Thank you for your message! We will be in touch soon 🐾',
    'Kontakt · Scampy Candles': 'Contact · Scampy Candles',
    'Pišite nam: pitanja o porudžbinama, poklon paketima i saradnji.': 'Write to us: questions about orders, gift packages and collaboration.',

    // ----- product page -----
    '/ kom': '/ pc', 'Sa većom količinom cena po komadu je manja ·': 'The price per piece is lower with a larger quantity ·', 'Najniža cena ✓ ·': 'Lowest price ✓ ·',
    'pogledajte cene': 'see prices',
    'Pakovanje': 'Packaging', 'U kartonskoj kutijici': 'In a cardboard box', 'U tilu': 'In tulle', 'Kartončić sa posvetom': 'Card with a message', 'Samo sveća': 'Candle only',
    'Detalje možemo dogovoriti i telefonom posle poručivanja, nakon čega šaljemo predloge dizajna.': 'We can also agree on the details by phone after you order, after which we send design proposals.',
    'Količina': 'Quantity', 'Boja sveće': 'Candle color', 'Miris': 'Scent', 'Izaberite…': 'Choose…',
    'Bez mirisa': 'No scent', 'Vanila': 'Vanilla', 'Jabuka': 'Apple', 'Kokos': 'Coconut', 'Bundeva': 'Pumpkin', 'Limun': 'Lemon', 'Malina': 'Raspberry', 'Kafa': 'Coffee', 'Cimet': 'Cinnamon',
    'Boja mašnice': 'Ribbon color', 'Datum proslave': 'Date of the celebration', 'Napomena': 'Note', 'Posveta': 'Message',
    'Bela': 'White', 'Krem': 'Cream', 'Roze': 'Pink', 'Crvena': 'Red', 'Lila': 'Lilac', 'Plava': 'Blue', 'Zelena': 'Green', 'Žuta': 'Yellow', 'Zlatna': 'Gold', 'Crna': 'Black',
    'Ime/imena, posveta npr. „Hvala što ste bili sa nama“, datum': 'Name(s), message e.g. “Thank you for being with us”, date', 'Tekst posvete': 'Message text',
    'Ako imate neku želju koja nije navedena ili pitanje, ostavite ovde': 'If you have a wish that is not listed, or a question, leave it here',
    'Možda će vam se svideti': 'You may also like', 'Još iz kolekcije': 'More from the collection',
    'Putanja': 'Breadcrumb', 'Prethodna': 'Previous', 'Sledeća': 'Next',
    '· izaberite': '· choose', '· upišite tekst posvete': '· enter the message text', 'Izaberite označene opcije': 'Please choose the highlighted options',
    'Cene po količini': 'Prices by quantity', 'Cene po komadu': 'Prices per piece', 'Cena po komadu': 'Price per piece', 'Cena važi za sva pakovanja.': 'The price applies to all packagings.',
    'Ova sveća nije pronađena.': 'This candle was not found.', 'Nazad u prodavnicu': 'Back to the shop', 'Proizvod · Scampy Candles': 'Product · Scampy Candles',
    'Dodajte u korpu': 'Add to cart', 'Dodajte': 'Add',

    // ----- checkout and thank-you -----
    'Poručivanje': 'Ordering', 'Podaci za dostavu': 'Delivery details', 'Vaša korpa je prazna.': 'Your cart is empty.',
    'Prezime': 'Last name', 'Adresa dostave': 'Delivery address', 'Ulica i broj': 'Street and number', 'Poštanski broj': 'Postal code', 'Grad': 'City',
    'Za sada dostavljamo samo na teritoriji Srbije.': 'For now we deliver only within Serbia.', 'Napomena (nije obavezno)': 'Note (optional)',
    'Način plaćanja': 'Payment method', 'Plaćanje pouzećem': 'Cash on delivery', 'Plaćate kuriru gotovinom prilikom preuzimanja paketa.': 'You pay the courier in cash when you receive the package.',
    'Potvrdite porudžbinu': 'Confirm order', 'Klikom na dugme potvrđujete porudžbinu. Ništa ne plaćate unapred.': 'By clicking the button you confirm the order. You pay nothing in advance.',
    'Vaša porudžbina': 'Your order', 'Plaćate pri preuzimanju.': 'You pay on delivery.',
    'Unesite broj telefona, npr. 060 123 4567': 'Enter a phone number, e.g. 060 123 4567', 'Poštanski broj ima 5 cifara': 'The postal code has 5 digits',
    'Pregled porudžbine': 'Order summary', 'Plaćanje · Scampy Candles': 'Checkout · Scampy Candles',
    'Porudžbina primljena': 'Order received', 'Hvala vam!': 'Thank you!', 'Broj porudžbine:': 'Order number:',
    'Potvrdu šaljemo na': 'We are sending the confirmation to',
    'Neko od nas će vas kontaktirati i javiti vam vreme dostave.': 'Someone from our team will contact you and let you know the delivery time.',
    'Pregled': 'Summary', 'Međuzbir': 'Subtotal', 'Dostava': 'Delivery', 'Plaća se kuriru': 'Paid to the courier',
    'Za plaćanje pouzećem (bez dostave)': 'To pay on delivery (excluding delivery)', 'Nastavite kupovinu': 'Continue shopping', 'Hvala · Scampy Candles': 'Thank you · Scampy Candles',
  };

  const unit = (n) => (n === 1 ? 'product' : 'products');
  const RULES = [
    [/^(\d+)–(\d+) kom$/, '$1–$2 pcs'],
    [/^(\d+)\+ kom$/, '$1+ pcs'],
    [/^· minimalno (\d+) kom$/, '· minimum $1 pcs'],
    [/^min\. (\d+) kom$/, 'min. $1 pcs'],
    [/^(.+) \/ kom$/, '$1 / pc'],
    [/^(\d+) proizvod(?:a)?$/, (m, n) => `${n} ${unit(Number(n))}`],
    [/^Instagram objava (\d+)$/, 'Instagram post $1'],
    [/^Uvećajte sliku (\d+)$/, 'Enlarge picture $1'],
    [/^(.+) je u korpi$/, (m, name) => `${tr(name)} is in the cart`],
    [/^po komadu · (\d+) kom, (.+)$/, (m, n, pack) => `per piece · ${n} pcs, ${tr(pack)}`],
    [/^· (.+)$/, (m, v) => `· ${tr(v)}`],
  ];

  function tr(s) {
    if (Object.prototype.hasOwnProperty.call(DICT, s)) return DICT[s];
    for (const [re, rep] of RULES) if (re.test(s)) return s.replace(re, rep);
    for (const sep of [' · ', ' / ']) {                       // "a · b" and "a / b": translate each side
      if (s.includes(sep)) {
        const parts = s.split(sep);
        const out = parts.map(tr);
        if (out.some((x, i) => x !== parts[i])) return out.join(sep);
      }
    }
    const m = /^([^:]{2,40}): (.+)$/.exec(s);                 // "Pakovanje: U tilu"
    if (m && Object.prototype.hasOwnProperty.call(DICT, m[1])) return `${DICT[m[1]]}: ${tr(m[2])}`;
    return s;
  }

  window.SC_T = tr;

  const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'NOSCRIPT', 'CODE']);
  const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];

  function textNode(n) {
    const p = n.parentElement;
    if (!p || SKIP.has(p.tagName) || p.closest('[data-no-i18n]')) return;
    const raw = n.nodeValue;
    const core = raw.replace(/\s+/g, ' ').trim();
    if (!core) return;
    const out = core === 'Ime' && p.closest('#checkout-form') ? 'First name' : tr(core);   // "Ime" is "Name" on the contact form but "First name" at checkout
    if (out !== core) n.nodeValue = raw.match(/^\s*/)[0] + out + raw.match(/\s*$/)[0];
  }
  function attrs(el) {
    for (const a of ATTRS) {
      const v = el.getAttribute && el.getAttribute(a);
      if (!v) continue;
      const out = tr(v.replace(/\s+/g, ' ').trim());
      if (out !== v) el.setAttribute(a, out);
    }
  }
  function walk(root) {
    if (root.nodeType === 3) return textNode(root);
    if (root.nodeType !== 1) return;
    attrs(root);                                             // placeholders and labels of text boxes too
    if (SKIP.has(root.tagName)) return;                      // but never the text typed or stored inside them
    for (const c of root.childNodes) walk(c);
  }

  function head() {
    const title = tr(document.title.replace(/\s+/g, ' ').trim());
    if (title !== document.title) document.title = title;            // only when it changes, so it cannot loop
    const meta = document.querySelector('meta[name="description"]');
    if (meta && tr(meta.content) !== meta.content) meta.content = tr(meta.content);
  }

  const observer = new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === 'childList') r.addedNodes.forEach(walk);
      else if (r.type === 'characterData') textNode(r.target);
      else if (r.type === 'attributes') attrs(r.target);
    }
    if (document.title) head();
    observer.takeRecords();                                   // ignore the changes we just made ourselves
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });

  document.addEventListener('DOMContentLoaded', () => {
    walk(document.body);
    head();
    observer.takeRecords();
    document.documentElement.classList.remove('i18n-pending');
  });
})();
