// Script to upload Geography and Technology questions to Firebase
// Run with: node scripts/uploadNewSubjects.js

const geographyQuestions = [
  // Easy
  { subject: 'Geography', difficulty: 'easy', question: 'What is the capital of France?', answers: ['London', 'Berlin', 'Paris', 'Rome'], correct: 2, explanation: 'Paris is the capital of France', points: 100 },
  { subject: 'Geography', difficulty: 'easy', question: 'Which continent is Egypt located in?', answers: ['Asia', 'Africa', 'Europe', 'South America'], correct: 1, explanation: 'Egypt is in Africa', points: 100 },
  { subject: 'Geography', difficulty: 'easy', question: 'What is the largest ocean on Earth?', answers: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3, explanation: 'The Pacific Ocean is the largest', points: 100 },
  // Average
  { subject: 'Geography', difficulty: 'average', question: 'What is the longest river in the world?', answers: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correct: 1, explanation: 'The Nile River is the longest at ~6,650 km', points: 200 },
  { subject: 'Geography', difficulty: 'average', question: 'Which country has the most time zones?', answers: ['USA', 'Russia', 'France', 'China'], correct: 2, explanation: 'France has 12 time zones (including territories)', points: 200 },
  { subject: 'Geography', difficulty: 'average', question: 'What is the smallest country in the world?', answers: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], correct: 1, explanation: 'Vatican City is the smallest at 0.44 km²', points: 200 },
  // Difficult
  { subject: 'Geography', difficulty: 'difficult', question: 'What is the deepest point in the ocean?', answers: ['Java Trench', 'Mariana Trench', 'Puerto Rico Trench', 'Tonga Trench'], correct: 1, explanation: 'Mariana Trench (~11,000 m deep)', points: 400 },
  { subject: 'Geography', difficulty: 'difficult', question: 'Which African country was formerly known as Abyssinia?', answers: ['Eritrea', 'Somalia', 'Ethiopia', 'Sudan'], correct: 2, explanation: 'Ethiopia was historically called Abyssinia', points: 400 },
  { subject: 'Geography', difficulty: 'difficult', question: 'What is the capital of Mongolia?', answers: ['Astana', 'Bishkek', 'Tashkent', 'Ulaanbaatar'], correct: 3, explanation: 'Ulaanbaatar is Mongolia\'s capital', points: 400 },
  // Impossible
  { subject: 'Geography', difficulty: 'impossible', question: 'How many countries does the Danube River flow through?', answers: ['6', '8', '10', '12'], correct: 2, explanation: 'The Danube flows through 10 countries', points: 800 },
  { subject: 'Geography', difficulty: 'impossible', question: 'What is the only sea without any coastline?', answers: ['Dead Sea', 'Caspian Sea', 'Sargasso Sea', 'Red Sea'], correct: 2, explanation: 'The Sargasso Sea is bounded by ocean currents', points: 800 },
  { subject: 'Geography', difficulty: 'impossible', question: 'What percentage of Earth\'s surface is covered by Russia?', answers: ['1.5%', '2.1%', '3.4%', '4.2%'], correct: 0, explanation: 'Russia covers about 1.5% of Earth\'s surface', points: 800 }
];

const technologyQuestions = [
  // Easy
  { subject: 'Technology', difficulty: 'easy', question: 'What does "URL" stand for?', answers: ['Universal Resource Locator', 'Uniform Resource Locator', 'Universal Reference Link', 'Uniform Reference Link'], correct: 1, explanation: 'URL = Uniform Resource Locator', points: 100 },
  { subject: 'Technology', difficulty: 'easy', question: 'Who is the founder of Microsoft?', answers: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Elon Musk'], correct: 1, explanation: 'Bill Gates co-founded Microsoft in 1975', points: 100 },
  { subject: 'Technology', difficulty: 'easy', question: 'What does "AI" stand for?', answers: ['Automated Intelligence', 'Artificial Intelligence', 'Advanced Integration', 'Automatic Interface'], correct: 1, explanation: 'AI = Artificial Intelligence', points: 100 },
  // Average
  { subject: 'Technology', difficulty: 'average', question: 'What year was the first iPhone released?', answers: ['2005', '2007', '2009', '2011'], correct: 1, explanation: 'The first iPhone was released in 2007', points: 200 },
  { subject: 'Technology', difficulty: 'average', question: 'What does "GPU" stand for?', answers: ['General Processing Unit', 'Graphics Processing Unit', 'Global Processing Unit', 'Graphical Performance Unit'], correct: 1, explanation: 'GPU = Graphics Processing Unit', points: 200 },
  { subject: 'Technology', difficulty: 'average', question: 'Which company developed ChatGPT?', answers: ['Google', 'Microsoft', 'OpenAI', 'Meta'], correct: 2, explanation: 'OpenAI developed ChatGPT', points: 200 },
  // Difficult
  { subject: 'Technology', difficulty: 'difficult', question: 'What is the primary programming language used for machine learning?', answers: ['Java', 'C++', 'Python', 'JavaScript'], correct: 2, explanation: 'Python is the dominant language for ML/AI', points: 400 },
  { subject: 'Technology', difficulty: 'difficult', question: 'What does "LLM" stand for in AI?', answers: ['Large Language Model', 'Linear Learning Machine', 'Logical Language Module', 'Long-term Learning Memory'], correct: 0, explanation: 'LLM = Large Language Model', points: 400 },
  { subject: 'Technology', difficulty: 'difficult', question: 'What year was the World Wide Web invented?', answers: ['1983', '1989', '1995', '2001'], correct: 1, explanation: 'Tim Berners-Lee invented the WWW in 1989', points: 400 },
  // Impossible
  { subject: 'Technology', difficulty: 'impossible', question: 'How many parameters does GPT-4 approximately have?', answers: ['175 billion', '540 billion', '1 trillion', '1.76 trillion'], correct: 3, explanation: 'GPT-4 is estimated to have ~1.76 trillion parameters', points: 800 },
  { subject: 'Technology', difficulty: 'impossible', question: 'What was the first computer virus called?', answers: ['ILOVEYOU', 'Creeper', 'Morris Worm', 'Melissa'], correct: 1, explanation: 'Creeper (1971) was the first computer virus', points: 800 },
  { subject: 'Technology', difficulty: 'impossible', question: 'What is the maximum theoretical speed of USB 4.0?', answers: ['10 Gbps', '20 Gbps', '40 Gbps', '80 Gbps'], correct: 2, explanation: 'USB 4.0 supports up to 40 Gbps', points: 800 }
];

const allNewQuestions = [...geographyQuestions, ...technologyQuestions];

console.log('📦 New Questions to Upload:');
console.log(`Total: ${allNewQuestions.length} questions`);
console.log(`Geography: ${geographyQuestions.length} questions`);
console.log(`Technology: ${technologyQuestions.length} questions`);
console.log('\n📋 Copy the JSON below and paste it into the app\'s question uploader:\n');
console.log(JSON.stringify(allNewQuestions, null, 2));
