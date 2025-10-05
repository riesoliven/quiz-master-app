import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore, COLLECTIONS } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

const SubmitQuestionScreen = ({ navigation }) => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState({
    subject: 'Arithmetic & Algebra',
    difficulty: 'easy',
    question: '',
    answers: ['', '', '', ''],
    correct: 0,
    explanation: ''
  });

  const subjects = [
    'Arithmetic & Algebra',
    'Geometry & Trigonometry',
    'Statistics & Probability',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Sports & Entertainment',
    'Literature',
    'Astronomy',
    'Geography',
    'Technology'
  ];

  const difficulties = ['easy', 'average', 'difficult', 'impossible'];

  const handleSubmit = async () => {
    // Validation
    if (!question.question.trim()) {
      Alert.alert('Error', 'Please enter a question');
      return;
    }

    if (question.answers.some(a => !a.trim())) {
      Alert.alert('Error', 'Please fill in all answer options');
      return;
    }

    try {
      setLoading(true);

      // Submit to pending questions collection
      await addDoc(collection(firestore, COLLECTIONS.PENDING_QUESTIONS), {
        ...question,
        submittedBy: user.uid,
        submittedByUsername: userProfile?.username || 'Anonymous',
        submittedAt: serverTimestamp(),
        status: 'pending',
        points: question.difficulty === 'easy' ? 100 :
                question.difficulty === 'average' ? 200 :
                question.difficulty === 'difficult' ? 400 : 800
      });

      Alert.alert(
        'Success!',
        'Your question has been submitted for review. Thank you for contributing!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

      // Reset form
      setQuestion({
        subject: 'Arithmetic & Algebra',
        difficulty: 'easy',
        question: '',
        answers: ['', '', '', ''],
        correct: 0,
        explanation: ''
      });

    } catch (error) {
      console.error('Error submitting question:', error);
      Alert.alert('Error', 'Failed to submit question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Submit a Question</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Help grow the quiz database! Submit your own questions for review.
        </Text>

        {/* Subject Selector */}
        <Text style={styles.label}>Subject:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {subjects.map(subject => (
            <TouchableOpacity
              key={subject}
              style={[
                styles.chip,
                question.subject === subject && styles.chipSelected
              ]}
              onPress={() => setQuestion({ ...question, subject })}
            >
              <Text style={[
                styles.chipText,
                question.subject === subject && styles.chipTextSelected
              ]}>
                {subject}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Difficulty Selector */}
        <Text style={styles.label}>Difficulty:</Text>
        <View style={styles.difficultyRow}>
          {difficulties.map(diff => (
            <TouchableOpacity
              key={diff}
              style={[
                styles.difficultyButton,
                question.difficulty === diff && styles.difficultyButtonSelected
              ]}
              onPress={() => setQuestion({ ...question, difficulty: diff })}
            >
              <Text style={[
                styles.difficultyText,
                question.difficulty === diff && styles.difficultyTextSelected
              ]}>
                {diff.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Question */}
        <Text style={styles.label}>Question:</Text>
        <TextInput
          style={styles.input}
          value={question.question}
          onChangeText={(text) => setQuestion({ ...question, question: text })}
          placeholder="Enter your question here..."
          placeholderTextColor="#888"
          multiline
        />

        {/* Answers */}
        <Text style={styles.label}>Answer Options:</Text>
        {question.answers.map((answer, index) => (
          <View key={index} style={styles.answerRow}>
            <TouchableOpacity
              style={[
                styles.correctButton,
                question.correct === index && styles.correctButtonSelected
              ]}
              onPress={() => setQuestion({ ...question, correct: index })}
            >
              <Text style={styles.correctButtonText}>
                {question.correct === index ? '✓' : index + 1}
              </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.answerInput}
              value={answer}
              onChangeText={(text) => {
                const newAnswers = [...question.answers];
                newAnswers[index] = text;
                setQuestion({ ...question, answers: newAnswers });
              }}
              placeholder={`Answer ${index + 1}`}
              placeholderTextColor="#888"
            />
          </View>
        ))}
        <Text style={styles.hint}>Tap the number to mark the correct answer</Text>

        {/* Explanation */}
        <Text style={styles.label}>Explanation:</Text>
        <TextInput
          style={styles.input}
          value={question.explanation}
          onChangeText={(text) => setQuestion({ ...question, explanation: text })}
          placeholder="Explain why the correct answer is right..."
          placeholderTextColor="#888"
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit for Review</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a3a4a',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#1a2a3a',
    borderBottomWidth: 2,
    borderBottomColor: '#faca3a',
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: '#faca3a',
    fontSize: 16,
  },
  title: {
    color: '#faca3a',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  label: {
    color: '#faca3a',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  horizontalScroll: {
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#3a4a5a',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#4a5a6a',
  },
  chipSelected: {
    backgroundColor: '#faca3a',
    borderColor: '#faca3a',
  },
  chipText: {
    color: '#ccc',
    fontSize: 12,
  },
  chipTextSelected: {
    color: '#1a2a3a',
    fontWeight: 'bold',
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: '#3a4a5a',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#4a5a6a',
  },
  difficultyButtonSelected: {
    backgroundColor: '#faca3a',
    borderColor: '#faca3a',
  },
  difficultyText: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  difficultyTextSelected: {
    color: '#1a2a3a',
  },
  input: {
    backgroundColor: '#3a4a5a',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    fontSize: 14,
    minHeight: 60,
    borderWidth: 1,
    borderColor: '#4a5a6a',
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  correctButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3a4a5a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#4a5a6a',
  },
  correctButtonSelected: {
    backgroundColor: '#4aca4a',
    borderColor: '#4aca4a',
  },
  correctButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  answerInput: {
    flex: 1,
    backgroundColor: '#3a4a5a',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#4a5a6a',
  },
  hint: {
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#4aca4a',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SubmitQuestionScreen;
