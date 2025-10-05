import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  orderBy
} from 'firebase/firestore';
import { firestore, COLLECTIONS } from '../services/firebase';
import { addQuestion } from '../services/questionService';
import { useAuth } from '../context/AuthContext';

const ApproveQuestionsScreen = ({ navigation }) => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    // Check if user is admin before loading
    if (!userProfile?.isAdmin) {
      Alert.alert(
        'Access Denied',
        'You must be an admin to access this screen.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      setLoading(false);
      return;
    }
    loadPendingQuestions();
  }, [userProfile]);

  const loadPendingQuestions = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(firestore, COLLECTIONS.PENDING_QUESTIONS),
        where('status', '==', 'pending')
      );

      const snapshot = await getDocs(q);
      const questions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a, b) => {
        // Sort by submittedAt descending (newest first)
        const timeA = a.submittedAt?.seconds || 0;
        const timeB = b.submittedAt?.seconds || 0;
        return timeB - timeA;
      });

      setPendingQuestions(questions);
    } catch (error) {
      console.error('Error loading pending questions:', error);
      Alert.alert('Error', 'Failed to load pending questions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (questionData) => {
    Alert.alert(
      'Approve Question',
      'Add this question to the main database?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              setProcessingId(questionData.id);

              // Add to main questions collection
              const { id, submittedBy, submittedByUsername, submittedAt, status, ...cleanQuestion } = questionData;
              await addQuestion(cleanQuestion);

              // Delete from pending
              await deleteDoc(doc(firestore, COLLECTIONS.PENDING_QUESTIONS, questionData.id));

              Alert.alert('Success', 'Question approved and added to database!');

              // Reload list
              await loadPendingQuestions();
            } catch (error) {
              console.error('Error approving question:', error);
              Alert.alert('Error', 'Failed to approve question');
            } finally {
              setProcessingId(null);
            }
          }
        }
      ]
    );
  };

  const handleReject = async (questionId) => {
    Alert.alert(
      'Reject Question',
      'Are you sure you want to reject this question?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              setProcessingId(questionId);

              // Delete from pending
              await deleteDoc(doc(firestore, COLLECTIONS.PENDING_QUESTIONS, questionId));

              Alert.alert('Success', 'Question rejected');

              // Reload list
              await loadPendingQuestions();
            } catch (error) {
              console.error('Error rejecting question:', error);
              Alert.alert('Error', 'Failed to reject question');
            } finally {
              setProcessingId(null);
            }
          }
        }
      ]
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#4aca4a';
      case 'average': return '#faca3a';
      case 'difficult': return '#ff9a3a';
      case 'impossible': return '#ff4a4a';
      default: return '#888';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#faca3a" />
        <Text style={styles.loadingText}>Loading pending questions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Approve Questions</Text>
        <Text style={styles.count}>{pendingQuestions.length} pending</Text>
      </View>

      <ScrollView style={styles.content}>
        {pendingQuestions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✓</Text>
            <Text style={styles.emptyText}>No pending questions</Text>
            <Text style={styles.emptySubtext}>All caught up!</Text>
          </View>
        ) : (
          pendingQuestions.map((q, index) => (
            <View key={q.id} style={styles.questionCard}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <View style={styles.badges}>
                  <View style={[styles.badge, { backgroundColor: getDifficultyColor(q.difficulty) }]}>
                    <Text style={styles.badgeText}>{q.difficulty.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.subject}>{q.subject}</Text>
                </View>
                <Text style={styles.submitter}>by {q.submittedByUsername}</Text>
              </View>

              {/* Question */}
              <Text style={styles.question}>{q.question}</Text>

              {/* Answers */}
              <View style={styles.answersContainer}>
                {q.answers.map((answer, i) => (
                  <View key={i} style={[
                    styles.answerRow,
                    i === q.correct && styles.correctAnswer
                  ]}>
                    <Text style={styles.answerLabel}>{i + 1}.</Text>
                    <Text style={[
                      styles.answerText,
                      i === q.correct && styles.correctAnswerText
                    ]}>
                      {answer}
                    </Text>
                    {i === q.correct && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                ))}
              </View>

              {/* Explanation */}
              <View style={styles.explanationBox}>
                <Text style={styles.explanationLabel}>Explanation:</Text>
                <Text style={styles.explanationText}>{q.explanation}</Text>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleReject(q.id)}
                  disabled={processingId === q.id}
                >
                  {processingId === q.id ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.actionIcon}>✕</Text>
                      <Text style={styles.actionText}>Reject</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => handleApprove(q)}
                  disabled={processingId === q.id}
                >
                  {processingId === q.id ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.actionIcon}>✓</Text>
                      <Text style={styles.actionText}>Approve</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
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
  count: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 5,
  },
  content: {
    flex: 1,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    color: '#faca3a',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emptySubtext: {
    color: '#aaa',
    fontSize: 14,
  },
  questionCard: {
    backgroundColor: '#3a4a5a',
    margin: 15,
    marginTop: 10,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4a5a6a',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  subject: {
    color: '#aaa',
    fontSize: 12,
  },
  submitter: {
    color: '#888',
    fontSize: 11,
    fontStyle: 'italic',
  },
  question: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 22,
  },
  answersContainer: {
    marginBottom: 12,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a3a4a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  correctAnswer: {
    backgroundColor: '#2a4a3a',
    borderWidth: 1,
    borderColor: '#4aca4a',
  },
  answerLabel: {
    color: '#aaa',
    fontSize: 14,
    marginRight: 8,
    fontWeight: 'bold',
  },
  answerText: {
    color: '#ccc',
    fontSize: 14,
    flex: 1,
  },
  correctAnswerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkmark: {
    color: '#4aca4a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  explanationBox: {
    backgroundColor: '#2a3a4a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  explanationLabel: {
    color: '#faca3a',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  explanationText: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  rejectButton: {
    backgroundColor: '#ff4a4a',
  },
  approveButton: {
    backgroundColor: '#4aca4a',
  },
  actionIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 6,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ApproveQuestionsScreen;
