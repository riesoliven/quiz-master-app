export const helpers = [
  { id: 1, name: 'Einstein', icon: '🧠', physics: 95, math: 80, chemistry: 60, biology: 30 },
  { id: 2, name: 'Darwin', icon: '🦜', biology: 95, chemistry: 65, physics: 40, math: 35 },
  { id: 3, name: 'Curie', icon: '⚗️', chemistry: 95, physics: 75, math: 60, biology: 50 },
  { id: 4, name: 'Turing', icon: '💻', math: 95, physics: 70, chemistry: 40, biology: 25 },
  { id: 5, name: 'Newton', icon: '🍎', physics: 90, math: 85, chemistry: 45, biology: 20 },
  { id: 6, name: 'Mendel', icon: '🌱', biology: 90, chemistry: 55, math: 50, physics: 30 }
];

export const questionBank = {
  easy: [
    {
      id: 'e1',
      subject: 'Chemistry',
      icon: '⚗️',
      question: 'What is the chemical symbol for Gold?',
      answers: ['Gd', 'Go', 'Au', 'Ag'],
      correct: 2,
      points: 100
    },
    {
      id: 'e2',
      subject: 'Mathematics',
      icon: '📐',
      question: 'What is 15% of 200?',
      answers: ['25', '30', '35', '40'],
      correct: 1,
      points: 100
    },
    {
      id: 'e3',
      subject: 'Physics',
      icon: '⚛️',
      question: "What is Newton's First Law also known as?",
      answers: ['Law of Acceleration', 'Law of Inertia', 'Law of Action-Reaction', 'Law of Gravity'],
      correct: 1,
      points: 100
    },
    {
      id: 'e4',
      subject: 'Biology',
      icon: '🧬',
      question: 'What is the powerhouse of the cell?',
      answers: ['Nucleus', 'Ribosome', 'Mitochondria', 'Chloroplast'],
      correct: 2,
      points: 100
    },
    {
      id: 'e5',
      subject: 'Chemistry',
      icon: '⚗️',
      question: 'What is H2O commonly known as?',
      answers: ['Hydrogen Peroxide', 'Water', 'Oxygen', 'Hydroxide'],
      correct: 1,
      points: 100
    }
  ],
  average: [
    {
      id: 'a1',
      subject: 'Mathematics',
      icon: '📐',
      question: 'What is the derivative of x²?',
      answers: ['x', '2x', 'x²/2', '2'],
      correct: 1,
      points: 200
    },
    {
      id: 'a2',
      subject: 'Physics',
      icon: '⚛️',
      question: 'What is the speed of light in vacuum?',
      answers: ['299,792 km/s', '299,792 m/s', '3×10⁸ m/s', '3×10⁶ m/s'],
      correct: 2,
      points: 200
    },
    {
      id: 'a3',
      subject: 'Biology',
      icon: '🧬',
      question: 'Which organelle is responsible for photosynthesis?',
      answers: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Ribosome'],
      correct: 1,
      points: 200
    },
    {
      id: 'a4',
      subject: 'Chemistry',
      icon: '⚗️',
      question: 'What is the atomic number of Carbon?',
      answers: ['4', '6', '8', '12'],
      correct: 1,
      points: 200
    }
  ],
  difficult: [
    {
      id: 'd1',
      subject: 'Physics',
      icon: '⚛️',
      question: 'What is the Heisenberg Uncertainty Principle about?',
      answers: [
        'Energy conservation',
        'Position and momentum cannot both be known exactly',
        'Wave-particle duality',
        'Quantum entanglement'
      ],
      correct: 1,
      points: 400
    },
    {
      id: 'd2',
      subject: 'Mathematics',
      icon: '📐',
      question: 'What is the value of e (Euler\'s number) to 2 decimal places?',
      answers: ['2.71', '3.14', '1.61', '2.54'],
      correct: 0,
      points: 400
    },
    {
      id: 'd3',
      subject: 'Biology',
      icon: '🧬',
      question: 'What is the process by which DNA makes RNA called?',
      answers: ['Translation', 'Replication', 'Transcription', 'Transformation'],
      correct: 2,
      points: 400
    }
  ],
  impossible: [
    {
      id: 'i1',
      subject: 'Mathematics',
      icon: '📐',
      question: 'What is the 7th Mersenne prime number?',
      answers: ['127', '524,287', '8191', '131,071'],
      correct: 2,
      points: 800
    },
    {
      id: 'i2',
      subject: 'Physics',
      icon: '⚛️',
      question: 'What is the fine-structure constant approximately equal to?',
      answers: ['1/137', '1/273', '1/89', '1/411'],
      correct: 0,
      points: 800
    }
  ]
};

export const getQuizQuestions = () => {
  const quiz = [];
  
  // Shuffle and select questions
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
  
  quiz.push(...shuffleArray([...questionBank.easy]).slice(0, 5));
  quiz.push(...shuffleArray([...questionBank.average]).slice(0, 4));
  quiz.push(...shuffleArray([...questionBank.difficult]).slice(0, 3));
  quiz.push(...shuffleArray([...questionBank.impossible]).slice(0, 2));
  
  return quiz;
};