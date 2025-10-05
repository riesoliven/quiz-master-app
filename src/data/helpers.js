// 20 Helpers with EXP-based progression
// Each subject has: base rating → potential rating
// Level 1 = base, Level 10 = potential

export const HELPER_TIERS = {
  FREE: 'FREE',
  COMMON: 'COMMON',
  RARE: 'RARE',
  EPIC: 'EPIC',
  LEGENDARY: 'LEGENDARY'
};

export const helpers = [
  // FREE TIER (3 helpers - Start with these)
  {
    id: 'max_chen',
    name: 'Max Chen',
    icon: '🧑‍🎓',
    tier: HELPER_TIERS.FREE,
    cost: 0,
    description: 'Enthusiastic student with balanced skills',
    ratings: {
      'Arithmetic & Algebra': { base: 60, potential: 75 },
      'Geometry & Trigonometry': { base: 55, potential: 70 },
      'Statistics & Probability': { base: 50, potential: 65 },
      'Physics': { base: 45, potential: 60 },
      'Chemistry': { base: 40, potential: 55 },
      'Biology': { base: 40, potential: 55 },
      'History': { base: 50, potential: 65 },
      'Sports & Entertainment': { base: 55, potential: 70 },
      'Literature': { base: 45, potential: 60 },
      'Astronomy': { base: 40, potential: 55 },
      'Geography': { base: 50, potential: 65 },
      'Technology': { base: 60, potential: 75 }
    }
  },
  {
    id: 'coach_rivera',
    name: 'Coach Rivera',
    icon: '🏃',
    tier: HELPER_TIERS.FREE,
    cost: 0,
    description: 'Sports expert with competitive spirit',
    ratings: {
      'Arithmetic & Algebra': { base: 40, potential: 50 },
      'Geometry & Trigonometry': { base: 35, potential: 45 },
      'Statistics & Probability': { base: 55, potential: 70 },
      'Physics': { base: 50, potential: 65 },
      'Chemistry': { base: 30, potential: 40 },
      'Biology': { base: 45, potential: 60 },
      'History': { base: 55, potential: 70 },
      'Sports & Entertainment': { base: 85, potential: 95 },
      'Literature': { base: 40, potential: 50 },
      'Astronomy': { base: 30, potential: 40 },
      'Geography': { base: 60, potential: 75 },
      'Technology': { base: 35, potential: 45 }
    }
  },
  {
    id: 'luna_page',
    name: 'Luna Page',
    icon: '📖',
    tier: HELPER_TIERS.FREE,
    cost: 0,
    description: 'Bookworm with deep literary knowledge',
    ratings: {
      'Arithmetic & Algebra': { base: 45, potential: 55 },
      'Geometry & Trigonometry': { base: 40, potential: 50 },
      'Statistics & Probability': { base: 50, potential: 60 },
      'Physics': { base: 35, potential: 45 },
      'Chemistry': { base: 40, potential: 50 },
      'Biology': { base: 50, potential: 65 },
      'History': { base: 75, potential: 88 },
      'Sports & Entertainment': { base: 50, potential: 60 },
      'Literature': { base: 85, potential: 95 },
      'Astronomy': { base: 45, potential: 55 },
      'Geography': { base: 65, potential: 80 },
      'Technology': { base: 30, potential: 40 }
    }
  },

  // COMMON TIER (7 helpers - 1000 coins each)
  {
    id: 'dr_sato',
    name: 'Dr. Sato',
    icon: '🧪',
    tier: HELPER_TIERS.COMMON,
    cost: 1000,
    description: 'Chemistry professor with lab expertise',
    ratings: {
      'Arithmetic & Algebra': { base: 65, potential: 78 },
      'Geometry & Trigonometry': { base: 60, potential: 72 },
      'Statistics & Probability': { base: 70, potential: 82 },
      'Physics': { base: 75, potential: 87 },
      'Chemistry': { base: 90, potential: 98 },
      'Biology': { base: 70, potential: 82 },
      'History': { base: 45, potential: 55 },
      'Sports & Entertainment': { base: 30, potential: 40 },
      'Literature': { base: 40, potential: 50 },
      'Astronomy': { base: 60, potential: 72 },
      'Geography': { base: 50, potential: 60 },
      'Technology': { base: 65, potential: 78 }
    }
  },
  {
    id: 'ada_lovelace',
    name: 'Ada Lovelace',
    icon: '💻',
    tier: HELPER_TIERS.COMMON,
    cost: 1000,
    description: 'Pioneer programmer and mathematician',
    ratings: {
      'Arithmetic & Algebra': { base: 88, potential: 96 },
      'Geometry & Trigonometry': { base: 82, potential: 92 },
      'Statistics & Probability': { base: 85, potential: 94 },
      'Physics': { base: 70, potential: 80 },
      'Chemistry': { base: 50, potential: 60 },
      'Biology': { base: 40, potential: 50 },
      'History': { base: 60, potential: 70 },
      'Sports & Entertainment': { base: 25, potential: 35 },
      'Literature': { base: 65, potential: 75 },
      'Astronomy': { base: 55, potential: 65 },
      'Geography': { base: 45, potential: 55 },
      'Technology': { base: 95, potential: 100 }
    }
  },
  {
    id: 'darwin_jr',
    name: 'Darwin Jr',
    icon: '🦎',
    tier: HELPER_TIERS.COMMON,
    cost: 1000,
    description: 'Young biologist studying evolution',
    ratings: {
      'Arithmetic & Algebra': { base: 55, potential: 65 },
      'Geometry & Trigonometry': { base: 50, potential: 60 },
      'Statistics & Probability': { base: 70, potential: 82 },
      'Physics': { base: 45, potential: 55 },
      'Chemistry': { base: 65, potential: 78 },
      'Biology': { base: 92, potential: 99 },
      'History': { base: 60, potential: 72 },
      'Sports & Entertainment': { base: 35, potential: 45 },
      'Literature': { base: 55, potential: 65 },
      'Astronomy': { base: 50, potential: 60 },
      'Geography': { base: 75, potential: 88 },
      'Technology': { base: 40, potential: 50 }
    }
  },
  {
    id: 'captain_vega',
    name: 'Captain Vega',
    icon: '🚀',
    tier: HELPER_TIERS.COMMON,
    cost: 1000,
    description: 'Astronaut with stellar knowledge',
    ratings: {
      'Arithmetic & Algebra': { base: 70, potential: 82 },
      'Geometry & Trigonometry': { base: 75, potential: 87 },
      'Statistics & Probability': { base: 65, potential: 78 },
      'Physics': { base: 88, potential: 96 },
      'Chemistry': { base: 65, potential: 78 },
      'Biology': { base: 55, potential: 65 },
      'History': { base: 50, potential: 60 },
      'Sports & Entertainment': { base: 45, potential: 55 },
      'Literature': { base: 40, potential: 50 },
      'Astronomy': { base: 95, potential: 100 },
      'Geography': { base: 60, potential: 72 },
      'Technology': { base: 80, potential: 92 }
    }
  },
  {
    id: 'prof_numbers',
    name: 'Prof. Numbers',
    icon: '🔢',
    tier: HELPER_TIERS.COMMON,
    cost: 1000,
    description: 'Math whiz who loves statistics',
    ratings: {
      'Arithmetic & Algebra': { base: 90, potential: 98 },
      'Geometry & Trigonometry': { base: 88, potential: 96 },
      'Statistics & Probability': { base: 95, potential: 100 },
      'Physics': { base: 75, potential: 87 },
      'Chemistry': { base: 50, potential: 60 },
      'Biology': { base: 45, potential: 55 },
      'History': { base: 40, potential: 50 },
      'Sports & Entertainment': { base: 30, potential: 40 },
      'Literature': { base: 45, potential: 55 },
      'Astronomy': { base: 70, potential: 82 },
      'Geography': { base: 55, potential: 65 },
      'Technology': { base: 85, potential: 94 }
    }
  },
  {
    id: 'historian_grey',
    name: 'Historian Grey',
    icon: '📜',
    tier: HELPER_TIERS.COMMON,
    cost: 1000,
    description: 'Time traveler from the past',
    ratings: {
      'Arithmetic & Algebra': { base: 50, potential: 60 },
      'Geometry & Trigonometry': { base: 55, potential: 65 },
      'Statistics & Probability': { base: 45, potential: 55 },
      'Physics': { base: 40, potential: 50 },
      'Chemistry': { base: 45, potential: 55 },
      'Biology': { base: 50, potential: 60 },
      'History': { base: 92, potential: 99 },
      'Sports & Entertainment': { base: 65, potential: 78 },
      'Literature': { base: 80, potential: 92 },
      'Astronomy': { base: 55, potential: 65 },
      'Geography': { base: 85, potential: 95 },
      'Technology': { base: 25, potential: 35 }
    }
  },
  {
    id: 'geo_explorer',
    name: 'Geo Explorer',
    icon: '🗺️',
    tier: HELPER_TIERS.COMMON,
    cost: 1000,
    description: 'World traveler and cartographer',
    ratings: {
      'Arithmetic & Algebra': { base: 55, potential: 65 },
      'Geometry & Trigonometry': { base: 70, potential: 82 },
      'Statistics & Probability': { base: 60, potential: 72 },
      'Physics': { base: 50, potential: 60 },
      'Chemistry': { base: 45, potential: 55 },
      'Biology': { base: 65, potential: 78 },
      'History': { base: 75, potential: 88 },
      'Sports & Entertainment': { base: 55, potential: 65 },
      'Literature': { base: 60, potential: 72 },
      'Astronomy': { base: 65, potential: 78 },
      'Geography': { base: 95, potential: 100 },
      'Technology': { base: 50, potential: 60 }
    }
  },

  // RARE TIER (5 helpers - 5000 coins each)
  {
    id: 'marie_curie',
    name: 'Marie Curie',
    icon: '⚗️',
    tier: HELPER_TIERS.RARE,
    cost: 5000,
    description: 'Nobel Prize physicist and chemist',
    ratings: {
      'Arithmetic & Algebra': { base: 82, potential: 94 },
      'Geometry & Trigonometry': { base: 78, potential: 90 },
      'Statistics & Probability': { base: 75, potential: 88 },
      'Physics': { base: 95, potential: 100 },
      'Chemistry': { base: 98, potential: 100 },
      'Biology': { base: 70, potential: 82 },
      'History': { base: 60, potential: 72 },
      'Sports & Entertainment': { base: 30, potential: 40 },
      'Literature': { base: 55, potential: 65 },
      'Astronomy': { base: 80, potential: 92 },
      'Geography': { base: 50, potential: 60 },
      'Technology': { base: 75, potential: 88 }
    }
  },
  {
    id: 'shakespeare',
    name: 'Shakespeare',
    icon: '🎭',
    tier: HELPER_TIERS.RARE,
    cost: 5000,
    description: 'The Bard himself',
    ratings: {
      'Arithmetic & Algebra': { base: 45, potential: 55 },
      'Geometry & Trigonometry': { base: 40, potential: 50 },
      'Statistics & Probability': { base: 35, potential: 45 },
      'Physics': { base: 30, potential: 40 },
      'Chemistry': { base: 35, potential: 45 },
      'Biology': { base: 40, potential: 50 },
      'History': { base: 88, potential: 96 },
      'Sports & Entertainment': { base: 80, potential: 92 },
      'Literature': { base: 98, potential: 100 },
      'Astronomy': { base: 45, potential: 55 },
      'Geography': { base: 75, potential: 88 },
      'Technology': { base: 20, potential: 30 }
    }
  },
  {
    id: 'carl_gauss',
    name: 'Carl Gauss',
    icon: '📐',
    tier: HELPER_TIERS.RARE,
    cost: 5000,
    description: 'Prince of Mathematics',
    ratings: {
      'Arithmetic & Algebra': { base: 98, potential: 100 },
      'Geometry & Trigonometry': { base: 98, potential: 100 },
      'Statistics & Probability': { base: 95, potential: 100 },
      'Physics': { base: 88, potential: 96 },
      'Chemistry': { base: 60, potential: 72 },
      'Biology': { base: 50, potential: 60 },
      'History': { base: 55, potential: 65 },
      'Sports & Entertainment': { base: 25, potential: 35 },
      'Literature': { base: 50, potential: 60 },
      'Astronomy': { base: 92, potential: 98 },
      'Geography': { base: 60, potential: 72 },
      'Technology': { base: 70, potential: 82 }
    }
  },
  {
    id: 'nikola_tesla',
    name: 'Nikola Tesla',
    icon: '⚡',
    tier: HELPER_TIERS.RARE,
    cost: 5000,
    description: 'Inventor and electrical engineer',
    ratings: {
      'Arithmetic & Algebra': { base: 85, potential: 95 },
      'Geometry & Trigonometry': { base: 82, potential: 92 },
      'Statistics & Probability': { base: 75, potential: 88 },
      'Physics': { base: 96, potential: 100 },
      'Chemistry': { base: 78, potential: 90 },
      'Biology': { base: 55, potential: 65 },
      'History': { base: 60, potential: 72 },
      'Sports & Entertainment': { base: 35, potential: 45 },
      'Literature': { base: 50, potential: 60 },
      'Astronomy': { base: 70, potential: 82 },
      'Geography': { base: 55, potential: 65 },
      'Technology': { base: 98, potential: 100 }
    }
  },
  {
    id: 'jane_goodall',
    name: 'Jane Goodall',
    icon: '🦍',
    tier: HELPER_TIERS.RARE,
    cost: 5000,
    description: 'Primatologist and conservationist',
    ratings: {
      'Arithmetic & Algebra': { base: 60, potential: 72 },
      'Geometry & Trigonometry': { base: 55, potential: 65 },
      'Statistics & Probability': { base: 75, potential: 88 },
      'Physics': { base: 50, potential: 60 },
      'Chemistry': { base: 70, potential: 82 },
      'Biology': { base: 98, potential: 100 },
      'History': { base: 65, potential: 78 },
      'Sports & Entertainment': { base: 40, potential: 50 },
      'Literature': { base: 70, potential: 82 },
      'Astronomy': { base: 55, potential: 65 },
      'Geography': { base: 85, potential: 95 },
      'Technology': { base: 45, potential: 55 }
    }
  },

  // EPIC TIER (3 helpers - 15000 coins each)
  {
    id: 'einstein',
    name: 'Einstein',
    icon: '🧠',
    tier: HELPER_TIERS.EPIC,
    cost: 15000,
    description: 'Genius physicist',
    ratings: {
      'Arithmetic & Algebra': { base: 90, potential: 98 },
      'Geometry & Trigonometry': { base: 95, potential: 100 },
      'Statistics & Probability': { base: 88, potential: 96 },
      'Physics': { base: 100, potential: 100 },
      'Chemistry': { base: 80, potential: 92 },
      'Biology': { base: 55, potential: 65 },
      'History': { base: 65, potential: 78 },
      'Sports & Entertainment': { base: 25, potential: 35 },
      'Literature': { base: 60, potential: 72 },
      'Astronomy': { base: 98, potential: 100 },
      'Geography': { base: 60, potential: 72 },
      'Technology': { base: 85, potential: 95 }
    }
  },
  {
    id: 'aristotle',
    name: 'Aristotle',
    icon: '🏛️',
    tier: HELPER_TIERS.EPIC,
    cost: 15000,
    description: 'Ancient philosopher and polymath',
    ratings: {
      'Arithmetic & Algebra': { base: 75, potential: 88 },
      'Geometry & Trigonometry': { base: 80, potential: 92 },
      'Statistics & Probability': { base: 70, potential: 82 },
      'Physics': { base: 72, potential: 85 },
      'Chemistry': { base: 65, potential: 78 },
      'Biology': { base: 80, potential: 92 },
      'History': { base: 96, potential: 100 },
      'Sports & Entertainment': { base: 65, potential: 78 },
      'Literature': { base: 92, potential: 98 },
      'Astronomy': { base: 88, potential: 96 },
      'Geography': { base: 90, potential: 98 },
      'Technology': { base: 40, potential: 50 }
    }
  },
  {
    id: 'ada_wong',
    name: 'Ada Wong',
    icon: '🎮',
    tier: HELPER_TIERS.EPIC,
    cost: 15000,
    description: 'AI researcher and gaming expert',
    ratings: {
      'Arithmetic & Algebra': { base: 92, potential: 98 },
      'Geometry & Trigonometry': { base: 88, potential: 96 },
      'Statistics & Probability': { base: 95, potential: 100 },
      'Physics': { base: 82, potential: 92 },
      'Chemistry': { base: 70, potential: 82 },
      'Biology': { base: 65, potential: 78 },
      'History': { base: 60, potential: 72 },
      'Sports & Entertainment': { base: 88, potential: 96 },
      'Literature': { base: 70, potential: 82 },
      'Astronomy': { base: 75, potential: 88 },
      'Geography': { base: 65, potential: 78 },
      'Technology': { base: 100, potential: 100 }
    }
  },

  // LEGENDARY TIER (2 helpers - 50000 coins each)
  {
    id: 'da_vinci',
    name: 'Da Vinci',
    icon: '🎨',
    tier: HELPER_TIERS.LEGENDARY,
    cost: 50000,
    description: 'Ultimate Renaissance man',
    ratings: {
      'Arithmetic & Algebra': { base: 88, potential: 98 },
      'Geometry & Trigonometry': { base: 95, potential: 100 },
      'Statistics & Probability': { base: 82, potential: 94 },
      'Physics': { base: 90, potential: 98 },
      'Chemistry': { base: 80, potential: 92 },
      'Biology': { base: 85, potential: 95 },
      'History': { base: 92, potential: 98 },
      'Sports & Entertainment': { base: 70, potential: 82 },
      'Literature': { base: 88, potential: 96 },
      'Astronomy': { base: 90, potential: 98 },
      'Geography': { base: 85, potential: 95 },
      'Technology': { base: 95, potential: 100 }
    }
  },
  {
    id: 'oracle',
    name: 'The Oracle',
    icon: '🔮',
    tier: HELPER_TIERS.LEGENDARY,
    cost: 50000,
    description: 'All-knowing mystical being',
    ratings: {
      'Arithmetic & Algebra': { base: 95, potential: 100 },
      'Geometry & Trigonometry': { base: 95, potential: 100 },
      'Statistics & Probability': { base: 98, potential: 100 },
      'Physics': { base: 95, potential: 100 },
      'Chemistry': { base: 92, potential: 100 },
      'Biology': { base: 92, potential: 100 },
      'History': { base: 100, potential: 100 },
      'Sports & Entertainment': { base: 85, potential: 95 },
      'Literature': { base: 95, potential: 100 },
      'Astronomy': { base: 100, potential: 100 },
      'Geography': { base: 95, potential: 100 },
      'Technology': { base: 90, potential: 100 }
    }
  }
];

// Get helper by ID
export const getHelperById = (helperId) => {
  return helpers.find(h => h.id === helperId);
};

// Get helpers by tier
export const getHelpersByTier = (tier) => {
  return helpers.filter(h => h.tier === tier);
};
