(function () {
  const WA_NUMBER = '573001234567';
  const SUPPORT_EMAIL = 'info@haventoursctg.com';
  const year = new Date().getFullYear();

  function footerHTML() {
    return `
      <footer id="contact" class="pct-site-footer bg-[#012A44] w-full py-14 md:py-16 px-6 md:px-8 mt-16">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12">
            <div>
              <a href="index.html" class="inline-flex hover:opacity-85 transition-opacity">
                <img src="images/logo.png" alt="Haven Cartagena Tours" class="h-14 w-auto mb-4">
              </a>
              <p class="text-white/60 text-sm font-medium leading-relaxed mb-6">
                Premium coastal experiences in Cartagena. Boats, beach clubs, tours, and group trips planned with local expertise.
              </p>
              <div class="flex gap-3">
                <a href="https://www.instagram.com/havencartagenatours/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:-translate-y-1 hover:bg-[#E4405F] transition-all">
                  <svg viewBox="0 0 24 24" class="w-5 h-5 text-white" fill="currentColor" aria-hidden="true">
                    <path d="M7.8 2h8.4A5.81 5.81 0 0 1 22 7.8v8.4a5.81 5.81 0 0 1-5.8 5.8H7.8A5.81 5.81 0 0 1 2 16.2V7.8A5.81 5.81 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>
                  </svg>
                </a>
                <a href="#" aria-label="TikTok" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:-translate-y-1 hover:bg-black transition-all">
                  <svg viewBox="0 0 24 24" class="w-5 h-5 text-white" fill="currentColor" aria-hidden="true">
                    <path d="M16.6 5.82A5.48 5.48 0 0 0 20 7.02v3.08a8.55 8.55 0 0 1-3.32-.68v5.68a6.2 6.2 0 1 1-6.2-6.2c.42 0 .83.04 1.22.12v3.14a3.2 3.2 0 1 0 1.9 2.94V2h3a5.48 5.48 0 0 0 0 3.82Z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/share/1Xm46YFNZH/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:-translate-y-1 hover:bg-[#1877F2] transition-all">
                  <svg viewBox="0 0 24 24" class="w-5 h-5 text-white" fill="currentColor" aria-hidden="true">
                    <path d="M14 8.5V6.75c0-.5.4-.75.85-.75H17V3h-2.8C11.7 3 10 4.55 10 7.35V8.5H7.5V12H10v9h4v-9h2.7l.55-3.5H14Z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 class="font-bold text-white mb-5 text-sm uppercase tracking-wider">Experiences</h4>
              <ul class="space-y-3 text-sm font-medium">
                <li><a href="tours.html" class="text-white/60 hover:text-[#FF7A00] transition-colors">Tours</a></li>
                <li><a href="beach-clubs.html" class="text-white/60 hover:text-[#FF7A00] transition-colors">Beach Clubs</a></li>
                <li><a href="boats.html" class="text-white/60 hover:text-[#FF7A00] transition-colors">Boats & Charters</a></li>
                <li><a href="index.html#tours" class="text-white/60 hover:text-[#FF7A00] transition-colors">Group Experiences</a></li>
              </ul>
            </div>

            <div>
              <h4 class="font-bold text-white mb-5 text-sm uppercase tracking-wider">Company</h4>
              <ul class="space-y-3 text-sm font-medium">
                <li><a href="about-us.html" class="text-white/60 hover:text-[#FF7A00] transition-colors">About Us</a></li>
                <li><a href="why-us.html" class="text-white/60 hover:text-[#FF7A00] transition-colors">Why Us</a></li>
                <li><a href="travel-tips.html" class="text-white/60 hover:text-[#FF7A00] transition-colors">Travel Tips</a></li>
                <li><a href="index.html#how" class="text-white/60 hover:text-[#FF7A00] transition-colors">How It Works</a></li>
                <li><a href="contact.html" class="text-white/60 hover:text-[#FF7A00] transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 class="font-bold text-white mb-5 text-sm uppercase tracking-wider">Support & Policies</h4>
              <ul class="space-y-4 text-sm font-medium">
                <li>
                  <a href="mailto:${SUPPORT_EMAIL}" class="flex items-center gap-3 text-white/60 hover:text-[#FF7A00] transition-colors">
                    <span class="material-symbols-outlined text-[#FF7A00] text-lg">mail</span>
                    ${SUPPORT_EMAIL}
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener" class="flex items-center gap-3 text-white/60 hover:text-[#FF7A00] transition-colors">
                    <svg viewBox="0 0 24 24" class="w-5 h-5 text-[#25D366] shrink-0" fill="currentColor" aria-hidden="true">
                      <path d="M20.52 3.48A11.8 11.8 0 0 0 12.1 0C5.55 0 .22 5.33.22 11.88c0 2.1.55 4.15 1.6 5.96L.12 24l6.3-1.65a11.86 11.86 0 0 0 5.68 1.45h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.15-3.47-8.44ZM12.1 21.8h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.5-5.29C2.22 6.43 6.65 2 12.1 2c2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.98c0 5.45-4.44 9.92-9.89 9.92Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/>
                    </svg>
                    WhatsApp booking
                  </a>
                </li>
                <li><a href="terms.html" class="text-white/60 hover:text-[#FF7A00] transition-colors">Terms & Conditions</a></li>
                <li><a href="cancellation-refund-policy.html" class="text-white/60 hover:text-[#FF7A00] transition-colors">Cancellation & Refund Policy</a></li>
                <li><a href="privacy-policy.html" class="text-white/60 hover:text-[#FF7A00] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div class="pt-8 border-t border-white/15 text-center">
            <p class="text-white/55 text-xs font-semibold uppercase tracking-widest">
              Copyright ${year} Haven Cartagena Tours. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    `;
  }

  function installFooter() {
    const template = document.createElement('template');
    template.innerHTML = footerHTML().trim();
    const nextFooter = template.content.firstElementChild;
    const existingFooters = Array.from(document.querySelectorAll('footer'));

    if (existingFooters.length) {
      existingFooters[0].replaceWith(nextFooter);
      existingFooters.slice(1).forEach(footer => footer.remove());
    } else {
      const anchor = document.currentScript || document.querySelector('script[src="mobile-enhancements.js"]');
      if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(nextFooter, anchor);
      else document.body.appendChild(nextFooter);
    }

  }

  if (document.body) installFooter();
  else document.addEventListener('DOMContentLoaded', installFooter);
})();
