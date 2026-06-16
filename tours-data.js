// ═══════════════════════════════════════════════════════════════════════════
//  tours-data.js — Single source of truth for all tour data
//  Base prices stored in COP (Colombian Pesos).
//  fmt(cop) converts to the currently selected display currency.
//  To add a tour: copy any existing object, increment the id, fill in fields.
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
  bestseller: { bg:'bg-[#FF7A00]',  text:'text-white', label:'🔥 Best Seller'  },
  limited:    { bg:'bg-[#FF4E50]',  text:'text-white', label:'⚡ Limited'       },
  popular:    { bg:'bg-[#FF7A00]',  text:'text-white', label:'Popular'          },
  historical: { bg:'bg-[#0077B6]',  text:'text-white', label:'Historical'       },
  exclusive:  { bg:'bg-[#00A8A8]',  text:'text-white', label:'Exclusive'        },
  cultural:   { bg:'bg-[#0077B6]',  text:'text-white', label:'Cultural'         },
  gourmet:    { bg:'bg-[#FF7A00]',  text:'text-white', label:'Gourmet'          },
  eco:        { bg:'bg-[#4CAF50]',  text:'text-white', label:'🌿 Eco'            },
};

// ── BADGE CONFIG (detail style — inline hex for sidebar) ──────────────────────
const badgeCfgDetail = {
  bestseller: { bg:'#FF7A00', color:'#ffffff', label:'🔥 Best Seller'  },
  limited:    { bg:'#FF4E50', color:'#ffffff', label:'⚡ Limited'       },
  popular:    { bg:'#FF7A00', color:'#ffffff', label:'Popular'          },
  historical: { bg:'#0077B6', color:'#ffffff', label:'Historical'       },
  exclusive:  { bg:'#00A8A8', color:'#ffffff', label:'Exclusive'        },
  cultural:   { bg:'#0077B6', color:'#ffffff', label:'Cultural'         },
  gourmet:    { bg:'#FF7A00', color:'#ffffff', label:'Gourmet'          },
  eco:        { bg:'#4CAF50', color:'#ffffff', label:'🌿 Eco'            },
};

