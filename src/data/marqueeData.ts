export interface EventShowcaseItem {
  id: string;
  category: 'baraat' | 'walima' | 'mehndi' | 'corporate';
  categoryLabel: string;
  title: string;
  subtitle: string;
  capacityRange: string;
  recommendedHall: string;
  recommendedTierId: string;
  stageDimensions: string;
  lightingSpec: string;
  image: string;
  highlights: string[];
  startingDecorFee: number;
}

export interface MarqueeServiceItem {
  id: string;
  index: string;
  title: string;
  summary: string;
  deliverable: string;
  pricePkr: number;
  spanWide?: boolean;
  defaultIncluded?: boolean;
}

export interface DishItem {
  id: string;
  name: string;
  course: 'starters' | 'mains' | 'bbq' | 'desserts';
  courseLabel: string;
  note: string;
  perHeadAddonPkr: number;
  isSignature?: boolean;
}

export interface MenuTier {
  id: string;
  name: string;
  tagline: string;
  basePerHeadPkr: number;
  includedDishIds: string[];
  serviceStyle: string;
}

export interface HallZone {
  id: string;
  name: string;
  capacityMin: number;
  capacityMax: number;
  hallRentalPkr: number;
  dimensions: string;
  summary: string;
}

export interface BookingRecord {
  referenceId: string;
  date: string;
  slot: 'lunch' | 'dinner';
  eventType: string;
  hallId: string;
  guests: number;
  menuTierId: string;
  selectedDishIds: string[];
  selectedServiceIds: string[];
  clientName: string;
  phone: string;
  email: string;
  notes: string;
  totalEstimatedPkr: number;
  advancePkr: number;
  createdAt: string;
}

export const VENUE_INFO = {
  name: 'Al Razzaq Royal Marquee',
  category: 'Wedding venue',
  rating: 4.3,
  reviewCount: 360,
  address: 'Pasrur Rd, Daska, Pakistan',
  phoneDisplay: '+92 334 9400000',
  phoneRaw: '923349400000',
  plusCode: '89FG+QV Daska, Pakistan',
  hoursSummary: 'Open daily · 10:00 AM – 11:30 PM',
  mapsSearchQuery: 'Al Razzaq Royal Marquee, Pasrur Rd, Daska, Pakistan',
  mapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=Al+Razzaq+Royal+Marquee+Pasrur+Rd+Daska+Pakistan',
  mapsPlaceUrl:
    'https://www.google.com/maps/search/?api=1&query=Al+Razzaq+Royal+Marquee+Pasrur+Rd+Daska+Pakistan',
};

export const VENUE_IMAGES = {
  hero: '/src/assets/images/hero_royal_marquee_1794922380147.jpg',
  baraat: '/src/assets/images/event_nikkah_stage_1794922379353.jpg',
  walima: '/src/assets/images/event_walima_reception_1794922380988.jpg',
  mehndi: '/src/assets/images/event_mehndi_night_1794922381765.jpg',
  culinary: '/src/assets/images/culinary_royal_dastarkhwan_1794922383109.jpg',
};

export const HALL_ZONES: HallZone[] = [
  {
    id: 'grand-imperial',
    name: 'Grand Imperial Hall',
    capacityMin: 300,
    capacityMax: 950,
    hallRentalPkr: 145000,
    dimensions: '140 ft × 85 ft · Pillar-Free Span',
    summary: 'Coffered chandelier ceiling, acoustic paneling, central aisle, and dedicated bridal suite.',
  },
  {
    id: 'emerald-courtyard',
    name: 'Emerald Marquee & Courtyard',
    capacityMin: 200,
    capacityMax: 650,
    hallRentalPkr: 115000,
    dimensions: '110 ft × 70 ft · Glass Atrium',
    summary: 'Daylight glass arches opening onto manicured evening lawns for Nikkah and Mehndi ceremonies.',
  },
  {
    id: 'full-estate',
    name: 'Full Royal Estate Buyout',
    capacityMin: 800,
    capacityMax: 1500,
    hallRentalPkr: 235000,
    dimensions: 'Full Complex · Dual Halls + Lawn',
    summary: 'Private full-campus access for large family Baraats, separated enclosures, and VIP valet.',
  },
];

