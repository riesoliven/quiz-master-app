import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  BackHandler
} from 'react-native';
import { getQuizQuestions } from '../data/questions';
import { calculateBonusPoints, getSubjectOfTheDay } from '../services/dailySubject';
import { useAuth } from '../context/AuthContext';
import { updateUserStats } from '../services/userStatsService';

// Shuffle answers while maintaining correct answer tracking
const shuffleAnswers = (question) => {
  const answersWithIndices = question.answers.map((answer, index) => ({
    answer,
    originalIndex: index
  }));

  // Fisher-Yates shuffle
  for (let i = answersWithIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answersWithIndices[i], answersWithIndices[j]] = [answersWithIndices[j], answersWithIndices[i]];
  }

  // Extract shuffled answers and find new correct index
  const shuffledAnswers = answersWithIndices.map(item => item.answer);
  const newCorrectIndex = answersWithIndices.findIndex(
    item => item.originalIndex === question.correct
  );

  return {
    ...question,
    answers: shuffledAnswers,
    correct: newCorrectIndex
  };
};

const QuizGameScreen = ({ route, navigation }) => {
  const { helpers } = route.params;
  const { user } = useAuth();
  const [questions] = useState(() => getQuizQuestions().map(q => shuffleAnswers(q)));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionResults, setQuestionResults] = useState([]); // Track results for stats
  const [streak, setStreak] = useState(0);
  const [helperUsed, setHelperUsed] = useState(false);
  const [totalTimer, setTotalTimer] = useState(90); // 90 seconds for entire quiz
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [helperSuggestion, setHelperSuggestion] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [dailySubject] = useState(getSubjectOfTheDay());

  const question = questions[currentQuestion];
  const isBonusQuestion = question.subject === dailySubject.subject;
  const questionNumber = currentQuestion + 1;
  // Use the actual difficulty from the question data
  const difficulty = question.difficulty ? question.difficulty.toUpperCase() : 'EASY';

  // Calculate time bonus based on streak
  const getTimeBonus = (currentStreak) => {
    if (currentStreak >= 10) return 6;
    if (currentStreak >= 7) return 5;
    if (currentStreak >= 4) return 4;
    if (currentStreak >= 2) return 3;
    return 0;
  };

  // Main timer for entire quiz
  useEffect(() => {
    if (isAnswered || quizComplete) return;
    
    const interval = setInterval(() => {
      setTotalTimer((prev) => {
        if (prev <= 1) {
          // Time's up - end quiz
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isAnswered, quizComplete]);

  // Pulse animation for low time warning
  useEffect(() => {
    if (totalTimer <= 10 && totalTimer > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [totalTimer <= 10]);

  // Prevent back navigation during quiz
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Quit Quiz?',
        'Are you sure you want to quit? Your progress will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Quit',
            style: 'destructive',
            onPress: () => {
              setQuizComplete(true); // Stop the timer
              navigation.navigate('MainMenu');
            }
          }
        ]
      );
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleTimeUp = async () => {
  setQuizComplete(true);

  // Update user stats with question results
  if (user && questionResults.length > 0) {
    await updateUserStats(user.uid, questionResults);
  }

  setTimeout(() => {
    navigation.replace('Results', {  // Changed to 'Results'
      finalScore: score,
      baseScore: score,
      timeRemaining: 0,
      timeBonus: 0,
      completionBonus: 0,
      questionsAnswered: correctAnswers,
      totalQuestions: questions.length,
      message: 'Time\'s Up!'
    });
  }, 1500);
};

  const handleAnswer = (answerIndex) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const isCorrect = answerIndex === question.correct;

    // Track result for stats
    setQuestionResults(prev => [...prev, {
      subject: question.subject,
      isCorrect
    }]);

    if (isCorrect) {
      // Calculate points with daily subject bonus
      const basePoints = question.points;
      const bonusCalc = calculateBonusPoints(basePoints, question.subject);

      setScore(prev => prev + bonusCalc.total);
      setCorrectAnswers(prev => prev + 1);

      // Increase streak
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Add time bonus based on streak
      const timeBonus = getTimeBonus(newStreak);
      if (timeBonus > 0) {
        setTotalTimer(prev => Math.min(prev + timeBonus, 180)); // Cap at 180 seconds
      }
    } else {
      setStreak(0); // Reset streak on wrong answer
    }

    // Move to next question after delay
    setTimeout(() => {
      moveToNext();
    }, 1500);
  };

  const moveToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setHelperSuggestion(null);
    } else {
      // Quiz complete - calculate final score
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
  setQuizComplete(true);

  // Calculate final score with time bonus
  const timeBonus = totalTimer * 10;
  const completionBonus = 500;
  const finalScore = score + timeBonus + completionBonus;

  // Update user stats with question results
  if (user && questionResults.length > 0) {
    await updateUserStats(user.uid, questionResults);
  }

  setTimeout(() => {
    navigation.replace('Results', {  // Changed to 'Results' instead of 'MainMenu'
      finalScore: finalScore,
      baseScore: score,
      timeRemaining: totalTimer,
      timeBonus: timeBonus,
      completionBonus: completionBonus,
      questionsAnswered: correctAnswers,
      totalQuestions: questions.length,
      message: 'Quiz Complete!'
    });
  }, 1500);
};

  const useHelper = (helper) => {
    if (helperUsed || isAnswered) return;
    
    setHelperUsed(true);
    const subject = question.subject.toLowerCase();
    const accuracy = helper[subject] || 50;
    
    setHelperSuggestion({
      answer: question.correct,
      helper: helper.name,
      confidence: accuracy
    });
  };

  const getAnswerStyle = (index) => {
    if (helperSuggestion && helperSuggestion.answer === index && !isAnswered) {
      return styles.answerHelper;
    }
    
    if (isAnswered) {
      if (index === question.correct) {
        return styles.answerCorrect;
      }
      if (index === selectedAnswer && selectedAnswer !== question.correct) {
        return styles.answerWrong;
      }
    }
    
    return styles.answerDefault;
  };

  const getTimerColor = () => {
    if (totalTimer <= 10) return '#ff4444';
    if (totalTimer <= 30) return '#ffa500';
    if (totalTimer <= 60) return '#ffff00';
    return '#00ff00';
  };

  const getStreakMessage = () => {
    if (streak >= 10) return '🔥 ON FIRE! +6s per correct';
    if (streak >= 7) return '⚡ UNSTOPPABLE! +5s per correct';
    if (streak >= 4) return '💪 GREAT! +4s per correct';
    if (streak >= 2) return '👍 NICE! +3s per correct';
    return '';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Timer Bar at Top */}
      <View style={styles.timerContainer}>
        <Animated.View 
          style={[
            styles.timerBar,
            { 
              width: `${(totalTimer / 90) * 100}%`,
              backgroundColor: getTimerColor(),
              opacity: totalTimer <= 10 ? fadeAnim : 1
            }
          ]}
        />
        <View style={styles.timerTextContainer}>
          <Text style={[styles.timerText, { color: getTimerColor() }]}>
            ⏱️ {Math.floor(totalTimer / 60)}:{(totalTimer % 60).toString().padStart(2, '0')}
          </Text>
          {totalTimer <= 10 && (
            <Text style={styles.warningText}>TIME RUNNING OUT!</Text>
          )}
        </View>
      </View>

      {/* Progress Dots */}
      <View style={styles.progressContainer}>
        {[...Array(14)].map((_, i) => (
          <View 
            key={i}
            style={[
              styles.dot,
              i < currentQuestion && styles.dotCompleted,
              i === currentQuestion && styles.dotCurrent,
              i < 5 ? styles.dotEasy : 
              i < 9 ? styles.dotAverage : 
              i < 12 ? styles.dotDifficult : 
              styles.dotImpossible
            ]}
          />
        ))}
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>💰 {score}</Text>
        </View>
        <View style={[styles.stat, streak > 0 && styles.streakActive]}>
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={styles.statValue}>🔥 {streak}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Question</Text>
          <Text style={styles.statValue}>{questionNumber}/14</Text>
        </View>
      </View>

      {/* Streak Bonus Message */}
      {streak >= 2 && !isAnswered && (
        <View style={styles.streakMessage}>
          <Text style={styles.streakMessageText}>{getStreakMessage()}</Text>
        </View>
      )}

      {/* Question Card */}
      <View style={[styles.questionCard, isBonusQuestion && styles.bonusQuestionCard]}>
        {isBonusQuestion && (
          <View style={styles.bonusBanner}>
            <Text style={styles.bonusBannerText}>⭐ SUBJECT OF THE DAY - +20% BONUS! ⭐</Text>
          </View>
        )}
        <View style={styles.questionHeader}>
          <View style={[styles.subjectBadge, isBonusQuestion && styles.bonusSubjectBadge]}>
            <Text style={styles.subjectText}>{question.icon} {question.subject}</Text>
          </View>
          <View style={styles.difficultyBadge}>
            <Text style={[styles.difficultyText, styles[`difficulty${difficulty}`]]}>
              {difficulty}
            </Text>
            <Text style={styles.pointsText}>
              {question.points} pts
              {isBonusQuestion && (
                <Text style={styles.bonusPointsText}> (+{Math.floor(question.points * 0.20)})</Text>
              )}
            </Text>
          </View>
        </View>
        
        <Text style={styles.questionContent}>
          {question.question}
        </Text>

        {/* Answer Options */}
        <View style={styles.answersContainer}>
          {question.answers.map((answer, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.answerButton, getAnswerStyle(index)]}
              onPress={() => handleAnswer(index)}
              disabled={isAnswered}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.answerText,
                isAnswered && index === question.correct && styles.answerTextCorrect,
                isAnswered && index === selectedAnswer && selectedAnswer !== question.correct && styles.answerTextWrong
              ]}>
                {answer}
              </Text>
              {isAnswered && index === question.correct && (
                <Text style={styles.indicator}>✓</Text>
              )}
              {isAnswered && index === selectedAnswer && selectedAnswer !== question.correct && (
                <Text style={styles.indicator}>✗</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback */}
        {isAnswered && (
          <View style={[
            styles.feedbackBox,
            selectedAnswer === question.correct ? styles.feedbackCorrect : styles.feedbackWrong
          ]}>
            <Text style={styles.feedbackText}>
              {selectedAnswer === question.correct
                ? (() => {
                    const bonusCalc = calculateBonusPoints(question.points, question.subject);
                    return bonusCalc.isBonusQuestion
                      ? `✅ Correct! +${question.points} pts + ${bonusCalc.bonus} BONUS = ${bonusCalc.total} pts!`
                      : `✅ Correct! +${question.points} pts`;
                  })()
                : '❌ Wrong Answer - Streak Lost!'}
            </Text>
            {selectedAnswer === question.correct && getTimeBonus(streak) > 0 && (
              <Text style={styles.timeBonusText}>
                ⏱️ +{getTimeBonus(streak)} seconds added!
              </Text>
            )}
          </View>
        )}

        {/* Helper Suggestion */}
        {helperSuggestion && !isAnswered && (
          <View style={styles.helperHint}>
            <Text style={styles.helperHintText}>
              💡 {helperSuggestion.helper} is {helperSuggestion.confidence}% confident it's answer {helperSuggestion.answer + 1}
            </Text>
          </View>
        )}
      </View>

      {/* Helpers */}
      <View style={styles.helpersSection}>
        <Text style={styles.helpersTitle}>
          {helperUsed ? 'Helper Used' : 'Your Helpers (One Use Only)'}
        </Text>
        <View style={styles.helpersGrid}>
          {helpers.map((helper) => (
            <TouchableOpacity
              key={helper.id}
              style={[
                styles.helperButton,
                helperUsed && styles.helperButtonDisabled
              ]}
              onPress={() => useHelper(helper)}
              disabled={helperUsed || isAnswered}
            >
              <Text style={styles.helperIcon}>{helper.icon}</Text>
              <Text style={styles.helperName}>{helper.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a4a5a',
    paddingTop: 40,
  },
  timerContainer: {
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  timerBar: {
    position: 'absolute',
    height: '100%',
    borderRadius: 20,
  },
  timerTextContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  warningText: {
    color: '#ff4444',
    fontSize: 10,
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 3,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#5a6a7a',
    borderWidth: 1,
    borderColor: '#4a5a6a',
  },
  dotCompleted: {
    backgroundColor: '#7a8a9a',
  },
  dotCurrent: {
    backgroundColor: '#ffffff',
    borderColor: '#faca3a',
    borderWidth: 2,
    transform: [{ scale: 1.2 }],
  },
  dotEasy: {
    backgroundColor: '#4a9a4a',
  },
  dotAverage: {
    backgroundColor: '#caca4a',
  },
  dotDifficult: {
    backgroundColor: '#ca8a4a',
  },
  dotImpossible: {
    backgroundColor: '#ca4a4a',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 10,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statLabel: {
    color: '#9aaa9a',
    fontSize: 10,
    marginBottom: 2,
  },
  statValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakActive: {
    backgroundColor: 'rgba(202, 74, 74, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  streakMessage: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 165, 0, 0.2)',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  streakMessageText: {
    color: '#ffa500',
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(90, 106, 122, 0.5)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  bonusQuestionCard: {
    backgroundColor: 'rgba(250, 202, 58, 0.15)',
    borderWidth: 2,
    borderColor: '#faca3a',
  },
  bonusBanner: {
    backgroundColor: '#faca3a',
    marginHorizontal: -20,
    marginTop: -20,
    marginBottom: 15,
    paddingVertical: 8,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  bonusBannerText: {
    color: '#3a4a5a',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bonusSubjectBadge: {
    backgroundColor: 'rgba(250, 202, 58, 0.3)',
    borderWidth: 1,
    borderColor: '#faca3a',
  },
  bonusPointsText: {
    color: '#4aca4a',
    fontSize: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  subjectBadge: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  subjectText: {
    color: '#faca3a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  difficultyBadge: {
    alignItems: 'flex-end',
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  difficultyEASY: {
    color: '#4a9a4a',
  },
  difficultyAVERAGE: {
    color: '#caca4a',
  },
  difficultyDIFFICULT: {
    color: '#ca8a4a',
  },
  difficultyIMPOSSIBLE: {
    color: '#ca4a4a',
  },
  pointsText: {
    color: '#faca3a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  questionContent: {
    color: 'white',
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 20,
    textAlign: 'center',
  },
  answersContainer: {
    gap: 10,
  },
  answerButton: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  answerDefault: {
    backgroundColor: '#4a5a6a',
    borderColor: '#6a7a8a',
  },
  answerCorrect: {
    backgroundColor: '#4a9a4a',
    borderColor: '#5aca5a',
  },
  answerWrong: {
    backgroundColor: '#ca4a4a',
    borderColor: '#da5a5a',
  },
  answerHelper: {
    backgroundColor: '#5a7a9a',
    borderColor: '#7a9aba',
  },
  answerText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  answerTextCorrect: {
    fontWeight: 'bold',
  },
  answerTextWrong: {
    color: '#ffcccc',
  },
  indicator: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  feedbackBox: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  feedbackCorrect: {
    backgroundColor: 'rgba(74, 154, 74, 0.3)',
  },
  feedbackWrong: {
    backgroundColor: 'rgba(202, 74, 74, 0.3)',
  },
  feedbackText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeBonusText: {
    color: '#4aca4a',
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
  },
  helperHint: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(90, 138, 202, 0.2)',
    borderRadius: 8,
  },
  helperHintText: {
    color: '#7a9aba',
    fontSize: 12,
    textAlign: 'center',
  },
  helpersSection: {
    margin: 20,
  },
  helpersTitle: {
    color: '#faca3a',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  helpersGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  helperButton: {
    backgroundColor: 'rgba(106, 122, 138, 0.5)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7a8a9a',
  },
  helperButtonDisabled: {
    opacity: 0.3,
  },
  helperIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  helperName: {
    color: 'white',
    fontSize: 10,
  },
});

export default QuizGameScreen;