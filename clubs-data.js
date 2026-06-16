// ═══════════════════════════════════════════════════════════════════════════
//  clubs-data.js — Single source of truth for all beach club data
//  Base prices stored in COP (Colombian Pesos).
//  fmt(cop) converts to the currently selected display currency.
// ═══════════════════════════════════════════════════════════════════════════

// ── CURRENCY SYSTEM ─────────────────────────────────────────────────────────
// How many COP = 1 unit of each currency. These values are a fallback until live rates load.
const RATES    = { COP: 1, USD: 4200, EUR: 4536, GBP: 5316 };
const SYMBOLS  = { COP: '$', USD: '$', EUR: '€', GBP: '£' };
const PREFIXES = { COP: 'COP ', USD: '', EUR: '', GBP: '' };
const RATE_CACHE_KEY = 'pct_currency_rates_v1';
const RATE_CACHE_TTL = 6 * 60 * 60 * 1000;
let currentCurrency = 'USD';

function applyRatePayload(payload) {
  if (!payload || (payload.base_code || payload.base) !== 'COP' || !payload.rates) return false;
  ['USD', 'EUR', 'GBP'].forEach(code => {
    const copToTarget = Number(payload.rates[code]);
    if (copToTarget > 0) RATES[code] = 1 / copToTarget;
  });
  return true;
}

async function loadCurrencyRates(onUpdate) {
  try {
    const cached = JSON.parse(localStorage.getItem(RATE_CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.savedAt < RATE_CACHE_TTL && applyRatePayload(cached.payload)) {
      if (typeof onUpdate === 'function') onUpdate();
      return;
    }
  } catch (err) {}

  try {
    const response = await fetch('https://open.er-api.com/v6/latest/COP');
    if (!response.ok) throw new Error('Currency rate request failed');
    const payload = await response.json();
    if (!applyRatePayload(payload)) return;
    localStorage.setItem(RATE_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), payload }));
    if (typeof onUpdate === 'function') onUpdate();
  } catch (err) {
    console.warn('Using fallback currency rates.', err);
  }
}

function fmt(cop) {
  const rate = RATES[currentCurrency];
  const val  = cop / rate;
  const sym  = SYMBOLS[currentCurrency];
  const pre  = PREFIXES[currentCurrency];
  if (currentCurrency === 'COP') return pre + sym + Math.round(val).toLocaleString('es-CO');
  return pre + sym + Math.round(val).toLocaleString('en-US');
}

// ── BADGE CONFIG (card style — Tailwind classes) ─────────────────────────────
const badgeCfg = {
  popular:    { bg:'bg-[#FF7A00]',  text:'text-white', label:'Popular'          },
  exclusive:  { bg:'bg-[#00A8A8]',  text:'text-white', label:'Exclusive'        },
  eco:        { bg:'bg-[#4CAF50]',  text:'text-white', label:'🌿 Eco'            },
  limited:    { bg:'bg-[#FF4E50]',  text:'text-white', label:'⚡ Limited'       },
  bestseller: { bg:'bg-[#FF7A00]',  text:'text-white', label:'🔥 Best Seller'   },
  gourmet:    { bg:'bg-[#FF7A00]',  text:'text-white', label:'Gourmet'          },
};

// ── BADGE CONFIG (detail style — inline hex for sidebar) ──────────────────────
const badgeCfgDetail = {
  popular:    { bg:'#FF7A00', color:'#ffffff', label:'Popular'          },
  exclusive:  { bg:'#00A8A8', color:'#ffffff', label:'Exclusive'        },
  eco:        { bg:'#4CAF50', color:'#ffffff', label:'🌿 Eco'            },
  limited:    { bg:'#FF4E50', color:'#ffffff', label:'⚡ Limited'       },
  bestseller: { bg:'#FF7A00', color:'#ffffff', label:'🔥 Best Seller'   },
  gourmet:    { bg:'#FF7A00', color:'#ffffff', label:'Gourmet'          },
};