export const EVENT_SHOWCASE_ITEMS: EventShowcaseItem[] = [
  {
    id: 'imperial-baraat',
    category: 'baraat',
    categoryLabel: 'Baraat & Nikkah',
    title: 'The Ivory Arch Baraat',
    subtitle: '2026 Sculptural Floral Stage & Crystal Aisle',
    capacityRange: '500 – 1,200 Guests',
    recommendedHall: 'grand-imperial',
    recommendedTierId: 'gold-royal',
    stageDimensions: '36 ft Wide × 16 ft Deep · Dual Ramp Walk',
    lightingSpec: '2,700K Warm Architectural Wash + Stage Spot Follow',
    image: VENUE_IMAGES.baraat,
    startingDecorFee: 95000,
    highlights: [
      'Hand-built champagne & ivory fresh orchid arches',
      'Brushed brass geometric jali backdrop with velvet royal seating',
      'Synchronized Baraat entrance brass-lamp walkway',
      'Separated family lounge & private Nikkah partition available',
    ],
  },
  {
    id: 'candlelight-walima',
    category: 'walima',
    categoryLabel: 'Walima Reception',
    title: 'Candlelit Imperial Walima',
    subtitle: 'Long Royal Banquet Tables & Chandelier Glaze',
    capacityRange: '350 – 950 Guests',
    recommendedHall: 'grand-imperial',
    recommendedTierId: 'platinum-nawabi',
    stageDimensions: '32 ft Minimalist Floral Horizon Stage',
    lightingSpec: 'Dimmable Crystal Chandeliers + Table Taper Pin-Spots',
    image: VENUE_IMAGES.walima,
    startingDecorFee: 85000,
    highlights: [
      'Fine ivory linen table styling with hammered brass candelabras',
      'Dedicated plated VIP head-table service for family elders',
      'Acoustic background instrumental sound zoning',
      'Climate-controlled 22°C hall comfort across summer & winter',
    ],
  },
  {
    id: 'marigold-mehndi',
    category: 'mehndi',
    categoryLabel: 'Mehndi & Dholki',
    title: 'Saffron & Emerald Mehndi Night',
    subtitle: 'Canopy Fairy Lights, Brass Lanterns & Lounge Seating',
    capacityRange: '200 – 650 Guests',
    recommendedHall: 'emerald-courtyard',
    recommendedTierId: 'silver-heritage',
    stageDimensions: '28 ft Carved Jhoola & Floor Cushioned Majlis',
    lightingSpec: 'Starlight Ceiling Canopy + Amber Festoon Glow',
    image: VENUE_IMAGES.mehndi,
    startingDecorFee: 75000,
    highlights: [
      'Deep emerald and marigold silk ceiling drapes with hanging brass lanterns',
      'Spring-loaded wooden dance floor with perimeter low-haze effects',
      'Traditional low-seating takht lounges and embroidered bolsters',
      'Live gol-gappa, chaat, and Kashmiri chai street carts',
    ],
  },
  {
    id: 'corporate-gala',
    category: 'corporate',
    categoryLabel: 'Corporate & Galas',
    title: 'Executive Banquet & Convocation',
    subtitle: 'Pillar-Free Sightlines & Dual-Screen AV Ready',
    capacityRange: '250 – 1,500 Guests',
    recommendedHall: 'full-estate',
    recommendedTierId: 'silver-heritage',
    stageDimensions: '40 ft Modular Podium + Dual 4K LED Wall Mounts',
    lightingSpec: 'Daylight-Balanced 4,000K Presentation + Gala Mode',
    image: VENUE_IMAGES.hero,
    startingDecorFee: 65000,
    highlights: [
      'Line-array conference audio with wireless lapel and podium mics',
      'High-speed fiber Wi-Fi and registration welcome desks',
      '450+ car guarded parking directly off Pasrur Road',
      'Custom corporate branding panels and executive VIP dining',
    ],
  },
];

