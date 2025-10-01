// Question template for reference
const questionTemplate = {
  id: 'unique_id',
  subject: 'Mathematics',
  icon: '📐',
  difficulty: 'easy',
  points: 100,
  question: 'Question text',
  answers: ['A', 'B', 'C', 'D'],
  correct: 0,
  explanation: 'Why this answer is correct',
  tags: [],
  timesSeen: 0,
  timesCorrect: 0,
  addedDate: '2024-01-01'
};

// Store questions by subject
export const questionDatabase = {
  Mathematics: {
    icon: '📐',
    easy: [
      {
        id: 'math_easy_1',
        question: 'What is 15% of 200?',
        answers: ['25', '30', '35', '40'],
        correct: 1,
        explanation: '15% of 200 = 0.15 × 200 = 30',
        points: 100
      },
      {
        id: 'math_easy_2',
        question: 'What is 7 × 8?',
        answers: ['54', '56', '58', '60'],
        correct: 1,
        explanation: '7 × 8 = 56',
        points: 100
      }
    ],
    average: [
      {
        id: 'math_avg_1',
        question: 'What is the derivative of x²?',
        answers: ['x', '2x', 'x²/2', '2'],
        correct: 1,
        explanation: 'Using power rule: d/dx(x²) = 2x',
        points: 200
      }
    ],
    difficult: [
      {
        id: 'math_diff_1',
        question: "What is e (Euler's number) to 2 decimal places?",
        answers: ['2.71', '3.14', '1.61', '2.54'],
        correct: 0,
        explanation: 'e ≈ 2.71828...',
        points: 400
      }
    ],
    impossible: [
      {
        id: 'math_imp_1',
        question: 'What is the 7th Mersenne prime?',
        answers: ['127', '524287', '8191', '131071'],
        correct: 2,
        explanation: 'The 7th Mersenne prime is 2^13 - 1 = 8191',
        points: 800
      }
    ]
  },
  Physics: {
    icon: '⚛️',
    easy: [
      {
        id: 'phys_easy_1',
        question: "What is Newton's First Law also known as?",
        answers: ['Law of Acceleration', 'Law of Inertia', 'Law of Action-Reaction', 'Law of Gravity'],
        correct: 1,
        explanation: "Newton's First Law is the Law of Inertia",
        points: 100
      }
    ],
    average: [
      {
        id: 'phys_avg_1',
        question: 'What is the speed of light in vacuum?',
        answers: ['299,792 km/s', '299,792 m/s', '3×10⁸ m/s', '3×10⁶ m/s'],
        correct: 2,
        explanation: 'Speed of light = 3×10⁸ m/s',
        points: 200
      }
    ],
    difficult: [
      {
        id: 'phys_diff_1',
        question: 'What is the Heisenberg Uncertainty Principle about?',
        answers: [
          'Energy conservation',
          'Position and momentum cannot both be known exactly',
          'Wave-particle duality',
          'Quantum entanglement'
        ],
        correct: 1,
        explanation: 'It states we cannot know both position and momentum precisely',
        points: 400
      }
    ],
    impossible: [
      {
        id: 'phys_imp_1',
        question: 'What is the fine-structure constant approximately?',
        answers: ['1/137', '1/273', '1/89', '1/411'],
        correct: 0,
        explanation: 'α ≈ 1/137',
        points: 800
      }
    ]
  },
  Chemistry: {
    icon: '⚗️',
    easy: [
      {
        id: 'chem_easy_1',
        question: 'What is the chemical symbol for Gold?',
        answers: ['Gd', 'Go', 'Au', 'Ag'],
        correct: 2,
        explanation: 'Au comes from the Latin word "aurum"',
        points: 100
      },
      {
        id: 'chem_easy_2',
        question: 'What is H2O commonly known as?',
        answers: ['Hydrogen Peroxide', 'Water', 'Oxygen', 'Hydroxide'],
        correct: 1,
        explanation: 'H2O is water',
        points: 100
      }
    ],
    average: [
      {
        id: 'chem_avg_1',
        question: 'What is the atomic number of Carbon?',
        answers: ['4', '6', '8', '12'],
        correct: 1,
        explanation: 'Carbon has 6 protons',
        points: 200
      }
    ],
    difficult: [],
    impossible: []
  },
  Biology: {
    icon: '🧬',
    easy: [
      {
        id: 'bio_easy_1',
        question: 'What is the powerhouse of the cell?',
        answers: ['Nucleus', 'Ribosome', 'Mitochondria', 'Chloroplast'],
        correct: 2,
        explanation: 'Mitochondria produce ATP energy',
        points: 100
      }
    ],
    average: [
      {
        id: 'bio_avg_1',
        question: 'Which organelle performs photosynthesis?',
        answers: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Ribosome'],
        correct: 1,
        explanation: 'Chloroplasts contain chlorophyll for photosynthesis',
        points: 200
      }
    ],
    difficult: [
      {
        id: 'bio_diff_1',
        question: 'What is the process of DNA → RNA called?',
        answers: ['Translation', 'Replication', 'Transcription', 'Transformation'],
        correct: 2,
        explanation: 'Transcription converts DNA to RNA',
        points: 400
      }
    ],
    impossible: []
  }
};

// Helper functions (keep your existing helpers array)
export const helpers = [
  { id: 1, name: 'Einstein', icon: '🧠', physics: 95, math: 80, chemistry: 60, biology: 30 },
  { id: 2, name: 'Darwin', icon: '🦜', biology: 95, chemistry: 65, physics: 40, math: 35 },
  { id: 3, name: 'Curie', icon: '⚗️', chemistry: 95, physics: 75, math: 60, biology: 50 },
  { id: 4, name: 'Turing', icon: '💻', math: 95, physics: 70, chemistry: 40, biology: 25 },
  { id: 5, name: 'Newton', icon: '🍎', physics: 90, math: 85, chemistry: 45, biology: 20 },
  { id: 6, name: 'Mendel', icon: '🌱', biology: 90, chemistry: 55, math: 50, physics: 30 }
];

// Add question function
export const addQuestion = (question) => {
  const { subject, difficulty } = question;
  if (questionDatabase[subject] && questionDatabase[subject][difficulty]) {
    questionDatabase[subject][difficulty].push({
      ...question,
      id: `${subject.toLowerCase()}_${difficulty}_${Date.now()}`,
      addedDate: new Date().toISOString()
    });
    return true;
  }
  return false;
};

// Get quiz questions
export const getQuizQuestions = (config = {}) => {
  const {
    subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
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
    
    const shuffled = availableQuestions.sort(() => Math.random() - 0.5);
    questions.push(...shuffled.slice(0, Math.min(count, shuffled.length)));
  });
  
  // If we don't have enough questions, add placeholders
  while (questions.length < 14) {
    questions.push({
      id: `placeholder_${questions.length}`,
      subject: 'Mathematics',
      icon: '📐',
      difficulty: 'easy',
      question: `Sample Question ${questions.length + 1}`,
      answers: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
      correct: 0,
      points: 100,
      explanation: 'This is a placeholder question'
    });
  }
  
  return questions.slice(0, 14);
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