// ═══════════════════════════════════════════════════════════════════════════
//  CLUB DATA
//  priceCOP  → base price in Colombian Pesos (per person, adult rate)
//  vibeKey   → 'party' | 'chill' | 'luxury' | 'eco'  (filter tab)
//  badge     → see badgeCfg keys above
// ═══════════════════════════════════════════════════════════════════════════
const CLUBS_DATA = [

  // ══════════════════════════════════════════════════════════════════════════
  //  BORA BORA
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 1,
    name: 'Bora Bora Beach Club – Club Area',
    emoji: '🍾',
    badge: 'popular',
    vibe: '🎉 Party',
    vibeKey: 'party',
    vibeLabels: ['🎉 Party', '🎶 Live DJ', '🔞 Adults Only'],
    subtitle: 'Adults-only Caribbean party beach with live DJ, dance show, and gourmet lunch — the club everyone talks about.',
    tagline: 'Cartagena\'s most iconic beach club — the name that comes up in every conversation.',
    priceCOP: 370000,
    perUnit: 'person',
    img: 'https://boraboracartagena.com/img/cms/vip-area-3.jpg',
    imgs: [
      'https://boraboracartagena.com/img/cms/vip-area-3.jpg',
      'https://boraboracartagena.com/img/cms/galeria-area-club-bora-bora-2.jpg',
      'https://boraboracartagena.com/img/cms/2024/VIP/Galeria%20Vip%20(1).jpg',
      'https://boraboracartagena.com/img/cms/2024/VIP/Galeria%20Vip%20(10).jpg',
    ],
    f1Icon: 'music_note', f1: 'Live DJ & Dance Show',
    f2Icon: 'restaurant', f2: 'Gourmet Lunch (6 Options)',
    includesNote: 'Includes speedboat + gourmet lunch + beach bed',
    sellsOut: true, limitedCapacity: true,
    duration: '8.5 Hours',
    stats: [
      { icon: 'schedule',        label: 'Full Day' },
      { icon: 'restaurant',      label: 'Gourmet Lunch' },
      { icon: 'directions_boat', label: 'Boat Incl.' },
    ],
    specs: [
      { icon: 'music_note',      label: 'Live DJ All Day' },
      { icon: 'restaurant',      label: 'Gourmet Lunch (6 Options)' },
      { icon: 'beach_access',    label: 'Beach Bed Included' },
      { icon: 'directions_boat', label: 'Speedboat Transport' },
    ],
    description: 'Bora Bora is the name that echoes through every conversation about Cartagena\'s beach scene. Set on Isla Barú about 45 minutes from the city, this adults-only club delivers the Caribbean party experience at its most electric: a resident DJ plays from arrival to departure, gourmet lunch offers six options (mojarra fish, grilled chicken, balsamic chicken, seafood pasta, poke bowl, or pesto pasta), and a live choreographed dance show rounds out the afternoon. The second-row beach beds hold up to three people and put you close enough to feel every bass beat and every wave.',
    whyLove: [
      { icon: 'music_note',   text: 'Live DJ from arrival to departure — and a live dance show' },
      { icon: 'restaurant',   text: 'Gourmet lunch with 6 menu options — fish, chicken, pasta, or vegan' },
      { icon: 'beach_access', text: 'Adults-only atmosphere — Cartagena\'s most electric beach club' },
    ],
    clubAreas: ['Main Dance Deck', 'Beach Bed Row', 'Bar & Cocktail Station', 'Swim Beach'],
    included: ['Round-trip speedboat transport','Welcome drink','Gourmet lunch (6 menu options)','Beach bed — 2nd row (max 3 people per bed)','Live DJ entertainment','Choreographed dance show','Tour guide / coordinator'],
    excluded: ['Towels','First-row beach beds (100,000 COP extra per bed)','Natural reserve fee (8,800 COP/person)','Port tax (31,500 COP/person)','Optional activities (kayak, paddleboard, spa)','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'📍', title:'Meet at Muelle de la Bodeguita Gate 3', desc:'Arrive by 7:30 AM — boat departs sharp at 8:20 AM.' },
      { step:'02', emoji:'🚤', title:'Speedboat to Bora Bora',                desc:'45–50 minutes of open Caribbean horizon.' },
      { step:'03', emoji:'🏖', title:'Arrive & claim your beach bed',         desc:'Welcome drink in hand — music already going on arrival.' },
      { step:'04', emoji:'🍽', title:'Gourmet lunch at 1:00 PM',              desc:'Choose from fish, chicken, pasta, poke bowl, or vegan.' },
      { step:'05', emoji:'🎶', title:'DJ & live dance show in the afternoon', desc:'The afternoon builds to Cartagena\'s most famous party vibe.' },
      { step:'06', emoji:'🚤', title:'Return boat at 3:00 PM',               desc:'Back at the Cartagena dock by 4:00 PM.' },
    ],
    perfectFor: ['Adult groups', 'Bachelorette parties', 'Party lovers', 'Couples'],
  },

  {
    id: 2,
    name: 'Bora Bora Beach Club – VIP Area',
    emoji: '🍾',
    badge: 'exclusive',
    vibe: '👑 VIP',
    vibeKey: 'party',
    vibeLabels: ['👑 VIP', '🎉 Party', '🔞 Adults Only'],
    subtitle: 'VIP access to Cartagena\'s iconic party beach — à la carte lunch, exclusive seating, and elevated service.',
    tagline: 'All the energy of Bora Bora, elevated — VIP zone access with à la carte dining.',
    priceCOP: 470000,
    perUnit: 'person',
    img: 'https://boraboracartagena.com/img/cms/vip-area-11.jpg',
    imgs: [
      'https://boraboracartagena.com/img/cms/vip-area-11.jpg',
      'https://boraboracartagena.com/img/cms/vip-area-15.jpg',
      'https://boraboracartagena.com/img/cms/2024/VIP/Galeria%20Vip%20(10).jpg',
      'https://boraboracartagena.com/img/cms/galeria-area-club-bora-bora-9.jpg',
    ],
    f1Icon: 'star',       f1: 'VIP Area Access',
    f2Icon: 'restaurant', f2: 'À La Carte Lunch',
    includesNote: 'Includes speedboat + VIP access + à la carte lunch',
    sellsOut: true, limitedCapacity: true,
    duration: '8.5 Hours',
    stats: [
      { icon: 'star',            label: 'VIP Access' },
      { icon: 'restaurant',      label: 'À La Carte' },
      { icon: 'directions_boat', label: 'Boat Incl.' },
    ],
    specs: [
      { icon: 'star',            label: 'VIP + Club Area Access' },
      { icon: 'restaurant',      label: 'À La Carte Gourmet Lunch' },
      { icon: 'music_note',      label: 'Live DJ All Day' },
      { icon: 'directions_boat', label: 'Speedboat Transport' },
    ],
    description: 'Everything that makes Bora Bora legendary — now with reserved access to the exclusive VIP zone. Your package includes entry to both the Club Area and the VIP section, a special welcome drink, à la carte dining from the gourmet menu (fish, chicken, seafood pasta, poke bowl, or vegetarian), and a beach bed or sun lounger based on arrival order. The same DJ, the same electric Caribbean energy, the same 45-minute speedboat ride — with a layer of exclusivity that separates you from the crowd.',
    whyLove: [
      { icon: 'star',        text: 'Access to both the exclusive VIP zone and the Club Area' },
      { icon: 'restaurant',  text: 'À la carte lunch — choose your dish from the full gourmet menu' },
      { icon: 'local_bar',   text: 'Special welcome drink + elevated service throughout the day' },
    ],
    clubAreas: ['VIP Exclusive Zone', 'Club Dance Area', 'VIP Bar', 'Private Beach Section'],
    included: ['Round-trip speedboat transport','Special welcome drink','À la carte gourmet lunch','Beach bed or sun lounger (2nd row, based on arrival order)','Access to VIP Area and Club Area','Live DJ entertainment','Tour guide / coordinator'],
    excluded: ['Natural reserve fee (8,800 COP/person)','Port tax (31,500 COP/person)','Towels','First-row beach beds (100,000 COP extra per bed)','Optional activities (kayak, paddleboard, spa)','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'📍', title:'Meet at Muelle de la Bodeguita Gate 3', desc:'Arrive by 7:30 AM — speedboat departs at 8:20 AM.' },
      { step:'02', emoji:'🚤', title:'Speedboat to Bora Bora VIP',            desc:'45–50 minutes across open Caribbean water.' },
      { step:'03', emoji:'👑', title:'VIP check-in & special welcome drink',  desc:'Escorted to your zone with a premium welcome drink.' },
      { step:'04', emoji:'🏖', title:'Morning beach & VIP relaxation',        desc:'Swim, relax, and soak in the exclusive VIP vibe.' },
      { step:'05', emoji:'🍽', title:'À la carte lunch at 1:00 PM',           desc:'Order your dish — fish, chicken, pasta, or vegetarian.' },
      { step:'06', emoji:'🚤', title:'Return boat at 3:00 PM',               desc:'Back at the Cartagena dock by 4:00 PM.' },
    ],
    perfectFor: ['VIP groups', 'Couples', 'Special occasions', 'Adult groups'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  //  BLUE APPLE
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 3,
    name: 'Blue Apple Beach Club',
    emoji: '🍏',
    badge: 'eco',
    vibe: '🌿 Eco',
    vibeKey: 'eco',
    vibeLabels: ['🌿 Eco', '🍹 Chill', '💎 Boutique'],
    subtitle: 'Solar-powered boutique beach club on Tierra Bomba — Mediterranean design, zero waste, pool, and DJ on weekends.',
    tagline: 'The most stylish and sustainable beach club in Cartagena — 20 minutes from the city.',
    priceCOP: 168000,
    perUnit: 'person',
    img: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/1f/22/bc/pool-parties.jpg?w=1400&h=-1&s=1',
    imgs: [
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/1f/22/bc/pool-parties.jpg?w=1400&h=-1&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/58/05/17/blue-apple-beach-house.jpg?w=1200&h=-1&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/1f/15/73/beach-lunch.jpg?w=1400&h=-1&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/1f/19/86/beach-house.jpg?w=1400&h=-1&s=1',
    ],
    f1Icon: 'pool', f1: 'Pool Access',
    f2Icon: 'eco',  f2: 'Solar Powered',
    includesNote: 'Includes shared boat transfer + full day access',
    sellsOut: false, limitedCapacity: true,
    duration: '6–8 Hours',
    stats: [
      { icon: 'pool',            label: 'Pool Incl.' },
      { icon: 'eco',             label: 'Zero Waste' },
      { icon: 'directions_boat', label: 'Boat Incl.' },
    ],
    specs: [
      { icon: 'eco',             label: 'Solar Powered & Zero Waste' },
      { icon: 'pool',            label: 'Pool & Beach Access' },
      { icon: 'music_note',      label: 'DJ on Weekends & Holidays' },
      { icon: 'directions_boat', label: 'Shared Boat Transfer' },
    ],
    description: 'Blue Apple is Cartagena\'s most photographed boutique beach house — and every photo earns its place. Solar-powered and certified zero-waste on Tierra Bomba Island, just 20–25 minutes from Cartagena by shared boat, it draws a crowd that cares about design as much as the Caribbean. Farm-to-table cuisine is available à la carte throughout the day (food is not included in the day pass price). DJ sets run from 1pm to 5pm on weekends and holidays; on weekdays, the soundtrack is purely the ocean. Kayaking, snorkeling, scuba diving, massages, and horseback riding are all available as optional extras. Groups over 13 must contact in advance.',
    whyLove: [
      { icon: 'eco',         text: 'Solar-powered and certified zero-waste — the most sustainable club in Cartagena' },
      { icon: 'restaurant',  text: 'Farm-to-table à la carte dining with international and local influences' },
      { icon: 'pool',        text: 'Pool, beach, garden, and all common areas included with day pass' },
    ],
    clubAreas: ['Beachfront Terrace', 'Swimming Pool', 'Garden Lounge', 'Water Activity Zone'],
    included: ['Round-trip shared boat transfer (Muelle de la Bodeguita Door #1)','Full day access to beach club','Beach, pool, garden & common area access','Music throughout the day (DJ on weekends & holidays 1pm–5pm)'],
    excluded: ['Sun lounger rental (from $5 USD extra)','Food & drinks (excellent à la carte menu — purchased separately)','Optional activities (kayaking, snorkeling, scuba diving, massages, horseback riding)','Port tax','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'📍', title:'Board at Muelle de la Bodeguita Door #1', desc:'Choose your departure: 10:00 AM or 11:30 AM.' },
      { step:'02', emoji:'🚤', title:'Shared boat to Tierra Bomba',             desc:'~20–25 minutes across the bay to the island.' },
      { step:'03', emoji:'🌿', title:'Check in and explore the club',           desc:'Beach, pool, garden — all yours to discover.' },
      { step:'04', emoji:'🍽', title:'À la carte dining at your pace',          desc:'Farm-to-table menu — order whenever you\'re ready.' },
      { step:'05', emoji:'🎶', title:'DJ sets from 1:00–5:00 PM (weekends)',    desc:'Background music on weekdays, full DJ energy on weekends.' },
      { step:'06', emoji:'🚤', title:'Return boat at 4:00 PM or 5:30 PM',      desc:'Choose your return time based on the day you\'re having.' },
    ],
    perfectFor: ['Eco-conscious travellers', 'Couples', 'Design lovers', 'Foodies'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  //  MAKANI
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 4,
    name: 'Makani Luxury Beach Club',
    emoji: '✨',
    badge: 'popular',
    vibe: '💎 Luxury',
    vibeKey: 'luxury',
    vibeLabels: ['💎 Luxury', '🏊 Pool', '👨‍👩‍👧 Family Friendly'],
    subtitle: 'Luxury beach club on Tierra Bomba with pool, gourmet lunch, 20% spa discount, and medical insurance included.',
    tagline: 'Caribbean luxury without compromise — full service, family pricing, and medical insurance included.',
    priceCOP: 359000,
    perUnit: 'person',
    img: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/ad/35/f7/our-daypass.jpg?w=1400&h=-1&s=1',
    imgs: [
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/ad/35/f7/our-daypass.jpg?w=1400&h=-1&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/31/14/6c/2d/the-unexpected-awaits.jpg?w=1400&h=-1&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/b7/c0/41/caption.jpg?w=1400&h=-1&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/31/14/76/8d/the-unexpected-awaits.jpg?w=1400&h=-1&s=1',
    ],
    f1Icon: 'pool', f1: 'Pool Access',
    f2Icon: 'spa',  f2: '20% Spa Discount',
    includesNote: 'Includes speedboat + lunch + pool + spa discount',
    sellsOut: false, limitedCapacity: false,
    duration: '5–9 Hours',
    stats: [
      { icon: 'pool',            label: 'Pool Incl.' },
      { icon: 'restaurant',      label: 'Lunch Incl.' },
      { icon: 'directions_boat', label: 'Boat Incl.' },
    ],
    specs: [
      { icon: 'pool',            label: 'Swimming Pool Access' },
      { icon: 'restaurant',      label: 'Lunch + Dessert Included' },
      { icon: 'spa',             label: '20% Spa Discount' },
      { icon: 'directions_boat', label: 'Speedboat Transport' },
    ],
    description: 'Makani delivers luxury beach club access to the whole family. Set on Tierra Bomba Island just 15–20 minutes from Cartagena by speedboat, you\'re assigned to either the Alaway or Kai zone on arrival — each with its own character. Lunch is a full sit-down meal: main dish, non-alcoholic drink, and dessert, with vegetarian options always available. Pool access is included throughout the day. A 20% spa discount is yours to use with a prior reservation. Medical assistance insurance is included for the entire visit. On weekends a DJ plays from the main deck; on weekdays the ambient music steps back and lets the Caribbean take over.',
    whyLove: [
      { icon: 'pool',       text: 'Swimming pool + direct beach access included all day' },
      { icon: 'restaurant', text: 'Full lunch: main dish, non-alcoholic drink & dessert' },
      { icon: 'spa',        text: '20% spa discount + medical assistance insurance included' },
    ],
    clubAreas: ['Alaway Zone', 'Kai Zone', 'Swimming Pool', 'Spa & Wellness'],
    included: ['Round-trip speedboat transport','Zone placement in Alaway or Kai (subject to availability)','Non-alcoholic welcome cocktail','Use of all common areas','Lunch (main dish, non-alcoholic drink & dessert)','Swimming pool access','20% spa discount (reservation required)','Beach service attendance','Medical assistance insurance'],
    excluded: ['Towels','Spa treatments (20% discount applies — treatments cost extra)','Optional activities (paddleboard, kayak, beach sports)','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'📍', title:'Arrive at dock behind Bocagrande Hospital', desc:'Choose your departure: 9:00 AM, 10:00 AM, or 11:00 AM.' },
      { step:'02', emoji:'🚤', title:'15–20 min speedboat to Makani',             desc:'Short crossing with views of the Cartagena coastline.' },
      { step:'03', emoji:'✨', title:'Welcome, zone assignment & cocktail',        desc:'Alaway or Kai zone — your non-alcoholic welcome cocktail awaits.' },
      { step:'04', emoji:'🏊', title:'Pool, beach & relaxation all morning',      desc:'Pool access, beach service, and spa discount to use at will.' },
      { step:'05', emoji:'🍽', title:'Lunch served at 1:00–2:00 PM',             desc:'Main dish, dessert, and a non-alcoholic drink at your spot.' },
      { step:'06', emoji:'🚤', title:'Return boat at 4:00–5:00 PM',              desc:'Choose your return time — back in Cartagena shortly after.' },
    ],
    perfectFor: ['Families', 'Couples', 'Groups', 'Luxury seekers'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  //  PAO PAO
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 5,
    name: 'Pao Pao Beach Club',
    emoji: '🌴',
    badge: 'exclusive',
    vibe: '🧘 Wellness',
    vibeKey: 'luxury',
    vibeLabels: ['💎 Luxury', '🧘 Wellness', '🤿 Activities'],
    subtitle: 'Rosario Islands beach club with jacuzzi pool, guided snorkeling, Fragatas Island tour, wellness session, and gourmet lunch.',
    tagline: 'The most activity-packed beach club day in Cartagena — with wellness built in from 10 AM.',
    priceCOP: 370000,
    perUnit: 'person',
    img: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/15/7c/9d/e8.jpg',
    imgs: [
      'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/15/7c/9d/e8.jpg',
      'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/14/b6/a6/6d.jpg',
      'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1920,dpr=1/tour_img/9a843695f7540e5683cb80edc340de1f74b221320af05753d8d43f10a8395cd5.jpeg',
      'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/15/c1/7c/d5.jpg',
    ],
    f1Icon: 'scuba_diving',    f1: 'Snorkeling Incl.',
    f2Icon: 'self_improvement', f2: 'Wellness Session',
    includesNote: 'Includes speedboat + lunch + snorkeling + wellness activity',
    sellsOut: true, limitedCapacity: true,
    duration: '8.5 Hours',
    stats: [
      { icon: 'scuba_diving',    label: 'Snorkeling' },
      { icon: 'restaurant',      label: 'Gourmet Lunch' },
      { icon: 'directions_boat', label: 'Boat Incl.' },
    ],
    specs: [
      { icon: 'self_improvement', label: 'Wellness Session Included' },
      { icon: 'scuba_diving',     label: 'Guided Snorkeling' },
      { icon: 'restaurant',       label: 'Gourmet Lunch (5 Options)' },
      { icon: 'directions_boat',  label: 'Speedboat Transport' },
    ],
    description: 'Pao Pao is the most activity-rich beach club day in Cartagena. Two beaches — one social, one tranquil — set the scene on arrival. By mid-morning you\'ve done a wellness session (choose from yoga, conscious breathing, or sound healing), gone guided snorkeling in clear Caribbean water, and taken a boat tour to Fragatas Island to see its famous bird colonies. A five-option gourmet lunch follows (paella, seafood pasta, fish, chicken, or vegetarian), then the Jacuzzi-style pool, cornhole, air hockey, and foosball fill the afternoon. An optional Oceanarium boat transfer is included in your package — entrance costs extra but can be arranged on the day. Ages 12 and over.',
    whyLove: [
      { icon: 'self_improvement', text: 'Choose your wellness session: yoga, conscious breathing, or sound healing' },
      { icon: 'scuba_diving',     text: 'Guided snorkeling + Fragatas Island boat tour both included' },
      { icon: 'pool',             text: 'Jacuzzi-style pool + games (cornhole, air hockey, foosball)' },
    ],
    clubAreas: ['Social Beach', 'Tranquil Beach', 'Jacuzzi Pool', 'Wellness & Games Deck'],
    included: ['Round-trip speedboat transport','Welcome drink','Gourmet lunch (5 options: paella, seafood pasta, fish, chicken, or vegetarian)','Sun lounger (2nd row, based on arrival order)','Live DJ','Jacuzzi-style pool access','Fragatas Island boat tour','Guided snorkeling session','Oceanarium boat transfer (entrance not included)','Wellness session (Yoga, Conscious Breathing, or Sound Healing)','Games (cornhole, air hockey, foosball)','Beach coordinator'],
    excluded: ['Natural reserve fee (8,800 COP/person)','Port tax (31,500 COP/person)','Towels','First-row sun loungers (extra fee)','Oceanarium entrance fee','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'📍', title:'Meet at Muelle de la Bodeguita Gate 3', desc:'Arrive by 7:30 AM — speedboat departs at 8:20 AM sharp.' },
      { step:'02', emoji:'🧘', title:'Wellness session at 10:00 AM',          desc:'Yoga, conscious breathing, or sound healing — your choice.' },
      { step:'03', emoji:'🤿', title:'Guided snorkeling at 11:00 AM',         desc:'Clear Rosario Islands water with a marine guide.' },
      { step:'04', emoji:'⛵', title:'Fragatas Island boat tour at 12:00 PM', desc:'Short island tour with nesting bird colonies.' },
      { step:'05', emoji:'🍽', title:'Gourmet lunch at 1:00 PM',              desc:'Paella, seafood pasta, fish, chicken, or vegetarian.' },
      { step:'06', emoji:'🚤', title:'Departure at 3:00 PM',                  desc:'Back at the Cartagena dock by 4:00 PM.' },
    ],
    perfectFor: ['Active travellers', 'Wellness seekers', 'Couples', 'Groups of friends'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  //  ISLA PAUE
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 6,
    name: 'Isla Paue Beach Club',
    emoji: '🌴',
    badge: 'popular',
    vibe: '🏝 Chill',
    vibeKey: 'chill',
    vibeLabels: ['🏝 Chill', '🚣 Active', '👨‍👩‍👧 Family Friendly'],
    subtitle: 'Private and calm Rosario Islands beach club — kayak, paddleboard, happy hour, and 7 lunch options all included.',
    tagline: 'The quietest, most exclusive private beach in the archipelago — no party crowds, just paradise.',
    priceCOP: 430000,
    perUnit: 'person',
    img: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/9c/fa/24/we-love-to-share-you.jpg?w=1400&h=-1&s=1',
    imgs: [
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/9c/fa/24/we-love-to-share-you.jpg?w=1400&h=-1&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/83/c1/06/the-pa-ue-experience.jpg?w=1400&h=-1&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/83/c0/e7/caribbean-flavors-we.jpg?w=1400&h=-1&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/d4/b0/c0/caption.jpg?w=1400&h=-1&s=1',
    ],
    f1Icon: 'kayaking',  f1: 'Kayak + Paddleboard',
    f2Icon: 'local_bar', f2: 'Happy Hour (11am–12pm)',
    includesNote: 'Includes sport boat + lunch + kayak + paddleboard + happy hour',
    sellsOut: true, limitedCapacity: true,
    duration: '8 Hours',
    stats: [
      { icon: 'kayaking',        label: 'Kayak + SUP' },
      { icon: 'restaurant',      label: 'Lunch Incl.' },
      { icon: 'directions_boat', label: 'Boat Incl.' },
    ],
    specs: [
      { icon: 'kayaking',        label: 'Kayak Use Included' },
      { icon: 'surfing',         label: 'Paddleboard Included' },
      { icon: 'local_bar',       label: 'Happy Hour (11am–12pm)' },
      { icon: 'directions_boat', label: 'Sport Boat Transport' },
    ],
    description: 'Paue is the quiet counter-argument to every party beach club. Private, calm, and entirely intentional — this Rosario Islands club is built for people who want the Caribbean without the crowd. A sport boat brings you straight from Cartagena (arrive by 7:15 AM), welcome champagne greets you on arrival, and a 2-for-1 Happy Hour runs from 11am to noon. Kayaking and paddleboarding are included for everyone (one use each). The lunch menu offers seven choices — fish dishes, grilled chicken, pasta, vegetable rice, shrimp rice, or chicken nuggets. The optional panoramic Rosario Islands tour runs at 11:30am. Family-friendly with separate adult and family areas.',
    whyLove: [
      { icon: 'kayaking',    text: 'Kayak + paddleboard use both included — one per guest' },
      { icon: 'local_bar',   text: 'Happy Hour 2-for-1 drinks from 11:00 AM to 12:00 PM' },
      { icon: 'beach_access', text: 'Calm, private, no-crowd atmosphere — exclusive island paradise' },
    ],
    clubAreas: ['Adult Beach Area', 'Family Beach Area', 'Water Sports Zone', 'Restaurant Terrace'],
    included: ['Round-trip sport boat transport','Water on board during transit','Welcome champagne (lemonade for children)','Panoramic Rosario Islands tour (optional, 11:30 AM)','Use of facilities (sun loungers, beach beds, hammocks, bathrooms)','Lunch (7 menu options with non-alcoholic drink)','Paddleboard use (1 per guest)','Kayak use (1 per guest)','Happy Hour 2-for-1 drinks (11:00 AM–12:00 PM)'],
    excluded: ['Natural reserve fee (8,800 COP/person)','Port tax (31,500 COP/person)','Towels','Snorkeling equipment','Optional paid activities','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'📍', title:'Arrive at Muelle de la Bodeguita Gate 4', desc:'Arrive by 7:15 AM — sport boat departs at 8:00 AM.' },
      { step:'02', emoji:'🚤', title:'Sport boat to Paue Beach Club',           desc:'~60 minutes through the beautiful Rosario archipelago.' },
      { step:'03', emoji:'🥂', title:'Welcome champagne at 9:15 AM',            desc:'Champagne for adults, lemonade for the little ones.' },
      { step:'04', emoji:'🚣', title:'Happy Hour + kayak & paddleboard',        desc:'2-for-1 drinks 11am–12pm, water equipment yours to use.' },
      { step:'05', emoji:'🍽', title:'Lunch served at 12:00 PM',               desc:'7 menu options — fish, chicken, pasta, or rice dishes.' },
      { step:'06', emoji:'🚤', title:'Departure at 3:00 PM',                    desc:'Back at the Cartagena dock by approximately 3:50 PM.' },
    ],
    perfectFor: ['Families', 'Couples', 'Relaxation seekers', 'Active travellers'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  //  ISLA DEL ENCANTO
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 7,
    name: 'Isla del Encanto – Gold Plan',
    emoji: '🌊',
    badge: 'exclusive',
    vibe: '🏝 Chill',
    vibeKey: 'chill',
    vibeLabels: ['🏝 Chill', '🍾 Open Bar', '🏊 Two Pools'],
    subtitle: 'The most all-inclusive beach club package in Cartagena — open bar, à la carte 3-course lunch, jacuzzi, kayak, beachfront bed, and two pools.',
    tagline: 'Nothing left to buy, nothing left to want — Isla del Encanto at its most complete.',
    priceCOP: 600000,
    perUnit: 'person',
    img: 'https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/245233896.jpg?k=98d7c13740fde25a447ad8c9cee0fec04080dcf8de9473f7b28dd5e9c7153406&o=&s=1024x',
    imgs: [
      'https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/245233896.jpg?k=98d7c13740fde25a447ad8c9cee0fec04080dcf8de9473f7b28dd5e9c7153406&o=&s=1024x',
      'https://image-tc.galaxy.tf/wijpeg-1kjj4hbb6138ce4978kwprgh1/otras-opc-4-opt.jpg?width=1200',
      'https://image-tc.galaxy.tf/wijpeg-36qbmq1cp7u1fzwed8qc04vst/15-buffet-opt.jpg?width=1200',
      'https://image-tc.galaxy.tf/wijpeg-dfxnx7610e755fvuu73n0i905/airview.jpg?width=1200',
    ],
    f1Icon: 'local_bar',  f1: '3-Hour Open Bar',
    f2Icon: 'restaurant', f2: 'À La Carte 3-Course Lunch',
    includesNote: 'Includes boat + 3hr open bar + 3-course lunch + jacuzzi + kayak + towels',
    sellsOut: true, limitedCapacity: true,
    duration: '7 Hours',
    stats: [
      { icon: 'local_bar',       label: 'Open Bar 3hr' },
      { icon: 'restaurant',      label: 'À La Carte' },
      { icon: 'directions_boat', label: 'Boat Incl.' },
    ],
    specs: [
      { icon: 'local_bar',       label: '3-Hour Open Bar' },
      { icon: 'restaurant',      label: 'À La Carte 3-Course Lunch' },
      { icon: 'pool',            label: 'Two Pools + Jacuzzi' },
      { icon: 'directions_boat', label: 'Speedboat or Bus Transport' },
    ],
    description: 'The Gold Plan is Isla del Encanto at its most complete — and the most all-inclusive beach club package Cartagena has to offer. Set inside the Rosario Islands National Park, you arrive by speedboat with a welcome champagne glass in hand and take your spot on a large reserved beachfront bed. Two pools — Delfines and Daytour — are yours all day. From noon to 3pm, the open bar flows: water, soda, beer, rum, aguardiente, wine, and cocktails. À la carte lunch is a full three-course affair: starter, main dish, and dessert, with wine and coffee included. One hour in the Jacuzzi, one hour with a kayak, and towels for five hours complete the picture. A reserved restaurant table with your name on it.',
    whyLove: [
      { icon: 'local_bar',   text: '3-hour open bar (12pm–3pm) — beer, rum, wine, cocktails & spirits' },
      { icon: 'restaurant',  text: 'Full à la carte 3-course lunch with wine and coffee — proper sit-down service' },
      { icon: 'pool',        text: 'Two pools + Jacuzzi + kayak + towels + large reserved beachfront bed' },
    ],
    clubAreas: ['Delfines Pool', 'Daytour Pool', 'Jacuzzi Terrace', 'Beachfront Restaurant'],
    included: ['Hotel transfer to dock (tourist zones)','Round-trip speedboat or bus transport','Welcome champagne (adults) or juice (children)','À la carte lunch (starter, main dish, dessert, non-alcoholic drink, glass of wine, coffee/tea)','3-hour open bar (12pm–3pm — water, soda, beer, rum, aguardiente, wine, cocktails)','Towels (5-hour use)','Large reserved beachfront bed','Delfines Pool + Daytour Pool access','Reserved beachfront restaurant table','1 hour Jacuzzi access','1 hour kayak use'],
    excluded: ['Port tax (31,500 COP/person — if speedboat transfer applies)','Optional excursions (snorkeling, diving, aquarium)','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'📍', title:'Hotel pickup or meet at Gate 3 — 8:00 AM', desc:'Hotel transfers included from tourist zones.' },
      { step:'02', emoji:'🚤', title:'Speedboat to Isla del Encanto',             desc:'~60 minutes into the Rosario Islands National Park.' },
      { step:'03', emoji:'🥂', title:'Welcome champagne & beachfront bed',        desc:'Your reserved bed and welcome glass are waiting on arrival.' },
      { step:'04', emoji:'🍾', title:'Open bar from 12:00 PM – 3:00 PM',          desc:'Beer, rum, wine, cocktails, aguardiente — all included.' },
      { step:'05', emoji:'🍽', title:'À la carte lunch at 1:00 PM',              desc:'3 courses with wine and coffee — full sit-down service.' },
      { step:'06', emoji:'🚤', title:'Departure at 3:00 PM',                      desc:'Back at the Cartagena dock by approximately 4:00 PM.' },
    ],
    perfectFor: ['Special occasions', 'Luxury groups', 'Couples', 'VIP travellers'],
  },

  {
    id: 8,
    name: 'Isla del Encanto – Premium Plan',
    emoji: '🌴',
    badge: 'popular',
    vibe: '🏝 Chill',
    vibeKey: 'chill',
    vibeLabels: ['🏝 Chill', '🌊 National Park', '🍽 Buffet Lunch'],
    subtitle: 'Smart-value day at Isla del Encanto — speedboat from your hotel, buffet lunch, sun loungers, and pool inside the Rosario Islands National Park.',
    tagline: 'The smartest entry point to Isla del Encanto — all the essentials, inside a national park.',
    priceCOP: 360000,
    perUnit: 'person',
    img: 'https://image-tc.galaxy.tf/wijpeg-1kjj4hbb6138ce4978kwprgh1/otras-opc-4-opt.jpg?width=1200',
    imgs: [
      'https://image-tc.galaxy.tf/wijpeg-1kjj4hbb6138ce4978kwprgh1/otras-opc-4-opt.jpg?width=1200',
      'https://image-tc.galaxy.tf/wijpeg-36qbmq1cp7u1fzwed8qc04vst/15-buffet-opt.jpg?width=1200',
      'https://image-tc.galaxy.tf/wijpeg-dfxnx7610e755fvuu73n0i905/airview.jpg?width=1200',
      'https://image-tc.galaxy.tf/wijpeg-mfs3hxlt16remg6yooo55hzx/22-exp-gold-opt.jpg?width=360&height=300',
    ],
    f1Icon: 'restaurant', f1: 'Buffet Lunch',
    f2Icon: 'pool',       f2: 'Pool Access',
    includesNote: 'Includes speedboat + hotel transfer + buffet lunch + pool + loungers',
    sellsOut: false, limitedCapacity: false,
    duration: '7 Hours',
    stats: [
      { icon: 'restaurant',      label: 'Buffet Lunch' },
      { icon: 'pool',            label: 'Pool Incl.' },
      { icon: 'directions_boat', label: 'Boat Incl.' },
    ],
    specs: [
      { icon: 'restaurant',      label: 'Buffet Lunch Included' },
      { icon: 'pool',            label: 'Daytour Pool Access' },
      { icon: 'beach_access',    label: 'Sun Loungers & Parasols' },
      { icon: 'directions_boat', label: 'Speedboat + Hotel Transfer' },
    ],
    description: 'The Premium Plan is the smart way into Isla del Encanto inside the Rosario Islands National Park. Hotel pickup from Cartagena\'s tourist zones, a speedboat across to one of Colombia\'s most beautiful protected beach destinations, and a full day of sun, sand, and calm Caribbean water. Buffet lunch at 1pm — main dish choices, fresh fruit, dessert, and a non-alcoholic drink. Sun loungers and parasols set up and waiting. The Daytour Pool is yours throughout the day. Optional activities — snorkeling, diving, kayaking, paddleboarding — are all available to book on the day at extra cost. Want the full experience? Upgrade to the Gold Plan for the open bar and à la carte treatment.',
    whyLove: [
      { icon: 'eco',         text: 'Inside the Rosario Islands National Park — pristine protected waters' },
      { icon: 'restaurant',  text: 'Buffet lunch with fresh fruit, dessert & non-alcoholic drink included' },
      { icon: 'pool',        text: 'Daytour Pool, sun loungers & parasols all ready when you arrive' },
    ],
    clubAreas: ['Daytour Pool', 'Sun Lounger Beach', 'Buffet Restaurant', 'Optional Activity Zone'],
    included: ['Hotel transfer to dock (tourist zones)','Round-trip speedboat transport','Buffet lunch (main dish choices, fresh fruit, dessert, non-alcoholic drink)','Sun loungers & parasols','Daytour Pool access'],
    excluded: ['Natural reserve fee (8,800 COP/person)','Port tax (31,500 COP/person)','Towels (bring your own)','Return transfer from dock to hotel','Optional activities (snorkeling, diving, kayaking, paddleboarding — extra cost)','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'📍', title:'Hotel pickup or meet at Gate 3 — 8:00 AM', desc:'Hotel transfers included from tourist zones in Cartagena.' },
      { step:'02', emoji:'🚤', title:'Speedboat to Isla del Encanto',             desc:'~60 minutes through the Rosario Islands National Park.' },
      { step:'03', emoji:'🏊', title:'Pool, beach & relaxation all morning',      desc:'Loungers set up, Daytour Pool open — settle in at your pace.' },
      { step:'04', emoji:'🍽', title:'Buffet lunch at 1:00 PM',                  desc:'Main dish, fresh fruit, dessert, and a non-alcoholic drink.' },
      { step:'05', emoji:'🤿', title:'Optional afternoon activities',             desc:'Snorkeling, kayaking, diving — book on the day at extra cost.' },
      { step:'06', emoji:'🚤', title:'Departure at 3:00 PM',                      desc:'Speedboat back to Cartagena, arriving around 4:00 PM.' },
    ],
    perfectFor: ['First-time visitors', 'Families', 'Value seekers', 'Beach relaxation'],
  },

];
