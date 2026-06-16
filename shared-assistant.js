(function () {
  if (window.PCT_ASSISTANT_INSTALLED) return;
  window.PCT_ASSISTANT_INSTALLED = true;

  const ENDPOINT = location.protocol === 'file:' ? 'http://localhost:8080/api/assistant' : '/api/assistant';
  const conversation = [];

  function installStyles() {
    if (document.getElementById('pctAndreaStyles')) return;
    const style = document.createElement('style');
    style.id = 'pctAndreaStyles';
    style.textContent = `
      .ai-chat-panel{position:fixed;right:24px;bottom:104px;z-index:160;width:min(420px,calc(100vw - 32px));max-height:min(680px,calc(100vh - 140px));display:none;overflow:hidden;border-radius:18px;background:#fff;box-shadow:0 24px 70px rgba(0,32,50,.24);border:1px solid rgba(0,47,70,.12);font-family:Inter,system-ui,sans-serif}
      .ai-chat-panel.is-open{display:flex;flex-direction:column}
      .ai-chat-panel *{box-sizing:border-box}
      .ai-chat-header{background:#012A44;color:white;padding:16px;display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
      .ai-chat-kicker{font-size:11px;font-weight:900;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.58);margin:0 0 4px}
      .ai-chat-title{font-size:16px;line-height:1.35;font-weight:900;margin:0}
      .ai-chat-close{width:32px;height:32px;border:0;border-radius:999px;background:rgba(255,255,255,.1);color:white;cursor:pointer;display:flex;align-items:center;justify-content:center}
      .ai-quick-replies{display:flex;flex-wrap:wrap;gap:8px;padding:12px 16px 0;background:#f7fbfd}
      .ai-quick-replies button{border:0;border-radius:999px;background:rgba(0,168,168,.1);color:#075a68;font-size:12px;font-weight:900;padding:8px 10px;cursor:pointer}
      .ai-chat-messages{display:grid;gap:10px;padding:16px;overflow-y:auto;max-height:410px;background:#f7fbfd}
      .ai-chat-message{max-width:88%;border-radius:14px;padding:10px 12px;font-size:13px;line-height:1.45;white-space:pre-wrap}
      .ai-chat-message.assistant{background:white;color:#173244;border:1px solid rgba(0,47,70,.08)}
      .ai-chat-message.user{justify-self:end;background:#00A8A8;color:white}
      .ai-chat-form{padding:12px;background:white;border-top:1px solid #e2e8f0;display:flex;gap:8px}
      .ai-chat-form input{flex:1;min-width:0;border:0;border-radius:999px;background:#f1f5f9;padding:12px 16px;font-size:14px;outline:0}
      .ai-chat-form input:focus{box-shadow:0 0 0 2px rgba(0,168,168,.25)}
      .ai-chat-form button{border:0;border-radius:999px;background:#00A8A8;color:white;padding:0 18px;font-size:14px;font-weight:900;cursor:pointer}
      .ai-chat-launcher{position:fixed;right:32px;bottom:32px;z-index:150;width:64px;height:64px;border:0;border-radius:999px;background:#25D366;color:white;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 32px rgba(37,211,102,.4);transition:transform .18s ease,box-shadow .18s ease;cursor:pointer}
      .ai-chat-launcher:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 12px 44px rgba(37,211,102,.56)}
      @media(max-width:768px){.ai-chat-panel{right:16px;bottom:88px;width:calc(100vw - 32px);max-height:calc(100vh - 112px)}.ai-chat-launcher{right:16px;bottom:16px;width:54px;height:54px}}
    `;
    document.head.appendChild(style);
  }

  function installMarkup() {
    if (document.getElementById('aiChatPanel')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div id="aiChatPanel" class="ai-chat-panel" aria-live="polite">
        <div class="ai-chat-header">
          <div>
            <p class="ai-chat-kicker">Andrea</p>
            <h3 class="ai-chat-title">Ask me about tours, boats, clubs, or booking.</h3>
          </div>
          <button type="button" class="ai-chat-close" data-andrea-close aria-label="Close Andrea">×</button>
        </div>
        <div class="ai-quick-replies">
          <button type="button" data-andrea-quick="What are your most popular tours?">Popular tours</button>
          <button type="button" data-andrea-quick="Do you offer private boats?">Private boats</button>
          <button type="button" data-andrea-quick="Which beach club should I choose?">Beach clubs</button>
          <button type="button" data-andrea-quick="How do I book?">How to book</button>
        </div>
        <div id="aiChatMessages" class="ai-chat-messages"></div>
        <form class="ai-chat-form" data-andrea-form>
          <input id="aiChatInput" placeholder="Ask a question..." autocomplete="off"/>
          <button type="submit">Send</button>
        </form>
      </div>
      <button type="button" class="ai-chat-launcher" data-andrea-toggle aria-label="Open Andrea assistant">
        <span class="material-symbols-outlined" style="font-size:36px;font-variation-settings:'FILL' 1;">chat</span>
      </button>
    `;
    document.body.appendChild(wrap);
  }

  function elements() {
    return {
      panel: document.getElementById('aiChatPanel'),
      messages: document.getElementById('aiChatMessages'),
      input: document.getElementById('aiChatInput')
    };
  }

  function detectLanguage(text) {
    const q = String(text || '').toLowerCase();
    if (/[ãõç]|\b(oi|olá|ola|você|voce|tudo bem|passeio|preço|preco|quanto custa|obrigad|barco|praia)\b/.test(q)) return 'pt';
    if (/[ñ¿¡ü]|\b(hola|buenas|buenos dias|buenas tardes|como estas|cómo estás|quiero|precio|cuanto|cuánto|paseo|playa|gracias|disponible|reserva)\b/.test(q)) return 'es';
    return 'en';
  }

  function copy(lang, key) {
    const text = {
      en: { thinking: "One moment. I'm checking that for you...", fallback: "I can help with tours, private boats, beach clubs, ATV, Cholon, Bora Bora, the 5 Island Tour, prices, timing, and booking. Tell me your group size, date, and what kind of day you want." },
      es: { thinking: "Un momento. Estoy revisando eso para ti...", fallback: "Puedo ayudarte con tours, botes privados, beach clubs, ATV, Cholón, Bora Bora, el tour de 5 islas, precios, horarios y reservas. Dime el tamaño de tu grupo, la fecha y qué tipo de experiencia buscas." },
      pt: { thinking: "Um momento. Estou verificando isso para você...", fallback: "Posso ajudar com passeios, barcos privados, beach clubs, ATV, Cholon, Bora Bora, tour de 5 ilhas, preços, horários e reservas. Me diga o tamanho do grupo, a data e o tipo de experiência que você quer." }
    };
    return (text[lang] || text.en)[key];
  }

  function addMessage(role, text) {
    const { messages } = elements();
    if (!messages) return null;
    const bubble = document.createElement('div');
    bubble.className = `ai-chat-message ${role === 'user' ? 'user' : 'assistant'}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    conversation.push({ role: role === 'user' ? 'user' : 'assistant', content: text });
    if (conversation.length > 12) conversation.splice(0, conversation.length - 12);
    return bubble;
  }

  function updateMessage(bubble, text) {
    if (!bubble) return;
    bubble.textContent = text;
    const last = conversation[conversation.length - 1];
    if (last && last.role === 'assistant') last.content = text;
    const { messages } = elements();
    if (messages) messages.scrollTop = messages.scrollHeight;
  }

  function collectPageContext() {
    const selectors = ['#toursGrid .pc-card', '#clubsGrid .club-card, #clubsGrid .pc-card', '#boatsGrid .pc-card, #boatsGrid a'];
    const visibleTours = selectors.flatMap(selector => Array.from(document.querySelectorAll(selector)).slice(0, 12).map(card => ({
      name: card.querySelector('h3')?.textContent.trim() || card.querySelector('[data-name]')?.textContent.trim() || '',
      price: card.querySelector('.text-primary, .text-sc-primary')?.textContent.trim() || '',
      duration: card.querySelector('.bg-surface-container, .bg-sc-surface-container')?.textContent.trim() || '',
      description: card.querySelector('p')?.textContent.trim() || ''
    }))).filter(item => item.name);
    return {
      currency: window.currentCurrency || document.getElementById('currLabel')?.textContent.trim() || 'USD',
      pageTitle: document.title,
      visibleTours,
      exactFacts: [
        'Use visible page prices when answering about prices.',
        'ATV booking options: single ATV is $115 USD for 1 person on 1 ATV; double ATV is $135 USD for 2 people sharing 1 ATV.',
        'ATV tour time slots: 10am, 1pm, 4pm.'
      ]
    };
  }

  function fallback(question) {
    const q = String(question || '').toLowerCase();
    const lang = detectLanguage(question);
    if (/atv|quad|tierra/.test(q)) {
      if (lang === 'es') return 'El tour de ATV tiene horarios a las 10am, 1pm y 4pm. ATV sencillo: $115 USD para 1 persona en 1 ATV. ATV doble: $135 USD para 2 personas compartiendo 1 ATV.';
      if (lang === 'pt') return 'O tour de ATV tem horários às 10am, 1pm e 4pm. ATV individual: US$115 para 1 pessoa em 1 ATV. ATV duplo: US$135 para 2 pessoas compartilhando 1 ATV.';
      return 'The ATV tour runs at 10am, 1pm, and 4pm. Single ATV is $115 USD for 1 person on 1 ATV. Double ATV is $135 USD for 2 people sharing 1 ATV.';
    }
    return copy(lang, 'fallback');
  }

  async function askClaude(question) {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: question,
        language: detectLanguage(question),
        history: conversation.slice(-8),
        pageContext: collectPageContext()
      })
    });
    if (!response.ok) throw new Error('Andrea API request failed');
    const data = await response.json();
    if (!data.reply) throw new Error('Andrea API response missing reply');
    return data.reply;
  }

  async function answer(question) {
    const lang = detectLanguage(question);
    const bubble = addMessage('assistant', copy(lang, 'thinking'));
    try {
      updateMessage(bubble, await askClaude(question));
    } catch (err) {
      updateMessage(bubble, fallback(question));
    }
  }

  function open(topic) {
    const { panel, input, messages } = elements();
    if (!panel) return false;
    panel.classList.add('is-open');
    if (messages && !messages.children.length) {
      const intro = topic === 'planning'
        ? "Hi, I'm Andrea. Tell me your group size, travel date, and the vibe you want: relaxed, party, private boat, beach club, or adventure."
        : "Hi, I'm Andrea. Ask me about tours, beach clubs, private boats, ATV, Cholon, Bora Bora, pricing, or how to book.";
      addMessage('assistant', intro);
    }
    window.setTimeout(() => input?.focus(), 80);
    return false;
  }

  function close() {
    elements().panel?.classList.remove('is-open');
  }

  function toggle() {
    const { panel } = elements();
    if (!panel) return false;
    if (panel.classList.contains('is-open')) close();
    else open();
    return false;
  }

  window.openAssistantChat = open;
  window.closeAssistantChat = close;
  window.toggleAssistantChat = toggle;
  window.askAssistantQuick = function (question) {
    open();
    addMessage('user', question);
    answer(question);
  };

  function bindEvents() {
    document.querySelector('[data-andrea-toggle]')?.addEventListener('click', toggle);
    document.querySelector('[data-andrea-close]')?.addEventListener('click', close);
    document.querySelectorAll('[data-andrea-quick]').forEach(button => {
      button.addEventListener('click', () => window.askAssistantQuick(button.dataset.andreaQuick));
    });
    document.querySelector('[data-andrea-form]')?.addEventListener('submit', event => {
      event.preventDefault();
      const { input } = elements();
      const question = input?.value.trim();
      if (!question) return;
      input.value = '';
      addMessage('user', question);
      answer(question);
    });
  }

  function removeLegacyFloaters() {
    document.querySelectorAll('#floatingWA, a.fixed[onclick*="openWA"], a.fixed[href*="wa.me"]').forEach(el => el.remove());
  }

  function init() {
    installStyles();
    removeLegacyFloaters();
    installMarkup();
    bindEvents();
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
