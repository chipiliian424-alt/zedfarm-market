/**
 * ZedFarm Market — Core Application Script
 * Vanilla JavaScript (No build step required, works on both file:/// and http/https).
 */

(function () {
  'use strict';

  // --- 1. CONFIGURATION & SUPABASE INITIALIZATION ---
  const SUPABASE_URL = 'https://veypltgafryvenzqebzm.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_6h3Gqxz2-gFza365BbaycQ_1UlqnKLR';

  let supabaseClient = null;
  function getSupabase() {
    if (supabaseClient) return supabaseClient;
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return supabaseClient;
    }
    return null;
  }

  // --- 2. MULTILINGUAL TRANSLATIONS (EN, BEMBA, NYANJA) ---
  const TRANSLATIONS = {
    en: {
      'site.title': 'ZedFarm Market',
      'home.heroTitle': 'Welcome to ZedFarm Market',
      'home.heroSubtitle': 'A marketplace connecting Zambian farmers with buyers. Fresh produce, livestock, honey and more.',
      'home.featured': 'Latest listings',
      'browse.title': 'Browse products',
      'browse.search': 'Search',
      'browse.searchPlaceholder': 'Search products...',
      'browse.allCategories': 'All categories',
      'browse.allProvinces': 'All provinces',
      'browse.district': 'District',
      'browse.sortNewest': 'Newest first',
      'browse.sortPriceAsc': 'Price: low to high',
      'browse.sortPriceDesc': 'Price: high to low',
      'browse.showSold': 'Show sold',
      'browse.minPrice': 'Min price (ZMW)',
      'browse.maxPrice': 'Max price (ZMW)',
      'browse.noResults': 'No listings found.',
      'browse.results': 'results',
      'listing.category': 'Category',
      'listing.price': 'Price',
      'listing.quantity': 'Quantity',
      'listing.location': 'Location',
      'listing.farmer': 'Farmer',
      'listing.phone': 'Phone',
      'listing.posted': 'Posted',
      'listing.description': 'Description',
      'listing.available': 'Available',
      'listing.sold': 'Sold',
      'listing.call': 'Call',
      'listing.whatsapp': 'WhatsApp',
      'auth.loginTitle': 'Log in',
      'auth.signupTitle': 'Create account',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.fullName': 'Full name',
      'auth.phone': 'Phone',
      'auth.province': 'Province',
      'auth.district': 'District',
      'auth.loginBtn': 'Log in',
      'auth.signupBtn': 'Sign up',
      'auth.noAccount': 'No account?',
      'auth.hasAccount': 'Already have an account?',
      'dash.title': 'My listings',
      'dash.add': 'Add listing',
      'dash.edit': 'Edit listing',
      'dash.addTitle': 'Add listing',
      'dash.noListings': 'No listings yet. Add one!',
      'dash.markSold': 'Mark sold',
      'dash.markAvailable': 'Mark available',
      'dash.delete': 'Delete',
      'dash.save': 'Save',
      'dash.cancel': 'Cancel',
      'dash.titleField': 'Title',
      'dash.categoryField': 'Category',
      'dash.descriptionField': 'Description',
      'dash.priceField': 'Price (ZMW)',
      'dash.unitField': 'Unit',
      'dash.quantityField': 'Quantity',
      'dash.provinceField': 'Province',
      'dash.districtField': 'District',
      'dash.imageField': 'Image',
      'nav.home': 'Home',
      'nav.browse': 'Browse',
      'nav.dashboard': 'Dashboard',
      'nav.login': 'Log in',
      'nav.signup': 'Sign up',
      'nav.logout': 'Log out',
      'a11y.skip': 'Skip to main content',
      'lang.label': 'Language',
      'tts.readPage': 'Listen',
      'tts.play': 'Play',
      'tts.pause': 'Pause',
      'tts.stop': 'Stop',
      'tts.speed': 'Speed',
      'common.loading': 'Loading...',
      'common.error': 'Something went wrong. Please try again.',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.view': 'View',
      'common.read': 'Listen',
      'footer.text': '© ZedFarm Market — connecting Zambian farmers and buyers.'
    },
    bem: {
      'site.title': 'ZedFarm Market',
      'home.heroTitle': 'Mwaiseni ku ZedFarm Market',
      'home.heroSubtitle': 'Market iyo ikalunga abalimi na abashita mu Zambia. Ifisabo, inama, uci na vino vyuze.',
      'home.featured': 'Ifipya fya pali market',
      'browse.title': 'Sakafye ifya kupanga',
      'browse.search': 'Sakafye',
      'browse.searchPlaceholder': 'Sakafye ifya kupanga...',
      'browse.allCategories': 'Amacategory yonse',
      'browse.allProvinces': 'Amacounty yonse',
      'browse.district': 'District',
      'browse.sortNewest': 'Ifipya kumbi',
      'browse.sortPriceAsc': 'Mutengo: uucepela ku uwakulu',
      'browse.sortPriceDesc': 'Mutengo: uwakulu ku uucepela',
      'browse.showSold': 'Langa ifyashitwa',
      'browse.minPrice': 'Mutengo uucepela (ZMW)',
      'browse.maxPrice': 'Mutengo uwakulu (ZMW)',
      'browse.noResults': 'Tapali ifyaoneka.',
      'browse.results': 'ifyaoneka',
      'listing.category': 'Category',
      'listing.price': 'Mutengo',
      'listing.quantity': 'Uwingi',
      'listing.location': 'Ukwaba',
      'listing.farmer': 'Mulimi',
      'listing.phone': 'Phone',
      'listing.posted': 'Ku file',
      'listing.description': 'Ukupwililika',
      'listing.available': 'Kuli',
      'listing.sold': 'Yashitwa',
      'listing.call': 'Fonela',
      'listing.whatsapp': 'WhatsApp',
      'auth.loginTitle': 'Ingila',
      'auth.signupTitle': 'Lembesha account',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.fullName': 'Ishina lyonse',
      'auth.phone': 'Phone',
      'auth.province': 'Province',
      'auth.district': 'District',
      'auth.loginBtn': 'Ingila',
      'auth.signupBtn': 'Lembesha',
      'auth.noAccount': 'Tapali account?',
      'auth.hasAccount': 'Kuli account?',
      'dash.title': 'Ifya ine',
      'dash.add': 'Ongezapo',
      'dash.edit': 'Lungamya',
      'dash.addTitle': 'Ongezapo',
      'dash.noListings': 'Tapali. Ongezapo!',
      'dash.markSold': 'Langa ukuti yashitwa',
      'dash.markAvailable': 'Langa ukuti kuli',
      'dash.delete': 'Fyapo',
      'dash.save': 'Sunga',
      'dash.cancel': 'Lekesha',
      'dash.titleField': 'Ishina',
      'dash.categoryField': 'Category',
      'dash.descriptionField': 'Ukupwililika',
      'dash.priceField': 'Mutengo (ZMW)',
      'dash.unitField': 'Unit',
      'dash.quantityField': 'Uwingi',
      'dash.provinceField': 'Province',
      'dash.districtField': 'District',
      'dash.imageField': 'Image',
      'nav.home': 'Pakwesu',
      'nav.browse': 'Sakafye',
      'nav.dashboard': 'Dashboard',
      'nav.login': 'Ingila',
      'nav.signup': 'Lembesha',
      'nav.logout': 'Fuma',
      'a11y.skip': 'Pitilila ku content',
      'lang.label': 'Ulwimi',
      'tts.readPage': 'Umfweni',
      'tts.play': 'Tantika',
      'tts.pause': 'Imya',
      'tts.stop': 'Lekesha',
      'tts.speed': 'Speed',
      'common.loading': 'Nalindila...',
      'common.error': 'Pali icilubo. Yesa na kabili.',
      'common.save': 'Sunga',
      'common.cancel': 'Lekesha',
      'common.delete': 'Fyapo',
      'common.edit': 'Lungamya',
      'common.view': 'Ona',
      'common.read': 'Umfweni',
      'footer.text': '© ZedFarm Market — tulakonka abalimi na abashita mu Zambia.'
    },
    ny: {
      'site.title': 'ZedFarm Market',
      'home.heroTitle': 'Takulandirani ku ZedFarm Market',
      'home.heroSubtitle': 'Market yolumikiza alimi ndi ogula ku Zambia. Zipatso, nyama, uchi ndi zina.',
      'home.featured': 'Zatsopano pa msika',
      'browse.title': 'Sakani zinthu',
      'browse.search': 'Sakani',
      'browse.searchPlaceholder': 'Sakani zinthu...',
      'browse.allCategories': 'Magulu onse',
      'browse.allProvinces': 'Madera onse',
      'browse.district': 'District',
      'browse.sortNewest': 'Zatsopano poyamba',
      'browse.sortPriceAsc': 'Mtengo: wotsika kukwera',
      'browse.sortPriceDesc': 'Mtengo: wokwera kutsika',
      'browse.showSold': 'Onetsani zotsatsidwa',
      'browse.minPrice': 'Mtengo wotsika (ZMW)',
      'browse.maxPrice': 'Mtengo wokwera (ZMW)',
      'browse.noResults': 'Palibe zomwe zapezeka.',
      'browse.results': 'zapezeka',
      'listing.category': 'Gulu',
      'listing.price': 'Mtengo',
      'listing.quantity': 'Kuchuluka',
      'listing.location': 'Kumene kuli',
      'listing.farmer': 'Mlimi',
      'listing.phone': 'Phone',
      'listing.posted': 'Tsiku lotumizidwa',
      'listing.description': 'Kufotokoza',
      'listing.available': 'Kuli',
      'listing.sold': 'Zotsatsidwa',
      'listing.call': 'Fonani',
      'listing.whatsapp': 'WhatsApp',
      'auth.loginTitle': 'Lowani',
      'auth.signupTitle': 'Pangani akaunti',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.fullName': 'Dzina lonse',
      'auth.phone': 'Phone',
      'auth.province': 'Province',
      'auth.district': 'District',
      'auth.loginBtn': 'Lowani',
      'auth.signupBtn': 'Lembetsani',
      'auth.noAccount': 'Mulibe akaunti?',
      'auth.hasAccount': 'Muli ndi akaunti?',
      'dash.title': 'Zanga',
      'dash.add': 'Onjezani',
      'dash.edit': 'Sinthani',
      'dash.addTitle': 'Onjezani',
      'dash.noListings': 'Palibe. Onjezani!',
      'dash.markSold': 'Chonetsani kuti zotsatsidwa',
      'dash.markAvailable': 'Chonetsani kuti kuli',
      'dash.delete': 'Fufutani',
      'dash.save': 'Sungani',
      'dash.cancel': 'Lekani',
      'dash.titleField': 'Dzina',
      'dash.categoryField': 'Gulu',
      'dash.descriptionField': 'Kufotokoza',
      'dash.priceField': 'Mtengo (ZMW)',
      'dash.unitField': 'Unit',
      'dash.quantityField': 'Kuchuluka',
      'dash.provinceField': 'Province',
      'dash.districtField': 'District',
      'dash.imageField': 'Chithunzi',
      'nav.home': 'Kunyumba',
      'nav.browse': 'Sakani',
      'nav.dashboard': 'Dashboard',
      'nav.login': 'Lowani',
      'nav.signup': 'Lembetsani',
      'nav.logout': 'Tulukani',
      'a11y.skip': 'Pitani ku nkhani',
      'lang.label': 'Chilankhulo',
      'tts.readPage': 'Mvetserani',
      'tts.play': 'Yambani',
      'tts.pause': 'Imitsani',
      'tts.stop': 'Lekani',
      'tts.speed': 'Liwiro',
      'common.loading': 'Dikirani...',
      'common.error': 'Pali vuto. Yesaninso.',
      'common.save': 'Sungani',
      'common.cancel': 'Lekani',
      'common.delete': 'Fufutani',
      'common.edit': 'Sinthani',
      'common.view': 'Onani',
      'common.read': 'Mvetserani',
      'footer.text': '© ZedFarm Market — kulumikiza alimi ndi ogula ku Zambia.'
    }
  };

  let currentLang = 'en';
  try {
    const saved = localStorage.getItem('zedfarm_lang');
    if (saved && TRANSLATIONS[saved]) currentLang = saved;
  } catch (e) {}

  function t(key) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang;

    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.placeholder = t(key);
    });

    // Aria labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (key) el.setAttribute('aria-label', t(key));
    });

    // Update Language Dropdown if exists
    const sel = document.getElementById('lang-select');
    if (sel && sel.value !== currentLang) {
      sel.value = currentLang;
    }
  }

  function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    try {
      localStorage.setItem('zedfarm_lang', lang);
    } catch (e) {}
    applyTranslations();
  }

  // --- 3. SPEECH SYNTHESIS (SCREEN READER) ---
  let synth = window.speechSynthesis;
  let speaking = false;
  let paused = false;
  let playbackRate = 1;

  function speakText(text) {
    if (!window.speechSynthesis) {
      showToast('Voice speech not supported by your browser.', 'error');
      return;
    }
    window.speechSynthesis.cancel();
    if (!text || !text.trim()) return;

    const u = new SpeechSynthesisUtterance(text.trim());
    u.rate = playbackRate;
    u.lang = 'en-US';

    u.onstart = () => {
      speaking = true;
      paused = false;
      updateTtsBar();
    };
    u.onend = () => {
      speaking = false;
      paused = false;
      updateTtsBar();
    };
    u.onerror = () => {
      speaking = false;
      paused = false;
      updateTtsBar();
    };

    window.speechSynthesis.speak(u);
    updateTtsBar();
  }

  function pauseSpeech() {
    if (!window.speechSynthesis) return;
    if (speaking && !paused) {
      window.speechSynthesis.pause();
      paused = true;
    } else if (paused) {
      window.speechSynthesis.resume();
      paused = false;
    }
    updateTtsBar();
  }

  function stopSpeech() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    speaking = false;
    paused = false;
    updateTtsBar();
  }

  function updateTtsBar() {
    const bar = document.getElementById('tts-bar');
    if (!bar) return;
    const playBtn = bar.querySelector('[data-tts="play"]');
    const pauseBtn = bar.querySelector('[data-tts="pause"]');
    const status = bar.querySelector('[data-tts="status"]');

    if (playBtn) playBtn.disabled = speaking && !paused;
    if (pauseBtn) pauseBtn.textContent = paused ? '▶️ ' + t('tts.play') : '⏸️ ' + t('tts.pause');
    if (status) {
      status.textContent = speaking ? (paused ? 'Paused' : 'Reading aloud...') : 'Voice Reader';
    }
  }

  function initTtsBar() {
    if (document.getElementById('tts-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'tts-bar';
    bar.className = 'tts-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Screen reader voice controls');
    bar.innerHTML = `
      <span data-tts="status" style="font-size:0.85rem; font-weight:700; color:var(--color-primary); margin-right:4px;">Voice Reader</span>
      <button type="button" data-tts="play" class="btn btn--sm btn--primary">▶️ ${t('tts.play')}</button>
      <button type="button" data-tts="pause" class="btn btn--sm btn--ghost">⏸️ ${t('tts.pause')}</button>
      <button type="button" data-tts="stop" class="btn btn--sm btn--ghost">⏹️ ${t('tts.stop')}</button>
      <select id="tts-speed" data-tts="speed" style="min-height:36px; padding:4px 8px; border-radius:var(--radius-full); border:1px solid var(--color-border); background:var(--color-surface); color:var(--color-text); font-size:0.85rem; font-weight:600;">
        <option value="0.75">0.75x</option>
        <option value="1" selected>1.0x</option>
        <option value="1.25">1.25x</option>
        <option value="1.5">1.5x</option>
      </select>
    `;
    document.body.appendChild(bar);

    bar.querySelector('[data-tts="play"]').addEventListener('click', readFullPage);
    bar.querySelector('[data-tts="pause"]').addEventListener('click', pauseSpeech);
    bar.querySelector('[data-tts="stop"]').addEventListener('click', stopSpeech);
    bar.querySelector('[data-tts="speed"]').addEventListener('change', (e) => {
      playbackRate = Number(e.target.value) || 1;
    });
  }

  function readFullPage() {
    const main = document.querySelector('main') || document.body;
    const text = main.innerText.replace(/\s+/g, ' ').trim();
    speakText(text);
  }

  // --- 4. UTILITIES ---
  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatPrice(n) {
    const num = Number(n);
    if (isNaN(num)) return n;
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return iso;
    }
  }

  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = 'toast' + (type === 'error' ? ' toast--error' : type === 'success' ? ' toast--success' : '');
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  // --- 5. AUTHENTICATION & NAVBAR STATE ---
  async function updateNavbarAuth() {
    const loginEl = document.getElementById('nav-login');
    const signupEl = document.getElementById('nav-signup');
    const logoutEl = document.getElementById('nav-logout');

    const sb = getSupabase();
    let user = null;
    if (sb) {
      try {
        const { data } = await sb.auth.getUser();
        user = data?.user || null;
      } catch (e) {
        user = null;
      }
    }

    if (user) {
      if (loginEl) loginEl.style.display = 'none';
      if (signupEl) signupEl.style.display = 'none';
      if (logoutEl) {
        logoutEl.hidden = false;
        logoutEl.style.display = 'inline-flex';
        logoutEl.onclick = async () => {
          if (sb) await sb.auth.signOut();
          location.href = 'index.html';
        };
      }
    } else {
      if (loginEl) loginEl.style.display = 'inline-flex';
      if (signupEl) signupEl.style.display = 'inline-flex';
      if (logoutEl) {
        logoutEl.hidden = true;
        logoutEl.style.display = 'none';
      }
    }
  }

  // --- 6. DATABASE QUERIES (LISTINGS) ---
  async function fetchListings(filters = {}) {
    const sb = getSupabase();
    if (!sb) {
      // Fallback direct REST fetch (works everywhere)
      let url = `${SUPABASE_URL}/rest/v1/listings?select=*&order=created_at.desc`;
      if (!filters.includeSold) url += '&is_sold=eq.false';
      if (filters.category) url += `&category=eq.${encodeURIComponent(filters.category)}`;
      if (filters.province) url += `&province=eq.${encodeURIComponent(filters.province)}`;
      if (filters.district) url += `&district=ilike.*${encodeURIComponent(filters.district)}*`;
      if (filters.minPrice) url += `&price=gte.${Number(filters.minPrice)}`;
      if (filters.maxPrice) url += `&price=lte.${Number(filters.maxPrice)}`;

      try {
        const res = await fetch(url, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        const data = await res.json();
        return { data: Array.isArray(data) ? data : [], error: null };
      } catch (err) {
        return { data: [], error: err };
      }
    }

    let q = sb.from('listings').select('*');
    if (!filters.includeSold) q = q.eq('is_sold', false);
    if (filters.category) q = q.eq('category', filters.category);
    if (filters.province) q = q.eq('province', filters.province);
    if (filters.district) q = q.ilike('district', `%${filters.district}%`);
    if (filters.minPrice) q = q.gte('price', Number(filters.minPrice));
    if (filters.maxPrice) q = q.lte('price', Number(filters.maxPrice));
    if (filters.search) q = q.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);

    if (filters.sort === 'price_asc') q = q.order('price', { ascending: true });
    else if (filters.sort === 'price_desc') q = q.order('price', { ascending: false });
    else q = q.order('created_at', { ascending: false });

    const { data, error } = await q;
    return { data: data || [], error };
  }

  async function fetchSingleListing(id) {
    const sb = getSupabase();
    let l = null;
    let error = null;

    if (!sb) {
      try {
        const url = `${SUPABASE_URL}/rest/v1/listings?id=eq.${id}&select=*`;
        const res = await fetch(url, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        const arr = await res.json();
        l = arr && arr[0] ? arr[0] : null;
      } catch (e) {
        error = e;
      }
    } else {
      const res = await sb.from('listings').select('*').eq('id', id).maybeSingle();
      l = res.data;
      error = res.error;
    }

    if (l) {
      if (l.user_id) {
        try {
          if (sb) {
            const { data: prof } = await sb.from('profiles').select('*').eq('id', l.user_id).maybeSingle();
            if (prof) l.profiles = prof;
          } else {
            const pRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${l.user_id}&select=*`, {
              headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`
              }
            });
            const pArr = await pRes.json();
            if (pArr && pArr[0]) l.profiles = pArr[0];
          }
        } catch (e) {}
      }
      if (!l.profiles) {
        l.profiles = {
          full_name: 'Verified Zambian Producer',
          phone: '+260 97 1234567'
        };
      }
    }

    return { data: l, error };
  }

  function makeProduceCard(l) {
    const el = document.createElement('article');
    el.className = 'card listing-card';
    const img = l.image_url || 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop';

    el.innerHTML = `
      <div class="listing-image-wrapper">
        <img src="${img}" alt="${escapeHtml(l.title)}" loading="lazy" />
        <span class="listing-category-badge">${escapeHtml(l.category)}</span>
        ${l.is_sold ? '<span class="listing-sold-badge">' + t('listing.sold') + '</span>' : ''}
      </div>
      <div class="body">
        <h3 class="title">${escapeHtml(l.title)}</h3>
        <div class="price">
          ZMW ${formatPrice(l.price)} <span class="price-unit">/ ${escapeHtml(l.unit)}</span>
        </div>
        <div class="meta">
          <span>📍 ${escapeHtml(l.district)}, ${escapeHtml(l.province)} Province</span>
        </div>
        <div class="actions">
          <a class="btn btn--sm btn--primary" href="listing.html?id=${l.id}">${t('common.view')} Details</a>
          <button type="button" class="btn btn--sm btn--ghost" data-read-text="${escapeHtml(l.title)}. ${escapeHtml(l.description || '')}. Price is ${l.price} Zambian Kwacha per ${escapeHtml(l.unit)}. Located in ${escapeHtml(l.district)}, ${escapeHtml(l.province)} province.">
            🔊 ${t('common.read')}
          </button>
        </div>
      </div>`;
    return el;
  }

  // --- 7. PAGE-SPECIFIC CONTROLLERS ---

  // Index (Home) Page
  async function initIndexPage() {
    const featuredBox = document.getElementById('featured');
    if (!featuredBox) return;

    featuredBox.innerHTML = '<div class="loading"><div class="spinner"></div><p>' + t('common.loading') + '</p></div>';
    const { data, error } = await fetchListings({ sort: 'newest' });

    if (error) {
      featuredBox.innerHTML = `
        <div class="empty-state">
          <div class="icon">⚠️</div>
          <p>${escapeHtml(error.message || 'Error loading listings')}</p>
        </div>`;
      return;
    }

    if (!data.length) {
      featuredBox.innerHTML = `
        <div class="empty-state">
          <div class="icon">🌱</div>
          <p>${t('browse.noResults')}</p>
        </div>`;
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'grid grid--3';
    data.slice(0, 6).forEach(l => grid.appendChild(makeProduceCard(l)));
    featuredBox.innerHTML = '';
    featuredBox.appendChild(grid);
  }

  // Browse Page
  async function initBrowsePage() {
    const resultsBox = document.getElementById('results');
    if (!resultsBox) return;

    const countEl = document.getElementById('results-count');
    const searchInput = document.getElementById('q');
    const catSel = document.getElementById('filter-category');
    const provSel = document.getElementById('filter-province');
    const distInput = document.getElementById('filter-district');
    const sortSel = document.getElementById('filter-sort');
    const minInput = document.getElementById('filter-min');
    const maxInput = document.getElementById('filter-max');
    const soldCheckbox = document.getElementById('filter-sold');

    // Parse URL params
    const params = new URLSearchParams(location.search);
    if (params.get('q') && searchInput) searchInput.value = params.get('q');
    if (params.get('category') && catSel) catSel.value = params.get('category');
    if (params.get('province') && provSel) provSel.value = params.get('province');

    async function loadFiltered() {
      resultsBox.innerHTML = '<div class="loading"><div class="spinner"></div><p>' + t('common.loading') + '</p></div>';
      const filters = {
        search: searchInput ? searchInput.value.trim() : '',
        category: catSel ? catSel.value : '',
        province: provSel ? provSel.value : '',
        district: distInput ? distInput.value.trim() : '',
        minPrice: minInput ? minInput.value : '',
        maxPrice: maxInput ? maxInput.value : '',
        sort: sortSel ? sortSel.value : 'newest',
        includeSold: soldCheckbox ? soldCheckbox.checked : false,
      };

      const { data, error } = await fetchListings(filters);
      if (error) {
        resultsBox.innerHTML = `
          <div class="empty-state">
            <div class="icon">⚠️</div>
            <p>${escapeHtml(error.message)}</p>
          </div>`;
        return;
      }

      if (countEl) countEl.textContent = `${data.length} ${t('browse.results')}`;

      if (!data.length) {
        resultsBox.innerHTML = `
          <div class="empty-state">
            <div class="icon">🌱</div>
            <p>${t('browse.noResults')}</p>
          </div>`;
        return;
      }

      const grid = document.createElement('div');
      grid.className = 'grid grid--3';
      data.forEach(l => grid.appendChild(makeProduceCard(l)));
      resultsBox.innerHTML = '';
      resultsBox.appendChild(grid);
    }

    const searchForm = document.getElementById('search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loadFiltered();
      });
    }

    [catSel, provSel, sortSel, minInput, maxInput, soldCheckbox].forEach(el => {
      if (el) el.addEventListener('change', loadFiltered);
    });
    if (distInput) {
      let dt;
      distInput.addEventListener('input', () => {
        clearTimeout(dt);
        dt = setTimeout(loadFiltered, 300);
      });
    }

    loadFiltered();
  }

  // Listing Detail Page
  async function initListingPage() {
    const detailBox = document.getElementById('detail');
    if (!detailBox) return;

    const id = new URLSearchParams(location.search).get('id');
    if (!id) {
      detailBox.innerHTML = `
        <div class="empty-state">
          <div class="icon">🔍</div>
          <p>No listing selected.</p>
          <a href="browse.html" class="btn btn--primary">Browse Market</a>
        </div>`;
      return;
    }

    detailBox.innerHTML = '<div class="loading"><div class="spinner"></div><p>' + t('common.loading') + '</p></div>';
    const { data: l, error } = await fetchSingleListing(id);

    if (error || !l) {
      detailBox.innerHTML = `
        <div class="empty-state">
          <div class="icon">⚠️</div>
          <p>${escapeHtml(error?.message || 'Produce listing not found.')}</p>
          <a href="browse.html" class="btn btn--primary">Back to Browse</a>
        </div>`;
      return;
    }

    const profile = l.profiles || {};
    const img = l.image_url || 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop';
    const phone = profile.phone || '';
    const waNumber = phone.replace(/\D/g, '');

    detailBox.innerHTML = `
      <div class="detail-grid">
        <div>
          <div class="detail-image-card">
            <img class="detail-image" src="${img}" alt="${escapeHtml(l.title)}" />
          </div>
          <div class="card" style="margin-top:20px; background:#f8fafc;">
            <h4 style="margin:0 0 8px; font-size:1rem; color:var(--color-primary);">🛡️ Buyer Safety Tips</h4>
            <ul style="margin:0; padding-left:20px; font-size:0.88rem; color:var(--color-muted); line-height:1.6;">
              <li>Inspect agricultural produce in person before transferring money.</li>
              <li>Agree on transport, weighing standards, and delivery terms.</li>
              <li>Meet in secure agricultural depots or farm collection points.</li>
            </ul>
          </div>
        </div>

        <div class="detail-info-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
            <div>
              <span class="badge" style="margin-bottom:8px; text-transform:capitalize;">${escapeHtml(l.category)}</span>
              <h1 class="detail-title">${escapeHtml(l.title)}</h1>
            </div>
            <div>
              ${l.is_sold ? '<span class="badge badge--sold">' + t('listing.sold') + '</span>' : '<span class="badge">' + t('listing.available') + '</span>'}
            </div>
          </div>

          <div class="detail-price-box">
            <div class="detail-price">ZMW ${formatPrice(l.price)}</div>
            <div style="color:var(--color-muted); font-size:1.05rem; font-weight:600;">/ ${escapeHtml(l.unit)}</div>
          </div>

          <table class="detail-props-table">
            <tr>
              <td><strong data-i18n="listing.quantity">Quantity:</strong></td>
              <td>${escapeHtml(l.quantity)} ${escapeHtml(l.unit)}</td>
            </tr>
            <tr>
              <td><strong data-i18n="listing.location">Location:</strong></td>
              <td>📍 ${escapeHtml(l.district)}, ${escapeHtml(l.province)} Province</td>
            </tr>
            <tr>
              <td><strong data-i18n="listing.posted">Posted:</strong></td>
              <td>🗓️ ${formatDate(l.created_at)}</td>
            </tr>
          </table>

          <div class="farmer-contact-card">
            <h4>👨‍🌾 Farmer Information</h4>
            <p style="margin:0 0 6px; font-size:1.05rem; font-weight:700; color:var(--color-text);">
              ${escapeHtml(profile.full_name || 'Verified Zambian Producer')}
            </p>
            <p style="margin:0 0 14px; font-size:0.92rem; color:var(--color-muted);">
              ${phone ? `📞 ${escapeHtml(phone)}` : 'Inquire online'}
            </p>

            <div class="actions">
              ${phone ? `<a class="btn btn--primary" href="tel:${phone}">📞 ${t('listing.call')}</a>` : ''}
              ${phone ? `<a class="btn btn--whatsapp" href="https://wa.me/${waNumber}?text=Hello%20${encodeURIComponent(profile.full_name || 'Farmer')},%20I%20am%20interested%20in%20your%20${encodeURIComponent(l.title)}%20advertised%20on%20ZedFarm%20Market." target="_blank" rel="noopener">💬 ${t('listing.whatsapp')}</a>` : ''}
              <button type="button" class="btn btn--ghost" data-read-text="${escapeHtml(l.title)}. ${escapeHtml(l.description || '')}. Price is ${l.price} Zambian Kwacha per ${escapeHtml(l.unit)}. Quantity available is ${l.quantity}. Location is ${escapeHtml(l.district)}, ${escapeHtml(l.province)} province. Farmer is ${escapeHtml(profile.full_name || 'local grower')}.">
                🔊 ${t('common.read')}
              </button>
            </div>
          </div>

          <div style="margin-top:16px;">
            <h3 style="margin:0 0 10px; font-size:1.2rem; color:var(--color-primary);" data-i18n="listing.description">Description</h3>
            <p style="margin:0; line-height:1.7; color:var(--color-text); font-size:1rem; white-space:pre-line;">
              ${escapeHtml(l.description || 'No description provided.')}
            </p>
          </div>
        </div>
      </div>`;
  }

  // Dashboard Page
  async function initDashboardPage() {
    const gate = document.getElementById('auth-gate');
    const content = document.getElementById('dashboard-content');
    const addBtnWrapper = document.getElementById('add-btn-wrapper');
    const listEl = document.getElementById('my-listings');
    const modal = document.getElementById('modal');
    const form = document.getElementById('listing-form');
    if (!gate || !content) return;

    const sb = getSupabase();
    let user = null;
    if (sb) {
      try {
        const { data } = await sb.auth.getUser();
        user = data?.user || null;
      } catch (e) {}
    }

    if (!user) {
      gate.innerHTML = `
        <div class="empty-state">
          <div class="icon">👨‍🌾</div>
          <h2 style="margin:0 0 8px; color:var(--color-primary);">Farmer Account Required</h2>
          <p>Please log in or create a free farmer account to advertise and manage your produce listings.</p>
          <div style="display:flex; justify-content:center; gap:12px; margin-top:16px;">
            <a href="login.html" class="btn btn--primary">Log in</a>
            <a href="signup.html" class="btn btn--secondary">Create Farmer Account</a>
          </div>
        </div>`;
      content.hidden = true;
      if (addBtnWrapper) addBtnWrapper.hidden = true;
      return;
    }

    gate.innerHTML = '';
    content.hidden = false;
    if (addBtnWrapper) addBtnWrapper.hidden = false;

    async function loadFarmerListings() {
      listEl.innerHTML = '<div class="loading"><div class="spinner"></div><p>' + t('common.loading') + '</p></div>';
      const { data, error } = await sb
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        listEl.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>${escapeHtml(error.message)}</p></div>`;
        return;
      }

      const total = data.length;
      const soldCount = data.filter(x => x.is_sold).length;
      const activeCount = total - soldCount;
      const statTotal = document.getElementById('stat-total');
      const statActive = document.getElementById('stat-active');
      const statSold = document.getElementById('stat-sold');
      if (statTotal) statTotal.textContent = total;
      if (statActive) statActive.textContent = activeCount;
      if (statSold) statSold.textContent = soldCount;

      if (!data.length) {
        listEl.innerHTML = `
          <div class="empty-state">
            <div class="icon">🌱</div>
            <h3 style="margin:0 0 6px;">No listings posted yet</h3>
            <p>${t('dash.noListings')}</p>
            <button class="btn btn--primary" id="empty-add-btn">➕ ${t('dash.add')}</button>
          </div>`;
        const eBtn = document.getElementById('empty-add-btn');
        if (eBtn) eBtn.addEventListener('click', () => openModal(null, []));
        return;
      }

      listEl.innerHTML = '';
      data.forEach(l => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.marginBottom = '14px';
        const soldLabel = l.is_sold ? t('dash.markAvailable') : t('dash.markSold');
        const img = l.image_url || 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&auto=format&fit=crop';

        card.innerHTML = `
          <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center;">
            <img src="${img}" alt="${escapeHtml(l.title)}" style="width:130px; height:95px; object-fit:cover; border-radius:var(--radius-sm); border:1px solid var(--color-border);" loading="lazy" />
            <div style="flex:1; min-width:240px;">
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <h3 style="margin:0; font-size:1.15rem; font-weight:700;">${escapeHtml(l.title)}</h3>
                ${l.is_sold ? '<span class="badge badge--sold">' + t('listing.sold') + '</span>' : '<span class="badge">' + t('listing.available') + '</span>'}
              </div>
              <div style="font-weight:800; color:var(--color-primary); font-size:1.1rem; margin-top:2px;">
                ZMW ${formatPrice(l.price)} <span style="font-size:0.85rem; font-weight:500; color:var(--color-muted);">/ ${escapeHtml(l.unit)}</span>
              </div>
              <div style="font-size:0.88rem; color:var(--color-muted); margin-top:2px;">
                📍 ${escapeHtml(l.district)}, ${escapeHtml(l.province)} Province · 🗓️ ${formatDate(l.created_at)}
              </div>
            </div>
            <div class="actions" style="margin-left:auto;">
              <a class="btn btn--sm btn--ghost" href="listing.html?id=${l.id}" target="_blank">👁️ ${t('common.view')}</a>
              <button type="button" class="btn btn--sm btn--ghost" data-edit="${l.id}">✏️ ${t('common.edit')}</button>
              <button type="button" class="btn btn--sm ${l.is_sold ? 'btn--secondary' : 'btn--primary'}" data-sold="${l.id}" data-val="${l.is_sold ? 'false' : 'true'}">${soldLabel}</button>
              <button type="button" class="btn btn--sm btn--danger" data-del="${l.id}">🗑️ ${t('common.delete')}</button>
            </div>
          </div>`;
        listEl.appendChild(card);
      });

      // Actions
      listEl.querySelectorAll('[data-edit]').forEach(b => {
        b.addEventListener('click', () => openModal(b.getAttribute('data-edit'), data));
      });
      listEl.querySelectorAll('[data-sold]').forEach(b => {
        b.addEventListener('click', async () => {
          const id = b.getAttribute('data-sold');
          const val = b.getAttribute('data-val') === 'true';
          b.disabled = true;
          const { error } = await sb.from('listings').update({ is_sold: val }).eq('id', id);
          if (error) showToast(error.message, 'error');
          else {
            showToast('Status updated', 'success');
            loadFarmerListings();
          }
        });
      });
      listEl.querySelectorAll('[data-del]').forEach(b => {
        b.addEventListener('click', async () => {
          if (!confirm('Are you sure you want to delete this listing?')) return;
          const id = b.getAttribute('data-del');
          b.disabled = true;
          const { error } = await sb.from('listings').delete().eq('id', id);
          if (error) showToast(error.message, 'error');
          else {
            showToast('Listing deleted', 'success');
            loadFarmerListings();
          }
        });
      });
    }

    function openModal(id, data) {
      const modalTitle = document.getElementById('modal-title');
      const listingId = document.getElementById('listing-id');
      const errBox = document.getElementById('modal-error');
      if (modalTitle) modalTitle.textContent = id ? t('dash.edit') : t('dash.addTitle');
      if (listingId) listingId.value = id || '';
      if (errBox) errBox.style.display = 'none';

      if (id) {
        const item = data.find(x => x.id === id);
        if (item) {
          document.getElementById('title').value = item.title || '';
          document.getElementById('category').value = item.category || 'maize';
          document.getElementById('description').value = item.description || '';
          document.getElementById('price').value = item.price || '';
          document.getElementById('unit').value = item.unit || 'kg';
          document.getElementById('quantity').value = item.quantity || '';
          document.getElementById('province').value = item.province || 'Lusaka';
          document.getElementById('district').value = item.district || '';
        }
      } else if (form) {
        form.reset();
      }
      modal.style.display = 'flex';
      document.getElementById('title').focus();
    }

    function closeModal() {
      if (modal) modal.style.display = 'none';
    }

    const addBtn = document.getElementById('add-btn');
    if (addBtn) addBtn.addEventListener('click', () => openModal(null, []));
    const cancelBtn = document.getElementById('modal-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    const closeX = document.getElementById('modal-close-x');
    if (closeX) closeX.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errBox = document.getElementById('modal-error');
        errBox.style.display = 'none';

        const id = document.getElementById('listing-id').value;
        const title = document.getElementById('title').value.trim();
        const price = Number(document.getElementById('price').value);
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value.trim();
        const unit = document.getElementById('unit').value;
        const quantity = Number(document.getElementById('quantity').value) || 0;
        const province = document.getElementById('province').value;
        const district = document.getElementById('district').value.trim();

        if (!title || isNaN(price) || price <= 0) {
          errBox.textContent = 'Please provide a valid title and price in ZMW.';
          errBox.style.display = 'block';
          return;
        }

        const saveBtn = document.getElementById('modal-save-btn');
        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.textContent = 'Saving...';
        }

        // Image upload handling
        let imageUrl = null;
        const fileInput = document.getElementById('image');
        if (fileInput && fileInput.files && fileInput.files[0]) {
          const file = fileInput.files[0];
          const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
          const path = `${user.id}/${Date.now()}.${ext}`;
          const upRes = await sb.storage.from('product-images').upload(path, file);
          if (!upRes.error) {
            const { data: pubData } = sb.storage.from('product-images').getPublicUrl(path);
            imageUrl = pubData.publicUrl;
          }
        }

        const payload = {
          user_id: user.id,
          title,
          category,
          description,
          price,
          unit,
          quantity,
          province,
          district
        };
        if (imageUrl) payload.image_url = imageUrl;

        let res;
        if (id) {
          res = await sb.from('listings').update(payload).eq('id', id);
        } else {
          res = await sb.from('listings').insert(payload);
        }

        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = t('common.save');
        }

        if (res.error) {
          errBox.textContent = res.error.message;
          errBox.style.display = 'block';
          return;
        }

        showToast('Produce listing saved successfully!', 'success');
        closeModal();
        loadFarmerListings();
      });
    }

    loadFarmerListings();
  }

  // Login Page
  function initLoginPage() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const errBox = document.getElementById('form-error');
      errBox.style.display = 'none';

      if (!email || !password) {
        errBox.textContent = 'Please fill in both email and password.';
        errBox.style.display = 'block';
        return;
      }

      const sb = getSupabase();
      if (!sb) {
        errBox.textContent = 'Supabase client not loaded.';
        errBox.style.display = 'block';
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Logging in...';

      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      btn.disabled = false;
      btn.textContent = 'Log in';

      if (error) {
        errBox.textContent = error.message;
        errBox.style.display = 'block';
        return;
      }

      showToast('Logged in successfully!', 'success');
      location.href = 'dashboard.html';
    });
  }

  // Signup Page
  function initSignupPage() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errBox = document.getElementById('form-error');
      errBox.style.display = 'none';

      const full_name = document.getElementById('full_name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const phone = document.getElementById('phone').value.trim();
      const province = document.getElementById('province').value;
      const district = document.getElementById('district').value.trim();

      if (!full_name || !email || !password || !province || !district) {
        errBox.textContent = 'Please fill in all required fields.';
        errBox.style.display = 'block';
        return;
      }

      if (password.length < 6) {
        errBox.textContent = 'Password must be at least 6 characters.';
        errBox.style.display = 'block';
        return;
      }

      const sb = getSupabase();
      if (!sb) {
        errBox.textContent = 'Supabase client not loaded.';
        errBox.style.display = 'block';
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Creating account...';

      const { data, error } = await sb.auth.signUp({ email, password });
      btn.disabled = false;
      btn.textContent = 'Create Free Account';

      if (error) {
        errBox.textContent = error.message;
        errBox.style.display = 'block';
        return;
      }

      if (data?.user) {
        await sb.from('profiles').insert({
          id: data.user.id,
          full_name,
          phone,
          province,
          district
        });
      }

      showToast('Account created! Welcome to ZedFarm.', 'success');
      location.href = 'dashboard.html';
    });
  }

  // --- 8. GLOBAL INITIALIZATION ON DOM READY ---
  function initApp() {
    applyTranslations();
    initTtsBar();
    updateNavbarAuth();

    // Wire Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    if (navToggle && mainNav) {
      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mainNav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      // Close menu when clicking outside or clicking a nav link
      document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
          mainNav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
      mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mainNav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Wire Language Switcher
    const langSel = document.getElementById('lang-select');
    if (langSel) {
      langSel.value = currentLang;
      langSel.addEventListener('change', (e) => setLanguage(e.target.value));
    }

    // Wire "Listen" button in header
    const readPageBtn = document.getElementById('readPageBtn');
    if (readPageBtn) {
      readPageBtn.addEventListener('click', readFullPage);
    }

    // Wire individual [data-read-text] buttons across cards
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-read-text]');
      if (target) {
        const text = target.getAttribute('data-read-text');
        if (text) speakText(text);
      }
    });

    // Detect Page and run specific controller
    const path = location.pathname.toLowerCase();
    if (path.endsWith('browse.html') || document.getElementById('results')) {
      initBrowsePage();
    } else if (path.endsWith('listing.html') || document.getElementById('detail')) {
      initListingPage();
    } else if (path.endsWith('dashboard.html') || document.getElementById('auth-gate')) {
      initDashboardPage();
    } else if (path.endsWith('login.html') || document.getElementById('login-form')) {
      initLoginPage();
    } else if (path.endsWith('signup.html') || document.getElementById('signup-form')) {
      initSignupPage();
    } else {
      initIndexPage();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  // Expose minimal API to window
  window.ZedFarm = {
    t,
    setLanguage,
    speakText,
    readFullPage
  };

})();
