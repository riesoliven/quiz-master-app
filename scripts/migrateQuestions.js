/**
 * Migration script to upload questions from questions.js to Firestore
 * Run this once to populate the Firestore database with initial questions
 *
 * Usage: node scripts/migrateQuestions.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5pkuyk7u3UDqwLW-eodEVg3NPwFtW1F0",
  authDomain: "battle-of-the-brains-d2eae.firebaseapp.com",
  projectId: "battle-of-the-brains-d2eae",
  storageBucket: "battle-of-the-brains-d2eae.firebasestorage.app",
  messagingSenderId: "236365066873",
  appId: "1:236365066873:web:c38236edae74bad9db1aa8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Import question database (you'll need to adjust the path)
// Since we can't import ES modules directly in Node, we'll define it inline
const questionDatabase = {
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
  // Add more subjects here... (copy from questions.js)
};

async function migrateQuestions() {
  console.log('🚀 Starting question migration to Firestore...\n');

  let totalCount = 0;
  let successCount = 0;
  let errorCount = 0;

  try {
    // Check if questions already exist
    const existingQuestions = await getDocs(collection(firestore, 'questions'));
    if (!existingQuestions.empty) {
      console.log(`⚠️  Warning: ${existingQuestions.size} questions already exist in Firestore.`);
      console.log('Do you want to continue? This will add duplicate questions.');
      console.log('To proceed, comment out this check in the script.\n');
      return;
    }

    // Iterate through all subjects
    for (const [subject, subjectData] of Object.entries(questionDatabase)) {
      console.log(`📚 Processing subject: ${subject}`);

      // Iterate through all difficulty levels
      for (const [difficulty, questions] of Object.entries(subjectData)) {
        if (difficulty === 'icon') continue; // Skip the icon property

        console.log(`  ⚡ ${difficulty}: ${questions.length} questions`);

        // Upload each question
        for (const question of questions) {
          totalCount++;
          try {
            await addDoc(collection(firestore, 'questions'), {
              ...question,
              subject,
              difficulty,
              icon: subjectData.icon,
              createdAt: new Date().toISOString(),
              migratedFrom: 'questions.js'
            });
            successCount++;
          } catch (error) {
            console.error(`    ❌ Error adding question ${question.id}:`, error.message);
            errorCount++;
          }
        }
      }
      console.log('');
    }

    console.log('✅ Migration complete!');
    console.log(`📊 Summary:`);
    console.log(`   Total: ${totalCount}`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }

  process.exit(0);
}

// Run migration
migrateQuestions();
