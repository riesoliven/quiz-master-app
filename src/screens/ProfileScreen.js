import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getUserStats } from '../services/userStatsService';

const ProfileScreen = ({ navigation }) => {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    setLoading(true);
    const userStats = await getUserStats(user.uid);
    setStats(userStats);
    setLoading(false);
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return '#4aca4a';
    if (accuracy >= 60) return '#caca4a';
    if (accuracy >= 40) return '#ca8a4a';
    return '#ca4a4a';
  };

  const getAccuracyGrade = (accuracy) => {
    if (accuracy >= 90) return 'S';
    if (accuracy >= 80) return 'A';
    if (accuracy >= 70) return 'B';
    if (accuracy >= 60) return 'C';
    if (accuracy >= 50) return 'D';
    return 'F';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#faca3a" />
        <Text style={styles.loadingText}>Loading stats...</Text>
      </View>
    );
  }

  const subjectsArray = stats?.subjects
    ? Object.entries(stats.subjects)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.accuracy - a.accuracy)
    : [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Player Profile</Text>
      </View>

      {/* Player Info */}
      <View style={styles.playerCard}>
        <Text style={styles.avatarLarge}>{userProfile?.avatar || '🧑‍🎓'}</Text>
        <Text style={styles.playerName}>{userProfile?.username || 'Player'}</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Level {userProfile?.level || 1}</Text>
        </View>
      </View>

      {/* Overall Stats */}
      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Overall Performance</Text>

        <View style={styles.overallStatsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats?.totalQuestionsAnswered || 0}</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats?.totalQuestionsCorrect || 0}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: getAccuracyColor(stats?.overallAccuracy || 0) }]}>
              {stats?.overallAccuracy || 0}%
            </Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.gradeText, { color: getAccuracyColor(stats?.overallAccuracy || 0) }]}>
              {getAccuracyGrade(stats?.overallAccuracy || 0)}
            </Text>
            <Text style={styles.statLabel}>Grade</Text>
          </View>
        </View>
      </View>

      {/* Subject Breakdown */}
      <View style={styles.subjectsCard}>
        <Text style={styles.sectionTitle}>Subject Ratings</Text>

        {subjectsArray.length === 0 ? (
          <Text style={styles.emptyText}>
            Complete quizzes to see your subject ratings!
          </Text>
        ) : (
          subjectsArray.map((subject, index) => (
            <View key={subject.name} style={styles.subjectRow}>
              <View style={styles.subjectRank}>
                <Text style={styles.rankNumber}>#{index + 1}</Text>
              </View>

              <View style={styles.subjectInfo}>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <View style={styles.subjectStats}>
                  <Text style={styles.subjectDetail}>
                    {subject.correct}/{subject.total} correct
                  </Text>
                </View>
              </View>

              <View style={styles.subjectAccuracy}>
                <Text
                  style={[
                    styles.accuracyPercent,
                    { color: getAccuracyColor(subject.accuracy) }
                  ]}
                >
                  {subject.accuracy}%
                </Text>
                <Text
                  style={[
                    styles.accuracyGrade,
                    { color: getAccuracyColor(subject.accuracy) }
                  ]}
                >
                  {getAccuracyGrade(subject.accuracy)}
                </Text>
              </View>

              <View style={styles.accuracyBar}>
                <View
                  style={[
                    styles.accuracyFill,
                    {
                      width: `${subject.accuracy}%`,
                      backgroundColor: getAccuracyColor(subject.accuracy)
                    }
                  ]}
                />
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a4a5a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#3a4a5a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#faca3a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  playerCard: {
    backgroundColor: 'rgba(90, 106, 122, 0.7)',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  avatarLarge: {
    fontSize: 80,
    marginBottom: 10,
  },
  playerName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  levelBadge: {
    backgroundColor: '#faca3a',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    color: '#3a4a5a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: 'rgba(90, 106, 122, 0.7)',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  sectionTitle: {
    color: '#faca3a',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  overallStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  gradeText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#9aaa9a',
    fontSize: 12,
    marginTop: 5,
  },
  subjectsCard: {
    backgroundColor: 'rgba(90, 106, 122, 0.7)',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#6a7a8a',
    marginBottom: 40,
  },
  emptyText: {
    color: '#9aaa9a',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  subjectRow: {
    marginBottom: 20,
    position: 'relative',
  },
  subjectRank: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  rankNumber: {
    color: '#faca3a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subjectInfo: {
    marginLeft: 35,
    marginBottom: 5,
  },
  subjectName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  subjectStats: {
    flexDirection: 'row',
  },
  subjectDetail: {
    color: '#9aaa9a',
    fontSize: 12,
  },
  subjectAccuracy: {
    position: 'absolute',
    right: 0,
    top: 0,
    alignItems: 'flex-end',
  },
  accuracyPercent: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  accuracyGrade: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  accuracyBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
    marginLeft: 35,
  },
  accuracyFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default ProfileScreen;
