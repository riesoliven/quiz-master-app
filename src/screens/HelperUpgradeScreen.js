import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Image
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { helpers, getHelperById } from '../data/helpers';
import {
  getUserHelpers,
  upgradeSubjectRating,
  addEXPToHelper,
  buyEXPWithCoins,
  getHelperRating,
  getRatingUpgradeCost,
  COINS_PER_EXP
} from '../services/helperService';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore, COLLECTIONS } from '../services/firebase';

const HelperUpgradeScreen = ({ navigation }) => {
  const { user, userProfile } = useAuth();
  const [userHelpers, setUserHelpers] = useState({});
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [expToBuy, setExpToBuy] = useState('');
  const [plannedUpgrades, setPlannedUpgrades] = useState({}); // { subject: upgradeCount }

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

  useEffect(() => {
    // Reset planned upgrades when switching helpers
    setPlannedUpgrades({});
  }, [selectedHelper]);

  const loadData = async () => {
    if (!user) return;
    try {
      const helpers = await getUserHelpers(user.uid);
      setUserHelpers(helpers);

      // Fetch fresh coins balance from Firestore
      const userDocRef = doc(firestore, COLLECTIONS.USERS, user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setCoins(userDocSnap.data().coins || 0);
      }

      // Auto-select first unlocked helper
      const unlockedHelpers = Object.keys(helpers).filter(id => helpers[id]?.unlocked);
      if (unlockedHelpers.length > 0 && !selectedHelper) {
        const firstHelper = getHelperById(unlockedHelpers[0]);
        setSelectedHelper(firstHelper);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyEXPForHelper = async () => {
    if (!selectedHelper) {
      Alert.alert('Error', 'Please select a helper first');
      return;
    }

    const expAmount = parseInt(expToBuy);
    if (isNaN(expAmount) || expAmount < 1) {
      Alert.alert('Error', 'Please enter a valid EXP amount (minimum 1)');
      return;
    }

    const coinsCost = expAmount * COINS_PER_EXP;
    if (coinsCost > coins) {
      Alert.alert('Not Enough Coins', `You need ${coinsCost} coins but only have ${coins} coins`);
      return;
    }

    Alert.alert(
      'Buy EXP',
      `Buy ${expAmount} EXP for ${coinsCost} coins for ${selectedHelper.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setLoading(true);
            try {
              // First, deduct coins from user's balance
              const purchaseResult = await buyEXPWithCoins(user.uid, coinsCost);
              if (purchaseResult.success) {
                // Then add EXP to the specific helper
                const success = await addEXPToHelper(user.uid, selectedHelper.id, expAmount);
                if (success) {
                  Alert.alert('Success! 🎉', `Bought ${expAmount} EXP for ${coinsCost} coins!\n\n${selectedHelper.name} now has more EXP to upgrade ratings.`);
                  setExpToBuy('');
                  await loadData();
                } else {
                  Alert.alert('Error', 'Failed to add EXP to helper');
                }
              } else {
                Alert.alert('Error', 'Failed to purchase EXP. Please try again.');
              }
            } catch (error) {
              console.error('Error buying EXP:', error);
              Alert.alert('Error', 'An error occurred. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleIncrementUpgrade = (subject) => {
    const helperData = userHelpers[selectedHelper.id];
    const helperDef = getHelperById(selectedHelper.id);
    const currentRating = getHelperRating(helperData, helperDef, subject);
    const plannedCount = plannedUpgrades[subject] || 0;
    const potentialCap = helperDef.ratings[subject].potential;

    // Check if can upgrade more
    if (currentRating + plannedCount >= potentialCap) {
      Alert.alert('Maxed', `${subject} is already at or will reach maximum potential!`);
      return;
    }

    setPlannedUpgrades(prev => ({
      ...prev,
      [subject]: (prev[subject] || 0) + 1
    }));
  };

  const handleDecrementUpgrade = (subject) => {
    const currentPlanned = plannedUpgrades[subject] || 0;
    if (currentPlanned > 0) {
      setPlannedUpgrades(prev => ({
        ...prev,
        [subject]: prev[subject] - 1
      }));
    }
  };

  const calculateTotalCost = () => {
    if (!selectedHelper) return 0;

    const helperData = userHelpers[selectedHelper.id];
    const helperDef = getHelperById(selectedHelper.id);
    let totalCost = 0;

    Object.keys(plannedUpgrades).forEach(subject => {
      const upgradeCount = plannedUpgrades[subject];
      if (upgradeCount > 0) {
        let currentRating = getHelperRating(helperData, helperDef, subject);

        // Calculate cost for each upgrade in sequence
        for (let i = 0; i < upgradeCount; i++) {
          totalCost += getRatingUpgradeCost(currentRating);
          currentRating++;
        }
      }
    });

    return totalCost;
  };

  const handlePurchaseUpgrades = async () => {
    if (!selectedHelper) return;

    const totalUpgrades = Object.values(plannedUpgrades).reduce((sum, count) => sum + count, 0);
    if (totalUpgrades === 0) {
      Alert.alert('No Upgrades', 'Use +/- buttons to plan your upgrades first!');
      return;
    }

    const helperData = userHelpers[selectedHelper.id];
    const currentExp = helperData?.exp || 0;
    const totalCost = calculateTotalCost();

    if (currentExp < totalCost) {
      Alert.alert(
        'Not Enough EXP',
        `You need ${totalCost} EXP but only have ${currentExp} EXP.\n\nBuy more EXP with coins above!`
      );
      return;
    }

    // Build summary
    const upgradesList = Object.keys(plannedUpgrades)
      .filter(subject => plannedUpgrades[subject] > 0)
      .map(subject => `• ${subject}: +${plannedUpgrades[subject]}`)
      .join('\n');

    Alert.alert(
      'Confirm Purchase',
      `Apply these upgrades?\n\n${upgradesList}\n\nTotal Cost: ${totalCost} EXP\nRemaining: ${currentExp - totalCost} EXP\n\n⚠️ Cannot be undone!`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase',
          onPress: async () => {
            setLoading(true);
            try {
              const helperDef = getHelperById(selectedHelper.id);
              const newRatings = { ...helperData.ratings };
              let expSpent = 0;

              // Apply all upgrades
              Object.keys(plannedUpgrades).forEach(subject => {
                const upgradeCount = plannedUpgrades[subject];
                if (upgradeCount > 0) {
                  let currentRating = getHelperRating(helperData, helperDef, subject);

                  for (let i = 0; i < upgradeCount; i++) {
                    expSpent += getRatingUpgradeCost(currentRating);
                    currentRating++;
                  }

                  newRatings[subject] = currentRating;
                }
              });

              // Update Firebase
              const userDocRef = doc(firestore, COLLECTIONS.USERS, user.uid);
              await updateDoc(userDocRef, {
                [`helpers.${selectedHelper.id}.ratings`]: newRatings,
                [`helpers.${selectedHelper.id}.exp`]: currentExp - expSpent
              });

              Alert.alert('Success! 🎉', `Upgrades applied!\n\nEXP Spent: ${expSpent}\nEXP Remaining: ${currentExp - expSpent}`);
              setPlannedUpgrades({});
              await loadData();
            } catch (error) {
              console.error('Error applying upgrades:', error);
              Alert.alert('Error', 'Failed to apply upgrades');
            }
            setLoading(false);
          }
        }
      ]
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 85) return '#4aca4a';
    if (rating >= 70) return '#caca4a';
    if (rating >= 50) return '#ca8a4a';
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

  // Filter to show only UNLOCKED helpers
  const unlockedHelpers = helpers.filter(h => userHelpers[h.id]?.unlocked);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#faca3a" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (unlockedHelpers.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>View Helpers</Text>
          <Text style={styles.coinsDisplay}>🪙 {coins}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔒</Text>
          <Text style={styles.emptyTitle}>No Helpers Unlocked</Text>
          <Text style={styles.emptyText}>
            Visit the Shop to unlock your first helpers!
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Shop')}
          >
            <Text style={styles.shopButtonText}>Go to Shop</Text>
          </TouchableOpacity>
        </View>
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
          <Text style={styles.infoTitle}>💡 NBA 2K-Style Upgrade System</Text>
          <Text style={styles.infoText}>
            • Use +/- to plan upgrades across subjects{'\n'}
            • Click "Purchase All" to apply changes{'\n'}
            • ⚠️ Cannot refund EXP after purchase{'\n'}
            • Buy EXP with coins (10 coins = 1 EXP)
          </Text>
        </View>

        {/* Helper Selection */}
        <Text style={styles.sectionTitle}>Select Helper</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.helperScroll}>
          {unlockedHelpers.map(helper => {
            const helperData = userHelpers[helper.id];
            const isSelected = selectedHelper?.id === helper.id;

            return (
              <TouchableOpacity
                key={helper.id}
                style={[
                  styles.helperCard,
                  isSelected && styles.helperCardSelected
                ]}
                onPress={() => setSelectedHelper(helper)}
              >
                <View style={[styles.tierBadge, { backgroundColor: getTierColor(helper.tier) }]}>
                  <Text style={styles.tierText}>{helper.tier}</Text>
                </View>

                <Image source={helper.image} style={styles.helperImage} />
                <Text style={styles.helperName}>{helper.name}</Text>
                <Text style={styles.helperEXP}>{helperData?.exp || 0} EXP</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Upgrade Section */}
        {selectedHelper && (
          <View style={styles.upgradeSection}>
            <View style={styles.selectedHelperHeader}>
              <Image source={selectedHelper.image} style={styles.selectedHelperImage} />
              <Text style={styles.selectedHelperTitle}>{selectedHelper.name}</Text>
            </View>

            {/* Buy EXP Section */}
            <View style={styles.buyEXPSection}>
              <Text style={styles.sectionTitle}>Buy EXP with Coins</Text>
              <Text style={styles.buyEXPInfo}>
                Current EXP: {userHelpers[selectedHelper.id]?.exp || 0} ⚡
              </Text>
              <View style={styles.buyEXPRow}>
                <TextInput
                  style={styles.coinsInput}
                  placeholder="EXP to buy"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  value={expToBuy}
                  onChangeText={setExpToBuy}
                />
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={handleBuyEXPForHelper}
                  disabled={loading}
                >
                  <Text style={styles.buyButtonText}>Buy EXP</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.conversionText}>
                {expToBuy ? `Costs: ${parseInt(expToBuy) * COINS_PER_EXP} coins` : '1 EXP = 10 coins'}
              </Text>
            </View>

            {/* Subject Ratings - NBA 2K Style with +/- */}
            <Text style={styles.sectionTitle}>Plan Rating Upgrades</Text>
            {subjects.map(({ key, icon }) => {
              const helperDef = getHelperById(selectedHelper.id);
              const helperData = userHelpers[selectedHelper.id];
              const currentRating = getHelperRating(helperData, helperDef, key);
              const potentialCap = helperDef.ratings[key].potential;
              const plannedCount = plannedUpgrades[key] || 0;
              const newRating = currentRating + plannedCount;
              const isMaxed = newRating >= potentialCap;

              return (
                <View key={key} style={styles.ratingRow}>
                  <View style={styles.ratingInfo}>
                    <Text style={styles.subjectIcon}>{icon}</Text>
                    <View style={styles.subjectTextContainer}>
                      <Text style={styles.subjectName}>{key}</Text>
                      <Text style={styles.ratingText}>
                        <Text style={{ color: getRatingColor(currentRating), fontWeight: 'bold' }}>
                          {currentRating}
                        </Text>
                        {plannedCount > 0 && (
                          <Text style={{ color: '#faca3a', fontWeight: 'bold' }}>
                            {' '}→ {newRating}
                          </Text>
                        )}
                        <Text style={{ color: '#666' }}> / {potentialCap}</Text>
                      </Text>
                    </View>
                  </View>

                  {!isMaxed ? (
                    <View style={styles.upgradeControls}>
                      <TouchableOpacity
                        style={[styles.controlButton, plannedCount === 0 && styles.controlButtonDisabled]}
                        onPress={() => handleDecrementUpgrade(key)}
                        disabled={plannedCount === 0}
                      >
                        <Text style={styles.controlButtonText}>−</Text>
                      </TouchableOpacity>

                      <View style={styles.upgradeCount}>
                        <Text style={styles.upgradeCountText}>
                          {plannedCount > 0 ? `+${plannedCount}` : '0'}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.controlButton}
                        onPress={() => handleIncrementUpgrade(key)}
                      >
                        <Text style={styles.controlButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.maxedBadge}>
                      <Text style={styles.maxedText}>MAX</Text>
                    </View>
                  )}
                </View>
              );
            })}

            {/* Purchase Button */}
            <View style={styles.purchaseSection}>
              <View style={styles.costSummary}>
                <Text style={styles.costLabel}>Total Cost:</Text>
                <Text style={styles.costValue}>{calculateTotalCost()} EXP</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.purchaseButton,
                  calculateTotalCost() === 0 && styles.purchaseButtonDisabled
                ]}
                onPress={handlePurchaseUpgrades}
                disabled={loading || calculateTotalCost() === 0}
              >
                <Text style={styles.purchaseButtonText}>Purchase All Upgrades</Text>
              </TouchableOpacity>
            </View>

            {/* Cost Info */}
            <View style={styles.costInfoBox}>
              <Text style={styles.costInfoTitle}>Upgrade Costs (EXP per +1)</Text>
              <Text style={styles.costInfoText}>
                25-49: 5 EXP{'\n'}
                50-69: 10 EXP{'\n'}
                70-84: 20 EXP{'\n'}
                85-94: 50 EXP{'\n'}
                95-99: 100 EXP
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#faca3a',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  shopButtonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#16213e',
    borderBottomWidth: 2,
    borderBottomColor: '#faca3a',
  },
  backButton: {
    color: '#faca3a',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  coinsDisplay: {
    fontSize: 16,
    color: '#faca3a',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  infoBox: {
    backgroundColor: '#16213e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#faca3a',
  },
  infoTitle: {
    color: '#faca3a',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    color: '#aaa',
    fontSize: 12,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 10,
  },
  helperScroll: {
    marginBottom: 15,
  },
  helperCard: {
    width: 100,
    height: 130,
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  helperCardSelected: {
    borderColor: '#faca3a',
    backgroundColor: '#1f2b4e',
  },
  tierBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tierText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  helperImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
    alignSelf: 'center',
  },
  helperName: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  helperEXP: {
    color: '#faca3a',
    fontSize: 10,
    marginTop: 2,
  },
  upgradeSection: {
    marginTop: 10,
  },
  selectedHelperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 10,
  },
  selectedHelperImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedHelperTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  buyEXPSection: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  buyEXPInfo: {
    color: '#faca3a',
    fontSize: 14,
    marginBottom: 10,
  },
  buyEXPRow: {
    flexDirection: 'row',
    gap: 10,
  },
  coinsInput: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  buyButton: {
    backgroundColor: '#4aca4a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  conversionText: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subjectIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  subjectTextContainer: {
    flex: 1,
  },
  subjectName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ratingText: {
    fontSize: 12,
    marginTop: 2,
  },
  upgradeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    backgroundColor: '#faca3a',
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.5,
  },
  controlButtonText: {
    color: '#1a1a2e',
    fontSize: 20,
    fontWeight: 'bold',
  },
  upgradeCount: {
    minWidth: 40,
    alignItems: 'center',
  },
  upgradeCountText: {
    color: '#faca3a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  maxedBadge: {
    backgroundColor: '#4aca4a',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  maxedText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  purchaseSection: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#faca3a',
  },
  costSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  costLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  costValue: {
    color: '#faca3a',
    fontSize: 20,
    fontWeight: 'bold',
  },
  purchaseButton: {
    backgroundColor: '#4aca4a',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  purchaseButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.5,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  costInfoBox: {
    backgroundColor: '#16213e',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  costInfoTitle: {
    color: '#faca3a',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  costInfoText: {
    color: '#aaa',
    fontSize: 12,
    lineHeight: 20,
  },
});

export default HelperUpgradeScreen;
