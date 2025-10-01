import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable
} from 'react-native';

const { width, height } = Dimensions.get('window');

const MainMenuScreen = ({ navigation }) => {
  const [userData] = useState({
    username: 'QuizMaster',
    level: 15,
    rating: 78,
    percentile: 82,
    avatar: '🧑‍🎓',
    coins: 2450,
    gems: 45,
    topSubjects: [
      { name: 'Chemistry', accuracy: 92, icon: '⚗️' },
      { name: 'Mathematics', accuracy: 85, icon: '📐' },
      { name: 'Physics', accuracy: 73, icon: '⚛️' }
    ],
    weakSubject: { name: 'Biology', accuracy: 61, icon: '🧬' },
    stats: {
      wins: 142,
      bestStreak: 23,
      accuracy: 94
    },
    perks: {
      speedDemon: 12,
      memoryBank: 8,
      luckyGuess: 5
    }
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Container - Game of Nerds Style */}
        <View style={styles.mainWrapper}>
          
          {/* Left Panel */}
          <View style={styles.leftPanel}>
            {/* Status Box */}
            <View style={styles.statusBox}>
              <Text style={styles.statusHeader}>STATUS</Text>
              
              <View style={styles.playerProfile}>
                <View style={styles.avatarFrame}>
                  <Text style={styles.avatar}>{userData.avatar}</Text>
                  <View style={styles.levelIndicator}>
                    <Text style={styles.levelText}>{userData.level}</Text>
                  </View>
                </View>
                
                <View style={styles.playerDetails}>
                  <Text style={styles.playerName}>{userData.username}</Text>
                  <Text style={styles.ratingText}>
                    RATING: <Text style={styles.ratingPercent}>{userData.rating}%</Text>
                  </Text>
                  <Text style={styles.betterThan}>
                    BETTER THAN: <Text style={styles.percentileText}>{userData.percentile}%</Text> of all players
                  </Text>
                </View>
              </View>

              {/* Subject Expertise */}
              <View style={styles.subjectExpertise}>
                <Text style={styles.expertiseHeader}>TOP SUBJECTS:</Text>
                {userData.topSubjects.map((subject, index) => (
                  <View key={index} style={styles.subjectStat}>
                    <View style={styles.subjectIcon}>
                      <Text style={styles.iconText}>{subject.icon}</Text>
                    </View>
                    <View style={styles.subjectInfo}>
                      <Text style={styles.subjectName}>{subject.name}</Text>
                      <Text style={styles.subjectAccuracy}>{subject.accuracy}% accuracy</Text>
                    </View>
                    <View style={styles.subjectRank}>
                      <Text style={styles.rankText}>#{index + 1}</Text>
                    </View>
                  </View>
                ))}
                
                <View style={styles.weaknessBox}>
                  <Text style={styles.weaknessLabel}>⚠️ Weak:</Text>
                  <Text style={styles.weaknessText}>
                    {userData.weakSubject.name} ({userData.weakSubject.accuracy}%)
                  </Text>
                </View>
              </View>

              {/* Brain Powers */}
              <View style={styles.perksSection}>
                <Text style={styles.perksLabel}>PERKS:</Text>
                
                <View style={styles.perkBar}>
                  <View style={styles.perkHeader}>
                    <Text style={styles.perkName}>Speed Demon</Text>
                    <Text style={styles.perkLevel}>{userData.perks.speedDemon}%</Text>
                  </View>
                  <View style={styles.perkProgress}>
                    <View style={[styles.perkFill, { width: `${userData.perks.speedDemon}%` }]} />
                  </View>
                </View>

                <View style={styles.perkBar}>
                  <View style={styles.perkHeader}>
                    <Text style={styles.perkName}>Memory Bank</Text>
                    <Text style={styles.perkLevel}>{userData.perks.memoryBank}%</Text>
                  </View>
                  <View style={styles.perkProgress}>
                    <View style={[styles.perkFill, { width: `${userData.perks.memoryBank * 5}%` }]} />
                  </View>
                </View>

                <View style={styles.perkBar}>
                  <View style={styles.perkHeader}>
                    <Text style={styles.perkName}>Lucky Guess</Text>
                    <Text style={styles.perkLevel}>{userData.perks.luckyGuess}%</Text>
                  </View>
                  <View style={styles.perkProgress}>
                    <View style={[styles.perkFill, { width: `${userData.perks.luckyGuess * 6}%` }]} />
                  </View>
                </View>
              </View>
            </View>

            {/* News Box */}
            <View style={styles.newsBox}>
              <Text style={styles.newsHeader}>NEWS</Text>
              <Text style={styles.newsTitle}>Season 7 Championship!</Text>
              <Text style={styles.newsContent}>
                Top 100 players qualify for exclusive rewards. 
                New subjects coming soon: Geography & History!
              </Text>
            </View>
          </View>

          {/* Right Panel */}
          <View style={styles.rightPanel}>
            {/* Mini Leaderboard */}
            <View style={styles.leaderboardBox}>
              <Text style={styles.leaderboardHeader}>High Scores: Top 10</Text>
              <View style={styles.leaderItem}>
                <Text style={styles.leaderRank}>1</Text>
                <Text style={styles.leaderName}>AlphaGenius</Text>
                <Text style={styles.leaderScore}>2847</Text>
              </View>
              <View style={styles.leaderItem}>
                <Text style={styles.leaderRank}>2</Text>
                <Text style={styles.leaderName}>BrainStorm</Text>
                <Text style={styles.leaderScore}>2693</Text>
              </View>
              <View style={styles.leaderItem}>
                <Text style={styles.leaderRank}>3</Text>
                <Text style={styles.leaderName}>QuizNinja</Text>
                <Text style={styles.leaderScore}>2541</Text>
              </View>
              <View style={[styles.leaderItem, styles.yourRank]}>
                <Text style={styles.leaderRank}>16</Text>
                <Text style={styles.leaderName}>You</Text>
                <Text style={styles.leaderScore}>1853</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <Pressable 
              style={({ pressed }) => [
                styles.playButton,
                pressed && styles.buttonPressed
              ]}
              onPress={() => navigation.navigate('HelperSelect')}
            >
              <Text style={styles.playButtonText}>PLAY GAME</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>USE YOUR 🪙</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>TOURNAMENTS</Text>
            </Pressable>

            <Pressable style={styles.tertiaryButton}>
              <Text style={styles.tertiaryButtonText}>HOW TO PLAY</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a4a5a',
  },
  mainWrapper: {
    flexDirection: 'row',
    padding: 15,
    paddingTop: 40,
  },
  leftPanel: {
    flex: 1.5,
    marginRight: 10,
  },
  rightPanel: {
    flex: 1,
  },
  statusBox: {
    backgroundColor: 'rgba(74, 90, 106, 0.6)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  statusHeader: {
    color: '#a0b0c0',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
  },
  playerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarFrame: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(122, 138, 154, 0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8a9aaa',
    marginRight: 12,
  },
  avatar: {
    fontSize: 28,
  },
  levelIndicator: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#4a9a4a',
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3a4a5a',
  },
  levelText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingText: {
    color: '#9aaa9a',
    fontSize: 11,
  },
  ratingPercent: {
    color: '#4a9a4a',
    fontWeight: 'bold',
  },
  betterThan: {
    color: '#9aaa9a',
    fontSize: 10,
  },
  percentileText: {
    color: '#4a9a4a',
    fontWeight: 'bold',
  },
  subjectExpertise: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#5a6a7a',
    marginBottom: 12,
  },
  expertiseHeader: {
    color: '#faca3a',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subjectStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 6,
    padding: 6,
    marginBottom: 5,
  },
  subjectIcon: {
    width: 28,
    height: 28,
    backgroundColor: 'rgba(90, 106, 122, 0.5)',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  iconText: {
    fontSize: 16,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  subjectAccuracy: {
    color: '#4a9a4a',
    fontSize: 10,
    fontWeight: 'bold',
  },
  subjectRank: {
    width: 26,
    height: 26,
    backgroundColor: 'rgba(106, 122, 138, 0.5)',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    color: '#faca3a',
    fontSize: 11,
    fontWeight: 'bold',
  },
  weaknessBox: {
    backgroundColor: 'rgba(202, 138, 74, 0.1)',
    borderRadius: 6,
    padding: 6,
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weaknessLabel: {
    color: '#ca8a4a',
    fontSize: 10,
    fontWeight: '600',
  },
  weaknessText: {
    color: '#9aaa9a',
    fontSize: 10,
  },
  perksSection: {
    borderTopWidth: 1,
    borderTopColor: '#5a6a7a',
    paddingTop: 10,
  },
  perksLabel: {
    color: '#a0b0c0',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
  },
  perkBar: {
    marginBottom: 8,
  },
  perkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  perkName: {
    color: '#d0d0d0',
    fontSize: 11,
  },
  perkLevel: {
    color: '#4a9a4a',
    fontSize: 11,
    fontWeight: 'bold',
  },
  perkProgress: {
    height: 12,
    backgroundColor: '#2a3a4a',
    borderRadius: 6,
    overflow: 'hidden',
  },
  perkFill: {
    height: '100%',
    backgroundColor: '#4a9a4a',
    borderRadius: 6,
  },
  newsBox: {
    backgroundColor: 'rgba(74, 90, 106, 0.6)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  newsHeader: {
    color: '#a0b0c0',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
  },
  newsTitle: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 5,
  },
  newsContent: {
    color: '#c0d0e0',
    fontSize: 11,
    lineHeight: 16,
  },
  leaderboardBox: {
    backgroundColor: 'rgba(74, 90, 106, 0.6)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  leaderboardHeader: {
    color: '#faca3a',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  leaderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#4a5a6a',
  },
  yourRank: {
    backgroundColor: 'rgba(74, 154, 74, 0.2)',
    borderRadius: 6,
    padding: 5,
    marginTop: 2,
  },
  leaderRank: {
    width: 25,
    color: '#8a9aaa',
    fontSize: 11,
    fontWeight: 'bold',
  },
  leaderName: {
    flex: 1,
    color: '#c0d0e0',
    fontSize: 11,
  },
  leaderScore: {
    color: '#4a9a4a',
    fontSize: 11,
    fontWeight: 'bold',
  },
  playButton: {
    backgroundColor: '#4a9a4a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#6aca6a',
  },
  playButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'rgba(90, 138, 202, 0.3)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#5a8aca',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  tertiaryButton: {
    backgroundColor: 'rgba(106, 106, 106, 0.3)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7a7a7a',
  },
  tertiaryButtonText: {
    color: '#a0b0c0',
    fontSize: 11,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.7,
  },
});

export default MainMenuScreen;