import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Share
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const [playerRank, setPlayerRank] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [comment, setComment] = useState('');
  const [highScores, setHighScores] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));

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
      const scores = await AsyncStorage.getItem('highScores');
      const parsedScores = scores ? JSON.parse(scores) : [];
      
      // Add current score
      const newScore = {
        score: finalScore,
        date: new Date().toISOString(),
        questionsAnswered,
        timeRemaining
      };
      
      parsedScores.push(newScore);
      parsedScores.sort((a, b) => b.score - a.score);
      
      // Keep only top 100
      const top100 = parsedScores.slice(0, 100);
      
      // Find player rank
      const rank = top100.findIndex(s => s.score === finalScore) + 1;
      setPlayerRank(rank);
      setTotalPlayers(top100.length);
      setHighScores(top100.slice(0, 5)); // Show top 5
      
      // Save updated scores
      await AsyncStorage.setItem('highScores', JSON.stringify(top100));
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
    // In a real app, this would save to a backend
    try {
      const scoreData = {
        score: finalScore,
        comment: comment,
        date: new Date().toISOString(),
        questionsAnswered,
        timeRemaining
      };
      
      // Here you would send to backend
      console.log('Saving score:', scoreData);
      
      navigation.navigate('MainMenu', { newHighScore: finalScore });
    } catch (error) {
      console.error('Error saving score:', error);
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

        {/* Results Card */}
        <View style={styles.resultsCard}>
          <Text style={styles.rankTitle}>You're number {playerRank}!</Text>
          <Text style={styles.pointsText}>{finalScore} points</Text>
          
          <View style={styles.rankMessage}>
            <Text style={[styles.rankMessageText, { color: getRankColor() }]}>
              {getRankMessage()}
            </Text>
          </View>

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
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Top {getPercentile()}%</Text>
              <Text style={styles.statLabel}>Percentile</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{timeRemaining}s</Text>
              <Text style={styles.statLabel}>Time Left</Text>
            </View>
          </View>

          {/* Comment Section */}
          <View style={styles.commentSection}>
            <Text style={styles.commentLabel}>Leave a comment for the leaderboard:</Text>
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
              Your message will appear on the high score list
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={saveHighScore}
          >
            <Text style={styles.saveButtonText}>Save High Score</Text>
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