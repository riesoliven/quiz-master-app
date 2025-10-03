import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Share,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import {
  updateHighScore,
  getUserHighScore,
  getUserRank,
  saveScoreRecord
} from '../services/leaderboardService';

const ResultsScreen = ({ route, navigation }) => {
  const {
    finalScore,
    baseScore,
    timeRemaining,
    timeBonus,
    completionBonus,
    questionsAnswered,
    totalQuestions,
    message
  } = route.params;

  const { user, userProfile, refreshUserProfile } = useAuth();
  const [playerRank, setPlayerRank] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [comment, setComment] = useState('');
  const [highScores, setHighScores] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [previousHighScore, setPreviousHighScore] = useState(0);

  useEffect(() => {
    // Load high scores and calculate rank
    loadHighScores();

    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const loadHighScores = async () => {
    try {
      if (!user) return;

      // Get previous high score
      const prevHighScore = await getUserHighScore(user.uid);
      setPreviousHighScore(prevHighScore);

      // Check if this is a new high score
      const isNew = finalScore > prevHighScore;
      console.log('High Score Check:', {
        finalScore,
        prevHighScore,
        isNewHighScore: isNew
      });
      setIsNewHighScore(isNew);

      // If it's a new high score, update it in Firestore (without message)
      // User can optionally add a message later
      if (isNew && userProfile) {
        await updateHighScore(
          user.uid,
          finalScore,
          '', // Empty message for now, user can add later
          userProfile.username,
          userProfile.avatar
        );
      }

      // Save score record
      await saveScoreRecord(user.uid, {
        score: finalScore,
        baseScore,
        timeBonus,
        completionBonus,
        questionsAnswered,
        totalQuestions,
        timeRemaining,
      });

      // Get rank
      const rankData = await getUserRank(user.uid);
      setPlayerRank(rankData.rank);
      setTotalPlayers(rankData.total);

    } catch (error) {
      console.error('Error loading scores:', error);
    }
  };

  const getRankMessage = () => {
    if (playerRank === 1) return "🏆 NEW HIGH SCORE!";
    if (playerRank <= 3) return "🥇 PODIUM FINISH!";
    if (playerRank <= 10) return "⭐ TOP 10!";
    if (playerRank <= 50) return "👏 GREAT JOB!";
    return "Keep practicing!";
  };

  const getRankColor = () => {
    if (playerRank === 1) return '#FFD700';
    if (playerRank <= 3) return '#C0C0C0';
    if (playerRank <= 10) return '#CD7F32';
    return '#4a9a4a';
  };

  const getPercentile = () => {
    if (totalPlayers === 0) return 100;
    return Math.round((1 - (playerRank / totalPlayers)) * 100);
  };

  const saveHighScore = async () => {
    if (!user || !userProfile) {
      Alert.alert('Error', 'You must be logged in to save scores');
      return;
    }

    if (!isNewHighScore) {
      // Just navigate back if not a new high score
      navigation.navigate('MainMenu');
      return;
    }

    try {
      // Update the message if provided (score was already saved in loadHighScores)
      if (comment && comment.trim() !== '') {
        await updateHighScore(
          user.uid,
          finalScore,
          comment.trim(),
          userProfile.username,
          userProfile.avatar
        );
      }

      Alert.alert(
        '🎉 New High Score!',
        `Congratulations! You beat your previous high score of ${previousHighScore} points!`,
        [{ text: 'Awesome!', onPress: () => navigation.navigate('MainMenu') }]
      );
    } catch (error) {
      console.error('Error saving message:', error);
      Alert.alert('Error', 'Failed to save message');
    }
  };

  const shareScore = async () => {
    try {
      await Share.share({
        message: `I scored ${finalScore} points in Quiz Master! 🎮\n` +
                `Rank: #${playerRank} (Top ${getPercentile()}%)\n` +
                `Questions: ${questionsAnswered}/${totalQuestions}\n` +
                `Can you beat my score? 🏆`
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[
        styles.content,
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        {/* Header with category */}
        <View style={styles.header}>
          <Text style={styles.category}>Mixed Subjects</Text>
          <Text style={styles.scoreDisplay}>{finalScore}</Text>
        </View>

        {/* Progress dots showing performance */}
        <View style={styles.progressDots}>
          {[...Array(14)].map((_, i) => (
            <View 
              key={i}
              style={[
                styles.dot,
                i < questionsAnswered ? styles.dotCompleted : styles.dotMissed,
                i < 5 ? styles.dotEasy : 
                i < 9 ? styles.dotAverage : 
                i < 12 ? styles.dotDifficult : 
                styles.dotImpossible
              ]}
            />
          ))}
        </View>

        {/* New High Score Banner - Only show when it's actually a new personal best */}
        {isNewHighScore && (
          <View style={styles.newHighScoreBanner}>
            <Text style={styles.newHighScoreText}>🎉 NEW PERSONAL BEST! 🎉</Text>
            <Text style={styles.previousScoreText}>
              Previous: {previousHighScore} pts → New: {finalScore} pts
            </Text>
            <Text style={styles.rankInfoText}>
              Rank: #{playerRank} • Top {getPercentile()}%
            </Text>
          </View>
        )}

        {/* Regular Completion Banner - Show when NOT a new high score */}
        {!isNewHighScore && (
          <View style={styles.completionBanner}>
            <Text style={styles.completionText}>Quiz Complete!</Text>
            <Text style={styles.correctAnswersText}>
              You got {questionsAnswered}/{totalQuestions} correct
            </Text>
          </View>
        )}

        {/* Results Card */}
        <View style={styles.resultsCard}>
          <Text style={styles.pointsText}>{finalScore} points</Text>

          {/* Score Breakdown */}
          <View style={styles.breakdown}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Base Score:</Text>
              <Text style={styles.breakdownValue}>{baseScore || finalScore}</Text>
            </View>
            {timeBonus > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Time Bonus ({timeRemaining}s):</Text>
                <Text style={styles.breakdownValue}>+{timeBonus}</Text>
              </View>
            )}
            {completionBonus > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Completion Bonus:</Text>
                <Text style={styles.breakdownValue}>+{completionBonus}</Text>
              </View>
            )}
            <View style={[styles.breakdownRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>TOTAL:</Text>
              <Text style={styles.totalValue}>{finalScore}</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{questionsAnswered}/{totalQuestions}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            {isNewHighScore && (
              <View style={styles.statItem}>
                <Text style={styles.statValue}>#{playerRank}</Text>
                <Text style={styles.statLabel}>Rank</Text>
              </View>
            )}
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{timeRemaining}s</Text>
              <Text style={styles.statLabel}>Time Left</Text>
            </View>
            {isNewHighScore && (
              <View style={styles.statItem}>
                <Text style={styles.statValue}>Top {getPercentile()}%</Text>
                <Text style={styles.statLabel}>Percentile</Text>
              </View>
            )}
          </View>

          {/* Comment Section - Only show for new high scores */}
          {isNewHighScore && (
            <View style={styles.commentSection}>
              <Text style={styles.commentLabel}>
                🎊 Leave a victory message for the leaderboard (optional):
              </Text>
              <TextInput
                style={styles.commentInput}
                placeholder="GG! That was tough..."
                placeholderTextColor="#6a7a8a"
                value={comment}
                onChangeText={setComment}
                maxLength={100}
                multiline
              />
              <Text style={styles.commentHint}>
                Your message will appear as a speech bubble on the leaderboard (or leave blank)
              </Text>
            </View>
          )}

          {/* Save/Continue Button */}
          <TouchableOpacity
            style={[styles.saveButton, !isNewHighScore && styles.continueButton]}
            onPress={saveHighScore}
          >
            <Text style={styles.saveButtonText}>
              {isNewHighScore ? 'Save New High Score' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Top Scores Preview */}
        <View style={styles.topScoresCard}>
          <Text style={styles.topScoresTitle}>🏆 Top Scores</Text>
          {highScores.map((score, index) => (
            <View key={index} style={styles.scoreRow}>
              <Text style={styles.scoreRank}>#{index + 1}</Text>
              <Text style={styles.scoreValue}>{score.score}</Text>
              <Text style={styles.scoreTime}>{score.timeRemaining}s</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={shareScore}
          >
            <Text style={styles.actionButtonText}>📤 Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.playAgainButton]}
            onPress={() => navigation.navigate('HelperSelect')}
          >
            <Text style={styles.actionButtonText}>🔄 Play Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('MainMenu')}
          >
            <Text style={styles.actionButtonText}>🏠 Menu</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a4a5a',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  category: {
    color: '#9aaa9a',
    fontSize: 14,
    marginBottom: 10,
  },
  scoreDisplay: {
    color: '#faca3a',
    fontSize: 48,
    fontWeight: 'bold',
  },
  newHighScoreBanner: {
    backgroundColor: 'rgba(74, 202, 74, 0.3)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4aca4a',
  },
  newHighScoreText: {
    color: '#4aca4a',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  previousScoreText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  rankInfoText: {
    color: '#4aca4a',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  completionBanner: {
    backgroundColor: 'rgba(90, 138, 202, 0.3)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#5a8aca',
  },
  completionText: {
    color: '#5a8aca',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  correctAnswersText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 3,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4a5a6a',
  },
  dotCompleted: {
    backgroundColor: '#4a9a4a',
  },
  dotMissed: {
    backgroundColor: '#ca4a4a',
    opacity: 0.5,
  },
  dotEasy: {
    borderColor: '#4a9a4a',
  },
  dotAverage: {
    borderColor: '#caca4a',
  },
  dotDifficult: {
    borderColor: '#ca8a4a',
  },
  dotImpossible: {
    borderColor: '#ca4a4a',
  },
  resultsCard: {
    backgroundColor: 'rgba(90, 106, 122, 0.7)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  rankTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  pointsText: {
    color: '#faca3a',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 15,
  },
  rankMessage: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rankMessageText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  breakdown: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    color: '#9aaa9a',
    fontSize: 14,
  },
  breakdownValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#5a6a7a',
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    color: '#faca3a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#faca3a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#9aaa9a',
    fontSize: 12,
    marginTop: 5,
  },
  commentSection: {
    marginBottom: 20,
  },
  commentLabel: {
    color: '#9aaa9a',
    fontSize: 12,
    marginBottom: 8,
  },
  commentInput: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    padding: 12,
    color: 'white',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#5a6a7a',
    minHeight: 50,
  },
  commentHint: {
    color: '#6a7a8a',
    fontSize: 10,
    marginTop: 5,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#4a9a4a',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6aca6a',
  },
  continueButton: {
    backgroundColor: 'rgba(90, 138, 202, 0.5)',
    borderColor: '#5a8aca',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topScoresCard: {
    backgroundColor: 'rgba(74, 90, 106, 0.5)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  topScoresTitle: {
    color: '#faca3a',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#4a5a6a',
  },
  scoreRank: {
    color: '#9aaa9a',
    fontSize: 14,
    fontWeight: 'bold',
    width: 40,
  },
  scoreValue: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  scoreTime: {
    color: '#6a7a8a',
    fontSize: 14,
    width: 50,
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(90, 138, 202, 0.3)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5a8aca',
  },
  playAgainButton: {
    backgroundColor: 'rgba(74, 154, 74, 0.3)',
    borderColor: '#4a9a4a',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ResultsScreen;