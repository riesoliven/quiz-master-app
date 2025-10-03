// Question database - 9 subjects with 3 questions per difficulty level

export const questionDatabase = {
  'Arithmetic & Algebra': {
    icon: '📐',
    easy: [
      { id: 'arith_easy_1', question: 'What is 15% of 200?', answers: ['25', '30', '35', '40'], correct: 1, explanation: '15% of 200 = 0.15 × 200 = 30', points: 100 },
      { id: 'arith_easy_2', question: 'What is 7 × 8?', answers: ['54', '56', '58', '60'], correct: 1, explanation: '7 × 8 = 56', points: 100 },
      { id: 'arith_easy_3', question: 'Solve: 3x = 12', answers: ['x = 3', 'x = 4', 'x = 5', 'x = 6'], correct: 1, explanation: 'Divide both sides by 3: x = 12/3 = 4', points: 100 }
    ],
    average: [
      { id: 'arith_avg_1', question: 'What is √144?', answers: ['10', '11', '12', '13'], correct: 2, explanation: '√144 = 12 because 12² = 144', points: 200 },
      { id: 'arith_avg_2', question: 'Solve: 2x + 5 = 15', answers: ['x = 4', 'x = 5', 'x = 6', 'x = 7'], correct: 1, explanation: '2x = 10, so x = 5', points: 200 },
      { id: 'arith_avg_3', question: 'What is 25% of 80?', answers: ['15', '18', '20', '22'], correct: 2, explanation: '25% of 80 = 0.25 × 80 = 20', points: 200 }
    ],
    difficult: [
      { id: 'arith_diff_1', question: 'Solve for x: x² - 5x + 6 = 0', answers: ['x = 1 or 6', 'x = 2 or 3', 'x = 3 or 4', 'x = 2 or 4'], correct: 1, explanation: 'Factoring: (x-2)(x-3) = 0, so x = 2 or x = 3', points: 400 },
      { id: 'arith_diff_2', question: 'If 3ˣ = 81, what is x?', answers: ['2', '3', '4', '5'], correct: 2, explanation: '3⁴ = 81, so x = 4', points: 400 },
      { id: 'arith_diff_3', question: 'What is the sum of first 10 natural numbers?', answers: ['45', '50', '55', '60'], correct: 2, explanation: 'Sum = n(n+1)/2 = 10(11)/2 = 55', points: 400 }
    ],
    impossible: [
      { id: 'arith_imp_1', question: 'What is the 15th Fibonacci number?', answers: ['377', '610', '987', '1597'], correct: 1, explanation: 'The sequence goes: 1,1,2,3,5,8,13,21,34,55,89,144,233,377,610', points: 800 },
      { id: 'arith_imp_2', question: 'Solve: log₂(x) + log₂(x-6) = 4', answers: ['x = 6', 'x = 8', 'x = 10', 'x = 12'], correct: 1, explanation: 'log₂(x(x-6)) = 4, so x² - 6x = 16, x = 8', points: 800 },
      { id: 'arith_imp_3', question: 'What is the value of e^π - π^e (approximately)?', answers: ['0.5', '1.5', '2.5', '3.5'], correct: 0, explanation: 'e^π ≈ 23.14, π^e ≈ 22.46, difference ≈ 0.68', points: 800 }
    ]
  },

  'Geometry & Trigonometry': {
    icon: '📏',
    easy: [
      { id: 'geom_easy_1', question: 'How many degrees in a right angle?', answers: ['45°', '60°', '90°', '180°'], correct: 2, explanation: 'A right angle is exactly 90 degrees', points: 100 },
      { id: 'geom_easy_2', question: 'What is the area of a rectangle with length 5 and width 3?', answers: ['8', '12', '15', '18'], correct: 2, explanation: 'Area = length × width = 5 × 3 = 15', points: 100 },
      { id: 'geom_easy_3', question: 'How many sides does a hexagon have?', answers: ['5', '6', '7', '8'], correct: 1, explanation: 'A hexagon has 6 sides', points: 100 }
    ],
    average: [
      { id: 'geom_avg_1', question: 'What is sin(30°)?', answers: ['0', '0.5', '0.707', '1'], correct: 1, explanation: 'sin(30°) = 1/2 = 0.5', points: 200 },
      { id: 'geom_avg_2', question: 'What is the circumference of a circle with radius 7? (use π ≈ 22/7)', answers: ['22', '44', '66', '88'], correct: 1, explanation: 'C = 2πr = 2 × (22/7) × 7 = 44', points: 200 },
      { id: 'geom_avg_3', question: 'Sum of interior angles of a triangle?', answers: ['90°', '180°', '270°', '360°'], correct: 1, explanation: 'The sum of angles in any triangle is always 180°', points: 200 }
    ],
    difficult: [
      { id: 'geom_diff_1', question: 'What is cos(60°)?', answers: ['0', '0.5', '0.707', '0.866'], correct: 1, explanation: 'cos(60°) = 1/2 = 0.5', points: 400 },
      { id: 'geom_diff_2', question: 'Volume of a sphere with radius 3? (Use π ≈ 3)', answers: ['36', '72', '108', '144'], correct: 2, explanation: 'V = (4/3)πr³ = (4/3) × 3 × 27 = 108', points: 400 },
      { id: 'geom_diff_3', question: 'What is tan(45°)?', answers: ['0', '0.5', '1', '√2'], correct: 2, explanation: 'tan(45°) = 1', points: 400 }
    ],
    impossible: [
      { id: 'geom_imp_1', question: 'What is the exact value of sin(15°)?', answers: ['(√6 - √2)/4', '(√6 + √2)/4', '(√3 - 1)/4', '(√3 + 1)/4'], correct: 0, explanation: 'Using angle subtraction formula: sin(15°) = (√6 - √2)/4', points: 800 },
      { id: 'geom_imp_2', question: 'Surface area of a regular dodecahedron with edge length 2?', answers: ['20.78√3', '41.57√3', '62.35√3', '83.14√3'], correct: 1, explanation: 'SA = 3√(25+10√5)a² ≈ 41.57√3 for a=2', points: 800 },
      { id: 'geom_imp_3', question: 'What is the sum of interior angles of a 17-sided polygon?', answers: ['2520°', '2700°', '2880°', '3060°'], correct: 1, explanation: 'Sum = (n-2)×180° = 15×180° = 2700°', points: 800 }
    ]
  },

  'Statistics & Probability': {
    icon: '📊',
    easy: [
      { id: 'stat_easy_1', question: 'What is the mean of 2, 4, 6, 8, 10?', answers: ['4', '5', '6', '7'], correct: 2, explanation: 'Mean = (2+4+6+8+10)/5 = 30/5 = 6', points: 100 },
      { id: 'stat_easy_2', question: 'What is the probability of flipping heads on a fair coin?', answers: ['0.25', '0.5', '0.75', '1'], correct: 1, explanation: 'A fair coin has 2 outcomes, probability of heads = 1/2 = 0.5', points: 100 },
      { id: 'stat_easy_3', question: 'What is the median of 1, 3, 5, 7, 9?', answers: ['3', '5', '7', '9'], correct: 1, explanation: 'The median is the middle value: 5', points: 100 }
    ],
    average: [
      { id: 'stat_avg_1', question: 'Rolling a die, what is P(rolling > 4)?', answers: ['1/6', '1/3', '1/2', '2/3'], correct: 1, explanation: 'Numbers > 4 are 5,6. So P = 2/6 = 1/3', points: 200 },
      { id: 'stat_avg_2', question: 'What is the mode of 2, 3, 3, 4, 5, 5, 5, 6?', answers: ['3', '4', '5', '6'], correct: 2, explanation: 'Mode is the most frequent value: 5 appears 3 times', points: 200 },
      { id: 'stat_avg_3', question: 'Standard deck of cards, P(drawing a heart)?', answers: ['1/13', '1/4', '1/2', '4/13'], correct: 1, explanation: '13 hearts out of 52 cards = 13/52 = 1/4', points: 200 }
    ],
    difficult: [
      { id: 'stat_diff_1', question: 'Two dice rolled, what is P(sum = 7)?', answers: ['1/12', '1/6', '1/4', '1/3'], correct: 1, explanation: '6 combinations make 7: (1,6)(2,5)(3,4)(4,3)(5,2)(6,1) out of 36 = 6/36 = 1/6', points: 400 },
      { id: 'stat_diff_2', question: 'What is the variance of 2, 4, 6, 8?', answers: ['3', '4', '5', '6'], correct: 2, explanation: 'Mean=5, variance=((9+1+1+9)/4)=5', points: 400 },
      { id: 'stat_diff_3', question: 'Choosing 2 cards without replacement, P(both aces)?', answers: ['1/221', '4/221', '1/169', '4/169'], correct: 0, explanation: '(4/52) × (3/51) = 12/2652 = 1/221', points: 400 }
    ],
    impossible: [
      { id: 'stat_imp_1', question: 'What is the expected value of rolling a fair die?', answers: ['3', '3.5', '4', '4.5'], correct: 1, explanation: 'E(X) = (1+2+3+4+5+6)/6 = 21/6 = 3.5', points: 800 },
      { id: 'stat_imp_2', question: 'In a normal distribution, what % is within 2 standard deviations?', answers: ['68%', '90%', '95%', '99%'], correct: 2, explanation: 'Empirical rule: 95% within 2σ of mean', points: 800 },
      { id: 'stat_imp_3', question: 'Birthday paradox: How many people for >50% chance of shared birthday?', answers: ['23', '50', '183', '253'], correct: 0, explanation: 'With 23 people, probability exceeds 50%', points: 800 }
    ]
  },

  Physics: {
    icon: '⚛️',
    easy: [
      { id: 'phys_easy_1', question: "What is Newton's First Law also known as?", answers: ['Law of Acceleration', 'Law of Inertia', 'Law of Action-Reaction', 'Law of Gravity'], correct: 1, explanation: "Newton's First Law is the Law of Inertia", points: 100 },
      { id: 'phys_easy_2', question: 'What force pulls objects toward Earth?', answers: ['Magnetism', 'Friction', 'Gravity', 'Tension'], correct: 2, explanation: 'Gravity is the force that attracts objects to Earth', points: 100 },
      { id: 'phys_easy_3', question: 'What is the unit of force?', answers: ['Joule', 'Newton', 'Watt', 'Pascal'], correct: 1, explanation: 'Force is measured in Newtons (N)', points: 100 }
    ],
    average: [
      { id: 'phys_avg_1', question: 'What is the speed of light in vacuum?', answers: ['299,792 km/s', '299,792 m/s', '3×10⁸ m/s', '3×10⁶ m/s'], correct: 2, explanation: 'Speed of light = 3×10⁸ m/s', points: 200 },
      { id: 'phys_avg_2', question: 'What is the formula for kinetic energy?', answers: ['mgh', '½mv²', 'mv', 'ma'], correct: 1, explanation: 'Kinetic energy KE = ½mv²', points: 200 },
      { id: 'phys_avg_3', question: 'What is the acceleration due to gravity on Earth?', answers: ['8.8 m/s²', '9.8 m/s²', '10.8 m/s²', '11.8 m/s²'], correct: 1, explanation: 'g ≈ 9.8 m/s²', points: 200 }
    ],
    difficult: [
      { id: 'phys_diff_1', question: 'What is the Heisenberg Uncertainty Principle about?', answers: ['Energy conservation', 'Position and momentum cannot both be known exactly', 'Wave-particle duality', 'Quantum entanglement'], correct: 1, explanation: 'It states we cannot know both position and momentum precisely', points: 400 },
      { id: 'phys_diff_2', question: "What is Planck's constant approximately?", answers: ['6.63×10⁻³⁴ J·s', '9.81×10⁻³⁴ J·s', '3.00×10⁸ J·s', '1.60×10⁻¹⁹ J·s'], correct: 0, explanation: 'h ≈ 6.63×10⁻³⁴ J·s', points: 400 },
      { id: 'phys_diff_3', question: 'What particle mediates the electromagnetic force?', answers: ['Gluon', 'Photon', 'W Boson', 'Graviton'], correct: 1, explanation: 'Photons are the force carriers of electromagnetism', points: 400 }
    ],
    impossible: [
      { id: 'phys_imp_1', question: 'What is the fine-structure constant approximately?', answers: ['1/137', '1/273', '1/89', '1/411'], correct: 0, explanation: 'α ≈ 1/137', points: 800 },
      { id: 'phys_imp_2', question: 'What is the mass of the Higgs boson in GeV/c²?', answers: ['91', '125', '173', '246'], correct: 1, explanation: 'Higgs boson mass ≈ 125 GeV/c²', points: 800 },
      { id: 'phys_imp_3', question: 'What is the Schwarzschild radius of a 1 solar mass black hole?', answers: ['1 km', '3 km', '10 km', '30 km'], correct: 1, explanation: 'Rs = 2GM/c² ≈ 3 km for 1 solar mass', points: 800 }
    ]
  },

  Chemistry: {
    icon: '⚗️',
    easy: [
      { id: 'chem_easy_1', question: 'What is the chemical symbol for Gold?', answers: ['Gd', 'Go', 'Au', 'Ag'], correct: 2, explanation: 'Au comes from the Latin word "aurum"', points: 100 },
      { id: 'chem_easy_2', question: 'What is H₂O commonly known as?', answers: ['Hydrogen Peroxide', 'Water', 'Oxygen', 'Hydroxide'], correct: 1, explanation: 'H₂O is water', points: 100 },
      { id: 'chem_easy_3', question: 'What is the chemical formula for table salt?', answers: ['NaCl', 'KCl', 'CaCl₂', 'MgCl₂'], correct: 0, explanation: 'Table salt is sodium chloride (NaCl)', points: 100 }
    ],
    average: [
      { id: 'chem_avg_1', question: 'What is the atomic number of Carbon?', answers: ['4', '6', '8', '12'], correct: 1, explanation: 'Carbon has 6 protons', points: 200 },
      { id: 'chem_avg_2', question: 'What is the pH of pure water at 25°C?', answers: ['0', '7', '10', '14'], correct: 1, explanation: 'Pure water has pH = 7 (neutral)', points: 200 },
      { id: 'chem_avg_3', question: 'What is the most abundant gas in Earth\'s atmosphere?', answers: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'], correct: 2, explanation: 'Nitrogen makes up about 78% of the atmosphere', points: 200 }
    ],
    difficult: [
      { id: 'chem_diff_1', question: 'What is Avogadro\'s number approximately?', answers: ['6.02×10²³', '9.81×10²³', '3.14×10²³', '1.60×10²³'], correct: 0, explanation: 'Avogadro\'s number ≈ 6.02×10²³ mol⁻¹', points: 400 },
      { id: 'chem_diff_2', question: 'What is the electron configuration of Iron (Fe)?', answers: ['[Ar] 4s² 3d⁶', '[Ar] 4s¹ 3d⁷', '[Ar] 3d⁸', '[Kr] 4s² 3d⁶'], correct: 0, explanation: 'Iron has 26 electrons: [Ar] 4s² 3d⁶', points: 400 },
      { id: 'chem_diff_3', question: 'Which element has the highest electronegativity?', answers: ['Oxygen', 'Fluorine', 'Chlorine', 'Nitrogen'], correct: 1, explanation: 'Fluorine has the highest electronegativity (4.0)', points: 400 }
    ],
    impossible: [
      { id: 'chem_imp_1', question: 'What is the bond angle in methane (CH₄)?', answers: ['90°', '104.5°', '109.5°', '120°'], correct: 2, explanation: 'Tetrahedral geometry: 109.5°', points: 800 },
      { id: 'chem_imp_2', question: 'What is the standard reduction potential of Cu²⁺/Cu?', answers: ['+0.34 V', '+0.52 V', '+0.80 V', '+1.07 V'], correct: 0, explanation: 'E° = +0.34 V for Cu²⁺ + 2e⁻ → Cu', points: 800 },
      { id: 'chem_imp_3', question: 'What is the crystal structure of diamond?', answers: ['Face-centered cubic', 'Body-centered cubic', 'Hexagonal close-packed', 'Cubic diamond'], correct: 3, explanation: 'Diamond has a cubic diamond crystal structure', points: 800 }
    ]
  },

  Biology: {
    icon: '🧬',
    easy: [
      { id: 'bio_easy_1', question: 'What is the powerhouse of the cell?', answers: ['Nucleus', 'Ribosome', 'Mitochondria', 'Chloroplast'], correct: 2, explanation: 'Mitochondria produce ATP energy', points: 100 },
      { id: 'bio_easy_2', question: 'How many chromosomes do humans have?', answers: ['23', '46', '48', '92'], correct: 1, explanation: 'Humans have 46 chromosomes (23 pairs)', points: 100 },
      { id: 'bio_easy_3', question: 'What gas do plants absorb during photosynthesis?', answers: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correct: 2, explanation: 'Plants absorb CO₂ during photosynthesis', points: 100 }
    ],
    average: [
      { id: 'bio_avg_1', question: 'Which organelle performs photosynthesis?', answers: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Ribosome'], correct: 1, explanation: 'Chloroplasts contain chlorophyll for photosynthesis', points: 200 },
      { id: 'bio_avg_2', question: 'What are the four DNA bases?', answers: ['A,T,C,G', 'A,U,C,G', 'A,T,U,G', 'A,B,C,D'], correct: 0, explanation: 'Adenine, Thymine, Cytosine, Guanine', points: 200 },
      { id: 'bio_avg_3', question: 'What is the largest organ in the human body?', answers: ['Liver', 'Brain', 'Skin', 'Heart'], correct: 2, explanation: 'Skin is the largest organ', points: 200 }
    ],
    difficult: [
      { id: 'bio_diff_1', question: 'What is the process of DNA → RNA called?', answers: ['Translation', 'Replication', 'Transcription', 'Transformation'], correct: 2, explanation: 'Transcription converts DNA to RNA', points: 400 },
      { id: 'bio_diff_2', question: 'What blood type is the universal donor?', answers: ['A+', 'B+', 'AB+', 'O-'], correct: 3, explanation: 'O- can donate to all blood types', points: 400 },
      { id: 'bio_diff_3', question: 'What is the function of ribosomes?', answers: ['DNA replication', 'Protein synthesis', 'Energy production', 'Lipid synthesis'], correct: 1, explanation: 'Ribosomes synthesize proteins', points: 400 }
    ],
    impossible: [
      { id: 'bio_imp_1', question: 'How many ATP molecules are produced from one glucose in aerobic respiration?', answers: ['2', '4', '32', '38'], correct: 3, explanation: 'Aerobic respiration yields ~36-38 ATP', points: 800 },
      { id: 'bio_imp_2', question: 'What is the resting membrane potential of a neuron?', answers: ['-40 mV', '-55 mV', '-70 mV', '-90 mV'], correct: 2, explanation: 'Typical resting potential is -70 mV', points: 800 },
      { id: 'bio_imp_3', question: 'What enzyme unwinds DNA during replication?', answers: ['DNA polymerase', 'Helicase', 'Ligase', 'Primase'], correct: 1, explanation: 'Helicase unwinds the DNA double helix', points: 800 }
    ]
  },

  History: {
    icon: '🏛️',
    easy: [
      { id: 'hist_easy_1', question: 'In what year did World War II end?', answers: ['1943', '1944', '1945', '1946'], correct: 2, explanation: 'World War II ended in 1945', points: 100 },
      { id: 'hist_easy_2', question: 'Who was the first President of the United States?', answers: ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'], correct: 1, explanation: 'George Washington was the first U.S. President', points: 100 },
      { id: 'hist_easy_3', question: 'What year did the Titanic sink?', answers: ['1910', '1912', '1914', '1916'], correct: 1, explanation: 'The Titanic sank in 1912', points: 100 }
    ],
    average: [
      { id: 'hist_avg_1', question: 'Who wrote the Declaration of Independence?', answers: ['George Washington', 'Benjamin Franklin', 'Thomas Jefferson', 'John Adams'], correct: 2, explanation: 'Thomas Jefferson was the primary author', points: 200 },
      { id: 'hist_avg_2', question: 'What ancient wonder is still standing?', answers: ['Colossus of Rhodes', 'Great Pyramid of Giza', 'Hanging Gardens', 'Lighthouse of Alexandria'], correct: 1, explanation: 'Only the Great Pyramid still stands', points: 200 },
      { id: 'hist_avg_3', question: 'What year did the Berlin Wall fall?', answers: ['1987', '1989', '1991', '1993'], correct: 1, explanation: 'The Berlin Wall fell in 1989', points: 200 }
    ],
    difficult: [
      { id: 'hist_diff_1', question: 'Who was the first Roman Emperor?', answers: ['Julius Caesar', 'Augustus', 'Nero', 'Caligula'], correct: 1, explanation: 'Augustus (Octavian) was the first Roman Emperor', points: 400 },
      { id: 'hist_diff_2', question: 'What treaty ended World War I?', answers: ['Treaty of Paris', 'Treaty of Versailles', 'Treaty of Ghent', 'Treaty of Vienna'], correct: 1, explanation: 'The Treaty of Versailles ended WWI', points: 400 },
      { id: 'hist_diff_3', question: 'What year did the French Revolution begin?', answers: ['1789', '1791', '1793', '1795'], correct: 0, explanation: 'The French Revolution began in 1789', points: 400 }
    ],
    impossible: [
      { id: 'hist_imp_1', question: 'Who was the youngest U.S. President ever elected?', answers: ['Theodore Roosevelt', 'John F. Kennedy', 'Bill Clinton', 'Barack Obama'], correct: 1, explanation: 'JFK was 43 when elected (youngest elected)', points: 800 },
      { id: 'hist_imp_2', question: 'What year was the Magna Carta signed?', answers: ['1066', '1215', '1337', '1453'], correct: 1, explanation: 'Magna Carta was signed in 1215', points: 800 },
      { id: 'hist_imp_3', question: 'How long did the Hundred Years\' War actually last?', answers: ['100 years', '116 years', '99 years', '150 years'], correct: 1, explanation: 'It lasted 116 years (1337-1453)', points: 800 }
    ]
  },

  'Sports & Entertainment': {
    icon: '⚽',
    easy: [
      { id: 'sport_easy_1', question: 'How many players on a soccer team on the field?', answers: ['9', '10', '11', '12'], correct: 2, explanation: '11 players per team on the field', points: 100 },
      { id: 'sport_easy_2', question: 'What sport is played at Wimbledon?', answers: ['Golf', 'Tennis', 'Cricket', 'Soccer'], correct: 1, explanation: 'Wimbledon is a tennis tournament', points: 100 },
      { id: 'sport_easy_3', question: 'How many rings are on the Olympic flag?', answers: ['4', '5', '6', '7'], correct: 1, explanation: '5 interlocking rings representing continents', points: 100 }
    ],
    average: [
      { id: 'sport_avg_1', question: 'What movie won Best Picture at the 2020 Oscars?', answers: ['1917', 'Joker', 'Parasite', 'Once Upon a Time'], correct: 2, explanation: 'Parasite won Best Picture in 2020', points: 200 },
      { id: 'sport_avg_2', question: 'How many points is a touchdown in American football?', answers: ['5', '6', '7', '8'], correct: 1, explanation: 'A touchdown is worth 6 points', points: 200 },
      { id: 'sport_avg_3', question: 'What is the maximum break in snooker?', answers: ['147', '180', '200', '501'], correct: 0, explanation: 'Maximum break in snooker is 147', points: 200 }
    ],
    difficult: [
      { id: 'sport_diff_1', question: 'Who has won the most Grand Slam tennis titles (as of 2024)?', answers: ['Roger Federer', 'Rafael Nadal', 'Novak Djokovic', 'Pete Sampras'], correct: 2, explanation: 'Novak Djokovic has 24 Grand Slam titles', points: 400 },
      { id: 'sport_diff_2', question: 'What TV show had the finale with the most viewers in US history?', answers: ['Friends', 'Seinfeld', 'Cheers', 'M*A*S*H'], correct: 3, explanation: 'M*A*S*H finale had 105.9 million viewers', points: 400 },
      { id: 'sport_diff_3', question: 'In what year were the first modern Olympics held?', answers: ['1892', '1896', '1900', '1904'], correct: 1, explanation: 'First modern Olympics: Athens 1896', points: 400 }
    ],
    impossible: [
      { id: 'sport_imp_1', question: 'Who holds the record for most goals in a calendar year?', answers: ['Pelé', 'Messi', 'Ronaldo', 'Romário'], correct: 1, explanation: 'Messi scored 91 goals in 2012', points: 800 },
      { id: 'sport_imp_2', question: 'What is the diameter of a basketball hoop in inches?', answers: ['16', '18', '20', '22'], correct: 1, explanation: 'Basketball hoop diameter is 18 inches', points: 800 },
      { id: 'sport_imp_3', question: 'How many Best Actor Oscars has Daniel Day-Lewis won?', answers: ['1', '2', '3', '4'], correct: 2, explanation: 'Daniel Day-Lewis has won 3 Best Actor Oscars', points: 800 }
    ]
  },

  Literature: {
    icon: '📚',
    easy: [
      { id: 'lit_easy_1', question: 'Who wrote "Romeo and Juliet"?', answers: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'], correct: 1, explanation: 'Shakespeare wrote Romeo and Juliet', points: 100 },
      { id: 'lit_easy_2', question: 'What is the first book of the Harry Potter series?', answers: ['Chamber of Secrets', 'Prisoner of Azkaban', 'Philosopher\'s Stone', 'Goblet of Fire'], correct: 2, explanation: 'First book: Harry Potter and the Philosopher\'s Stone', points: 100 },
      { id: 'lit_easy_3', question: 'Who wrote "1984"?', answers: ['Aldous Huxley', 'George Orwell', 'Ray Bradbury', 'H.G. Wells'], correct: 1, explanation: 'George Orwell wrote 1984', points: 100 }
    ],
    average: [
      { id: 'lit_avg_1', question: 'What is the opening line of "A Tale of Two Cities"?', answers: ['"Call me Ishmael"', '"It was the best of times"', '"Happy families are all alike"', '"It is a truth universally acknowledged"'], correct: 1, explanation: '"It was the best of times, it was the worst of times"', points: 200 },
      { id: 'lit_avg_2', question: 'Who wrote "To Kill a Mockingbird"?', answers: ['Harper Lee', 'Toni Morrison', 'Maya Angelou', 'Alice Walker'], correct: 0, explanation: 'Harper Lee wrote To Kill a Mockingbird', points: 200 },
      { id: 'lit_avg_3', question: 'What is Sherlock Holmes\' address?', answers: ['221B Baker Street', '10 Downing Street', '4 Privet Drive', '12 Grimmauld Place'], correct: 0, explanation: 'Sherlock Holmes lives at 221B Baker Street', points: 200 }
    ],
    difficult: [
      { id: 'lit_diff_1', question: 'Who wrote "The Great Gatsby"?', answers: ['Ernest Hemingway', 'F. Scott Fitzgerald', 'John Steinbeck', 'William Faulkner'], correct: 1, explanation: 'F. Scott Fitzgerald wrote The Great Gatsby', points: 400 },
      { id: 'lit_diff_2', question: 'In "Moby Dick", what is the name of the ship?', answers: ['The Hispaniola', 'The Pequod', 'The Nautilus', 'The Black Pearl'], correct: 1, explanation: 'The ship is called the Pequod', points: 400 },
      { id: 'lit_diff_3', question: 'Who wrote "One Hundred Years of Solitude"?', answers: ['Jorge Luis Borges', 'Pablo Neruda', 'Gabriel García Márquez', 'Isabel Allende'], correct: 2, explanation: 'Gabriel García Márquez wrote this masterpiece', points: 400 }
    ],
    impossible: [
      { id: 'lit_imp_1', question: 'How many cantos are in Dante\'s "Divine Comedy"?', answers: ['33', '66', '100', '120'], correct: 2, explanation: '100 cantos total (34 + 33 + 33)', points: 800 },
      { id: 'lit_imp_2', question: 'What was James Joyce\'s last novel?', answers: ['Ulysses', 'A Portrait of the Artist', 'Finnegans Wake', 'Dubliners'], correct: 2, explanation: 'Finnegans Wake was Joyce\'s final novel', points: 800 },
      { id: 'lit_imp_3', question: 'Who wrote "The Metamorphosis"?', answers: ['Franz Kafka', 'Albert Camus', 'Jean-Paul Sartre', 'Hermann Hesse'], correct: 0, explanation: 'Franz Kafka wrote The Metamorphosis', points: 800 }
    ]
  }
};

// Helper characters with updated subject skills
export const helpers = [
  { id: 1, name: 'Einstein', icon: '🧠', 'Arithmetic & Algebra': 85, 'Geometry & Trigonometry': 90, 'Statistics & Probability': 80, Physics: 95, Chemistry: 70, Biology: 40, History: 50, 'Sports & Entertainment': 20, Literature: 45 },
  { id: 2, name: 'Darwin', icon: '🦜', 'Arithmetic & Algebra': 50, 'Geometry & Trigonometry': 45, 'Statistics & Probability': 70, Physics: 40, Chemistry: 65, Biology: 95, History: 60, 'Sports & Entertainment': 30, Literature: 55 },
  { id: 3, name: 'Curie', icon: '⚗️', 'Arithmetic & Algebra': 75, 'Geometry & Trigonometry': 70, 'Statistics & Probability': 65, Physics: 85, Chemistry: 95, Biology: 50, History: 45, 'Sports & Entertainment': 25, Literature: 40 },
  { id: 4, name: 'Turing', icon: '💻', 'Arithmetic & Algebra': 95, 'Geometry & Trigonometry': 88, 'Statistics & Probability': 90, Physics: 70, Chemistry: 45, Biology: 30, History: 40, 'Sports & Entertainment': 35, Literature: 50 },
  { id: 5, name: 'Shakespeare', icon: '🎭', 'Arithmetic & Algebra': 40, 'Geometry & Trigonometry': 35, 'Statistics & Probability': 30, Physics: 25, Chemistry: 30, Biology: 35, History: 85, 'Sports & Entertainment': 75, Literature: 95 },
  { id: 6, name: 'Aristotle', icon: '📜', 'Arithmetic & Algebra': 70, 'Geometry & Trigonometry': 75, 'Statistics & Probability': 60, Physics: 60, Chemistry: 55, Biology: 70, History: 90, 'Sports & Entertainment': 50, Literature: 85 }
];

// Get quiz questions (14 questions, randomized from all subjects)
export const getQuizQuestions = (config = {}) => {
  const {
    subjects = Object.keys(questionDatabase),
    distribution = { easy: 5, average: 4, difficult: 3, impossible: 2 }
  } = config;

  const questions = [];

  Object.entries(distribution).forEach(([difficulty, count]) => {
    const availableQuestions = [];

    subjects.forEach(subject => {
      if (questionDatabase[subject] && questionDatabase[subject][difficulty]) {
        availableQuestions.push(...questionDatabase[subject][difficulty].map(q => ({
          ...q,
          subject,
          icon: questionDatabase[subject].icon,
          difficulty,
          points: difficulty === 'easy' ? 100 : difficulty === 'average' ? 200 : difficulty === 'difficult' ? 400 : 800
        })));
      }
    });

    // Shuffle and pick random questions
    const shuffled = availableQuestions.sort(() => Math.random() - 0.5);
    questions.push(...shuffled.slice(0, Math.min(count, shuffled.length)));
  });

  // Shuffle final question order
  return questions.sort(() => Math.random() - 0.5).slice(0, 14);
};

// Add question function (for Question Manager)
export const addQuestion = (question) => {
  const { subject, difficulty } = question;
  if (questionDatabase[subject] && questionDatabase[subject][difficulty]) {
    questionDatabase[subject][difficulty].push({
      ...question,
      id: `${subject.toLowerCase().replace(/\s+/g, '_')}_${difficulty}_${Date.now()}`,
      addedDate: new Date().toISOString()
    });
    return true;
  }
  return false;
};

// Load questions from JSON
export const loadQuestionsFromJSON = async (jsonData) => {
  try {
    const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    let count = 0;

    parsed.forEach(question => {
      if (addQuestion(question)) {
        count++;
      }
    });

    return { success: true, count };
  } catch (error) {
    console.error('Error loading questions:', error);
    return { success: false, error: error.message };
  }
};

// Export questions to JSON
export const exportQuestionsToJSON = () => {
  const allQuestions = [];

  Object.entries(questionDatabase).forEach(([subject, data]) => {
    ['easy', 'average', 'difficult', 'impossible'].forEach(difficulty => {
      if (data[difficulty] && Array.isArray(data[difficulty])) {
        data[difficulty].forEach(q => {
          allQuestions.push({
            ...q,
            subject,
            difficulty
          });
        });
      }
    });
  });

  return JSON.stringify(allQuestions, null, 2);
};
