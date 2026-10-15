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
    'Always & Forever srce': 'Always & Forever Heart', 'Dijamant srce': 'Diamond Heart', 'Astronaut': 'Astronaut', 'Pahulja': 'Snowflake', 'Cvetno srce': 'Flower Heart', 'Flame sveća': 'Flame candle', 'Zevs sveća': 'Zeus candle', 'Twist sveća': 'Twist candle',

    // ----- navigation, header, footer, cart -----
    'Početna': 'Home', 'Prodavnica': 'Shop', 'O nama': 'About us', 'Kontakt': 'Contact',
    'Scampy Candles Studio – početna': 'Scampy Candles Studio – home', 'Glavni meni': 'Main menu', 'Meni': 'Menu',
    'Jezik': 'Language', 'Valuta': 'Currency', 'Pretraga': 'Search', 'Korpa': 'Cart', 'Zatvori': 'Close',
    'Pretražite sveće (npr. vanila, limun…)': 'Search candles (e.g. vanilla, lemon…)',
    'Stranice': 'Pages', 'Pratite nas': 'Follow us', 'Pon–Pet, 10–18h': 'Mon–Fri, 10 am–6 pm',
    'Vaša korpa': 'Your cart', 'Korpa je prazna.': 'Your cart is empty.', 'Dodajte neku sveću 🕯️': 'Add a candle 🕯️',
    'Ukupno': 'Total', 'Nastavite na plaćanje': 'Proceed to checkout', 'Ukloni': 'Remove',
    'Poštarinu plaćate kuriru.': 'Postage is paid to the courier.', 'Poštarinu plaćate kuriru': 'Postage is paid to the courier',
    'Manje': 'Less', 'Više': 'More',

    // ----- home -----
    'Sveće od sojinog voska sa pamučnim fitiljem, ručno livene u malim serijama, sa mirisima koji greju dom.':
      'Soy wax candles with cotton wicks, hand-poured in small batches, with scents that warm the home.',
    'Ručni rad': 'Handmade', 'Ručno izlivene sveće sa mašnom': 'Hand-poured candles with a ribbon',
    'Sto u radionici prepun ručno rađenih sveća u obliku cveća': 'A workshop table full of handmade flower-shaped candles',
    'Scampy u dvorištu iza dve kutije sa buketima od sveća': 'Scampy in the garden behind two boxes of candle bouquets',
    'Posebni trenuci': 'Special moments', 'zaslužuju posebne detalje.': 'deserve special details.',
    'Pogledajte prodavnicu': 'Visit the shop', 'Naša priča': 'Our story', 'Zašto Scampy': 'Why Scampy', 'Zašto Scampy Candles': 'Why Scampy Candles',
    '100% sojin vosak': '100% soy wax', 'Čisto sagorevanje, bez parafina.': 'Clean burning, no paraffin.',
    'Ručno livene': 'Hand-poured', 'Male serije, velika pažnja.': 'Small batches, great care.',
    'Personalizovano do detalja': 'Personalised to the last detail', 'Zajedno oblikujemo dizajn koji prati vašu priču.': 'Together we shape a design that follows your story.',
    'Lično preuzimanje ili slanje poštom': 'Personal pickup or delivery by post', 'U Beogradu možete preuzeti lično.': 'In Belgrade you can pick it up in person.',
    'Pokloni za goste': 'Gifts for guests', 'Mali pokloni sa velikim srcem': 'Small gifts with a big heart',
    'Za venčanja, krštenja i rođendane. Boju, miris, pakovanje i posvetu birate Vi.': 'For weddings, christenings and birthdays. You choose the color, scent, packaging and message.',
    'Skulpturalna sveća od sojinog voska u obliku lika Zevsa, sa bogato izvajanom bradom i kovrdžama. Elegantan detalj za policu ili sto.':
      'A sculptural soy wax candle in the shape of Zeus, with a richly carved beard and curls. An elegant touch for a shelf or table.',
    'Rebrasta sveća od sojinog voska u boji slonovače, sa elegantnim uvrnutim detaljem na sredini. Dolazi u dve veličine, a zajedno čine skladan par.':
      'A ribbed ivory soy wax candle with an elegant twist in the middle. It comes in two sizes, and together they make a lovely pair.',
    'Pogledajte sve kolekcije': 'See all collections',
    'Pronađite nešto posebno': 'Find something special', 'Za koju priliku birate?': 'What is the occasion?',
    'Izaberite poklon': 'Choose a gift', 'Sveće za vaš dom': 'Candles for your home', 'Pogledajte sveće': 'See the candles',
    'Za venčanja, krštenja i rođendane, sa vašom posvetom.': 'For weddings, christenings and birthdays, with your own message.', '10+ oblika.': '10+ shapes.',
    'Skulpturalne sveće za policu, sto ili poklon nekom dragom.': 'Sculptural candles for a shelf or table, or as a gift for someone dear.', 'Pojedinačni komadi i setovi.': 'Single pieces and sets.',
    'Jesen': 'Autumn', 'Miris jeseni': 'The scent of autumn',
    'Bundeve, šišarke i sovice za duge večeri, tople šolje i dom koji miriše na cimet.': 'Pumpkins, pine cones and little owls for long evenings, warm mugs and a home that smells of cinnamon.',
    'Praznična sezona': 'Festive season', 'Praznici su blizu': 'The holidays are near',
    'Sveće koje greju dom i pokloni koji se pamte, za Novu godinu, Božić i sve vaše drage.': 'Candles that warm the home and gifts to remember, for New Year, Christmas and everyone dear to you.',
    'Dan zaljubljenih': "Valentine's Day", 'Za nekog posebnog': 'For someone special',
    'Srca, medići i nežne boje, mali znak pažnje koji kaže mnogo.': 'Hearts, teddy bears and soft colours, a small gesture that says a lot.',
    'Proleće': 'Spring', 'Sve cveta': 'Everything is blooming',
    'Božuri, cvetna srca i buketi koji nikada ne venu, za proleće u vašem domu.': 'Peonies, flower hearts and bouquets that never wilt, for spring in your home.',
    'Leto': 'Summer', 'Ukus leta': 'A taste of summer',
    'Limunovi, svetle boje i sveže note, za duge letnje večeri.': 'Lemons, bright colours and fresh notes, for long summer evenings.',
    'Poručite na vreme, jer svaku sveću pravimo ručno.': 'Order in time, as we make every candle by hand.',
    'Nove sezonske sveće stižu uskoro. Za porudžbine i pitanja pišite nam.': 'New seasonal candles are coming soon. Write to us with orders and questions.',
    "dana do Nove godine": "days until New Year", "dan do Nove godine": "day until New Year",
    "dana do Božića": "days until Christmas", "dan do Božića": "day until Christmas",
    "dana do Dana zaljubljenih": "days until Valentine's Day", "dan do Dana zaljubljenih": "day until Valentine's Day",
    'Srećna Nova godina!': 'Happy New Year!', 'Srećan Božić!': 'Merry Christmas!', 'Srećan Dan zaljubljenih!': "Happy Valentine's Day!",
    'Pišite nam': 'Write to us', 'Pogledajte sezonsku kolekciju': 'See the seasonal collection',
    'Veličina': 'Size', 'Mala': 'Small', 'Velika': 'Large', 'Set (mala + velika)': 'Set (small + large)',
    'Elegantna sveća od sojinog voska u boji slonovače, sa rebrastim postoljem. Dolazi u dve veličine, a zajedno čine skladan set.':
      'An elegant ivory soy wax candle on a ribbed base. It comes in two sizes, and together they make a lovely set.',
    'Poklon za goste': 'Gift for guests', 'Odaberite': 'Choose', 'Sve sveće': 'All candles',
    'Scampy je počeo u maloj kuhinji, sa jednim loncem voska i jednim vrlo radoznalim psom. Danas svaku sveću i dalje ručno izlivamo, od sojinog voska sa pamučnim fitiljem i mirisima koje smo sami birali.':
      'Scampy started in a small kitchen, with one pot of wax and one very curious dog. Today we still pour every candle by hand, from soy wax with a cotton wick and scents we chose ourselves.',
    'Pročitajte celu priču →': 'Read the full story →',
    'Utisci': 'Reviews', 'Šta kažu naši kupci': 'What our customers say',
    '„Lavanda miriše savršeno, a pakovanje je tako lepo da sam je poklonila.“': '“The lavender smells perfect, and the packaging is so beautiful that I gave it as a gift.”',
    '„Gori satima i ravnomerno. Vanila & karamel je moj omiljeni.“': '“It burns for hours and evenly. Vanilla & caramel is my favourite.”',
    'Zapratite nas na Instagramu': 'Follow us on Instagram',
    'Budite u toku': 'Stay in the loop', 'Prijavite se i dobijte 10% popusta na prvu porudžbinu.': 'Sign up and get 10% off your first order.',
    'Prijavite me': 'Sign me up', 'ime@email.com': 'name@email.com',
    'Hvala! Javljamo se uskoro 🐾': 'Thank you! We will be in touch soon 🐾',
    'Capri Lemon – sveća u obliku limuna': 'Capri Lemon – lemon-shaped candle',
    'Medvedići za krštenje': 'Teddy bears for a christening',
    'Božur – pokloni za venčanja': 'Peony – gifts for weddings',
    'Always & Forever srce – ručno izlivene sveće': 'Always & Forever Heart – hand-poured candles',
    'Pokloni za rođendane i krštenja': 'Gifts for birthdays and christenings',
    'Bubble – pokloni, sveće od sojinog voska': 'Bubble – gifts, soy wax candles',
    'Scampy Candles · Ručno rađene sojine sveće': 'Scampy Candles · Handmade soy candles',
    'Ručno rađene sojine sveće. Pawsitively handcrafted, with love.': 'Handmade soy candles. Pawsitively handcrafted, with love.',

    // ----- shop -----
    'Ručno izlivene, od sojinog voska sa pamučnim fitiljem.': 'Hand-poured, made of soy wax with a cotton wick.',
    'Sve': 'All', 'Naše kolekcije': 'Our collections', 'Sve kolekcije': 'All collections', 'Pogledajte': 'View', 'Pažljivo odabrani komadi -': 'Carefully selected pieces -', 'Uskoro': 'Coming soon', '← Sve kolekcije': '← All collections',
    'Kolekcije · Scampy Candles': 'Collections · Scampy Candles',
    'Naše kolekcije: pokloni za goste, Classic, Sezonska kolekcija i buketi.': 'Our collections: gifts for guests, Classic, Seasonal collection and bouquets.', 'Kolekcija': 'Collection', 'Classic kolekcija': 'Classic collection', 'Sezonska kolekcija': 'Seasonal collection', 'Buketi': 'Bouquets',
    'Ova kolekcija uskoro stiže. Javite nam se ako želite da je naručite.': 'This collection is coming soon. Get in touch if you would like to order it.',
    'Nema rezultata. Probajte drugu reč.': 'No results. Try another word.',
    'Prodavnica · Scampy Candles': 'Shop · Scampy Candles',
    'Sve Scampy sveće na jednom mestu: cvetne, slatke, drvenaste i sveže.': 'All Scampy candles in one place.',
    'u kartonskoj kutijici': 'in a cardboard box', 'u tilu': 'in tulle', 'kartončić sa posvetom': 'card with a message', 'samo sveća': 'candle only',

    // ----- about -----
    'Scampy Candles je nastao sasvim spontano, u jednoj maloj trpezariji, iz želje da stvaramo nešto svojim rukama.':
      'Scampy Candles began quite spontaneously, in a small dining room, out of a wish to make something with our own hands.',
    'Nas dvoje smo po struci softverski inženjeri, ali smo oduvek imali i kreativnu stranu koja je tražila svoj prostor. Iako je svet tehnologije naš svakodnevni posao, Scampy je postao mnogo više od hobija – naš mali svet u kome ideje pretvaramo u nešto opipljivo.':
      'We are both software engineers by profession, but we have always had a creative side looking for its own space. Technology is our everyday job, yet Scampy has become much more than a hobby – our little world where ideas turn into something you can hold.',
    'Sve je počelo jednim loncem voska, prvim cvetnim svećama i idejom da napravimo bukete koji nikada ne venu. A sve to uz budno oko našeg psa, po kome je naš mali brend i dobio ime.':
      'It all started with one pot of wax, our first flower candles and the idea of making bouquets that never wilt. All under the watchful eye of our dog, who gave our small brand its name.',
    'Od prvih buketa za naše najbliže stigli smo do desetina rođendana, krštenja i drugih posebnih trenutaka čiji smo danas mali deo.':
      'From the first bouquets for our loved ones, we have come to dozens of birthdays, christenings and other special moments we are now a small part of.',
    'Iako je Scampy porastao, trpezariju zamenila naša radionica, a prve eksperimente pažljivo osmišljen proces izrade, neke stvari se nisu promenile.':
      'Scampy has grown, the dining room has become our workshop and the first experiments a carefully thought-out making process, yet some things have not changed.',
    'I dalje svaku sveću pravimo nas dvoje, ručno, sa istom pažnjom i uzbuđenjem kao na početku.':
      'The two of us still make every candle by hand, with the same care and excitement as at the very beginning.',
    '12.000+': '12,000+', 'prodatih sveća': 'candles sold', 'proslava čiji smo deo': 'celebrations we were part of',
    'Od čega pravimo sveće': 'What we make our candles from',
    'Sojin vosak': 'Soy wax', 'Prirodan, obnovljiv i čist. Sagoreva sporije i ravnomernije od parafina.': 'Natural, renewable and clean. Burns slower and more evenly than paraffin.',
    'Male serije': 'Small batches', 'Izlivamo ih ručno, nekoliko desetina odjednom, da bi svaka dobila pažnju.': 'We pour them by hand, a few dozen at a time, so each one gets attention.',
    'Pogledajte celu kolekciju i pronađite svoj miris.': 'Browse the whole collection and find your scent.',
    'O nama · Scampy Candles': 'About us · Scampy Candles',
    'Priča iza Scampy Candles: ručno rađene sojine sveće i dizajn od početka do kraja.': 'The story behind Scampy Candles: handmade soy candles and design from start to finish.',

    // ----- contact -----
    'Za najbrže odgovore pišite nam na Instagramu -': 'For the fastest replies, message us on Instagram -',
    'Javite nam se': 'Get in touch', 'Pitanja o porudžbini, poklonima za goste ili saradnji. Odgovaramo u roku od jednog radnog dana.': 'Questions about an order, gifts for guests or collaboration. We reply within one working day.',
    'Podaci': 'Details', 'Telefon': 'Phone', 'Radno vreme': 'Opening hours', 'Ime': 'Name', 'Poruka': 'Message',
    'Pošaljite poruku': 'Send message', 'Hvala na poruci! Javljamo se uskoro 🐾': 'Thank you for your message! We will be in touch soon 🐾',
    'Kontakt · Scampy Candles': 'Contact · Scampy Candles',
    'Pišite nam: pitanja o porudžbinama, poklonima za goste i saradnji.': 'Write to us: questions about orders, gifts for guests and collaboration.',

    // ----- product page -----
    '/ kom': '/ pc', '/ po komadu': '/ per piece', 'od': 'from', 'Sa većom količinom cena po komadu je manja ·': 'The price per piece is lower with a larger quantity ·', 'Najniža cena ✓ ·': 'Lowest price ✓ ·',
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
    'Slike': 'Pictures', 'Putanja': 'Breadcrumb', 'Prethodna': 'Previous', 'Sledeća': 'Next',
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
    [/^Slika (\d+)$/, 'Picture $1'],
    [/^Uvećajte sliku (\d+)$/, 'Enlarge picture $1'],
    [/^(.+) je u korpi$/, (m, name) => `${tr(name)} is in the cart`],
    [/^(\d+) kom, (.+)$/, (m, n, pack) => `${n} pcs, ${tr(pack)}`],
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