export const MARQUEE_SERVICES: MarqueeServiceItem[] = [
  {
    id: 'floral-architecture',
    index: '01',
    title: 'Architectural Floral & Stage Design',
    summary:
      'Custom 2026 sculptural floral arches, velvet royal seating, and fresh seasonal botanicals tailored to your color palette.',
    deliverable: '3D Stage Mockup + Fresh Import Florals',
    pricePkr: 85000,
    spanWide: true,
    defaultIncluded: true,
  },
  {
    id: 'lighting-acoustics',
    index: '02',
    title: 'Warm Chandelier & Pin-Spot Lighting',
    summary:
      'Dimmable crystal chandeliers paired with warm 2,700K table pin-spots and crystal-clear acoustic sound distribution.',
    deliverable: 'DMX Lighting Console + Operator',
    pricePkr: 35000,
    defaultIncluded: true,
  },
  {
    id: 'bridal-protocol',
    index: '03',
    title: 'Private Bridal Suite & VIP Protocol',
    summary:
      'Climate-controlled sanctuary with vanity mirrors, private washroom, refreshments, and dedicated hospitality attendants.',
    deliverable: 'Full-Duration Suite + 2 Attendants',
    pricePkr: 25000,
  },
  {
    id: 'valet-power',
    index: '04',
    title: 'Valet Parking & Dual-Generator Backup',
    summary:
      'Uniformed valet stewards on Pasrur Road entrance with 450+ lit bays and zero-flicker heavy industrial backup power.',
    deliverable: '8 Valet Stewards + Dual Diesel Backup',
    pricePkr: 30000,
    defaultIncluded: true,
  },
  {
    id: 'live-cinema',
    index: '05',
    title: '4K Cinema Screens & Entry Cold Pyro',
    summary:
      'Indoor synchronized dual LED walls for live guest relay plus smokeless cold sparklers for couple grand entrance.',
    deliverable: 'Dual 12×8ft LED Walls + 8 Cold Sparks',
    pricePkr: 55000,
    spanWide: true,
  },
  {
    id: 'segregated-enclosure',
    index: '06',
    title: 'Custom Parda / Family Partition Setup',
    summary:
      'Dignified floor-to-ceiling ivory acoustic draping separating ladies and gents dining halls with matching chandeliers.',
    deliverable: 'Dual Buffet Lines + Separate Entrances',
    pricePkr: 20000,
  },
];

export const DISH_CATALOG: DishItem[] = [
  // Welcome Drinks & Starters
  {
    id: 'mint-margarita',
    name: 'Fresh Mint & Lime Cooler',
    course: 'starters',
    courseLabel: 'Welcome Drinks & Starters',
    note: 'Served chilled at guest arrival',
    perHeadAddonPkr: 140,
  },
  {
    id: 'chicken-corn-soup',
    name: 'Velvet Chicken Corn & Hot Sour Soup',
    course: 'starters',
    courseLabel: 'Welcome Drinks & Starters',
    note: 'Winter seasonal staple with crackers',
    perHeadAddonPkr: 180,
  },
  {
    id: 'lahori-fish',
    name: 'Crisp Finger Fish with Tartar',
    course: 'starters',
    courseLabel: 'Welcome Drinks & Starters',
    note: 'Boneless rahoo fillets in light besan crust',
    perHeadAddonPkr: 380,
    isSignature: true,
  },
  // Signature Mains
  {
    id: 'mutton-qorma',
    name: 'Shahi Badami Mutton Qorma',
    course: 'mains',
    courseLabel: 'Signature Main Course',
    note: 'Slow-braised goat in saffron almond gravy',
    perHeadAddonPkr: 620,
    isSignature: true,
  },
  {
    id: 'mutton-biryani',
    name: 'Copper-Handi Saffron Mutton Biryani',
    course: 'mains',
    courseLabel: 'Signature Main Course',
    note: 'Aged basmati steamed over charcoal dum',
    perHeadAddonPkr: 520,
    isSignature: true,
  },
  {
    id: 'chicken-karahi',
    name: 'Daska Desi Makhan Chicken Karahi',
    course: 'mains',
    courseLabel: 'Signature Main Course',
    note: 'Fresh tomato, crushed coriander & butter finish',
    perHeadAddonPkr: 360,
  },
  {
    id: 'palak-paneer',
    name: 'Creamy Palak Gosht / Paneer',
    course: 'mains',
    courseLabel: 'Signature Main Course',
    note: 'Traditional slow-simmered Punjabi specialty',
    perHeadAddonPkr: 320,
  },
  {
    id: 'roghani-naan',
    name: 'Live Tandoor Roghani & Kalonji Naan',
    course: 'mains',
    courseLabel: 'Signature Main Course',
    note: 'Served hot table-side throughout dinner',
    perHeadAddonPkr: 120,
  },
  // Live BBQ & Tandoor
  {
    id: 'reshmi-kabab',
    name: 'Charcoal Chicken Reshmi & Seekh Kabab',
    course: 'bbq',
    courseLabel: 'Live BBQ & Tandoor',
    note: 'Grilled live over glowing kikar coals',
    perHeadAddonPkr: 340,
  },
  {
    id: 'mutton-chops',
    name: 'Saffron Glazed Mutton Chops',
    course: 'bbq',
    courseLabel: 'Live BBQ & Tandoor',
    note: '24-hour papaya & green cardamom marinade',
    perHeadAddonPkr: 540,
    isSignature: true,
  },
  {
    id: 'malai-boti',
    name: 'Creamy Chicken Malai Boti',
    course: 'bbq',
    courseLabel: 'Live BBQ & Tandoor',
    note: 'Tender boneless skewers with mint chutney',
    perHeadAddonPkr: 310,
  },
  // Royal Desserts & Chai
  {
    id: 'pistachio-kheer',
    name: 'Zafrani Pistachio Matka Kheer',
    course: 'desserts',
    courseLabel: 'Royal Desserts & Chai',
    note: 'Slow-reduced milk topped with silver warq',
    perHeadAddonPkr: 220,
    isSignature: true,
  },
  {
    id: 'gajar-halwa',
    name: 'Desi Ghee Gajar Halwa & Gulab Jamun',
    course: 'desserts',
    courseLabel: 'Royal Desserts & Chai',
    note: 'Warm winter dessert duo with khoya',
    perHeadAddonPkr: 260,
  },
  {
    id: 'kashmiri-chai',
    name: 'Live Samovar Kashmiri Pink Chai',
    course: 'desserts',
    courseLabel: 'Royal Desserts & Chai',
    note: 'Crushed pistachios, almonds & cardamom',
    perHeadAddonPkr: 160,
  },
];