// ═══════════════════════════════════════════════════════════════════════════
//  TOUR DATA
//  priceCOP  → base price in Colombian Pesos (adult rate)
//  category  → 'island' | 'land' | 'eco'
//  perUnit   → 'person' | 'group'
//  badge     → see badgeCfg keys above
// ═══════════════════════════════════════════════════════════════════════════
const TOURS_DATA = [

  // ══════════════════════════════════════════════════════════════════════════
  //  ISLAND TOURS (ids 10–17)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 10,
    name: 'Basic Cholón Island Tour',
    subtitle: 'The legendary Caribbean party island — lunch, two beers, and good vibes included.',
    desc: 'Visit the famous Isla Cholón on a shared Rosario Islands boat tour with a full Caribbean lunch and two complimentary beers.',
    img: 'https://cdn.getyourguide.com/image/format=auto,fit=contain,gravity=auto,quality=60,width=1440,height=650,dpr=2/tour_img/b3a0faa537414b7fb696865f0b4ba2a8d329dadd8bbdd3786b882a0647056c87.jpeg',
    imgs: [
      'https://cdn.getyourguide.com/image/format=auto,fit=contain,gravity=auto,quality=60,width=1440,height=650,dpr=2/tour_img/b3a0faa537414b7fb696865f0b4ba2a8d329dadd8bbdd3786b882a0647056c87.jpeg',
      'https://cdn.getyourguide.com/image/format=auto,fit=contain,gravity=auto,quality=60,width=1440,height=650,dpr=2/tour_img/216b5d78daae37dbb8994a61c26fcf3c5d22ce4db744551633abc7d369a8abb6.png',
      'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1920,dpr=1/tour_img/0f1f8c6fdfec2a02304ae8a979ae8c8f49e71848ff9574e0261ef54c3d5b936d.jpeg',
      'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1920,dpr=1/tour_img/e3571efce6b8059e.jpeg',
    ],
    duration: '10 Hours', groupInfo: 'Shared Group', feature: 'Lunch Incl.',
    featureIcon: 'restaurant', groupIcon: 'groups',
    priceCOP: 175000, badge: 'popular', category: 'island', perUnit: 'person',
    limitedSpots: false,
    description: 'Jump on an air-conditioned bus to Barú, board a shared boat for a panoramic tour of the Rosario Islands, and arrive at the legendary Isla Cholón. Known for its infectious Caribbean energy — boats anchored side by side, music pumping, vendors circling with cold drinks — Cholón is unlike any other beach experience. Two complimentary beers and a full Caribbean lunch are included, and you\'ll have from 11am to 3pm to swim, dance, and soak it all in.',
    whyLove: [
      { icon: 'music_note', text: 'The Caribbean\'s most iconic party island atmosphere' },
      { icon: 'restaurant', text: 'Full lunch: fish or chicken with rice & patacones' },
      { icon: 'local_bar',  text: '2 complimentary beers included for adults' },
    ],
    included: ['Round-trip AC bus to Barú','Shared panoramic Rosario Islands boat tour','Isla Cholón visit','2 complimentary beers (adults)','Typical Caribbean lunch (fish or chicken)','Coconut/white rice, green salad & patacones','Tour coordinator'],
    excluded: ['Towels','Natural reserve entry fee (8,800 COP/person)','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'🚌', title:'Hotel pickup & AC bus to Barú',   desc:'Bus departs 8:30 AM from central Cartagena.' },
      { step:'02', emoji:'⛵', title:'Rosario Islands panoramic tour',  desc:'Scenic shared boat ride through the archipelago.' },
      { step:'03', emoji:'🏝', title:'Arrive at Isla Cholón',           desc:'Music, boats, energy — the party starts.' },
      { step:'04', emoji:'🍺', title:'Complimentary beers at noon',     desc:'Two cold beers per adult guest.' },
      { step:'05', emoji:'🍽', title:'Caribbean lunch served',          desc:'Fried fish or grilled chicken with rice & patacones.' },
      { step:'06', emoji:'🚤', title:'Depart 3 PM — back by 5:30 PM',  desc:'Return boat then AC bus back to Cartagena.' },
    ],
    audience: ['Groups of friends','Couples','Solo travelers','First-time visitors'],
  },

  {
    id: 11,
    name: 'VIP 4 Islands Tour',
    subtitle: 'Luxury sport boat, aquarium, Escobar\'s plane, Cholón, and Playa Tranquila lunch — all in one day.',
    desc: 'A premium multi-stop island day on a luxury sport boat: Aquarium (entrance included), snorkeling at Pablo Escobar\'s plane, Cholón, and lunch at Playa Tranquila.',
    img: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/6903e9ebc3f8ca5edca0e63d.jpeg',
    imgs: [
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/6903e9ebc3f8ca5edca0e63d.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/6903e9eb521c84662402a490.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/6903e9ebf2b1f90163167064.jpeg',
    ],
    duration: '9 Hours', groupInfo: 'Bilingual Guide', feature: 'Aquarium Incl.',
    featureIcon: 'water', groupIcon: 'groups',
    priceCOP: 280000, badge: 'exclusive', category: 'island', perUnit: 'person',
    limitedSpots: true,
    description: 'Four iconic stops, one luxury sport boat, and a bilingual coordinator by your side all day. You\'ll glide past the colonial Bocachica Fort, visit the Rosario Islands Aquarium (entrance included), snorkel above Pablo Escobar\'s famous submerged plane, experience Isla Cholón, and end the day with lunch at Playa Tranquila — the calmest, most beautiful beach on Barú Island. Medical insurance included.',
    whyLove: [
      { icon: 'directions_boat', text: 'Luxury sport boat throughout — no crowded shared buses' },
      { icon: 'scuba_diving',    text: 'Snorkeling at Pablo Escobar\'s submerged plane' },
      { icon: 'water',           text: 'Aquarium entrance included — dolphins & sea turtles' },
    ],
    included: ['Hotel transfer to dock','Luxury sport boat (round-trip)','Bocachica Fort panoramic view','Aquarium visit (entrance included)','Snorkeling at Pablo Escobar\'s plane','Isla Cocoloco private island visit','Isla Cholón visit','Playa Tranquila beach time + lunch','Bilingual coordinator','Medical insurance'],
    excluded: ['Return hotel transfer','Towels','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'⚓', title:'Board luxury sport boat',             desc:'Hotel pickup 7 AM, boat departs 8 AM.' },
      { step:'02', emoji:'🏰', title:'Bocachica Fort panoramic view',       desc:'Historic colonial fort that guarded Cartagena\'s bay.' },
      { step:'03', emoji:'🐬', title:'Aquarium visit (entrance included)',  desc:'Dolphins, sea turtles, fish, and marine life.' },
      { step:'04', emoji:'✈️', title:'Snorkel Pablo Escobar\'s plane',     desc:'Historic aircraft wreck now part of the reef ecosystem.' },
      { step:'05', emoji:'🎉', title:'Isla Cholón party stop',              desc:'Music, boats, and Caribbean energy.' },
      { step:'06', emoji:'🏖', title:'Playa Tranquila — lunch & relax',    desc:'Calm private beach, fish, chicken, or vegetarian lunch.' },
    ],
    audience: ['Couples','Groups of friends','Families','First-time visitors'],
  },

  {
    id: 12,
    name: 'Playa Tranquila Beach Day',
    subtitle: 'The quietest, most beautiful beach near Cartagena — beach club, welcome drink, and lunch.',
    desc: 'Escape to Playa Tranquila on Barú Island — a calm conservation beach with white sand, beach club setup, welcome drink, and a full lunch included.',
    img: 'images/bento-beach-clubs.webp',
    imgs: [
      'images/bento-beach-clubs.webp',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/b3/a6/e2/caption.jpg?w=1400&h=-1&s=1',
      'images/bento-groups.jpg',
      'images/bento-boats.jpg',
    ],
    duration: '10 Hours', groupInfo: 'Small Group', feature: 'Beach Club',
    featureIcon: 'beach_access', groupIcon: 'groups',
    priceCOP: 110000, badge: 'popular', category: 'island', perUnit: 'person',
    limitedSpots: false,
    description: 'Playa Tranquila lives up to its name. A serene, conservation-protected beach on Barú Island that stays far less crowded than its neighbours. Bus to Barú, a short boat ride, a welcome drink on arrival, hours of swimming and sunbathing on a true Caribbean beach, and a full Colombian lunch with your choice of fish or grilled pork. Beach chairs, umbrellas, and sun loungers are set up and waiting for you.',
    whyLove: [
      { icon: 'beach_access', text: 'Conservation beach — calm, clean, and uncrowded' },
      { icon: 'chair',        text: 'Full beach club: chairs, umbrellas & loungers' },
      { icon: 'restaurant',   text: 'Welcome drink + full Colombian lunch included' },
    ],
    included: ['Hotel pickup & return','Round-trip AC bus to Barú','Boat transfer to Playa Tranquila','Welcome drink on arrival','Lunch (2 options + typical drink)','Beach club facilities (chairs, umbrellas, restrooms)','Tour coordinator'],
    excluded: ['Towels','Natural reserve entry fee (8,800 COP/person)','Outside food & drinks'],
    itinerary: [
      { step:'01', emoji:'🚌', title:'Hotel pickup & AC bus to Barú',    desc:'Bus departs 8:30 AM.' },
      { step:'02', emoji:'🚤', title:'Boat transfer to Playa Tranquila', desc:'Short scenic ride to the beach.' },
      { step:'03', emoji:'🍹', title:'Welcome drink on arrival',         desc:'Settle in with a refreshing welcome drink.' },
      { step:'04', emoji:'🏖', title:'Beach time — morning until 3 PM',  desc:'Swim, sunbathe, and relax in calm turquoise water.' },
      { step:'05', emoji:'🍽', title:'Full Colombian lunch at 1 PM',     desc:'Fried fish or grilled pork with rice, salad & patacones.' },
      { step:'06', emoji:'⛵', title:'Depart 3 PM — back by 5:30 PM',   desc:'Boat and bus return to Cartagena.' },
    ],
    audience: ['Couples','Families','Solo travelers','First-time visitors'],
  },

  {
    id: 14,
    name: 'Basic 5 Destinations Tour',
    subtitle: 'Five legendary stops in one day — fort, Escobar\'s plane, snorkeling, Cholón, and a beach club lunch.',
    desc: 'A sport boat day covering San Fernando Fort, Pablo Escobar\'s submerged plane, snorkeling in Rosario Islands, Isla Cholón, and a beach club lunch.',
    img: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/69013d4cff3e4494eae32692.jpeg',
    imgs: [
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/69013d4cff3e4494eae32692.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/69068471e98d665678ce69cc.webp',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/6903e9eb1e31ecd3b03659b1.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/69068e396947d8d0f2f205c3.jpeg',
    ],
    duration: '9.5 Hours', groupInfo: 'Sport Boat', feature: 'Sport Boat',
    featureIcon: 'directions_boat', groupIcon: 'groups',
    priceCOP: 240000, badge: 'popular', category: 'island', perUnit: 'person',
    limitedSpots: false,
    description: 'Five destinations, one sport boat, and a full day on the Caribbean. You glide past the historic San Fernando Fort, spot Pablo Escobar\'s infamous submerged plane from the water, snorkel in the Rosario Islands national park, experience the electric energy of Isla Cholón, and cap it all off with a multi-choice lunch at the Mirador de Barú Beach Club. Medical insurance included.',
    whyLove: [
      { icon: 'directions_boat', text: 'Sport boat all day — faster and more exciting than buses' },
      { icon: 'history_edu',     text: 'See Pablo Escobar\'s submerged plane from the water' },
      { icon: 'scuba_diving',    text: 'Snorkeling inside a UNESCO-protected national park' },
    ],
    included: ['Hotel pickup to dock','Round-trip sport boat','San Fernando Fort panoramic view','Pablo Escobar plane viewing','Snorkeling activity','Isla Cholón visit + shrimp cocktail','Isla Kokomo visit','Mirador de Barú Beach Club + lunch','Tour coordinator','Medical insurance'],
    excluded: ['Return hotel transfer','Towels','Aquarium entrance (40,000 COP — optional)','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'⚓', title:'Board sport boat at 8 AM',          desc:'Hotel pickup from 7 AM.' },
      { step:'02', emoji:'🏰', title:'San Fernando Fort — panoramic view', desc:'Colonial fort that defended Cartagena from naval attack.' },
      { step:'03', emoji:'✈️', title:'Pablo Escobar\'s submerged plane', desc:'Famous plane wreck visible just below the surface.' },
      { step:'04', emoji:'🤿', title:'Snorkeling in Rosario Islands',     desc:'Coral gardens, tropical fish, and clear water.' },
      { step:'05', emoji:'🎉', title:'Isla Cholón + Isla Kokomo',          desc:'Party energy at Cholón, then a calmer stop at Kokomo.' },
      { step:'06', emoji:'🍽', title:'Mirador de Barú Beach Club lunch',  desc:'Fish, chicken, pork, or vegetarian at the beach club.' },
    ],
    audience: ['Groups of friends','Couples','Families','First-time visitors'],
  },

  {
    id: 15,
    name: 'Top 3 Islands Tour',
    subtitle: 'Three exclusive private islands — Bora Bora, Pao Pao & Isla Bela — a welcome cocktail at each.',
    desc: 'An adults-only tour visiting three exclusive Rosario Islands — Bora Bora, Pao Pao, and Isla Bela — with reserved space, a welcome cocktail at each stop, and lunch.',
    img: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/12/58/44/82.jpg',
    imgs: [
      'https://media.tacdn.com/media/attractions-splice-spp-674x446/12/58/44/82.jpg',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/4a/0c/ec/caption.jpg?w=1100&h=-1&s=1',
      'https://boraboracartagena.com/img/cms/2024/Mesa-de-trabajo-1-copia-4@2x_1.jpg',
      'https://boraboracartagena.com/img/cms/update23jun/carrusel4-pasadia.jpg',
    ],
    duration: '8.5 Hours', groupInfo: 'Adults Only', feature: 'Cocktail Each Stop',
    featureIcon: 'local_bar', groupIcon: 'groups',
    priceCOP: 440000, badge: 'exclusive', category: 'island', perUnit: 'person',
    limitedSpots: true,
    description: 'Three of the most stunning private islands in the Rosario archipelago — and a reserved space at each one just for your group. Bora Bora is the Caribbean\'s most iconic party island. Pao Pao offers mangrove channels and raw natural beauty. Isla Bela is serene, calm, and where your lunch is served with your feet in the sand. A welcome cocktail at every stop, a bilingual guide throughout, and a fast speedboat between islands. No children. Just the good stuff.',
    whyLove: [
      { icon: 'local_bar',    text: 'Welcome cocktail at every island — included' },
      { icon: 'beach_access', text: 'Exclusive reserved space at Bora Bora, Pao Pao & Bela' },
      { icon: 'sailing',      text: 'Fast speedboat — no buses, no crowds' },
    ],
    included: ['Fast speedboat (round-trip)','Panoramic Rosario Islands tour','Refreshments on boat','Isla Bora Bora visit + welcome cocktail','Isla Pao Pao visit + welcome cocktail (nature & mangroves)','Isla Bela visit + welcome cocktail','Lunch at Isla Bela (fish, chicken, or vegetarian)','Exclusive reserved space on each island','Bilingual guide'],
    excluded: ['Towels','Natural reserve fee (8,800 COP/person)','Port tax (31,500 COP/person)','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'⚓', title:'Meet at Muelle de la Bodeguita',  desc:'Arrive by 7:30 AM — boat departs 8:30 AM sharp. No late arrivals.' },
      { step:'02', emoji:'🎉', title:'Isla Bora Bora',                  desc:'The iconic Caribbean party island — cocktail, music, swimming.' },
      { step:'03', emoji:'🌿', title:'Isla Pao Pao',                    desc:'Mangroves, wildlife, and unspoiled natural scenery.' },
      { step:'04', emoji:'🏝', title:'Isla Bela — lunch & relaxation',  desc:'Fish, chicken, or vegetarian — calm white sand beach.' },
      { step:'05', emoji:'🚤', title:'Return to Cartagena',             desc:'Back at port by 4:00 PM.' },
    ],
    audience: ['Couples','Groups of friends','Bachelor/Bachelorette','VIP groups'],
  },

  {
    id: 16,
    name: '5 Destinations + Bioluminescent Plankton',
    subtitle: 'Sport boat, five islands, a beach club lunch, and a once-in-a-lifetime night swim through glowing water.',
    desc: 'The most complete island tour — sport boat to five destinations including Cholón, beach club lunch, sunset, and a bioluminescent plankton swim after dark.',
    img: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/11/dc/ef/77.jpg',
    imgs: [
      'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/11/dc/ef/77.jpg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/69013d4cff3e4494eae32692.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/69068471e98d665678ce69cc.webp',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/6903e9eb1e31ecd3b03659b1.jpeg',
    ],
    duration: '13.5 Hours', groupInfo: 'Sport Boat', feature: 'Plankton Swim',
    featureIcon: 'nightlight', groupIcon: 'groups',
    priceCOP: 270000, badge: 'bestseller', category: 'island', perUnit: 'person',
    limitedSpots: true,
    description: 'Cartagena\'s most complete island experience. You start with a panoramic fort view, snorkel above Pablo Escobar\'s plane, explore the Rosario Islands, party at Cholón (shrimp cocktail included), relax at Kokomo, and have lunch at Mirador de Barú Beach Club. Then — as the sky darkens — you board a boat to a hidden lagoon and slip into water that glows blue. Bioluminescent plankton: millions of tiny organisms that light up when disturbed. One of those things you have to see to believe.',
    whyLove: [
      { icon: 'nightlight',      text: 'Bioluminescent plankton swim after dark — pure magic' },
      { icon: 'directions_boat', text: 'Sport boat all day — fast, thrilling, premium' },
      { icon: 'restaurant',      text: 'Shrimp cocktail at Cholón + full beach club lunch' },
    ],
    included: ['Hotel pickup to dock','Sport boat (day & night)','San Fernando Fort panoramic view','Pablo Escobar plane viewing','Snorkeling in Rosario Islands','Isla Cholón visit + shrimp cocktail','Isla Kokomo visit','Mirador de Barú Beach Club + lunch','Snack/refreshment','Night boat transfer','Bioluminescent plankton swim','Return bus to Cartagena','Tour coordinator','Medical insurance'],
    excluded: ['Towels','Aquarium entrance (40,000 COP — optional)','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'⚓', title:'Board sport boat at 8 AM',          desc:'Hotel pickup from 7 AM, depart for Rosario Islands.' },
      { step:'02', emoji:'🏰', title:'Fort view + Escobar\'s plane',      desc:'History from the water — two iconic sights in one pass.' },
      { step:'03', emoji:'🤿', title:'Snorkeling in national park',       desc:'Clear water, coral, and tropical marine life.' },
      { step:'04', emoji:'🎉', title:'Cholón + shrimp cocktail + Kokomo', desc:'Party vibes, then chill vibes — best of both worlds.' },
      { step:'05', emoji:'🍽', title:'Beach club lunch & sunset',         desc:'Mirador de Barú — watch the sky turn gold over the water.' },
      { step:'06', emoji:'✨', title:'Bioluminescent plankton swim',      desc:'Night boat to glowing lagoon — electric blue, unforgettable.' },
    ],
    audience: ['Adventure seekers','Couples','Nature lovers','Groups of friends'],
  },

  {
    id: 17,
    name: 'VIP 5 Destinations Tour',
    subtitle: 'The premium version — five islands, a dedicated coordinator, plankton swim, and VIP beach club.',
    desc: 'Five island destinations on a sport boat with a dedicated VIP coordinator, shrimp cocktail, full beach club lunch, and a bioluminescent plankton swim to end the night.',
    img: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/69013d4cff3e4494eae32692.jpeg',
    imgs: [
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/69013d4cff3e4494eae32692.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/69068471e98d665678ce69cc.webp',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/6903e9eb1e31ecd3b03659b1.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/69068e396947d8d0f2f205c3.jpeg',
    ],
    duration: '13.5 Hours', groupInfo: 'VIP Coordinator', feature: 'VIP Service',
    featureIcon: 'star', groupIcon: 'groups',
    priceCOP: 270000, badge: 'exclusive', category: 'island', perUnit: 'person',
    limitedSpots: true,
    description: 'Everything in the 5 Destinations tour, elevated. Your VIP coordinator is with you all day — managing every transition, handling logistics, and making sure your group has everything it needs. The same incredible stops (fort, plane, snorkeling, Cholón, Kokomo, beach club lunch), the same magical plankton swim at the end, with an extra layer of personal service and medical assistance insurance throughout.',
    whyLove: [
      { icon: 'star',        text: 'Dedicated VIP coordinator from pickup to drop-off' },
      { icon: 'nightlight',  text: 'Bioluminescent plankton swim — the night finale' },
      { icon: 'sailing',     text: 'Sport boat access to all five destinations' },
    ],
    included: ['Hotel pickup to dock','Sport boat (day & night)','San Fernando Fort panoramic view','Pablo Escobar plane viewing','Snorkeling','Isla Cholón visit + shrimp cocktail','Isla Kokomo visit','Mirador de Barú Beach Club + lunch','Snack/refreshment','Night boat & plankton swim','Return bus to Cartagena','Dedicated VIP coordinator','Medical insurance'],
    excluded: ['Towels','Aquarium entrance (40,000 COP — optional)','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'⚓', title:'VIP board & coordinator briefing',    desc:'Your coordinator meets you at pickup and stays all day.' },
      { step:'02', emoji:'🏰', title:'Fort view + Escobar\'s plane',        desc:'Two iconic stops viewed panoramically from the sport boat.' },
      { step:'03', emoji:'🤿', title:'Snorkeling in national park',         desc:'Coral reefs, fish, and crystal-clear Caribbean water.' },
      { step:'04', emoji:'🎉', title:'Cholón + shrimp cocktail + Kokomo',   desc:'The classic island double — party then paradise.' },
      { step:'05', emoji:'🍽', title:'VIP beach club lunch & sunset',       desc:'Reserved VIP area, full lunch, and golden hour views.' },
      { step:'06', emoji:'✨', title:'Bioluminescent plankton swim',        desc:'The unforgettable finale — glowing blue water after dark.' },
    ],
    audience: ['VIP groups','Couples','Groups of friends','Birthday celebrations'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  //  LAND & ECO TOURS (ids 18–23)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 18,
    name: 'ATV Tour on Tierra Bomba Island',
    subtitle: 'Rip through forests, coastline, and colonial forts on your own ATV — 7 minutes from Cartagena.',
    desc: 'Ride an ATV across Tierra Bomba Island — beaches, forests, the historic San Fernando Fort, and a scenic cliff overlooking Cartagena Bay.',
    img: 'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1920,dpr=1/tour_img/1bd3556bea841e3c033e91760e3afd8a69d9972b17be3c4e140367ebaa8e1e34.jpeg',
    imgs: [
      'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1920,dpr=1/tour_img/1bd3556bea841e3c033e91760e3afd8a69d9972b17be3c4e140367ebaa8e1e34.jpeg',
      'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1920,dpr=1/tour_img/0e6d8e994220a4fa20e10d23b9ca0fa4865749df19ced3a38e889eda116343f9.jpeg',
      'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1920,dpr=1/tour_img/461902be2102aea267915ef48c8de5bcfab532306e9ca1fe6d37fc2c89b4d3f1.jpeg',
      'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1920,dpr=1/tour_img/f61014cf71c9ccc5.jpeg',
    ],
    duration: '3 Hours', groupInfo: 'Age 16+ / Co-pilot 10+', feature: 'ATV Incl.',
    featureIcon: 'terrain', groupIcon: 'person',
    priceCOP: 424000, badge: 'popular', category: 'land', perUnit: 'person',
    limitedSpots: false,
    description: 'A short boat ride from Cartagena sits Tierra Bomba Island — and you\'re about to see it the best way possible: from the seat of your own ATV. Your certified guide leads you through the village of Bocachica, into forest and coastal trails, up to the panoramic cliff overlooking Cartagena Bay, and through the grounds of Fuerte de San Fernando. No experience needed — full safety briefing included. Optional GoPro footage available.',
    whyLove: [
      { icon: 'terrain',    text: 'Forests, beaches, cliffs, and colonial forts by ATV' },
      { icon: 'directions_boat', text: 'Island just 7 minutes from Cartagena by boat' },
      { icon: 'castle',     text: 'Visit the historic Fuerte de San Fernando on the route' },
    ],
    included: ['Round-trip boat transfer (Cartagena ↔ Tierra Bomba)','ATV rental (solo or double)','Helmet & safety equipment','Safety briefing & guide','Water (hydration)','Flight insurance'],
    excluded: ['Hotel transfer to meeting point','GoPro photos/video (extra cost)','Gratuities','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'🚤', title:'Boat to Tierra Bomba',           desc:'7-minute boat ride from behind Bocagrande Hospital.' },
      { step:'02', emoji:'🪖', title:'Safety briefing & ATV start',    desc:'Helmet fitted, controls explained, ready to ride.' },
      { step:'03', emoji:'🏘', title:'Bocachica town & coastal trail', desc:'Ride through the local community and along the shore.' },
      { step:'04', emoji:'🏰', title:'Fuerte de San Fernando',         desc:'Historic fort — explore the grounds on your ATV.' },
      { step:'05', emoji:'🌄', title:'Panoramic cliff viewpoint',      desc:'Breathtaking view over Cartagena Bay from the hilltop.' },
      { step:'06', emoji:'🚤', title:'Return to Cartagena',            desc:'Boat back after hydration break at the end of the ride.' },
    ],
    audience: ['Adventure seekers','Groups of friends','Couples','Solo travelers'],
  },

  {
    id: 19,
    name: 'Boquilla Mangroves Canoe Tour',
    subtitle: 'Paddle through ancient mangrove tunnels in a traditional Afro-Caribbean fishing village.',
    desc: 'Glide through the mangrove ecosystem of La Boquilla by canoe — wildlife, mangrove tunnels, and an optional extension to Fisherman\'s Island and Boquilla Beach.',
    img: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/68fe8fdee225d231796054d4.jpeg',
    imgs: [
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/68fe8fdee225d231796054d4.jpeg',
      'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1210,dpr=2/tour_img/2d6c2810894a3f068858401da1888ebdf6ffc18d64d3d59fba7da75e0ea7d9e6.jpeg',
      'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1920,dpr=1/tour_img/f8faf4ae7c66d4093fdb2d432d86ff168ff2bcda7ebc4f0b1715f04788915093.jpeg',
      'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1920,dpr=1/tour_img/ffb596905b99b4d7f1ca219f8b18c391e21ba0d718d4e3551fac1c241a4bd5d7.jpeg',
    ],
    duration: '4.5 Hours', groupInfo: 'Up to 5/canoe', feature: 'Canoe Incl.',
    featureIcon: 'kayaking', groupIcon: 'groups',
    priceCOP: 130000, badge: 'eco', category: 'eco', perUnit: 'person',
    limitedSpots: false,
    description: 'La Boquilla is a traditional Afro-Caribbean fishing village on the edge of Cartagena — and its mangrove ecosystem is one of the most biodiverse in the region. Your guide (a local from the community) paddles you through natural mangrove tunnels where birds, crabs, raccoons, and fish are visible in every direction. The pace is gentle, the air is cool under the canopy, and the experience is genuinely unlike anything else in Cartagena. An optional extension includes Fisherman\'s Island and Boquilla Beach.',
    whyLove: [
      { icon: 'kayaking',  text: 'Natural mangrove tunnels and hidden wildlife' },
      { icon: 'diversity_3', text: 'Led by a local from the La Boquilla community' },
      { icon: 'eco',       text: 'One of Cartagena\'s most biodiverse ecosystems' },
    ],
    included: ['Round-trip transport','Canoe tour through Boquilla mangroves','Local guide with ecological explanations','Bottled water','Optional Fisherman\'s Island stop','Optional Boquilla Beach extension','Cartagena letters photo stop','Medical insurance'],
    excluded: ['Fisherman\'s Island entrance fee','Meals','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'🚌', title:'Pickup & transfer to La Boquilla', desc:'Hotel pickup at 7:30 AM, arrive 8:00 AM.' },
      { step:'02', emoji:'🛶', title:'Board canoe & enter mangroves',    desc:'Paddle into the tunnel network with your local guide.' },
      { step:'03', emoji:'🦜', title:'Wildlife viewing in the canopy',   desc:'Birds, crabs, raccoons, and more visible from the canoe.' },
      { step:'04', emoji:'🏝', title:'Optional Fisherman\'s Island stop', desc:'Small ecological island — local life and nature.' },
      { step:'05', emoji:'📸', title:'Cartagena letters photo stop',     desc:'The iconic Cartagena sign for your trip photo.' },
      { step:'06', emoji:'🏖', title:'Optional Boquilla Beach (extended)', desc:'Extra beach time available for a 7.5-hour experience.' },
    ],
    audience: ['Nature lovers','Families','Birdwatching enthusiasts','Conscious travelers'],
  },

  {
    id: 20,
    name: 'Cartagena City Tour',
    subtitle: 'The essential Cartagena day — chiva bus, San Felipe Fortress, and the Walled City.',
    desc: 'A 4–5 hour guided city tour on a traditional chiva bus: coastal panoramic tour, Castillo de San Felipe (entrance included), and a walking tour through the Walled City.',
    img: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/688be4100a5cdd4ac1ee4961.jpeg',
    imgs: [
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/688be4100a5cdd4ac1ee4961.jpeg',
      'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://storage.googleapis.com/msgsndr/yoFsyX3wwP7OA34UkJSE/media/688be3ec1fcebdbc9775045e.jpeg',
      'https://images.pexels.com/photos/20483126/pexels-photo-20483126.jpeg',
      'https://images.pexels.com/photos/14001847/pexels-photo-14001847.jpeg',
    ],
    duration: '4-5 Hours', groupInfo: 'Historian Guide', feature: 'Fortress Incl.',
    featureIcon: 'castle', groupIcon: 'groups',
    priceCOP: 80000, badge: 'historical', category: 'land', perUnit: 'person',
    limitedSpots: false,
    description: 'See Cartagena the way it deserves to be seen — on a colorful traditional chiva bus with a historian guide who actually makes history compelling. You\'ll roll through Bocagrande, Laguito, and Castillo Grande for coastal views, stop for photos at the Botas Viejas monument, get full access to Castillo de San Felipe (the largest colonial fort in the Americas), and finish with a walking tour through the UNESCO Walled City. Morning and afternoon departures available.',
    whyLove: [
      { icon: 'castle',      text: 'Castillo de San Felipe — entrance included' },
      { icon: 'history_edu', text: 'Historian guide who brings the city\'s story to life' },
      { icon: 'directions_bus', text: 'Traditional chiva bus — the most fun way to tour' },
    ],
    included: ['~4 hours on traditional chiva bus','Panoramic tour of Bocagrande, Laguito & Castillo Grande','Botas Viejas monument stop','Castillo de San Felipe (entrance included)','Cartagena letters photo stop','Walled City walking tour with historian guide','Medical insurance'],
    excluded: ['Food & drinks','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'🚌', title:'Board the chiva bus',              desc:'Morning (8 AM) or afternoon (1:30 PM) departure.' },
      { step:'02', emoji:'🌊', title:'Coastal panoramic tour',           desc:'Bocagrande, Laguito, and Castillo Grande seafront.' },
      { step:'03', emoji:'🥾', title:'Botas Viejas monument',           desc:'Famous sculpture honoring Cartagena poet Luis Carlos López.' },
      { step:'04', emoji:'🏰', title:'Castillo de San Felipe',           desc:'The largest colonial fort ever built in the Americas.' },
      { step:'05', emoji:'📸', title:'Cartagena letters photo stop',     desc:'The classic Cartagena sign photo.' },
      { step:'06', emoji:'🚶', title:'Walled City walking tour',         desc:'Historic plazas, colonial streets, and Plaza Bolívar.' },
    ],
    audience: ['First-time visitors','History lovers','Families','Solo travelers'],
  },

  {
    id: 21,
    name: 'Horseback Riding & Mangroves at Sunset',
    subtitle: 'Canoe through jungle tunnels in the afternoon, then ride a horse along the beach at golden hour.',
    desc: 'A combination adventure at La Boquilla: canoe through mangrove tunnels with a local guide, then ride a trained horse along the coastline as the sun sets over the Caribbean.',
    img: 'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1920,dpr=1/tour_img/2f5138df1ffef396.png',
    imgs: [
      'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1920,dpr=1/tour_img/2f5138df1ffef396.png',
      'https://ranchosaman.com/wp-content/uploads/2025/12/IMG_9165-1-1536x1152.jpg',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/ed/9a/e7/felices-aprendiendo.jpg?w=1400&h=-1&s=1',
    ],
    duration: '4.5 Hours', groupInfo: 'Age 16+', feature: 'Sunset Ride',
    featureIcon: 'sunny', groupIcon: 'groups',
    priceCOP: 250000, badge: 'popular', category: 'eco', perUnit: 'person',
    limitedSpots: false,
    description: 'Cartagena\'s most photogenic afternoon. You start with a canoe tour through La Boquilla\'s mangrove tunnels — birds, crabs, and a guide from the local community — then in the late afternoon you mount a trained horse and ride along La Boquilla\'s coastline as the sky turns orange and gold over the Caribbean. No riding experience needed. The tour ends at the iconic Cartagena letters sign.',
    whyLove: [
      { icon: 'sunny',     text: 'Horseback ride timed perfectly with Cartagena\'s sunset' },
      { icon: 'kayaking',  text: 'Canoe through mangrove tunnels before the ride' },
      { icon: 'eco',       text: 'Guided by a local from the La Boquilla community' },
    ],
    included: ['Round-trip transport','Canoe tour through La Boquilla mangroves','Local ecological guide','Bottled water','Optional Fisherman\'s Island stop','30-minute horseback ride along the coastline','Sunset horseback experience','Cartagena letters photo stop','Medical insurance'],
    excluded: ['Fisherman\'s Island entrance fee','Meals','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'🚌', title:'Pickup at 1:30 PM',                desc:'Hotel pickup or Torre del Reloj meeting point.' },
      { step:'02', emoji:'🛶', title:'Canoe through mangrove tunnels',   desc:'Glide through the green canopy with your local guide.' },
      { step:'03', emoji:'🦜', title:'Wildlife & ecosystem tour',        desc:'Birds, crabs, and the story of the La Boquilla community.' },
      { step:'04', emoji:'🐎', title:'Horseback ride at 4:30 PM',       desc:'Trained horses, beach trail, and golden afternoon light.' },
      { step:'05', emoji:'🌅', title:'Sunset on horseback',             desc:'The most photogenic moment in Cartagena.' },
      { step:'06', emoji:'📸', title:'Cartagena letters photo stop',    desc:'End the day with the iconic Cartagena sign photo.' },
    ],
    audience: ['Couples','Adventure seekers','Groups of friends','Solo travelers'],
  },

  {
    id: 22,
    name: 'Rum & Chocolate Tasting Experience',
    subtitle: 'Colombia\'s finest rums paired with artisanal chocolate — then you craft your own cocktail.',
    desc: '8–10 premium Colombian rums expertly paired with artisanal chocolates at Lunático Studio in Getsemaní, led by a certified Rummelier. Includes cocktail-making session.',
    img: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/12/38/29/38.jpg',
    imgs: [
      'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/12/38/29/38.jpg',
      'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1920,dpr=1/tour_img/a16fe7a346b846143254e8eb9bc0d09ade1146be00c60ba3a85c570e5d1f287d.jpg',
      'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1920,dpr=1/tour_img/f27913b82d5203d2e9cbea84534d2533e8869df934591218457443409a6f91bd.jpeg',
      'https://cdn.getyourguide.com/image/format=auto,fit=crop,gravity=auto,quality=60,width=1920,dpr=1/tour_img/78d5160db1506350aa8f81a332c6289e3952b1237fe267676c106424c48bfde2.jpg',
    ],
    duration: '2 Hours', groupInfo: 'Max 12 People', feature: 'Cocktail Making',
    featureIcon: 'liquor', groupIcon: 'groups',
    priceCOP: 420000, badge: 'gourmet', category: 'land', perUnit: 'person',
    limitedSpots: true,
    description: 'Hosted at the renowned Lunático Studio in the heart of Getsemaní, this boutique tasting experience is one of the most sophisticated things to do in Cartagena. A certified Rummelier guides you through 8–10 premium Colombian rums — each paired with an artisanal chocolate selected to complement its flavor profile. You\'ll learn the history of Colombian rum, cacao, and sugar cane, practice professional tasting techniques, and finish by crafting your own rum cocktail. Small group only. 18+ exclusively.',
    whyLove: [
      { icon: 'liquor',   text: '8–10 premium Colombian rums with expert pairings' },
      { icon: 'cookie',   text: 'Artisanal Colombian chocolate at every step' },
      { icon: 'science',  text: 'Craft your own rum cocktail with the Rummelier' },
    ],
    included: ['Guided tasting of 8–10 premium Colombian rums','Artisanal chocolate pairings','Cocktail-making session','Bilingual certified Rummelier guide','Bottled water','All taxes and fees'],
    excluded: ['Hotel pickup (meeting point activity)','Additional food or drinks','Gratuities'],
    itinerary: [
      { step:'01', emoji:'🏛', title:'Arrive at Lunático Studio',         desc:'Getsemaní — Cartagena\'s most creative neighbourhood.' },
      { step:'02', emoji:'📖', title:'Rum, cacao & Colombian history',    desc:'The story of Colombia\'s spirits and chocolate traditions.' },
      { step:'03', emoji:'🥃', title:'Guided rum & chocolate tasting',    desc:'8–10 rums, each paired with a matched artisanal chocolate.' },
      { step:'04', emoji:'👃', title:'Professional tasting techniques',   desc:'Nose, palate, finish — learn to taste like a Rummelier.' },
      { step:'05', emoji:'🍹', title:'Craft your own rum cocktail',       desc:'The grand finale — shake, stir, and taste your creation.' },
    ],
    audience: ['Foodies','Couples','Groups of friends','Solo travelers'],
  },

  {
    id: 23,
    name: 'Paratrike Flight Experience',
    subtitle: 'Soar over Cartagena\'s coastline on a motorized paraglider — lunch and transport included.',
    desc: 'A 12-minute tandem paratrike flight over Morros Beach, Bocagrande, and the La Boquilla mangroves, followed by a typical Colombian lunch on the beach.',
    img: 'https://everythingcartagena.com/wp-content/uploads/2022/12/Paratrikeboquilla05.jpg',
    imgs: [
      'https://everythingcartagena.com/wp-content/uploads/2022/12/Paratrikeboquilla05.jpg',
      'https://www.tourandhotels.com/configurador/fotos/Tour_Grande_0812019062736.jpg',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/af/a3/e8/fly-cartagena.jpg?w=1400&h=-1&s=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/80/78/90/fly-cartagena.jpg?w=1400&h=-1&s=1',
    ],
    duration: '6 Hours', groupInfo: 'Tandem with Pilot', feature: '12-Min Flight',
    featureIcon: 'paragliding', groupIcon: 'person',
    priceCOP: 470000, badge: 'exclusive', category: 'land', perUnit: 'person',
    limitedSpots: true,
    description: 'A certified pilot, a motorized paraglider, and 12 minutes of pure aerial freedom over Cartagena. You\'ll lift off from La Boquilla beach and soar over the iconic Morros rocks, Bocagrande\'s skyline, and the mangrove lagoons below — watching the Caribbean stretch to the horizon. No experience required. After your flight, you\'ll receive a complimentary drink, a traditional Colombian beach lunch, and time to relax on the sand. Minimum 2 people per departure.',
    whyLove: [
      { icon: 'paragliding', text: '12-minute flight over Cartagena\'s coastline' },
      { icon: 'photo_camera', text: 'Aerial views of Morros, Bocagrande & the mangroves' },
      { icon: 'restaurant',  text: 'Complimentary drink + full beach lunch after your flight' },
    ],
    included: ['Round-trip transport','Tourism coordinator','Beach reception by flight staff','12-minute tandem paratrike flight','Certified pilot','Flight insurance','Complimentary drink','Typical Colombian lunch (fish, chicken, or pork with rice & patacones)','Cartagena letters photo stop'],
    excluded: ['GoPro photos/video (extra cost)','Towels','Personal expenses'],
    itinerary: [
      { step:'01', emoji:'🚌', title:'Hotel pickup at 9 AM',            desc:'Transfer to La Boquilla flight beach.' },
      { step:'02', emoji:'📋', title:'Check-in & safety briefing',      desc:'Registration and pilot introduction.' },
      { step:'03', emoji:'🪂', title:'12-minute paratrike flight',      desc:'Take off from the beach — soar over the Caribbean coast.' },
      { step:'04', emoji:'🌊', title:'Aerial views of Cartagena',       desc:'Morros Beach, Bocagrande skyline, and La Boquilla mangroves.' },
      { step:'05', emoji:'🍹', title:'Landing + complimentary drink',   desc:'Touch down on the beach to a cold welcome drink.' },
      { step:'06', emoji:'🍽', title:'Beach lunch & free time',         desc:'Fish, chicken, or pork lunch, then relax on the sand.' },
    ],
    audience: ['Adventure seekers','Couples','Groups of friends','Solo travelers'],
  },

  // ══════════════════════════════════════════════════════════════════════════
  //  LAND TOURS (continued)
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: 24,
    name: 'Totumo Mud Volcano',
    subtitle: 'Float in a 15-metre mud volcano, rinse in the lagoon, then relax at a beach club — all in one day.',
    desc: 'Climb into the world\'s most famous mud volcano, float in warm mineral mud, then spend the afternoon at Coco Beach Club with lunch and a welcome cocktail included.',
    img: 'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/17/0b/ef/e2.jpg',
    imgs: [
      'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/17/0b/ef/e2.jpg',
      'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/10/5b/f9/65.jpg',
      'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/09/c5/52/9b.jpg',
      'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/09/c5/52/af.jpg',
    ],
    duration: '8.5 Hours', groupInfo: 'Shared Group', feature: 'Lunch Incl.',
    featureIcon: 'restaurant', groupIcon: 'groups',
    priceCOP: 160000, badge: 'popular', category: 'land', perUnit: 'person',
    limitedSpots: false,
    description: 'Just 45 minutes from Cartagena sits a 15-metre volcanic crater filled with warm, dense mineral mud — so thick it holds you afloat without effort. Climb the steps, drop in, and let local guides manoeuvre you through the crater while the therapeutic mud soaks into your skin. After a full rinse in the adjacent Totumo lagoon (where local women help wash you down), a comfortable air-conditioned bus whisks you to Coco Beach Club for a welcome cocktail, a proper lunch, and a lazy afternoon by the pool and beach. One of the most unique experiences in Colombia — and one of the best-value days out of Cartagena.',
    whyLove: [
      { icon: 'spa',           text: 'Float effortlessly in warm therapeutic volcanic mud' },
      { icon: 'beach_access',  text: 'Afternoon at Coco Beach Club with pool and ocean access' },
      { icon: 'restaurant',    text: 'Welcome cocktail and full lunch included' },
      { icon: 'directions_bus', text: 'Air-conditioned transport door to door' },
    ],
    included: [
      'Round-trip air-conditioned bus transport',
      'Entrance to Totumo Volcano',
      'Volcanic mud bath experience',
      'Lagoon mud-removal rinse',
      'Visit to Coco Beach Club',
      'Welcome cocktail',
      'Lunch (fish, chicken, vegetarian, or other)',
      'Light dessert',
      'Pool, beach, chairs & tables',
      'Bilingual guide',
      'Medical assistance insurance',
    ],
    excluded: [
      'Towels',
      'Optional massages & photos (paid on-site)',
      'Personal expenses',
      'Services not listed above',
    ],
    itinerary: [
      { step:'01', emoji:'🚌', title:'7:30 AM — Hotel pickup',             desc:'Pickup from hotels in main zones or meet at Torre del Reloj.' },
      { step:'02', emoji:'🛣', title:'8:30 AM — Depart for Totumo',        desc:'Comfortable air-conditioned bus, ~1 hour drive.' },
      { step:'03', emoji:'🌋', title:'9:30 AM — Arrive & climb the volcano', desc:'Climb the iconic 15-metre mud volcano steps.' },
      { step:'04', emoji:'🛁', title:'Morning — Mud bath',                 desc:'Float in the warm mineral mud. Optional massage and photos available.' },
      { step:'05', emoji:'🚿', title:'Late morning — Lagoon rinse',        desc:'Local attendants help wash off the mud in the Totumo lagoon.' },
      { step:'06', emoji:'🍹', title:'Midday — Coco Beach Club',           desc:'Welcome cocktail, lunch, pool, and beach time.' },
      { step:'07', emoji:'🚌', title:'4:00 PM — Return to Cartagena',      desc:'Air-conditioned bus back to the city.' },
    ],
    audience: ['Families','Couples','Groups of friends','Solo travelers','First-time visitors','Adventure seekers'],
  },

  {
    id: 25,
    name: '4 Island Tour Basic',
    subtitle: 'Four islands, snorkeling, a shrimp cocktail at Cholón, sunset at Playa Tranquila, and a bioluminescent plankton swim — all in one epic day.',
    desc: 'The most complete day-tour from Cartagena: four island stops, snorkeling, a Caribbean lunch, sunset at Playa Tranquila, and a night swim through glowing bioluminescent plankton.',
    img: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/b3/a6/e2/caption.jpg?w=1400&h=-1&s=1',
    imgs: [
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/b3/a6/e2/caption.jpg?w=1400&h=-1&s=1',
      'https://culturestraveled.com/wp-content/uploads/2023/10/boat-tours-cartagena.jpg',
      'https://www.cartagenafortravelers.com/wp-content/uploads/2022/09/Playa-Blanca-BAru-Island-scaled-870x555.jpg.webp',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/84/9d/eb/caption.jpg?w=1400&h=-1&s=1',
    ],
    duration: '13.5 Hours', groupInfo: 'Shared Group', feature: 'Lunch + Plankton',
    featureIcon: 'restaurant', groupIcon: 'groups',
    priceCOP: 185000, badge: 'bestseller', category: 'island', perUnit: 'person',
    limitedSpots: false,
    description: 'This is the full Cartagena island experience — compressed into a single unforgettable 13-hour day. You\'ll start at dawn with an air-conditioned bus to Barú, then board a boat for a panoramic Rosario Islands tour past San Fernando Fort. The morning is spent snorkeling in clear Caribbean water (with an optional Aquarium stop), followed by the famous Isla Cholón visit — shrimp cocktail in hand, music blasting, boats packed wall-to-wall. After lunch at Isla Kokomo, the afternoon winds down at Playa Tranquila for sunset. Then, as darkness falls, you\'re transferred by boat to the bioluminescent plankton zone — where every stroke of your arm through the water ignites a burst of blue light. One of the most bucket-list experiences in Colombia. Children 4–9 are 175,000 COP. Children 0–3 are free.',
    whyLove: [
      { icon: 'anchor',        text: 'Four island stops in one day — Cholón, Kokomo, Playa Tranquila & more' },
      { icon: 'scuba_diving',  text: 'Snorkeling in crystal-clear Rosario Islands waters' },
      { icon: 'bedtime',       text: 'Bioluminescent plankton night swim — a bucket-list moment' },
      { icon: 'restaurant',    text: 'Shrimp cocktail tasting + full Caribbean lunch included' },
    ],
    included: [
      'Round-trip air-conditioned bus transport to Barú',
      'Panoramic Rosario Islands boat tour',
      'Optional Aquarium stop (entrance not included)',
      'Snorkeling activity',
      'Isla Cholón visit + shrimp cocktail tasting',
      'Isla Kokomo visit',
      'Typical Caribbean lunch (fish or chicken, coconut or white rice, green salad, patacones)',
      'Playa Tranquila visit + beach chair',
      'Snack or refreshment',
      'Boat transfer to plankton area',
      'Bioluminescent plankton swimming experience',
      'Tour coordinator',
    ],
    excluded: [
      'Towels',
      'Aquarium entrance (40,000 COP — optional)',
      'Natural reserve entry fee (8,800 COP)',
      'Personal expenses',
      'Services not listed above',
    ],
    itinerary: [
      { step:'01', emoji:'🚌', title:'7:00 AM — Hotel pickup',              desc:'Pickup in Bocagrande, Castillo Grande, Laguito, or meet at Muelle de los Pegasos.' },
      { step:'02', emoji:'🛣', title:'8:00 AM — Bus to Barú Island',        desc:'Air-conditioned bus across the bridge to Barú.' },
      { step:'03', emoji:'⛵', title:'Morning — Rosario Islands panorama',  desc:'Boat tour past San Fernando Fort and the national park.' },
      { step:'04', emoji:'🤿', title:'Mid-morning — Snorkeling',            desc:'Clear Caribbean waters with fish and marine life. Optional Aquarium stop.' },
      { step:'05', emoji:'🍤', title:'11:00 AM — Isla Cholón',              desc:'The legendary party island — shrimp cocktail tasting and Caribbean vibes.' },
      { step:'06', emoji:'🏝', title:'12:30 PM — Isla Kokomo',              desc:'A quieter island stop before lunch.' },
      { step:'07', emoji:'🍽', title:'1:30 PM — Lunch',                    desc:'Fish or chicken with coconut rice, green salad, and patacones.' },
      { step:'08', emoji:'🌅', title:'2:00 PM — Playa Tranquila',           desc:'Relax on Barú\'s most beautiful beach as the sun starts to lower.' },
      { step:'09', emoji:'🚤', title:'7:00 PM — Boat to plankton zone',     desc:'Depart as night falls for the bioluminescent plankton area.' },
      { step:'10', emoji:'✨', title:'7:15 PM — Plankton swim',             desc:'Every movement through the water ignites a burst of blue light.' },
      { step:'11', emoji:'🚌', title:'8:30 PM — Return to Cartagena',       desc:'Boat back then bus transfer to the city.' },
    ],
    audience: ['Families','Couples','Groups of friends','Solo travelers','First-time visitors','Adventure seekers','Beginner snorkelers'],
  },

];
