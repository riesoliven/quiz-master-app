/**
 * Migration helper to upload questions from questions.js to Firestore
 * This runs in the app context with user authentication
 */

import { addQuestion } from './questionService';
import { questionDatabase } from '../data/questions';

export const migrateQuestionsToFirestore = async (onProgress) => {
  console.log('🚀 Starting question migration to Firestore...\n');

  let totalCount = 0;
  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  try {
    // Iterate through all subjects
    for (const [subject, subjectData] of Object.entries(questionDatabase)) {
      onProgress?.(`Processing subject: ${subject}`);
      console.log(`📚 Processing subject: ${subject}`);

      // Iterate through all difficulty levels
      for (const [difficulty, questions] of Object.entries(subjectData)) {
        if (difficulty === 'icon') continue; // Skip the icon property

        console.log(`  ⚡ ${difficulty}: ${questions.length} questions`);

        // Upload each question
        for (const question of questions) {
          totalCount++;
          try {
            await addQuestion({
              ...question,
              subject,
              difficulty,
              icon: subjectData.icon,
              migratedFrom: 'questions.js'
            });
            successCount++;
            onProgress?.(`Added ${successCount}/${totalCount} questions...`);
          } catch (error) {
            console.error(`    ❌ Error adding question ${question.id}:`, error.message);
            errorCount++;
            errors.push({
              questionId: question.id,
              error: error.message
            });
          }
        }
      }
    }

    const summary = {
      total: totalCount,
      success: successCount,
      errors: errorCount,
      errorDetails: errors
    };

    console.log('✅ Migration complete!');
    console.log(`📊 Summary:`);
    console.log(`   Total: ${totalCount}`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);

    return summary;

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};
