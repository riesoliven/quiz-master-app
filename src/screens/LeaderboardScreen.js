import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { getTopLeaderboard, getUserRank } from '../services/leaderboardService';
import { useAuth } from '../context/AuthContext';

const LeaderboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const [topPlayers, rankData] = await Promise.all([
        getTopLeaderboard(50),
        user ? getUserRank(user.uid) : Promise.resolve(null)
      ]);

      setLeaderboard(topPlayers);
      setUserRank(rankData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLeaderboard();
  };

  const getRankColor = (index) => {
    if (index === 0) return '#FFD700'; // Gold
    if (index === 1) return '#C0C0C0'; // Silver
    if (index === 2) return '#CD7F32'; // Bronze
    return '#9aaa9a';
  };

  const getRankIcon = (index) => {
    if (index === 0) return '👑';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#faca3a" />
        <Text style={styles.loadingText}>Loading Leaderboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🏆 Leaderboard</Text>
      </View>

      {/* User's Rank Card */}
      {userRank && userRank.rank > 0 && (
        <View style={styles.userRankCard}>
          <View style={styles.userRankContent}>
            <Text style={styles.userRankLabel}>Your Rank</Text>
            <Text style={styles.userRankValue}>#{userRank.rank}</Text>
          </View>
          <View style={styles.userRankContent}>
            <Text style={styles.userRankLabel}>Your Score</Text>
            <Text style={styles.userRankValue}>{userRank.score}</Text>
          </View>
          <View style={styles.userRankContent}>
            <Text style={styles.userRankLabel}>Top</Text>
            <Text style={styles.userRankValue}>
              {userRank.total > 0 ? Math.round((1 - userRank.rank / userRank.total) * 100) : 0}%
            </Text>
          </View>
        </View>
      )}

      {/* Leaderboard List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#faca3a" />
        }
      >
        {leaderboard.map((player, index) => {
          const isCurrentUser = user && player.userId === user.uid;

          return (
            <View
              key={player.id}
              style={[
                styles.leaderboardItem,
                isCurrentUser && styles.currentUserItem,
                index < 3 && styles.topThreeItem
              ]}
            >
              {/* Rank and Avatar */}
              <View style={styles.leftSection}>
                <View style={[styles.rankBadge, { backgroundColor: getRankColor(index) + '33' }]}>
                  <Text style={[styles.rankText, { color: getRankColor(index) }]}>
                    {getRankIcon(index)} #{index + 1}
                  </Text>
                </View>
                <Text style={styles.avatar}>{player.avatar || '🧑‍🎓'}</Text>
              </View>

              {/* Username and Score */}
              <View style={styles.centerSection}>
                <Text style={styles.username}>
                  {player.username} {isCurrentUser && '(You)'}
                </Text>
                <Text style={styles.score}>{player.highScore} pts</Text>

                {/* Message Bubble */}
                {player.message && player.message.trim() !== '' && (
                  <View style={styles.messageBubble}>
                    <View style={styles.bubbleTriangle} />
                    <View style={styles.bubbleContent}>
                      <Text style={styles.messageText}>{player.message}</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Medal for top 3 */}
              {index < 3 && (
                <View style={styles.medalContainer}>
                  <Text style={styles.medal}>{getRankIcon(index)}</Text>
                </View>
              )}
            </View>
          );
        })}

        {leaderboard.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No scores yet!</Text>
            <Text style={styles.emptySubtext}>Be the first to set a high score</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a4a5a',
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#3a4a5a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9aaa9a',
    fontSize: 14,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
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
  userRankCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(250, 202, 58, 0.15)',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#faca3a',
  },
  userRankContent: {
    flex: 1,
    alignItems: 'center',
  },
  userRankLabel: {
    color: '#9aaa9a',
    fontSize: 10,
    marginBottom: 5,
  },
  userRankValue: {
    color: '#faca3a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  leaderboardItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(90, 106, 122, 0.5)',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#6a7a8a',
    alignItems: 'flex-start',
  },
  currentUserItem: {
    backgroundColor: 'rgba(250, 202, 58, 0.1)',
    borderColor: '#faca3a',
    borderWidth: 2,
  },
  topThreeItem: {
    borderWidth: 2,
  },
  leftSection: {
    alignItems: 'center',
    marginRight: 15,
  },
  rankBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  rankText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  avatar: {
    fontSize: 32,
  },
  centerSection: {
    flex: 1,
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  score: {
    color: '#4aca4a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageBubble: {
    marginTop: 10,
    position: 'relative',
  },
  bubbleTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(106, 122, 138, 0.9)',
    marginLeft: 10,
  },
  bubbleContent: {
    backgroundColor: 'rgba(106, 122, 138, 0.9)',
    borderRadius: 12,
    padding: 10,
  },
  messageText: {
    color: 'white',
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  medalContainer: {
    marginLeft: 10,
  },
  medal: {
    fontSize: 28,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9aaa9a',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#6a7a8a',
    fontSize: 14,
  },
});

export default LeaderboardScreen;
