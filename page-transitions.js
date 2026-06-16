(function () {
  const DURATION = 260;
  const STORAGE_KEY = 'pct_page_transition';

  function injectStyles() {
    if (document.getElementById('pct-page-transition-styles')) return;
    const style = document.createElement('style');
    style.id = 'pct-page-transition-styles';
    style.textContent = `
      .pct-transition-veil {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: #012A44;
        opacity: 0;
        pointer-events: none;
        transition: opacity ${DURATION}ms cubic-bezier(.4,0,.2,1);
      }
      @media (prefers-reduced-motion: no-preference) {
        html.pct-page-enter main,
        html.pct-page-enter section:first-of-type {
          animation: pctPageEnter 320ms cubic-bezier(.2,.8,.2,1) both;
        }
        html.pct-page-exit .pct-transition-veil {
          opacity: 1;
          pointer-events: auto;
        }
        @keyframes pctPageEnter {
          from { opacity: .94; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureVeil() {
    let veil = document.querySelector('.pct-transition-veil');
    if (!veil) {
      veil = document.createElement('div');
      veil.className = 'pct-transition-veil';
      document.body.appendChild(veil);
    }
    return veil;
  }

  function isInternalPageLink(anchor) {
    if (!anchor || !anchor.href) return false;
    if (anchor.target && anchor.target !== '_self') return false;
    if (anchor.hasAttribute('download')) return false;
    if (anchor.getAttribute('href').startsWith('#')) return false;
    if (anchor.href.includes('wa.me') || anchor.href.startsWith('mailto:') || anchor.href.startsWith('tel:')) return false;

    const url = new URL(anchor.href, location.href);
    if (url.origin !== location.origin) return false;

    const currentPath = location.pathname.split('/').pop();
    const nextPath = url.pathname.split('/').pop();
    if (currentPath === nextPath && url.hash) return false;

    return /\.html$/i.test(nextPath) || nextPath === '';
  }

  function shouldSkipEvent(event) {
    return event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
  }

  function handleClick(event) {
    if (shouldSkipEvent(event)) return;

    const anchor = event.target.closest && event.target.closest('a[href]');
    if (!isInternalPageLink(anchor)) return;

    event.preventDefault();
    ensureVeil();
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (err) {}
    document.documentElement.classList.add('pct-page-exit');

    window.setTimeout(() => {
      location.href = anchor.href;
    }, DURATION - 40);
  }

  function init() {
    injectStyles();
    ensureVeil();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let cameFromTransition = false;
      try {
        cameFromTransition = sessionStorage.getItem(STORAGE_KEY) === '1';
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (err) {}
      if (cameFromTransition) {
        document.documentElement.classList.add('pct-page-enter');
        window.setTimeout(() => document.documentElement.classList.remove('pct-page-enter'), 380);
      }
    }
    document.addEventListener('click', handleClick, true);
    window.addEventListener('pageshow', () => {
      document.documentElement.classList.remove('pct-page-exit');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
