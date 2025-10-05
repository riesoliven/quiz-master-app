// 20 Helpers with manual rating upgrade system (NBA 2K style)
// Players spend EXP to upgrade individual subject ratings
// Base = starting rating, Potential = maximum cap

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
    id: 'sir_sam',
    name: 'Sir Sam',
    icon: '🎩',
    image: require('../../assets/helper_images/sir_sam.png'),
    tier: HELPER_TIERS.FREE,
    cost: 0,
    description: 'Distinguished gentleman with balanced knowledge',
    ratings: {
      'Arithmetic & Algebra': { base: 45, potential: 70 },
      'Geometry & Trigonometry': { base: 42, potential: 68 },
      'Statistics & Probability': { base: 48, potential: 72 },
      'Physics': { base: 40, potential: 65 },
      'Chemistry': { base: 38, potential: 63 },
      'Biology': { base: 40, potential: 65 },
      'History': { base: 55, potential: 78 },
      'Sports & Entertainment': { base: 50, potential: 73 },
      'Literature': { base: 45, potential: 70 },
      'Astronomy': { base: 38, potential: 62 },
      'Geography': { base: 52, potential: 75 },
      'Technology': { base: 43, potential: 68 }
    }
  },
  {
    id: 'manny_pacquiao',
    name: 'Manny Pacquiao',
    icon: '🥊',
    image: require('../../assets/helper_images/manny_pacquiao.png'),
    tier: HELPER_TIERS.FREE,
    cost: 0,
    description: 'Eight-division world champion and Filipino legend',
    ratings: {
      'Arithmetic & Algebra': { base: 35, potential: 58 },
      'Geometry & Trigonometry': { base: 32, potential: 55 },
      'Statistics & Probability': { base: 48, potential: 72 },
      'Physics': { base: 45, potential: 68 },
      'Chemistry': { base: 28, potential: 50 },
      'Biology': { base: 40, potential: 65 },
      'History': { base: 50, potential: 73 },
      'Sports & Entertainment': { base: 65, potential: 92 },
      'Literature': { base: 35, potential: 58 },
      'Astronomy': { base: 28, potential: 48 },
      'Geography': { base: 52, potential: 75 },
      'Technology': { base: 32, potential: 55 }
    }
  },
  {
    id: 'annie_librarian',
    name: 'Annie the Librarian',
    icon: '📚',
    image: require('../../assets/helper_images/annie_librarian.png'),
    tier: HELPER_TIERS.FREE,
    cost: 0,
    description: 'Bookworm with deep literary knowledge',
    ratings: {
      'Arithmetic & Algebra': { base: 40, potential: 63 },
      'Geometry & Trigonometry': { base: 38, potential: 60 },
      'Statistics & Probability': { base: 45, potential: 68 },
      'Physics': { base: 32, potential: 55 },
      'Chemistry': { base: 35, potential: 58 },
      'Biology': { base: 42, potential: 68 },
      'History': { base: 60, potential: 85 },
      'Sports & Entertainment': { base: 45, potential: 68 },
      'Literature': { base: 68, potential: 90 },
      'Astronomy': { base: 40, potential: 63 },
      'Geography': { base: 55, potential: 78 },
      'Technology': { base: 30, potential: 52 }
    }
  },

  // COMMON TIER (7 helpers - 1000 coins each)
  {
    id: 'stephen_hawking',
    name: 'Stephen Hawking',
    icon: '🌌',
    image: require('../../assets/helper_images/stephen_hawking.png'),
    tier: HELPER_TIERS.COMMON,
    cost: 1000,
    description: 'Brilliant physicist who explored the cosmos',
    ratings: {
      'Arithmetic & Algebra': { base: 65, potential: 88 },
      'Geometry & Trigonometry': { base: 62, potential: 85 },
      'Statistics & Probability': { base: 58, potential: 80 },
      'Physics': { base: 72, potential: 95 },
      'Chemistry': { base: 55, potential: 78 },
      'Biology': { base: 50, potential: 73 },
      'History': { base: 48, potential: 70 },
      'Sports & Entertainment': { base: 35, potential: 58 },
      'Literature': { base: 52, potential: 75 },
      'Astronomy': { base: 70, potential: 92 },
      'Geography': { base: 42, potential: 65 },
      'Technology': { base: 60, potential: 82 }
    }
  },
  {
    id: 'ada_lovelace',
    name: 'Ada Lovelace',
    icon: '💻',
    image: require('../../assets/helper_images/ada_lovelace.png'),
    tier: HELPER_TIERS.COMMON,
    cost: 1000,
    description: 'Pioneer programmer and mathematician',
    ratings: {
      'Arithmetic & Algebra': { base: 68, potential: 92 },
      'Geometry & Trigonometry': { base: 65, potential: 88 },
      'Statistics & Probability': { base: 70, potential: 90 },
      'Physics': { base: 58, potential: 80 },
      'Chemistry': { base: 45, potential: 68 },
      'Biology': { base: 40, potential: 63 },
      'History': { base: 52, potential: 73 },
      'Sports & Entertainment': { base: 30, potential: 52 },
      'Literature': { base: 55, potential: 75 },
      'Astronomy': { base: 48, potential: 70 },
      'Geography': { base: 42, potential: 65 },
      'Technology': { base: 72, potential: 98 }
    }
  },
  {
    id: 'charles_darwin',
    name: 'Charles Darwin',
    icon: '🐢',
    image: require('../../assets/helper_images/charles_darwin.png'),
    tier: HELPER_TIERS.COMMON,
    cost: 1000,
    description: 'Naturalist who discovered evolution',
    ratings: {
      'Arithmetic & Algebra': { base: 48, potential: 70 },
      'Geometry & Trigonometry': { base: 45, potential: 68 },
      'Statistics & Probability': { base: 58, potential: 80 },
      'Physics': { base: 42, potential: 65 },
      'Chemistry': { base: 55, potential: 78 },
      'Biology': { base: 70, potential: 96 },
      'History': { base: 52, potential: 75 },
      'Sports & Entertainment': { base: 38, potential: 60 },
      'Literature': { base: 48, potential: 70 },
      'Astronomy': { base: 45, potential: 68 },
      'Geography': { base: 62, potential: 85 },
      'Technology': { base: 40, potential: 63 }
    }
  },
  {
    id: 'neil_armstrong',
    name: 'Neil Armstrong',
    icon: '👨‍🚀',
    image: require('../../assets/helper_images/neil_armstrong.png'),
    tier: HELPER_TIERS.COMMON,
    cost: 1000,
    description: 'First human to walk on the moon',
    ratings: {
      'Arithmetic & Algebra': { base: 60, potential: 82 },
      'Geometry & Trigonometry': { base: 62, potential: 85 },
      'Statistics & Probability': { base: 55, potential: 78 },
      'Physics': { base: 68, potential: 90 },
      'Chemistry': { base: 58, potential: 80 },
      'Biology': { base: 50, potential: 73 },
      'History': { base: 48, potential: 70 },
      'Sports & Entertainment': { base: 42, potential: 65 },
      'Literature': { base: 40, potential: 63 },
      'Astronomy': { base: 72, potential: 98 },
      'Geography': { base: 52, potential: 75 },
      'Technology': { base: 65, potential: 88 }
    }
  },
  {
    id: 'alan_turing',
    name: 'Alan Turing',
    icon: '🔐',
    image: require('../../assets/helper_images/alan_turing.png'),
    tier: HELPER_TIERS.COMMON,
    cost: 1000,
    description: 'Mathematician who cracked the Enigma code',
    ratings: {
      'Arithmetic & Algebra': { base: 70, potential: 95 },
      'Geometry & Trigonometry': { base: 68, potential: 92 },
      'Statistics & Probability': { base: 72, potential: 98 },
      'Physics': { base: 62, potential: 85 },
      'Chemistry': { base: 48, potential: 70 },
      'Biology': { base: 42, potential: 65 },
      'History': { base: 50, potential: 73 },
      'Sports & Entertainment': { base: 35, potential: 58 },
      'Literature': { base: 45, potential: 68 },
      'Astronomy': { base: 55, potential: 78 },
      'Geography': { base: 48, potential: 70 },
      'Technology': { base: 70, potential: 95 }
    }
  },
  {
    id: 'cleopatra',
    name: 'Cleopatra',
    icon: '👑',
    image: require('../../assets/helper_images/cleopatra.png'),
    tier: HELPER_TIERS.COMMON,
    cost: 1000,
    description: 'Last pharaoh of ancient Egypt',
    ratings: {
      'Arithmetic & Algebra': { base: 48, potential: 70 },
      'Geometry & Trigonometry': { base: 50, potential: 73 },
      'Statistics & Probability': { base: 42, potential: 65 },
      'Physics': { base: 38, potential: 60 },
      'Chemistry': { base: 45, potential: 68 },
      'Biology': { base: 45, potential: 68 },
      'History': { base: 72, potential: 96 },
      'Sports & Entertainment': { base: 55, potential: 78 },
      'Literature': { base: 65, potential: 88 },
      'Astronomy': { base: 52, potential: 75 },
      'Geography': { base: 68, potential: 92 },
      'Technology': { base: 30, potential: 52 }
    }
  },
  {
    id: 'marco_polo',
    name: 'Marco Polo',
    icon: '🧭',
    image: require('../../assets/helper_images/marco_polo.png'),
    tier: HELPER_TIERS.COMMON,
    cost: 1000,
    description: 'Explorer who traveled the Silk Road',
    ratings: {
      'Arithmetic & Algebra': { base: 48, potential: 70 },
      'Geometry & Trigonometry': { base: 55, potential: 78 },
      'Statistics & Probability': { base: 50, potential: 73 },
      'Physics': { base: 42, potential: 65 },
      'Chemistry': { base: 40, potential: 63 },
      'Biology': { base: 52, potential: 75 },
      'History': { base: 65, potential: 88 },
      'Sports & Entertainment': { base: 48, potential: 70 },
      'Literature': { base: 55, potential: 78 },
      'Astronomy': { base: 58, potential: 80 },
      'Geography': { base: 72, potential: 98 },
      'Technology': { base: 42, potential: 65 }
    }
  },

  // RARE TIER (5 helpers - 5000 coins each)
  {
    id: 'marie_curie',
    name: 'Marie Curie',
    icon: '⚗️',
    image: require('../../assets/helper_images/marie_curie.png'),
    tier: HELPER_TIERS.RARE,
    cost: 5000,
    description: 'Nobel Prize physicist and chemist',
    ratings: {
      'Arithmetic & Algebra': { base: 65, potential: 88 },
      'Geometry & Trigonometry': { base: 62, potential: 85 },
      'Statistics & Probability': { base: 60, potential: 82 },
      'Physics': { base: 72, potential: 98 },
      'Chemistry': { base: 75, potential: 100 },
      'Biology': { base: 58, potential: 80 },
      'History': { base: 52, potential: 75 },
      'Sports & Entertainment': { base: 35, potential: 58 },
      'Literature': { base: 48, potential: 70 },
      'Astronomy': { base: 65, potential: 88 },
      'Geography': { base: 45, potential: 68 },
      'Technology': { base: 62, potential: 85 }
    }
  },
  {
    id: 'shakespeare',
    name: 'Shakespeare',
    icon: '🎭',
    image: require('../../assets/helper_images/shakespeare.png'),
    tier: HELPER_TIERS.RARE,
    cost: 5000,
    description: 'The Bard himself',
    ratings: {
      'Arithmetic & Algebra': { base: 40, potential: 63 },
      'Geometry & Trigonometry': { base: 38, potential: 60 },
      'Statistics & Probability': { base: 35, potential: 58 },
      'Physics': { base: 32, potential: 55 },
      'Chemistry': { base: 35, potential: 58 },
      'Biology': { base: 38, potential: 60 },
      'History': { base: 68, potential: 92 },
      'Sports & Entertainment': { base: 65, potential: 88 },
      'Literature': { base: 75, potential: 100 },
      'Astronomy': { base: 42, potential: 65 },
      'Geography': { base: 60, potential: 82 },
      'Technology': { base: 25, potential: 48 }
    }
  },
  {
    id: 'carl_gauss',
    name: 'Carl Gauss',
    icon: '📐',
    image: require('../../assets/helper_images/carl_gauss.png'),
    tier: HELPER_TIERS.RARE,
    cost: 5000,
    description: 'Prince of Mathematics',
    ratings: {
      'Arithmetic & Algebra': { base: 75, potential: 100 },
      'Geometry & Trigonometry': { base: 75, potential: 100 },
      'Statistics & Probability': { base: 72, potential: 98 },
      'Physics': { base: 68, potential: 92 },
      'Chemistry': { base: 52, potential: 75 },
      'Biology': { base: 45, potential: 68 },
      'History': { base: 48, potential: 70 },
      'Sports & Entertainment': { base: 30, potential: 52 },
      'Literature': { base: 45, potential: 68 },
      'Astronomy': { base: 70, potential: 95 },
      'Geography': { base: 52, potential: 75 },
      'Technology': { base: 58, potential: 80 }
    }
  },
  {
    id: 'nikola_tesla',
    name: 'Nikola Tesla',
    icon: '⚡',
    image: require('../../assets/helper_images/nikola_tesla.png'),
    tier: HELPER_TIERS.RARE,
    cost: 5000,
    description: 'Inventor and electrical engineer',
    ratings: {
      'Arithmetic & Algebra': { base: 68, potential: 90 },
      'Geometry & Trigonometry': { base: 65, potential: 88 },
      'Statistics & Probability': { base: 60, potential: 82 },
      'Physics': { base: 72, potential: 98 },
      'Chemistry': { base: 62, potential: 85 },
      'Biology': { base: 48, potential: 70 },
      'History': { base: 52, potential: 75 },
      'Sports & Entertainment': { base: 35, potential: 58 },
      'Literature': { base: 45, potential: 68 },
      'Astronomy': { base: 58, potential: 80 },
      'Geography': { base: 48, potential: 70 },
      'Technology': { base: 75, potential: 100 }
    }
  },
  {
    id: 'jane_goodall',
    name: 'Jane Goodall',
    icon: '🦍',
    image: require('../../assets/helper_images/jane_goodall.png'),
    tier: HELPER_TIERS.RARE,
    cost: 5000,
    description: 'Primatologist and conservationist',
    ratings: {
      'Arithmetic & Algebra': { base: 52, potential: 75 },
      'Geometry & Trigonometry': { base: 48, potential: 70 },
      'Statistics & Probability': { base: 60, potential: 82 },
      'Physics': { base: 45, potential: 68 },
      'Chemistry': { base: 58, potential: 80 },
      'Biology': { base: 75, potential: 100 },
      'History': { base: 55, potential: 78 },
      'Sports & Entertainment': { base: 40, potential: 63 },
      'Literature': { base: 58, potential: 80 },
      'Astronomy': { base: 48, potential: 70 },
      'Geography': { base: 68, potential: 92 },
      'Technology': { base: 42, potential: 65 }
    }
  },

  // EPIC TIER (3 helpers - 15000 coins each)
  {
    id: 'einstein',
    name: 'Einstein',
    icon: '🧠',
    image: require('../../assets/helper_images/einstein.png'),
    tier: HELPER_TIERS.EPIC,
    cost: 15000,
    description: 'Genius physicist',
    ratings: {
      'Arithmetic & Algebra': { base: 70, potential: 95 },
      'Geometry & Trigonometry': { base: 72, potential: 98 },
      'Statistics & Probability': { base: 68, potential: 92 },
      'Physics': { base: 75, potential: 100 },
      'Chemistry': { base: 65, potential: 88 },
      'Biology': { base: 50, potential: 73 },
      'History': { base: 55, potential: 78 },
      'Sports & Entertainment': { base: 32, potential: 55 },
      'Literature': { base: 52, potential: 75 },
      'Astronomy': { base: 72, potential: 98 },
      'Geography': { base: 52, potential: 75 },
      'Technology': { base: 68, potential: 92 }
    }
  },
  {
    id: 'aristotle',
    name: 'Aristotle',
    icon: '🏛️',
    image: require('../../assets/helper_images/aristotle.png'),
    tier: HELPER_TIERS.EPIC,
    cost: 15000,
    description: 'Ancient philosopher and polymath',
    ratings: {
      'Arithmetic & Algebra': { base: 60, potential: 82 },
      'Geometry & Trigonometry': { base: 62, potential: 85 },
      'Statistics & Probability': { base: 58, potential: 80 },
      'Physics': { base: 58, potential: 80 },
      'Chemistry': { base: 52, potential: 75 },
      'Biology': { base: 65, potential: 88 },
      'History': { base: 72, potential: 98 },
      'Sports & Entertainment': { base: 55, potential: 78 },
      'Literature': { base: 70, potential: 95 },
      'Astronomy': { base: 68, potential: 92 },
      'Geography': { base: 70, potential: 95 },
      'Technology': { base: 38, potential: 60 }
    }
  },
  {
    id: 'frida_kahlo',
    name: 'Frida Kahlo',
    icon: '🎨',
    image: require('../../assets/helper_images/frida_kahlo.png'),
    tier: HELPER_TIERS.EPIC,
    cost: 15000,
    description: 'Iconic artist who painted her truth',
    ratings: {
      'Arithmetic & Algebra': { base: 55, potential: 78 },
      'Geometry & Trigonometry': { base: 62, potential: 85 },
      'Statistics & Probability': { base: 58, potential: 80 },
      'Physics': { base: 52, potential: 75 },
      'Chemistry': { base: 55, potential: 78 },
      'Biology': { base: 60, potential: 82 },
      'History': { base: 70, potential: 95 },
      'Sports & Entertainment': { base: 65, potential: 88 },
      'Literature': { base: 72, potential: 98 },
      'Astronomy': { base: 50, potential: 73 },
      'Geography': { base: 68, potential: 92 },
      'Technology': { base: 48, potential: 70 }
    }
  },

  // LEGENDARY TIER (2 helpers - 50000 coins each)
  {
    id: 'da_vinci',
    name: 'Da Vinci',
    icon: '🎨',
    image: require('../../assets/helper_images/da_vinci.png'),
    tier: HELPER_TIERS.LEGENDARY,
    cost: 50000,
    description: 'Ultimate Renaissance man',
    ratings: {
      'Arithmetic & Algebra': { base: 68, potential: 95 },
      'Geometry & Trigonometry': { base: 72, potential: 98 },
      'Statistics & Probability': { base: 65, potential: 90 },
      'Physics': { base: 70, potential: 95 },
      'Chemistry': { base: 65, potential: 88 },
      'Biology': { base: 68, potential: 92 },
      'History': { base: 70, potential: 95 },
      'Sports & Entertainment': { base: 58, potential: 80 },
      'Literature': { base: 68, potential: 92 },
      'Astronomy': { base: 70, potential: 95 },
      'Geography': { base: 68, potential: 92 },
      'Technology': { base: 72, potential: 98 }
    }
  },
  {
    id: 'snuffles',
    name: 'Snuffles',
    icon: '🐶',
    image: require('../../assets/helper_images/snuffles.png'),
    tier: HELPER_TIERS.LEGENDARY,
    cost: 50000,
    description: 'Super-intelligent dog from another dimension',
    ratings: {
      'Arithmetic & Algebra': { base: 70, potential: 98 },
      'Geometry & Trigonometry': { base: 70, potential: 98 },
      'Statistics & Probability': { base: 72, potential: 100 },
      'Physics': { base: 70, potential: 98 },
      'Chemistry': { base: 68, potential: 95 },
      'Biology': { base: 68, potential: 95 },
      'History': { base: 65, potential: 92 },
      'Sports & Entertainment': { base: 62, potential: 88 },
      'Literature': { base: 65, potential: 92 },
      'Astronomy': { base: 72, potential: 100 },
      'Geography': { base: 68, potential: 95 },
      'Technology': { base: 72, potential: 100 }
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
