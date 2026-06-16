(function () {
  const NAV_ITEMS = [
    ['tours.html', 'TOURS'],
    ['beach-clubs.html', 'BEACH CLUBS'],
    ['boats.html', 'BOATS'],
    ['why-us.html', 'WHY US'],
    ['travel-tips.html', 'TRAVEL TIPS'],
    ['contact.html', 'CONTACT']
  ];
  const LANGS = [
    ['en', 'EN', 'English'],
    ['es', 'ES', 'Espanol'],
    ['pt', 'PT', 'Portugues']
  ];
  const CURRENCIES = [
    ['USD', '$', 'US Dollar'],
    ['COP', '$', 'Colombian Peso'],
    ['EUR', 'EUR', 'Euro'],
    ['GBP', 'GBP', 'Pound']
  ];

  function injectStyles() {
    if (document.getElementById('pct-mobile-enhancement-styles')) return;
    const style = document.createElement('style');
    style.id = 'pct-mobile-enhancement-styles';
    style.textContent = `
      .pct-mobile-menu-button { display:none; align-items:center; justify-content:center; width:42px; height:42px; border:1px solid rgba(255,255,255,.22); border-radius:999px; color:#fff; background:rgba(255,255,255,.08); flex:0 0 auto; }
      .pct-mobile-menu-button span { font-size:24px; line-height:1; }
      .pct-mobile-backdrop { position:fixed; inset:0; z-index:220; background:rgba(1,42,68,.54); opacity:0; pointer-events:none; transition:opacity .2s ease; }
      .pct-mobile-drawer { position:fixed; top:0; right:0; z-index:221; width:min(88vw,360px); height:100dvh; background:#012A44; color:#fff; transform:translateX(100%); transition:transform .24s ease; box-shadow:-18px 0 40px rgba(0,0,0,.22); display:flex; flex-direction:column; padding:18px; }
      .pct-mobile-nav-open .pct-mobile-backdrop { opacity:1; pointer-events:auto; }
      .pct-mobile-nav-open .pct-mobile-drawer { transform:translateX(0); }
      .pct-mobile-drawer-head { display:flex; align-items:center; justify-content:space-between; padding-bottom:16px; border-bottom:1px solid rgba(255,255,255,.12); }
      .pct-mobile-close { width:40px; height:40px; display:flex; align-items:center; justify-content:center; border-radius:999px; background:rgba(255,255,255,.1); color:#fff; }
      .pct-mobile-links { display:grid; gap:4px; padding:18px 0; }
      .pct-mobile-links a { display:flex; align-items:center; min-height:48px; padding:0 6px; color:rgba(255,255,255,.82); font-size:13px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; border-bottom:1px solid rgba(255,255,255,.08); }
      .pct-mobile-links a[aria-current="page"] { color:#FF7A00; }
      .pct-mobile-controls { display:grid; gap:18px; margin-top:auto; padding-top:18px; border-top:1px solid rgba(255,255,255,.12); }
      .pct-mobile-control-label { color:rgba(255,255,255,.58); font-size:11px; font-weight:900; letter-spacing:.14em; text-transform:uppercase; margin-bottom:8px; }
      .pct-mobile-control-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; }
      .pct-mobile-control-grid.currency { grid-template-columns:repeat(2,minmax(0,1fr)); }
      .pct-mobile-choice { min-height:42px; border-radius:12px; background:rgba(255,255,255,.08); color:#fff; font-size:12px; font-weight:800; border:1px solid rgba(255,255,255,.14); }
      .pct-mobile-choice.is-selected { background:#FF7A00; border-color:#FF7A00; }
      .pct-mobile-caption { display:block; color:rgba(255,255,255,.58); font-size:10px; font-weight:600; margin-top:2px; }
      .pct-scroll-table { overflow-x:auto !important; -webkit-overflow-scrolling:touch; }
      .pct-header-controls { display:flex; align-items:center; gap:8px; }
      .pct-header-controls .lux-chip { display:flex; align-items:center; gap:6px; background:rgba(255,255,255,0.08); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.15); border-radius:999px; padding:5px 10px; cursor:pointer; transition:background .2s,border-color .2s,transform .15s; font-size:.72rem; font-weight:500; color:#fff; white-space:nowrap; user-select:none; }
      .pct-header-controls .lux-chip:hover { background:rgba(255,255,255,0.15); border-color:rgba(255,255,255,0.25); transform:translateY(-1px); }
      .pct-header-controls .lux-chip-wrap { position:relative; }
      .pct-header-controls .lux-dropdown { position:absolute; top:calc(100% + 8px); left:50%; transform:translateX(-50%) translateY(-6px); background:#fff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,.15); padding:6px; min-width:140px; z-index:9999; opacity:0; pointer-events:none; transition:opacity .18s ease,transform .18s ease; }
      .pct-header-controls .lux-dropdown.open { opacity:1; pointer-events:auto; transform:translateX(-50%) translateY(0); }
      .pct-header-controls .lux-dropdown-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:8px; font-size:14px; font-weight:400; color:#1a1a1a; cursor:pointer; transition:background .12s; }
      .pct-header-controls .lux-dropdown-item:hover { background:rgba(0,0,0,.05); }
      .pct-header-controls .lux-dropdown-item.selected { font-weight:700; background:rgba(0,119,182,.07); color:#0077B6; }
      .pct-header-controls .item-code { font-weight:700; font-size:13px; }
      .pct-header-controls .item-name { color:#666; font-size:12px; }
      @media (min-width: 768px) {
        header > a:first-child { width:180px; display:flex; align-items:center; }
        header > nav { flex:1; justify-content:center; }
        header > nav + div { width:180px; justify-content:flex-end; }
      }
      @media (max-width: 767px) {
        .pct-mobile-menu-button { display:flex; }
        header nav.hidden.md\\:flex { display:none !important; }
        header { min-height:74px; gap:8px; }
        header > a:first-child { min-width:0; flex:1 1 auto; }
        header > a:first-child img { max-width:min(188px,43vw); }
        header > .flex.items-center.gap-2,
        header > .pct-header-controls { display:flex !important; align-items:center; gap:6px; margin-left:auto; flex:0 0 auto; }
        header .lux-chip-wrap { display:flex !important; position:relative; }
        header .lux-chip { min-height:38px; padding:0 9px !important; gap:4px !important; font-size:11px !important; font-weight:800 !important; }
        header .lux-chip > span:first-child:not(#langLabel):not(#currLabel) { font-size:12px !important; }
        header .lux-dropdown { top:calc(100% + 8px); left:auto !important; right:0; transform:translateY(-6px) !important; min-width:132px; }
        header .lux-dropdown.open { transform:translateY(0) !important; }
        body { padding-bottom:76px; }
        #modalOverlay .grid.grid-cols-2, #bookingModal .grid.grid-cols-2 { grid-template-columns:1fr !important; }
        #modalOverlay [id*="Total"], #bookingModal [id*="Total"] { word-break:normal; }
        a.fixed.bottom-8.right-8, a.fixed.bottom-6.right-6, a.fixed[onclick*="openWA"], #floatingWA, .ai-chat-launcher {
          width:54px !important; height:54px !important; right:16px !important; bottom:16px !important;
        }
        body.pct-has-sticky-bar a.fixed[onclick*="openWA"], body.pct-has-sticky-bar #floatingWA, body.pct-has-sticky-bar .ai-chat-launcher { bottom:92px !important; }
        a.fixed.bottom-8.right-8 .absolute, a.fixed.bottom-6.right-6 .absolute, a.fixed[onclick*="openWA"] .absolute, #floatingWA .absolute, .ai-chat-launcher .absolute { display:none !important; }
        table { min-width:560px; }
        .pct-mobile-card-height { height:360px !important; }
        .pct-mobile-media-height { height:300px !important; }
        .pct-mobile-gallery-height { height:320px !important; }
        .pct-mobile-hero-height { min-height:74vh !important; }
        .pc-card .grid.grid-cols-2.gap-3 { grid-template-columns:1fr !important; }
      }
      @media (max-width: 420px) {
        .pct-mobile-drawer { width:92vw; }
        header { padding-left:16px !important; padding-right:16px !important; gap:6px; }
        header > a:first-child img { max-width:min(160px,39vw); }
        header > .flex.items-center.gap-2,
        header > .pct-header-controls { gap:5px; }
        header .lux-chip { min-height:36px; padding:0 8px !important; font-size:10px !important; }
        .pct-mobile-menu-button { width:40px; height:40px; }
        .pct-mobile-card-height { height:320px !important; }
        .pct-mobile-media-height { height:260px !important; }
        .pct-mobile-gallery-height { height:280px !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function closeHeaderDropdowns() {
    document.querySelectorAll('.pct-header-controls .lux-dropdown.open').forEach(drop => {
      drop.classList.remove('open');
      const btn = drop.parentElement && drop.parentElement.querySelector('.lux-chip');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  function updateHeaderSelection(kind, value) {
    const scope = kind === 'lang' ? '#langDrop' : '#currDrop';
    document.querySelectorAll(scope + ' .lux-dropdown-item').forEach(item => {
      item.classList.toggle('selected', item.dataset.val === value);
    });
  }

  function chooseHeaderLang(value) {
    const label = document.getElementById('langLabel');
    if (label) label.textContent = value.toUpperCase();
    updateHeaderSelection('lang', value);
    if (typeof window.setLang === 'function') window.setLang(value);
    closeHeaderDropdowns();
  }

  function chooseHeaderCurrency(value) {
    const label = document.getElementById('currLabel');
    const symbol = document.getElementById('currSymbol');
    if (label) label.textContent = value;
    if (symbol) symbol.textContent = (CURRENCIES.find(c => c[0] === value) || [value, '$'])[1];
    updateHeaderSelection('curr', value);

    const select = document.getElementById('currencySelect');
    if (select) {
      select.value = value;
      select.dispatchEvent(new Event('change'));
    } else if (typeof window.setCurrency === 'function') {
      window.setCurrency(value);
    }
    closeHeaderDropdowns();
  }

  function makeHeaderDropdown(kind, rows, currentValue) {
    const wrap = document.createElement('div');
    wrap.className = 'hidden sm:flex lux-chip-wrap';
    wrap.id = kind === 'lang' ? 'langWrap' : 'currWrap';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lux-chip';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = kind === 'lang'
      ? `<span style="font-size:1rem;line-height:1;">🌐</span><span id="langLabel">${currentValue.toUpperCase()}</span><span style="font-size:.6rem;opacity:.7;margin-left:2px;">▾</span>`
      : `<span style="font-size:.85rem;line-height:1;font-weight:600;" id="currSymbol">${(CURRENCIES.find(c => c[0] === currentValue) || ['USD', '$'])[1]}</span><span id="currLabel">${currentValue}</span><span style="font-size:.6rem;opacity:.7;margin-left:2px;">▾</span>`;

    const drop = document.createElement('div');
    drop.className = 'lux-dropdown';
    drop.id = kind === 'lang' ? 'langDrop' : 'currDrop';
    drop.setAttribute('role', 'listbox');

    rows.forEach(([value, code, name]) => {
      const item = document.createElement('div');
      item.className = 'lux-dropdown-item' + (value === currentValue ? ' selected' : '');
      item.dataset.val = value;
      item.innerHTML = `<span class="item-code">${code}</span><span class="item-name">${name}</span>`;
      item.addEventListener('click', event => {
        event.stopPropagation();
        if (kind === 'lang') chooseHeaderLang(value);
        else chooseHeaderCurrency(value);
      });
      drop.appendChild(item);
    });

    btn.addEventListener('click', event => {
      event.stopPropagation();
      const wasOpen = drop.classList.contains('open');
      closeHeaderDropdowns();
      if (!wasOpen) {
        drop.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    wrap.appendChild(btn);
    wrap.appendChild(drop);
    return wrap;
  }

  function ensureHeaderControls() {
    const header = document.querySelector('header');
    const nav = header && header.querySelector('nav');
    if (!header || !nav || document.getElementById('currWrap')) return;

    const controls = document.createElement('div');
    controls.className = 'pct-header-controls';
    controls.appendChild(makeHeaderDropdown('lang', LANGS, 'en'));
    controls.appendChild(makeHeaderDropdown('curr', CURRENCIES, 'USD'));
    nav.insertAdjacentElement('afterend', controls);
  }

  function currentPath() {
    return (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  }

  function closeDrawer() {
    document.documentElement.classList.remove('pct-mobile-nav-open');
    const btn = document.querySelector('.pct-mobile-menu-button');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function openDrawer() {
    document.documentElement.classList.add('pct-mobile-nav-open');
    const btn = document.querySelector('.pct-mobile-menu-button');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  function chooseLang(code) {
    if (typeof window.pickLang === 'function') window.pickLang(code);
    else if (typeof window.setLang === 'function') window.setLang(code);
    closeDrawer();
  }

  function chooseCurrency(code) {
    if (typeof window.pickCurr === 'function') {
      window.pickCurr(code);
    } else {
      const select = document.getElementById('currencySelect');
      if (select) {
        select.value = code;
        select.dispatchEvent(new Event('change'));
      } else if (typeof window.setCurrency === 'function') {
        window.setCurrency(code);
      }
    }
    closeDrawer();
  }

  function makeChoice(value, label, caption, handler, selected) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pct-mobile-choice' + (selected ? ' is-selected' : '');
    button.innerHTML = `${label}${caption ? `<span class="pct-mobile-caption">${caption}</span>` : ''}`;
    button.addEventListener('click', () => handler(value));
    return button;
  }

  function buildDrawer() {
    if (document.querySelector('.pct-mobile-drawer')) return;
    const header = document.querySelector('header');
    if (!header) return;

    const menuButton = document.createElement('button');
    menuButton.type = 'button';
    menuButton.className = 'pct-mobile-menu-button';
    menuButton.setAttribute('aria-label', 'Open menu');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.innerHTML = '<span class="material-symbols-outlined">menu</span>';
    menuButton.addEventListener('click', openDrawer);
    header.appendChild(menuButton);

    const backdrop = document.createElement('div');
    backdrop.className = 'pct-mobile-backdrop';
    backdrop.addEventListener('click', closeDrawer);

    const drawer = document.createElement('aside');
    drawer.className = 'pct-mobile-drawer';
    drawer.setAttribute('aria-label', 'Mobile menu');

    const activePath = currentPath();
    const links = NAV_ITEMS.map(([href, label]) => {
      const active = activePath === href.toLowerCase();
      return `<a href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a>`;
    }).join('');

    drawer.innerHTML = `
      <div class="pct-mobile-drawer-head">
        <img src="images/logo.png" alt="Paradise Cartagena Tours" style="max-height:52px;width:auto;">
        <button type="button" class="pct-mobile-close" aria-label="Close menu"><span class="material-symbols-outlined">close</span></button>
      </div>
      <nav class="pct-mobile-links">${links}</nav>
      <div class="pct-mobile-controls">
        <div>
          <div class="pct-mobile-control-label">Language</div>
          <div class="pct-mobile-control-grid" id="pctMobileLang"></div>
        </div>
        <div>
          <div class="pct-mobile-control-label">Currency</div>
          <div class="pct-mobile-control-grid currency" id="pctMobileCurrency"></div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);
    drawer.querySelector('.pct-mobile-close').addEventListener('click', closeDrawer);
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

    const activeLang = (document.getElementById('langLabel') || {}).textContent || 'EN';
    const activeCurrency = (document.getElementById('currLabel') || {}).textContent || 'USD';
    const langWrap = drawer.querySelector('#pctMobileLang');
    const currencyWrap = drawer.querySelector('#pctMobileCurrency');

    LANGS.forEach(([value, label, caption]) => {
      langWrap.appendChild(makeChoice(value, label, caption, chooseLang, activeLang.trim().toLowerCase() === value));
    });
    CURRENCIES.forEach(([value, label, caption]) => {
      currencyWrap.appendChild(makeChoice(value, label, caption, chooseCurrency, activeCurrency.trim() === value));
    });
  }

  function improveTables() {
    document.querySelectorAll('table').forEach(table => {
      const parent = table.parentElement;
      if (parent) parent.classList.add('pct-scroll-table');
    });
  }

  function reduceFixedHeights() {
    document.querySelectorAll('[class*="h-[480px]"], [class*="h-[540px]"]').forEach(el => {
      el.classList.add('pct-mobile-card-height');
    });
    document.querySelectorAll('[class*="h-[380px]"]').forEach(el => {
      el.classList.add('pct-mobile-media-height');
    });
    document.querySelectorAll('[class*="h-[420px]"]').forEach(el => {
      el.classList.add('pct-mobile-gallery-height');
    });
    document.querySelectorAll('[class*="min-h-[90vh]"]').forEach(el => {
      el.classList.add('pct-mobile-hero-height');
    });
  }

  function markStickyBarPages() {
    if (document.getElementById('stickyBar')) document.body.classList.add('pct-has-sticky-bar');
  }

  function init() {
    injectStyles();
    ensureHeaderControls();
    buildDrawer();
    improveTables();
    reduceFixedHeights();
    markStickyBarPages();
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeDrawer();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
