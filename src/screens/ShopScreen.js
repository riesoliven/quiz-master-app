import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { helpers } from '../data/helpers';
import { getUserHelpers, unlockHelper } from '../services/helperService';

const ShopScreen = ({ navigation }) => {
  const { user, userProfile } = useAuth();
  const [userHelpers, setUserHelpers] = useState({});
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const handleUnlockHelper = async (helper) => {
    if (coins < helper.cost) {
      Alert.alert(
        'Not Enough Coins',
        `You need ${helper.cost} coins to unlock ${helper.name}. You have ${coins} coins.`
      );
      return;
    }

    Alert.alert(
      'Unlock Helper',
      `Unlock ${helper.name} for ${helper.cost} coins?\n\n${helper.description}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlock',
          onPress: async () => {
            setLoading(true);
            const success = await unlockHelper(user.uid, helper.id, helper.cost);
            if (success) {
              Alert.alert('Success!', `${helper.name} has been unlocked! You can now upgrade their ratings in View Helpers.`);
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

  const getTierHelpers = (tier) => {
    return helpers.filter(h => h.tier === tier);
  };

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
        <Text style={styles.title}>Helper Shop</Text>
        <Text style={styles.coinsDisplay}>🪙 {coins}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>🛒 Helper Shop</Text>
          <Text style={styles.infoText}>
            • Buy helpers with coins{'\n'}
            • Higher tier helpers have better potential ratings{'\n'}
            • Upgrade ratings in "View Helpers" after unlocking{'\n'}
            • FREE helpers are already unlocked!
          </Text>
        </View>

        {/* FREE Tier */}
        <View style={styles.tierSection}>
          <View style={styles.tierHeader}>
            <View style={[styles.tierBadge, { backgroundColor: getTierColor('FREE') }]}>
              <Text style={styles.tierBadgeText}>FREE</Text>
            </View>
            <Text style={styles.tierTitle}>Already Unlocked</Text>
          </View>
          <View style={styles.helperGrid}>
            {getTierHelpers('FREE').map(helper => (
              <View key={helper.id} style={styles.helperCard}>
                <View style={styles.unlockedBadge}>
                  <Text style={styles.unlockedText}>✓ UNLOCKED</Text>
                </View>
                <Image source={helper.image} style={styles.helperImage} />
                <Text style={styles.helperName}>{helper.name}</Text>
                <Text style={styles.helperDesc}>{helper.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* COMMON Tier */}
        <View style={styles.tierSection}>
          <View style={styles.tierHeader}>
            <View style={[styles.tierBadge, { backgroundColor: getTierColor('COMMON') }]}>
              <Text style={styles.tierBadgeText}>COMMON</Text>
            </View>
            <Text style={styles.tierTitle}>1,000 Coins Each</Text>
          </View>
          <View style={styles.helperGrid}>
            {getTierHelpers('COMMON').map(helper => {
              const isUnlocked = userHelpers[helper.id]?.unlocked || false;
              return (
                <View key={helper.id} style={[styles.helperCard, !isUnlocked && styles.lockedCard]}>
                  {isUnlocked && (
                    <View style={styles.unlockedBadge}>
                      <Text style={styles.unlockedText}>✓ OWNED</Text>
                    </View>
                  )}
                  <Image source={helper.image} style={[styles.helperImage, !isUnlocked && styles.lockedImage]} />
                  <Text style={styles.helperName}>{helper.name}</Text>
                  <Text style={styles.helperDesc}>{helper.description}</Text>
                  {!isUnlocked && (
                    <TouchableOpacity
                      style={styles.buyButton}
                      onPress={() => handleUnlockHelper(helper)}
                    >
                      <Text style={styles.buyButtonText}>🪙 {helper.cost}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* RARE Tier */}
        <View style={styles.tierSection}>
          <View style={styles.tierHeader}>
            <View style={[styles.tierBadge, { backgroundColor: getTierColor('RARE') }]}>
              <Text style={styles.tierBadgeText}>RARE</Text>
            </View>
            <Text style={styles.tierTitle}>5,000 Coins Each</Text>
          </View>
          <View style={styles.helperGrid}>
            {getTierHelpers('RARE').map(helper => {
              const isUnlocked = userHelpers[helper.id]?.unlocked || false;
              return (
                <View key={helper.id} style={[styles.helperCard, !isUnlocked && styles.lockedCard]}>
                  {isUnlocked && (
                    <View style={styles.unlockedBadge}>
                      <Text style={styles.unlockedText}>✓ OWNED</Text>
                    </View>
                  )}
                  <Image source={helper.image} style={[styles.helperImage, !isUnlocked && styles.lockedImage]} />
                  <Text style={styles.helperName}>{helper.name}</Text>
                  <Text style={styles.helperDesc}>{helper.description}</Text>
                  {!isUnlocked && (
                    <TouchableOpacity
                      style={styles.buyButton}
                      onPress={() => handleUnlockHelper(helper)}
                    >
                      <Text style={styles.buyButtonText}>🪙 {helper.cost}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* EPIC Tier */}
        <View style={styles.tierSection}>
          <View style={styles.tierHeader}>
            <View style={[styles.tierBadge, { backgroundColor: getTierColor('EPIC') }]}>
              <Text style={styles.tierBadgeText}>EPIC</Text>
            </View>
            <Text style={styles.tierTitle}>15,000 Coins Each</Text>
          </View>
          <View style={styles.helperGrid}>
            {getTierHelpers('EPIC').map(helper => {
              const isUnlocked = userHelpers[helper.id]?.unlocked || false;
              return (
                <View key={helper.id} style={[styles.helperCard, !isUnlocked && styles.lockedCard]}>
                  {isUnlocked && (
                    <View style={styles.unlockedBadge}>
                      <Text style={styles.unlockedText}>✓ OWNED</Text>
                    </View>
                  )}
                  <Image source={helper.image} style={[styles.helperImage, !isUnlocked && styles.lockedImage]} />
                  <Text style={styles.helperName}>{helper.name}</Text>
                  <Text style={styles.helperDesc}>{helper.description}</Text>
                  {!isUnlocked && (
                    <TouchableOpacity
                      style={styles.buyButton}
                      onPress={() => handleUnlockHelper(helper)}
                    >
                      <Text style={styles.buyButtonText}>🪙 {helper.cost}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* LEGENDARY Tier */}
        <View style={styles.tierSection}>
          <View style={styles.tierHeader}>
            <View style={[styles.tierBadge, { backgroundColor: getTierColor('LEGENDARY') }]}>
              <Text style={styles.tierBadgeText}>LEGENDARY</Text>
            </View>
            <Text style={styles.tierTitle}>50,000 Coins Each</Text>
          </View>
          <View style={styles.helperGrid}>
            {getTierHelpers('LEGENDARY').map(helper => {
              const isUnlocked = userHelpers[helper.id]?.unlocked || false;
              return (
                <View key={helper.id} style={[styles.helperCard, !isUnlocked && styles.lockedCard]}>
                  {isUnlocked && (
                    <View style={styles.unlockedBadge}>
                      <Text style={styles.unlockedText}>✓ OWNED</Text>
                    </View>
                  )}
                  <Image source={helper.image} style={[styles.helperImage, !isUnlocked && styles.lockedImage]} />
                  <Text style={styles.helperName}>{helper.name}</Text>
                  <Text style={styles.helperDesc}>{helper.description}</Text>
                  {!isUnlocked && (
                    <TouchableOpacity
                      style={styles.buyButton}
                      onPress={() => handleUnlockHelper(helper)}
                    >
                      <Text style={styles.buyButtonText}>🪙 {helper.cost}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>
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
    marginBottom: 20,
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
  tierSection: {
    marginBottom: 25,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 10,
  },
  tierBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tierTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helperGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  helperCard: {
    width: '48%',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#333',
    position: 'relative',
  },
  lockedCard: {
    opacity: 0.7,
  },
  unlockedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4aca4a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  unlockedText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  helperImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginVertical: 10,
  },
  lockedImage: {
    opacity: 0.3,
  },
  helperName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  helperDesc: {
    color: '#aaa',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 10,
    minHeight: 32,
  },
  buyButton: {
    backgroundColor: '#faca3a',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#1a1a2e',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ShopScreen;
