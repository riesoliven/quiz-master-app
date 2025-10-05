import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { verifyAdminPassword } from '../services/auth';
import { getSubjectOfTheDay } from '../services/dailySubject';
import { useAuth } from '../context/AuthContext';
import { getTopLeaderboard } from '../services/leaderboardService';
import { getTopSubjects } from '../services/userStatsService';
import { awardCoinsForAd } from '../services/coinService';
import { getUserEnergy, canAffordGame, spendEnergyForGame, addEnergy, refillEnergy, ENERGY_PER_GAME, MAX_ENERGY, getTimeUntilNextEnergyFormatted } from '../services/energyService';
import { awardGemsForAd, getUserGems } from '../services/gemService';
import { initializeRewardedAd, showRewardedAd, isRewardedAdReady } from '../services/adService';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore, COLLECTIONS } from '../services/firebase';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

const MainMenuScreen = ({ navigation }) => {
  // ALL state hooks MUST be inside the component
  const { user, userProfile, logout, refreshUserProfile } = useAuth();
  const [secretTaps, setSecretTaps] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAdRewardModal, setShowAdRewardModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [dailySubject] = useState(getSubjectOfTheDay());
  const [leaderboard, setLeaderboard] = useState([]);
  const [topSubjects, setTopSubjects] = useState([]);
  const [energy, setEnergy] = useState(0);
  const [energyLastUpdate, setEnergyLastUpdate] = useState(new Date());
  const [gems, setGems] = useState(0);

  useEffect(() => {
    try {
      console.log('MainMenu: Loading data for user:', user?.uid);
      loadLeaderboard();
      loadTopSubjects();
      loadEnergyAndGems();

      // Initialize rewarded ad
      console.log('MainMenu: Initializing ads...');
      const cleanupAd = initializeRewardedAd();

      // Update energy display every minute
      const energyInterval = setInterval(() => {
        loadEnergyAndGems();
      }, 60000); // Update every minute

      return () => {
        if (cleanupAd) {
          try {
            cleanupAd();
          } catch (error) {
            console.error('Error cleaning up ads:', error);
          }
        }
        clearInterval(energyInterval);
      };
    } catch (error) {
      console.error('❌ Error in MainMenu useEffect:', error);
    }
  }, [user]);

  const loadLeaderboard = async () => {
    try {
      const topPlayers = await getTopLeaderboard(10);
      setLeaderboard(topPlayers);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLeaderboard([]); // Set empty array on error to prevent crashes
    }
  };

  const loadTopSubjects = async () => {
    if (!user) return;
    const subjects = await getTopSubjects(user.uid, 3);
    setTopSubjects(subjects);
  };

  const loadEnergyAndGems = async () => {
    if (!user) return;
    const { energy: currentEnergy, lastUpdate } = await getUserEnergy(user.uid);
    const currentGems = await getUserGems(user.uid);
    setEnergy(currentEnergy);
    setEnergyLastUpdate(lastUpdate);
    setGems(currentGems);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' }
      ]
    );
  };

  const handleSecretTap = () => {
    const newTaps = secretTaps + 1;
    setSecretTaps(newTaps);
    
    if (newTaps >= 5) {
      setSecretTaps(0);
      setShowPasswordModal(true);
    }
    
    setTimeout(() => {
      if (secretTaps < 5) setSecretTaps(0);
    }, 2000);
  };

  const handlePasswordSubmit = async () => {
    if (verifyAdminPassword(passwordInput)) {
      try {
        // Update user document to set isAdmin = true
        const userDocRef = doc(firestore, COLLECTIONS.USERS, user.uid);
        await updateDoc(userDocRef, {
          isAdmin: true
        });

        // Refresh user profile to get updated isAdmin status
        await refreshUserProfile();

        setShowPasswordModal(false);
        setPasswordInput('');
        Alert.alert('Success', 'Admin access granted!');
        navigation.navigate('QuestionManager');
      } catch (error) {
        console.error('Error setting admin status:', error);
        Alert.alert('Error', 'Failed to grant admin access');
      }
    } else {
      Alert.alert('Access Denied', 'Incorrect password');
      setPasswordInput('');
    }
  };

  const handlePlayGame = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to play');
      return;
    }

    // Check if user has enough energy
    const hasEnergy = await canAffordGame(user.uid);

    if (!hasEnergy) {
      // Show insufficient energy dialog with ad option
      const timeUntilNext = getTimeUntilNextEnergyFormatted(energyLastUpdate);
      Alert.alert(
        'Insufficient Energy',
        `You need ${ENERGY_PER_GAME} energy to play. You have ${energy} energy.\n\nNext energy in: ${timeUntilNext}\n\nWatch an ad to get energy?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Watch Ad',
            onPress: handleWatchAd
          }
        ]
      );
      return;
    }

    // Deduct energy and start game
    const success = await spendEnergyForGame(user.uid);
    if (success) {
      // Reload energy display
      await loadEnergyAndGems();
      navigation.navigate('HelperSelect');
    } else {
      Alert.alert('Error', 'Failed to start game. Please try again.');
    }
  };

  const handleWatchAd = async () => {
    // Show player choice modal
    setShowAdRewardModal(true);
  };

  const handleAdRewardChoice = async (rewardType) => {
    setShowAdRewardModal(false);

    try {
      // Show the rewarded ad (auto-detects Expo Go vs EAS)
      const earnedReward = await showRewardedAd();

      if (earnedReward) {
        // Award chosen reward
        if (rewardType === 'energy') {
          await addEnergy(user.uid, 2);
          await loadEnergyAndGems();
          Alert.alert('Energy Earned!', `You received 2 energy! ⚡`);
        } else if (rewardType === 'gems') {
          await awardGemsForAd(user.uid);
          await loadEnergyAndGems();
          Alert.alert('Gems Earned!', `You received 2 gems! 💎`);
        } else {
          // coins
          const coinsEarned = await awardCoinsForAd(user.uid);
          await refreshUserProfile();
          Alert.alert('Coins Earned!', `You received ${coinsEarned} coins! 🪙`);
        }
      } else {
        // User closed ad early without earning reward (only in EAS builds)
        Alert.alert(
          'Ad Closed',
          'You need to watch the ad completely to earn coins.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error showing ad:', error);
      Alert.alert(
        'Ad Error',
        error.message || 'Failed to show ad. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  };

  // DEV: Instant energy refill for testing
  const handleDevRefillEnergy = async () => {
    if (!user) return;
    await refillEnergy(user.uid);
    await loadEnergyAndGems();
    Alert.alert('DEV', 'Energy refilled to 25! ⚡');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mainWrapper}>
          
          {/* Left Panel */}
          <View style={styles.leftPanel}>
            <View style={styles.statusBox}>
              <Text style={styles.statusHeader}>STATUS</Text>
              
              <View style={styles.playerProfile}>
                <TouchableOpacity onPress={handleSecretTap} activeOpacity={0.9}>
                  <View style={styles.avatarFrame}>
                    <Text style={styles.avatar}>{userProfile?.avatar || '🧑‍🎓'}</Text>
                    <View style={styles.levelIndicator}>
                      <Text style={styles.levelText}>{userProfile?.level || 1}</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <View style={styles.playerDetails}>
                  <Text style={styles.playerName}>{userProfile?.username || 'Player'}</Text>
                  <Text style={styles.ratingText}>
                    GAMES: <Text style={styles.ratingPercent}>{userProfile?.totalGamesPlayed || 0}</Text>
                  </Text>
                  <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logoutText}>🚪 Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.playerStats}>
                <Text style={styles.expertiseHeader}>YOUR STATS:</Text>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>💰 Coins:</Text>
                  <Text style={styles.statValue}>{userProfile?.coins || 0}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>💎 Gems:</Text>
                  <Text style={styles.statValue}>{userProfile?.gems || 0}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>🎮 Games:</Text>
                  <Text style={styles.statValue}>{userProfile?.totalGamesPlayed || 0}</Text>
                </View>

              </View>

              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('Profile')}
              >
                <Text style={styles.profileButtonText}>📊 View Full Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Top 3 Subjects */}
            {topSubjects.length > 0 && (
              <View style={styles.topSubjectsBox}>
                <Text style={styles.topSubjectsHeader}>🏅 YOUR TOP SUBJECTS</Text>
                {topSubjects.map((subject, index) => (
                  <View key={subject.name} style={styles.topSubjectRow}>
                    <Text style={styles.topSubjectRank}>#{index + 1}</Text>
                    <Text style={styles.topSubjectName}>{subject.name}</Text>
                    <Text style={[
                      styles.topSubjectAccuracy,
                      { color: subject.accuracy >= 80 ? '#4aca4a' : subject.accuracy >= 60 ? '#caca4a' : '#ca8a4a' }
                    ]}>
                      {subject.accuracy}%
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.newsBox}>
              <Text style={styles.newsHeader}>NEWS</Text>
              <Text style={styles.newsTitle}>Season 7 Championship!</Text>
              <Text style={styles.newsContent}>
                Top 100 players qualify for exclusive rewards.
                New subjects coming soon: Geography & History!
              </Text>
            </View>

            {/* Subject of the Day */}
            <View style={styles.dailySubjectBox}>
              <Text style={styles.dailySubjectHeader}>⭐ SUBJECT OF THE DAY</Text>
              <View style={styles.dailySubjectContent}>
                <Text style={styles.dailySubjectIcon}>{dailySubject.icon}</Text>
                <View style={styles.dailySubjectInfo}>
                  <Text style={styles.dailySubjectName}>{dailySubject.subject}</Text>
                  <Text style={styles.dailySubjectBonus}>
                    🎁 +20% Bonus Points!
                  </Text>
                </View>
              </View>
              <Text style={styles.dailySubjectHint}>
                Answer {dailySubject.subject} questions correctly for extra points today!
              </Text>
            </View>
          </View>

          {/* Right Panel */}
          <View style={styles.rightPanel}>
            <TouchableOpacity
              style={styles.leaderboardBox}
              onPress={() => navigation.navigate('Leaderboard')}
            >
              <Text style={styles.leaderboardHeader}>🏆 High Scores: Top 10</Text>
              {leaderboard.slice(0, 4).map((player, index) => (
                <View key={player.id} style={[styles.leaderItem, player.userId === userProfile?.id && styles.yourRank]}>
                  <Text style={styles.leaderRank}>{index + 1}</Text>
                  <Text style={styles.leaderName}>{player.username}</Text>
                  <Text style={styles.leaderScore}>{player.highScore}</Text>
                </View>
              ))}
              {leaderboard.length === 0 && (
                <Text style={styles.emptyLeaderboard}>No scores yet!</Text>
              )}
              <Text style={styles.viewFullLeaderboard}>Tap to view full leaderboard →</Text>
            </TouchableOpacity>

            {/* Energy Bar */}
            <View style={styles.energyBox}>
              <View style={styles.energyHeader}>
                <Text style={styles.energyLabel}>⚡ ENERGY</Text>
                <Text style={styles.energyCount}>{energy}/{MAX_ENERGY}</Text>
                <TouchableOpacity onPress={handleDevRefillEnergy} style={styles.devButton}>
                  <Text style={styles.devButtonText}>DEV +25</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.energyBarContainer}>
                <View style={[styles.energyBarFill, { width: `${(energy / MAX_ENERGY) * 100}%` }]} />
              </View>
              <Text style={styles.energyHint}>
                {energy >= MAX_ENERGY ? 'Full energy!' : `Next energy in: ${getTimeUntilNextEnergyFormatted(energyLastUpdate)}`}
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.playButton,
                pressed && styles.buttonPressed,
                energy < ENERGY_PER_GAME && styles.buttonDisabled
              ]}
              onPress={handlePlayGame}
            >
              <Text style={styles.playButtonText}>PLAY GAME</Text>
              <Text style={styles.playCostText}>Cost: {ENERGY_PER_GAME} ⚡</Text>
            </Pressable>

            <Pressable
              style={styles.adButton}
              onPress={handleWatchAd}
            >
              <Text style={styles.adButtonText}>📺 WATCH AD FOR REWARDS</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('HelperUpgrade')}
            >
              <Text style={styles.secondaryButtonText}>👥 VIEW HELPERS</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('SubmitQuestion')}
            >
              <Text style={styles.secondaryButtonText}>➕ SUBMIT QUESTION</Text>
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

      {/* Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.passwordModal}>
            <Text style={styles.modalTitle}>🔐 Admin Access</Text>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter admin password"
              placeholderTextColor="#6a7a8a"
              secureTextEntry
              value={passwordInput}
              onChangeText={setPasswordInput}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPasswordModal(false);
                  setPasswordInput('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handlePasswordSubmit}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Ad Reward Choice Modal */}
      <Modal
        visible={showAdRewardModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.rewardModal}>
            <Text style={styles.modalTitle}>📺 Choose Your Reward</Text>
            <Text style={styles.rewardDescription}>Watch an ad to earn:</Text>

            <TouchableOpacity
              style={styles.rewardOption}
              onPress={() => handleAdRewardChoice('energy')}
            >
              <Text style={styles.rewardIcon}>⚡</Text>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardName}>Energy</Text>
                <Text style={styles.rewardAmount}>+2 Energy</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rewardOption}
              onPress={() => handleAdRewardChoice('gems')}
            >
              <Text style={styles.rewardIcon}>💎</Text>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardName}>Gems</Text>
                <Text style={styles.rewardAmount}>+2 Gems</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rewardOption}
              onPress={() => handleAdRewardChoice('coins')}
            >
              <Text style={styles.rewardIcon}>🪙</Text>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardName}>Coins</Text>
                <Text style={styles.rewardAmount}>+50 Coins</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { marginTop: 15 }]}
              onPress={() => setShowAdRewardModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Complete styles object - add all missing styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a4a5a',
  },
  mainWrapper: {
    flexDirection: 'row',
    padding: 10,
  },
  leftPanel: {
    flex: 1.5,
    marginRight: 10,
  },
  rightPanel: {
    flex: 1,
  },
  statusBox: {
    backgroundColor: 'rgba(90, 106, 122, 0.5)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  statusHeader: {
    color: '#faca3a',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  playerProfile: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatarFrame: {
    width: 60,
    height: 60,
    backgroundColor: '#4a5a6a',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6a7a8a',
  },
  avatar: {
    fontSize: 30,
  },
  levelIndicator: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#faca3a',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  levelText: {
    color: '#3a4a5a',
    fontSize: 10,
    fontWeight: 'bold',
  },
  playerDetails: {
    marginLeft: 15,
    flex: 1,
  },
  playerName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingText: {
    color: '#9aaa9a',
    fontSize: 12,
  },
  ratingPercent: {
    color: '#faca3a',
    fontWeight: 'bold',
  },
  betterThan: {
    color: '#9aaa9a',
    fontSize: 10,
  },
  percentileText: {
    color: '#4aca4a',
    fontWeight: 'bold',
  },
  logoutText: {
    color: '#ca4a4a',
    fontSize: 12,
    marginTop: 5,
  },
  playerStats: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#5a6a7a',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    color: '#9aaa9a',
    fontSize: 12,
  },
  statValue: {
    color: '#faca3a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subjectExpertise: {
    marginTop: 10,
  },
  expertiseHeader: {
    color: '#9aaa9a',
    fontSize: 11,
    marginBottom: 8,
  },
  subjectStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectIcon: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  subjectInfo: {
    flex: 1,
    marginLeft: 10,
  },
  subjectName: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subjectAccuracy: {
    color: '#9aaa9a',
    fontSize: 10,
  },
  subjectRank: {
    backgroundColor: 'rgba(250, 202, 58, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rankText: {
    color: '#faca3a',
    fontSize: 11,
    fontWeight: 'bold',
  },
  weaknessBox: {
    backgroundColor: 'rgba(202, 74, 74, 0.2)',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  weaknessLabel: {
    fontSize: 12,
    marginRight: 5,
  },
  weaknessText: {
    color: '#ca9a9a',
    fontSize: 11,
  },
  perksSection: {
    marginTop: 15,
  },
  perksLabel: {
    color: '#9aaa9a',
    fontSize: 11,
    marginBottom: 10,
  },
  perkBar: {
    marginBottom: 10,
  },
  perkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  perkName: {
    color: 'white',
    fontSize: 11,
  },
  perkLevel: {
    color: '#faca3a',
    fontSize: 11,
    fontWeight: 'bold',
  },
  perkProgress: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 3,
  },
  perkFill: {
    height: '100%',
    backgroundColor: '#4aca4a',
    borderRadius: 3,
  },
  newsBox: {
    backgroundColor: 'rgba(90, 106, 122, 0.5)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  newsHeader: {
    color: '#faca3a',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  newsTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  newsContent: {
    color: '#9aaa9a',
    fontSize: 11,
    lineHeight: 16,
  },
  leaderboardBox: {
    backgroundColor: 'rgba(90, 106, 122, 0.5)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  leaderboardHeader: {
    color: '#faca3a',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  leaderItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingVertical: 4,
  },
  leaderRank: {
    color: '#9aaa9a',
    fontSize: 12,
    width: 25,
    fontWeight: 'bold',
  },
  leaderName: {
    color: 'white',
    fontSize: 12,
    flex: 1,
  },
  leaderScore: {
    color: '#faca3a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  yourRank: {
    backgroundColor: 'rgba(250, 202, 58, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 5,
  },
  emptyLeaderboard: {
    color: '#6a7a8a',
    fontSize: 12,
    textAlign: 'center',
    padding: 20,
  },
  viewFullLeaderboard: {
    color: '#faca3a',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  playButton: {
    backgroundColor: '#4a9a4a',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#5aca5a',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  playButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playCostText: {
    color: '#faca3a',
    fontSize: 12,
    marginTop: 4,
  },
  secondaryButton: {
    backgroundColor: 'rgba(90, 106, 122, 0.5)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 14,
  },
  tertiaryButton: {
    backgroundColor: 'rgba(74, 90, 106, 0.3)',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5a6a7a',
  },
  tertiaryButtonText: {
    color: '#9aaa9a',
    fontSize: 12,
  },
  dailySubjectBox: {
    backgroundColor: 'rgba(250, 202, 58, 0.15)',
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#faca3a',
  },
  dailySubjectHeader: {
    color: '#faca3a',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  dailySubjectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dailySubjectIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  dailySubjectInfo: {
    flex: 1,
  },
  dailySubjectName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dailySubjectBonus: {
    color: '#4aca4a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dailySubjectHint: {
    color: '#9aaa9a',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordModal: {
    backgroundColor: '#4a5a6a',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  modalTitle: {
    color: '#faca3a',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  passwordInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: '#5a6a7a',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(106, 106, 106, 0.3)',
    borderWidth: 1,
    borderColor: '#7a7a7a',
  },
  confirmButton: {
    backgroundColor: 'rgba(74, 154, 74, 0.3)',
    borderWidth: 1,
    borderColor: '#4a9a4a',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileButton: {
    backgroundColor: 'rgba(250, 202, 58, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#faca3a',
  },
  profileButtonText: {
    color: '#faca3a',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  topSubjectsBox: {
    backgroundColor: 'rgba(58, 74, 90, 0.5)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4a5a6a',
  },
  topSubjectsHeader: {
    color: '#faca3a',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  topSubjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  topSubjectRank: {
    color: '#faca3a',
    fontSize: 12,
    fontWeight: 'bold',
    width: 30,
  },
  topSubjectName: {
    color: 'white',
    fontSize: 12,
    flex: 1,
  },
  topSubjectAccuracy: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  energyBox: {
    backgroundColor: 'rgba(90, 106, 122, 0.5)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  energyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  energyLabel: {
    color: '#faca3a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  energyCount: {
    color: '#4aca4a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  devButton: {
    backgroundColor: '#ca4aca',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  devButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  energyBarContainer: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  energyBarFill: {
    height: '100%',
    backgroundColor: '#4aca4a',
    borderRadius: 4,
  },
  energyHint: {
    color: '#9aaa9a',
    fontSize: 10,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  adButton: {
    backgroundColor: 'rgba(138, 90, 202, 0.3)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#9a5aca',
  },
  adButtonText: {
    color: '#ca9aca',
    fontSize: 13,
    fontWeight: 'bold',
  },
  rewardModal: {
    backgroundColor: '#4a5a6a',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  rewardDescription: {
    color: '#9aaa9a',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 15,
  },
  rewardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#5a6a7a',
  },
  rewardIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  rewardAmount: {
    color: '#faca3a',
    fontSize: 12,
  },
});

export default MainMenuScreen;