import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  addQuestion,
  getQuestionStats
} from '../services/questionService';
import { migrateQuestionsToFirestore } from '../services/migrateQuestionsToFirestore';
import { useAuth } from '../context/AuthContext';

const QuestionManagerScreen = ({ navigation }) => {
  const { userProfile } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [questionStats, setQuestionStats] = useState({});
  const [newQuestion, setNewQuestion] = useState({
    subject: 'Mathematics',
    difficulty: 'easy',
    question: '',
    answers: ['', '', '', ''],
    correct: 0,
    explanation: '',
    points: 100,
    tags: []
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const stats = await getQuestionStats();
      setQuestionStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.question || newQuestion.answers.some(a => !a)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await addQuestion(newQuestion);
      Alert.alert('Success', 'Question added successfully!');
      setShowAddModal(false);
      setNewQuestion({
        subject: 'Mathematics',
        difficulty: 'easy',
        question: '',
      answers: ['', '', '', ''],
      correct: 0,
      explanation: '',
      points: 100,
      tags: []
    });
      await loadStats(); // Reload stats after adding
    } catch (error) {
      console.error('Error adding question:', error);
      Alert.alert('Error', 'Failed to add question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const importCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        setLoading(true);
        const content = await FileSystem.readAsStringAsync(result.uri);
        const questions = parseCSV(content);

        for (const q of questions) {
          await addQuestion(q);
        }
        await loadStats();
        Alert.alert('Success', `Imported ${questions.length} questions!`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to import CSV');
    } finally {
      setLoading(false);
    }
  };

  const parseCSV = (csv) => {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const questions = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= 8) {
        questions.push({
          subject: values[0],
          difficulty: values[1],
          question: values[2],
          answers: [values[3], values[4], values[5], values[6]],
          correct: parseInt(values[7]),
          explanation: values[8] || '',
          points: parseInt(values[9]) || 100
        });
      }
    }

    return questions;
  };

  const exportQuestions = async () => {
    Alert.alert('Info', 'Export feature is now handled directly by Firestore. Use Firebase Console to export questions.');
  };

  const generateSampleQuestions = async () => {
    const samples = [
      {
        subject: 'Mathematics',
        difficulty: 'easy',
        question: 'What is 2 + 2?',
        answers: ['3', '4', '5', '6'],
        correct: 1,
        explanation: '2 + 2 equals 4',
        points: 100
      },
      {
        subject: 'Physics',
        difficulty: 'average',
        question: 'What is the unit of force?',
        answers: ['Joule', 'Newton', 'Watt', 'Pascal'],
        correct: 1,
        explanation: 'Newton (N) is the SI unit of force',
        points: 200
      },
      {
        subject: 'Chemistry',
        difficulty: 'difficult',
        question: 'What is the electron configuration of Iron (Fe)?',
        answers: [
          '[Ar] 4s² 3d⁶',
          '[Ar] 4s¹ 3d⁷',
          '[Ar] 3d⁸',
          '[Kr] 4s² 3d⁶'
        ],
        correct: 0,
        explanation: 'Iron has 26 electrons with configuration [Ar] 4s² 3d⁶',
        points: 400
      }
    ];

    try {
      setLoading(true);
      for (const q of samples) {
        await addQuestion(q);
      }
      await loadStats();
      Alert.alert('Success', 'Sample questions added!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add sample questions');
    } finally {
      setLoading(false);
    }
  };

  const handleMigration = async () => {
    Alert.alert(
      'Migrate Questions',
      'This will upload all questions from questions.js to Firestore. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Migrate',
          onPress: async () => {
            try {
              setLoading(true);
              const result = await migrateQuestionsToFirestore((progress) => {
                console.log(progress);
              });
              await loadStats();
              Alert.alert(
                'Migration Complete',
                `Total: ${result.total}\nSuccess: ${result.success}\nErrors: ${result.errors}`
              );
            } catch (error) {
              console.error('Migration error:', error);
              Alert.alert('Error', 'Migration failed: ' + error.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Question Manager</Text>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Question Database Statistics</Text>
        {Object.entries(questionStats).map(([subject, stats]) => (
          <View key={subject} style={styles.statRow}>
            <Text style={styles.subjectName}>{subject}</Text>
            <View style={styles.statDetails}>
              <Text style={styles.statBadge}>E: {stats.easy}</Text>
              <Text style={styles.statBadge}>A: {stats.average}</Text>
              <Text style={styles.statBadge}>D: {stats.difficult}</Text>
              <Text style={styles.statBadge}>I: {stats.impossible}</Text>
              <Text style={styles.totalBadge}>Total: {stats.total}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowAddModal(true)}>
          <Text style={styles.actionIcon}>➕</Text>
          <Text style={styles.actionText}>Add Question</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={importCSV}>
          <Text style={styles.actionIcon}>📥</Text>
          <Text style={styles.actionText}>Import CSV</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={exportQuestions}>
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionText}>Export JSON</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={generateSampleQuestions}>
          <Text style={styles.actionIcon}>🎲</Text>
          <Text style={styles.actionText}>Add Samples</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#ff6b35'}]} onPress={handleMigration}>
          <Text style={styles.actionIcon}>🚀</Text>
          <Text style={styles.actionText}>Migrate to Firestore</Text>
        </TouchableOpacity>

        {userProfile?.isAdmin && (
          <TouchableOpacity style={[styles.actionButton, {backgroundColor: '#4aca4a'}]} onPress={() => navigation.navigate('ApproveQuestions')}>
            <Text style={styles.actionIcon}>✓</Text>
            <Text style={styles.actionText}>Approve Questions</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && (
        <View style={{padding: 20, alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#faca3a" />
          <Text style={{color: '#fff', marginTop: 10}}>Processing...</Text>
        </View>
      )}

      {/* CSV Template */}
      <View style={styles.templateContainer}>
        <Text style={styles.sectionTitle}>CSV Format Template</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
            Subject,Difficulty,Question,Answer1,Answer2,Answer3,Answer4,Correct,Explanation,Points{'\n'}
            Mathematics,easy,What is 2+2?,3,4,5,6,1,Basic addition,100{'\n'}
            Physics,average,Unit of force?,Joule,Newton,Watt,Pascal,1,SI unit,200
          </Text>
        </View>
      </View>

      {/* Add Question Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Question</Text>
            
            <ScrollView style={styles.modalScroll}>
              {/* Subject Selector */}
              <Text style={styles.inputLabel}>Subject:</Text>
              <View style={styles.subjectSelector}>
                {['Arithmetic & Algebra', 'Geometry & Trigonometry', 'Statistics & Probability', 'Physics', 'Chemistry', 'Biology', 'History', 'Sports & Entertainment', 'Literature', 'Astronomy'].map(subject => (
                  <TouchableOpacity
                    key={subject}
                    style={[
                      styles.subjectOption,
                      newQuestion.subject === subject && styles.selectedSubject
                    ]}
                    onPress={() => setNewQuestion({...newQuestion, subject})}
                  >
                    <Text style={styles.subjectOptionText}>{subject}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Difficulty Selector */}
              <Text style={styles.inputLabel}>Difficulty:</Text>
              <View style={styles.difficultySelector}>
                {['easy', 'average', 'difficult', 'impossible'].map(diff => (
                  <TouchableOpacity
                    key={diff}
                    style={[
                      styles.diffOption,
                      newQuestion.difficulty === diff && styles.selectedDiff
                    ]}
                    onPress={() => setNewQuestion({
                      ...newQuestion, 
                      difficulty: diff,
                      points: diff === 'easy' ? 100 : diff === 'average' ? 200 : diff === 'difficult' ? 400 : 800
                    })}
                  >
                    <Text style={styles.diffOptionText}>{diff}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Question Input */}
              <Text style={styles.inputLabel}>Question:</Text>
              <TextInput
                style={styles.textInput}
                value={newQuestion.question}
                onChangeText={(text) => setNewQuestion({...newQuestion, question: text})}
                placeholder="Enter question..."
                placeholderTextColor="#6a7a8a"
                multiline
              />

              {/* Answer Inputs */}
              <Text style={styles.inputLabel}>Answers:</Text>
              {newQuestion.answers.map((answer, index) => (
                <View key={index} style={styles.answerRow}>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      newQuestion.correct === index && styles.radioSelected
                    ]}
                    onPress={() => setNewQuestion({...newQuestion, correct: index})}
                  >
                    {newQuestion.correct === index && <Text style={styles.radioCheck}>✓</Text>}
                  </TouchableOpacity>
                  <TextInput
                    style={styles.answerInput}
                    value={answer}
                    onChangeText={(text) => {
                      const newAnswers = [...newQuestion.answers];
                      newAnswers[index] = text;
                      setNewQuestion({...newQuestion, answers: newAnswers});
                    }}
                    placeholder={`Answer ${index + 1}`}
                    placeholderTextColor="#6a7a8a"
                  />
                </View>
              ))}

              {/* Explanation */}
              <Text style={styles.inputLabel}>Explanation (optional):</Text>
              <TextInput
                style={styles.textInput}
                value={newQuestion.explanation}
                onChangeText={(text) => setNewQuestion({...newQuestion, explanation: text})}
                placeholder="Why is this the correct answer?"
                placeholderTextColor="#6a7a8a"
                multiline
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddQuestion}
              >
                <Text style={styles.buttonText}>Add Question</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a4a5a',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    marginRight: 20,
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
  statsContainer: {
    backgroundColor: 'rgba(90, 106, 122, 0.5)',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  sectionTitle: {
    color: '#faca3a',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#4a5a6a',
  },
  subjectName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  statDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    color: '#9aaa9a',
    fontSize: 11,
  },
  totalBadge: {
    backgroundColor: 'rgba(74, 154, 74, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    color: '#4aca4a',
    fontSize: 11,
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(90, 106, 122, 0.5)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  actionIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  templateContainer: {
    backgroundColor: 'rgba(90, 106, 122, 0.5)',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  codeBlock: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 12,
    borderRadius: 8,
  },
  codeText: {
    color: '#4aca4a',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#4a5a6a',
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#faca3a',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 400,
  },
  inputLabel: {
    color: '#9aaa9a',
    fontSize: 12,
    marginBottom: 5,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5a6a7a',
    fontSize: 14,
  },
  subjectSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  subjectOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5a6a7a',
  },
  selectedSubject: {
    backgroundColor: 'rgba(74, 154, 74, 0.3)',
    borderColor: '#4a9a4a',
  },
  subjectOptionText: {
    color: 'white',
    fontSize: 12,
  },
  difficultySelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  diffOption: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5a6a7a',
  },
  selectedDiff: {
    backgroundColor: 'rgba(74, 154, 74, 0.3)',
    borderColor: '#4a9a4a',
  },
  diffOptionText: {
    color: 'white',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6a7a8a',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: '#4a9a4a',
    borderColor: '#4a9a4a',
  },
  radioCheck: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  answerInput: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: 'white',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#5a6a7a',
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(202, 74, 74, 0.5)',
    borderWidth: 1,
    borderColor: '#ca4a4a',
  },
  saveButton: {
    backgroundColor: 'rgba(74, 154, 74, 0.5)',
    borderWidth: 1,
    borderColor: '#4a9a4a',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default QuestionManagerScreen;