export const MENU_TIERS: MenuTier[] = [
  {
    id: 'silver-heritage',
    name: 'Silver Heritage',
    tagline: 'Refined classic Punjabi dastarkhwan for Mehndi & daytime gatherings',
    basePerHeadPkr: 2150,
    serviceStyle: 'Dual Grand Buffet · Porcelain Dinnerware',
    includedDishIds: [
      'mint-margarita',
      'chicken-karahi',
      'mutton-biryani',
      'roghani-naan',
      'reshmi-kabab',
      'pistachio-kheer',
      'kashmiri-chai',
    ],
  },
  {
    id: 'gold-royal',
    name: 'Gold Royal',
    tagline: 'Signature Daska Baraat menu with live BBQ and mutton qorma',
    basePerHeadPkr: 2950,
    serviceStyle: 'Buffet + VIP Table Service · Brass Chafing Dishes',
    includedDishIds: [
      'mint-margarita',
      'chicken-corn-soup',
      'mutton-qorma',
      'mutton-biryani',
      'chicken-karahi',
      'roghani-naan',
      'reshmi-kabab',
      'malai-boti',
      'pistachio-kheer',
      'gajar-halwa',
      'kashmiri-chai',
    ],
  },
  {
    id: 'platinum-nawabi',
    name: 'Platinum Nawabi',
    tagline: 'Full 14-item royal feast with mutton chops, finger fish & live stations',
    basePerHeadPkr: 3850,
    serviceStyle: 'White-Glove Waiter Service + Dedicated VIP Lounge',
    includedDishIds: DISH_CATALOG.map((d) => d.id),
  },
];

// Initial booked/limited slots for November - December 2026
export const INITIAL_OCCUPIED_SLOTS: Record<string, ('lunch' | 'dinner')[]> = {
  '2026-11-21': ['lunch', 'dinner'],
  '2026-11-22': ['dinner'],
  '2026-11-28': ['lunch', 'dinner'],
  '2026-11-29': ['dinner'],
  '2026-12-05': ['dinner'],
  '2026-12-06': ['lunch', 'dinner'],
  '2026-12-12': ['dinner'],
  '2026-12-13': ['lunch'],
  '2026-12-19': ['lunch', 'dinner'],
  '2026-12-26': ['dinner'],
};

export function formatPkr(amount: number): string {
  return `PKR ${Math.round(amount).toLocaleString('en-PK')}`;
}
