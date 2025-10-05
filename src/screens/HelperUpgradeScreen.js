import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { helpers } from '../data/helpers';
import {
  getUserHelpers,
  unlockHelper,
  buyHelperEXP,
  calculateHelperRating,
  getExpForNextLevel,
  COINS_PER_EXP,
  MAX_HELPER_LEVEL
} from '../services/helperService';

const HelperUpgradeScreen = ({ navigation }) => {
  const { user, userProfile } = useAuth();
  const [userHelpers, setUserHelpers] = useState({});
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [coinsToSpend, setCoinsToSpend] = useState('');

  const subjects = [
    { key: 'Arithmetic & Algebra', icon: '📐' },
    { key: 'Geometry & Trigonometry', icon: '📏' },
    { key: 'Statistics & Probability', icon: '📊' },
    { key: 'Physics', icon: '⚛️' },
    { key: 'Chemistry', icon: '⚗️' },
    { key: 'Biology', icon: '🧬' },
    { key: 'History', icon: '🏛️' },
    { key: 'Sports & Entertainment', icon: '⚽' },
    { key: 'Literature', icon: '📚' },
    { key: 'Astronomy', icon: '🔭' },
    { key: 'Geography', icon: '🌍' },
    { key: 'Technology', icon: '💻' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;
    try {
      const helpers = await getUserHelpers(user.uid);
      setUserHelpers(helpers);
      setCoins(userProfile?.coins || 0);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockHelper = async () => {
    if (!selectedHelper) return;

    if (coins < selectedHelper.cost) {
      Alert.alert(
        'Not Enough Coins',
        `You need ${selectedHelper.cost} coins to unlock ${selectedHelper.name}. You have ${coins} coins.`
      );
      return;
    }

    Alert.alert(
      'Unlock Helper',
      `Unlock ${selectedHelper.name} for ${selectedHelper.cost} coins?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlock',
          onPress: async () => {
            setLoading(true);
            const success = await unlockHelper(user.uid, selectedHelper.id, selectedHelper.cost);
            if (success) {
              Alert.alert('Success!', `${selectedHelper.name} has been unlocked!`);
              await loadData();
            } else {
              Alert.alert('Error', 'Failed to unlock helper');
            }
            setLoading(false);
          }
        }
      ]
    );
  };

  const handleBuyEXP = async () => {
    if (!selectedHelper) {
      Alert.alert('Error', 'Please select a helper first');
      return;
    }

    const amount = parseInt(coinsToSpend);
    if (isNaN(amount) || amount < COINS_PER_EXP) {
      Alert.alert('Error', `Minimum ${COINS_PER_EXP} coins required`);
      return;
    }

    if (amount > coins) {
      Alert.alert('Not Enough Coins', `You only have ${coins} coins`);
      return;
    }

    const helperData = userHelpers[selectedHelper.id];
    if (helperData?.level >= MAX_HELPER_LEVEL) {
      Alert.alert('Max Level', 'This helper is already at max level!');
      return;
    }

    const expGained = Math.floor(amount / COINS_PER_EXP);
    Alert.alert(
      'Buy EXP',
      `Spend ${amount} coins to gain ${expGained} EXP for ${selectedHelper.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setLoading(true);
            const result = await buyHelperEXP(user.uid, selectedHelper.id, amount);
            if (result.success) {
              if (result.leveledUp) {
                Alert.alert(
                  'Level Up! 🎉',
                  `${selectedHelper.name} leveled up to Level ${result.newLevel}!`
                );
              } else {
                Alert.alert('Success', `Added ${result.expGained} EXP to ${selectedHelper.name}`);
              }
              setCoinsToSpend('');
              await loadData();
            } else {
              Alert.alert('Error', 'Failed to buy EXP');
            }
            setLoading(false);
          }
        }
      ]
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 80) return '#4aca4a';
    if (rating >= 60) return '#caca4a';
    if (rating >= 40) return '#ca8a4a';
    return '#ca4a4a';
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'FREE': return '#888';
      case 'COMMON': return '#4aca4a';
      case 'RARE': return '#4a9aca';
      case 'EPIC': return '#ca4aca';
      case 'LEGENDARY': return '#faca3a';
      default: return '#888';
    }
  };

  // Show ALL helpers (both locked and unlocked)
  const allHelpers = helpers;

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#faca3a" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>View Helpers</Text>
        <Text style={styles.coinsDisplay}>🪙 {coins}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Helper System</Text>
          <Text style={styles.infoText}>
            • Unlock helpers with coins{'\n'}
            • Spend coins to gain EXP ({COINS_PER_EXP} coins = 1 EXP){'\n'}
            • Level up to unlock better ratings{'\n'}
            • Earn EXP by playing quizzes with your helpers!
          </Text>
        </View>

        {/* Helper Selection */}
        <Text style={styles.sectionTitle}>All Helpers</Text>
        <View style={styles.helperGrid}>
          {allHelpers.map(helper => {
            const helperData = userHelpers[helper.id];
            const isUnlocked = helperData?.unlocked || false;
            const isSelected = selectedHelper?.id === helper.id;
            const level = helperData?.level || 1;
            const exp = helperData?.exp || 0;
            const expNeeded = getExpForNextLevel(level);
            const isMaxLevel = level >= MAX_HELPER_LEVEL;

            return (
              <TouchableOpacity
                key={helper.id}
                style={[
                  styles.helperCard,
                  isSelected && styles.helperCardSelected,
                  !isUnlocked && styles.helperCardLocked
                ]}
                onPress={() => setSelectedHelper(helper)}
              >
                <View style={[styles.tierBadge, { backgroundColor: getTierColor(helper.tier) }]}>
                  <Text style={styles.tierText}>{helper.tier}</Text>
                </View>

                {!isUnlocked && (
                  <View style={styles.lockOverlay}>
                    <Text style={styles.lockIcon}>🔒</Text>
                    <Text style={styles.unlockCost}>{helper.cost} 🪙</Text>
                  </View>
                )}

                <Text style={[styles.helperIcon, !isUnlocked && styles.lockedIcon]}>
                  {helper.icon}
                </Text>
                <Text style={styles.helperName}>{helper.name}</Text>

                {isUnlocked ? (
                  <>
                    <Text style={styles.helperLevel}>Level {level}</Text>
                    {!isMaxLevel ? (
                      <View style={styles.expBarContainer}>
                        <View style={styles.expBar}>
                          <View
                            style={[
                              styles.expBarFill,
                              { width: `${(exp / expNeeded) * 100}%` }
                            ]}
                          />
                        </View>
                        <Text style={styles.expText}>
                          {exp}/{expNeeded} EXP
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.maxLevelText}>MAX LEVEL</Text>
                    )}
                  </>
                ) : (
                  <Text style={styles.lockedText}>LOCKED</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Upgrade Section */}
        {selectedHelper && (
          <View style={styles.upgradeSection}>
            <Text style={styles.sectionTitle}>
              {userHelpers[selectedHelper.id]?.unlocked ? 'Upgrade' : 'Unlock'} {selectedHelper.name}
            </Text>

            {/* Unlock Button for Locked Helpers */}
            {!userHelpers[selectedHelper.id]?.unlocked && (
              <View style={styles.unlockSection}>
                <Text style={styles.unlockText}>
                  This helper is currently locked. Unlock to use in quizzes and start leveling up!
                </Text>
                <TouchableOpacity
                  style={styles.unlockButton}
                  onPress={handleUnlockHelper}
                  disabled={loading}
                >
                  <Text style={styles.unlockButtonText}>
                    🔓 Unlock for {selectedHelper.cost} 🪙
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Current Stats */}
            <View style={styles.statsBox}>
              <Text style={styles.statsTitle}>Current Ratings (Level {userHelpers[selectedHelper.id]?.level || 1})</Text>
              <ScrollView style={styles.ratingsList}>
                {subjects.map(subject => {
                  const currentLevel = userHelpers[selectedHelper.id]?.level || 1;
                  const currentRating = calculateHelperRating(selectedHelper, currentLevel, subject.key);
                  const maxRating = selectedHelper.ratings[subject.key]?.potential || currentRating;

                  return (
                    <View key={subject.key} style={styles.ratingRow}>
                      <Text style={styles.subjectIcon}>{subject.icon}</Text>
                      <Text style={styles.subjectName}>{subject.key}</Text>
                      <View style={styles.ratingBar}>
                        <View
                          style={[
                            styles.ratingFill,
                            {
                              width: `${currentRating}%`,
                              backgroundColor: getRatingColor(currentRating)
                            }
                          ]}
                        />
                      </View>
                      <Text style={[styles.ratingValue, { color: getRatingColor(currentRating) }]}>
                        {currentRating}
                        {currentLevel < MAX_HELPER_LEVEL && (
                          <Text style={styles.potentialRating}> → {maxRating}</Text>
                        )}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            {/* Buy EXP - Only show for unlocked helpers */}
            {userHelpers[selectedHelper.id]?.unlocked && userHelpers[selectedHelper.id]?.level < MAX_HELPER_LEVEL && (
              <View style={styles.buyBox}>
                <Text style={styles.buyTitle}>Buy EXP with Coins</Text>
                <Text style={styles.buySubtitle}>{COINS_PER_EXP} coins = 1 EXP</Text>

                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter coins to spend"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={coinsToSpend}
                    onChangeText={setCoinsToSpend}
                  />
                  <TouchableOpacity
                    style={styles.maxButton}
                    onPress={() => setCoinsToSpend(coins.toString())}
                  >
                    <Text style={styles.maxButtonText}>MAX</Text>
                  </TouchableOpacity>
                </View>

                {coinsToSpend && !isNaN(parseInt(coinsToSpend)) && parseInt(coinsToSpend) >= COINS_PER_EXP && (
                  <Text style={styles.expPreview}>
                    Will gain {Math.floor(parseInt(coinsToSpend) / COINS_PER_EXP)} EXP
                  </Text>
                )}

                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={handleBuyEXP}
                  disabled={loading}
                >
                  <Text style={styles.buyButtonText}>
                    {loading ? 'Processing...' : 'Buy EXP'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#faca3a',
    fontSize: 16,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#1a2a3a',
    borderBottomWidth: 2,
    borderBottomColor: '#faca3a',
  },
  backButton: {
    color: '#faca3a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    color: '#faca3a',
    fontSize: 24,
    fontWeight: 'bold',
  },
  coinsDisplay: {
    color: '#faca3a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoBox: {
    backgroundColor: 'rgba(74, 202, 74, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4aca4a',
  },
  infoTitle: {
    color: '#4aca4a',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 20,
  },
  sectionTitle: {
    color: '#faca3a',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  helperGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  helperCard: {
    width: '48%',
    backgroundColor: 'rgba(90, 106, 122, 0.5)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5a6a7a',
    position: 'relative',
  },
  helperCardSelected: {
    borderColor: '#faca3a',
    backgroundColor: 'rgba(250, 202, 58, 0.1)',
  },
  helperCardLocked: {
    opacity: 0.7,
  },
  lockOverlay: {
    position: 'absolute',
    top: 50,
    right: 10,
    alignItems: 'center',
    zIndex: 10,
  },
  lockIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  unlockCost: {
    color: '#faca3a',
    fontSize: 10,
    fontWeight: 'bold',
  },
  lockedIcon: {
    opacity: 0.3,
  },
  lockedText: {
    color: '#ca4a4a',
    fontSize: 11,
    fontWeight: 'bold',
  },
  tierBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  tierText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  helperIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  helperName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  helperLevel: {
    color: '#faca3a',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  expBarContainer: {
    width: '100%',
  },
  expBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  expBarFill: {
    height: '100%',
    backgroundColor: '#4aca4a',
  },
  expText: {
    color: '#ccc',
    fontSize: 10,
    textAlign: 'center',
  },
  maxLevelText: {
    color: '#faca3a',
    fontSize: 11,
    fontWeight: 'bold',
  },
  upgradeSection: {
    marginTop: 20,
  },
  unlockSection: {
    backgroundColor: 'rgba(250, 202, 58, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#faca3a',
  },
  unlockText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  unlockButton: {
    backgroundColor: '#faca3a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  unlockButtonText: {
    color: '#1a2a3a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsBox: {
    backgroundColor: 'rgba(90, 106, 122, 0.3)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  statsTitle: {
    color: '#faca3a',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ratingsList: {
    maxHeight: 300,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  subjectName: {
    color: '#fff',
    fontSize: 11,
    flex: 1,
  },
  ratingBar: {
    width: 60,
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 5,
    marginRight: 8,
    overflow: 'hidden',
  },
  ratingFill: {
    height: '100%',
    borderRadius: 5,
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: 'bold',
    width: 70,
    textAlign: 'right',
  },
  potentialRating: {
    fontSize: 9,
    color: '#9aaa9a',
    fontWeight: 'normal',
  },
  buyBox: {
    backgroundColor: 'rgba(250, 202, 58, 0.1)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#faca3a',
  },
  buyTitle: {
    color: '#faca3a',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buySubtitle: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#5a6a7a',
  },
  maxButton: {
    backgroundColor: '#4a9aca',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  maxButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  expPreview: {
    color: '#4aca4a',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  buyButton: {
    backgroundColor: '#4aca4a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HelperUpgradeScreen;
