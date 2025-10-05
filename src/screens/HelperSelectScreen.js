import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  FlatList,
  BackHandler,
  ActivityIndicator,
  Image
} from 'react-native';
import { helpers, getHelperById } from '../data/helpers';
import { useAuth } from '../context/AuthContext';
import { getUserHelpers, unlockHelper, getHelperRating, HELPER_COSTS } from '../services/helperService';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_SPACING = (width - CARD_WIDTH) / 2;

const HelperSelectScreen = ({ navigation }) => {
  const { user, userProfile } = useAuth();
  const [selectedHelpers, setSelectedHelpers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userHelpers, setUserHelpers] = useState({});
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadUserHelpers();
  }, []);

  const loadUserHelpers = async () => {
    if (!user) return;
    try {
      const helpers = await getUserHelpers(user.uid);
      setUserHelpers(helpers);
      setCoins(userProfile?.coins || 0);
    } catch (error) {
      console.error('Error loading helpers:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const isHelperUnlocked = (helperId) => {
    return userHelpers[helperId]?.unlocked || false;
  };

  const getHelperLevel = (helperId) => {
    return userHelpers[helperId]?.level || 1;
  };

  const isHelperSelected = (helper) => {
    return selectedHelpers.find(h => h.id === helper.id);
  };

  const handleUnlockHelper = async (helper) => {
    if (coins < helper.cost) {
      Alert.alert('Not Enough Coins', `You need ${helper.cost} coins to unlock ${helper.name}. You have ${coins} coins.`);
      return;
    }

    Alert.alert(
      'Unlock Helper',
      `Unlock ${helper.name} for ${helper.cost} coins?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlock',
          onPress: async () => {
            const success = await unlockHelper(user.uid, helper.id, helper.cost);
            if (success) {
              Alert.alert('Success!', `${helper.name} has been unlocked!`);
              await loadUserHelpers();
            } else {
              Alert.alert('Error', 'Failed to unlock helper');
            }
          }
        }
      ]
    );
  };

  const toggleHelper = (helper) => {
    if (!isHelperUnlocked(helper.id)) {
      handleUnlockHelper(helper);
      return;
    }

    if (isHelperSelected(helper)) {
      setSelectedHelpers(selectedHelpers.filter(h => h.id !== helper.id));
    } else {
      if (selectedHelpers.length < 3) {
        setSelectedHelpers([...selectedHelpers, helper]);
      } else {
        Alert.alert('Team Full', 'You can only select 3 helpers! Remove one first.');
      }
    }
  };

  const startQuiz = () => {
    if (selectedHelpers.length !== 3) {
      Alert.alert('Select 3 Helpers', 'Please select exactly 3 helpers for your team');
      return;
    }
    navigation.navigate('QuizGame', { helpers: selectedHelpers });
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

  const renderHelper = ({ item: helper, index }) => {
    const selected = isHelperSelected(helper);
    const unlocked = isHelperUnlocked(helper.id);
    const level = getHelperLevel(helper.id);

    return (
      <View style={styles.cardContainer}>
        <View style={[
          styles.card,
          selected && styles.cardSelected,
          !unlocked && styles.cardLocked
        ]}>
          {/* Tier Badge */}
          <View style={[styles.tierBadge, { backgroundColor: getTierColor(helper.tier) }]}>
            <Text style={styles.tierText}>{helper.tier}</Text>
          </View>

          {/* Helper Icon/Avatar */}
          <View style={styles.helperIconContainer}>
            <Image source={helper.image} style={[styles.helperImage, !unlocked && styles.lockedImage]} />
            {selected && unlocked && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>✓</Text>
              </View>
            )}
            {!unlocked && (
              <View style={styles.lockBadge}>
                <Text style={styles.lockIcon}>🔒</Text>
              </View>
            )}
          </View>

          {/* Helper Name */}
          <Text style={styles.helperName}>{helper.name}</Text>
          {unlocked && <Text style={styles.helperLevel}>Level {level}</Text>}
          <Text style={styles.helperDescription}>{helper.description}</Text>

          {/* Add/Remove/Unlock Button */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              selected && styles.removeButton,
              !unlocked && styles.unlockButton
            ]}
            onPress={() => toggleHelper(helper)}
          >
            <Text style={styles.actionButtonText}>
              {!unlocked ? `🔓 Unlock (${helper.cost} 🪙)` :
               selected ? '✕ Remove from Team' : '+ Add to Team'}
            </Text>
          </TouchableOpacity>

          {/* Subject Ratings */}
          <View style={styles.ratingsContainer}>
            <Text style={styles.ratingsHeader}>Subject Expertise</Text>
            <ScrollView style={styles.ratingsList} showsVerticalScrollIndicator={false}>
              {subjects.map(subject => {
                const helperDef = getHelperById(helper.id);
                const userHelper = userHelpers[helper.id];
                const currentRating = unlocked
                  ? getHelperRating(userHelper, helperDef, subject.key)
                  : helperDef.ratings[subject.key]?.base || 0;
                const potentialRating = helperDef.ratings[subject.key]?.potential || currentRating;

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
                            backgroundColor: getRatingColor(currentRating),
                            opacity: unlocked ? 1 : 0.5
                          }
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.ratingValue,
                        { color: getRatingColor(currentRating) }
                      ]}
                    >
                      {currentRating}
                      {unlocked && currentRating < potentialRating && (
                        <Text style={styles.potentialRating}>→{potentialRating}</Text>
                      )}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50
  };

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#faca3a" />
        <Text style={styles.loadingText}>Loading helpers...</Text>
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
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Choose Your Team</Text>
          <Text style={styles.coinsDisplay}>🪙 {coins}</Text>
        </View>
      </View>

      {/* Selected Team Slots */}
      <View style={styles.slotsContainer}>
        <Text style={styles.slotsTitle}>Your Team ({selectedHelpers.length}/3)</Text>
        <View style={styles.slots}>
          {[0, 1, 2].map(index => (
            <View key={index} style={[styles.slot, selectedHelpers[index] && styles.slotFilled]}>
              {selectedHelpers[index] ? (
                <>
                  <Image source={selectedHelpers[index].image} style={styles.slotImage} />
                  <Text style={styles.slotName}>{selectedHelpers[index].name}</Text>
                </>
              ) : (
                <Text style={styles.slotEmpty}>Empty</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Swipeable Helper Cards */}
      <View style={styles.carouselContainer}>
        <Text style={styles.swipeHint}>← Swipe to browse helpers →</Text>
        <FlatList
          ref={flatListRef}
          data={helpers}
          renderItem={renderHelper}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: CARD_SPACING
          }}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(data, index) => ({
            length: CARD_WIDTH,
            offset: CARD_WIDTH * index,
            index
          })}
        />

        {/* Carousel Indicators */}
        <View style={styles.indicators}>
          {helpers.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentIndex === index && styles.indicatorActive
              ]}
            />
          ))}
        </View>
      </View>

      {/* Start Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, selectedHelpers.length !== 3 && styles.startButtonDisabled]}
          onPress={startQuiz}
          disabled={selectedHelpers.length !== 3}
        >
          <Text style={styles.startButtonText}>
            {selectedHelpers.length === 3 ? '🎮 Start Quiz' : `Select ${3 - selectedHelpers.length} more helper${3 - selectedHelpers.length === 1 ? '' : 's'}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a4a5a',
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
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    color: '#faca3a',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 15,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  coinsDisplay: {
    color: '#faca3a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  slotsContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  slotsTitle: {
    color: '#9aaa9a',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  slots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  slot: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5a6a7a',
    minHeight: 70,
    justifyContent: 'center',
  },
  slotFilled: {
    borderColor: '#4aca4a',
    backgroundColor: 'rgba(74, 202, 74, 0.2)',
  },
  slotImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 4,
  },
  slotName: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  slotEmpty: {
    color: '#6a7a8a',
    fontSize: 12,
  },
  carouselContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  swipeHint: {
    color: '#9aaa9a',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  cardContainer: {
    width: CARD_WIDTH,
    padding: 10,
  },
  card: {
    backgroundColor: 'rgba(90, 106, 122, 0.7)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#6a7a8a',
    height: '100%',
    position: 'relative',
  },
  cardSelected: {
    borderColor: '#4aca4a',
    backgroundColor: 'rgba(74, 202, 74, 0.15)',
  },
  cardLocked: {
    opacity: 0.7,
  },
  tierBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  tierText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  helperIconContainer: {
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  helperImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  lockedImage: {
    opacity: 0.3,
  },
  selectedBadge: {
    position: 'absolute',
    top: 0,
    right: '30%',
    backgroundColor: '#4aca4a',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  selectedBadgeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  lockBadge: {
    position: 'absolute',
    top: 10,
    right: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 28,
  },
  helperName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  helperLevel: {
    color: '#faca3a',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  helperDescription: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  actionButton: {
    backgroundColor: '#4a9a4a',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#5aca5a',
  },
  removeButton: {
    backgroundColor: '#ca4a4a',
    borderColor: '#da5a5a',
  },
  unlockButton: {
    backgroundColor: '#faca3a',
    borderColor: '#fada4a',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingsContainer: {
    flex: 1,
  },
  ratingsHeader: {
    color: '#faca3a',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingsList: {
    maxHeight: 240,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  subjectName: {
    color: 'white',
    fontSize: 10,
    flex: 1,
  },
  ratingBar: {
    width: 50,
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 5,
    marginRight: 6,
    overflow: 'hidden',
  },
  ratingFill: {
    height: '100%',
    borderRadius: 6,
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: 'bold',
    width: 50,
    textAlign: 'right',
  },
  potentialRating: {
    fontSize: 9,
    color: '#9aaa9a',
    fontWeight: 'normal',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5a6a7a',
  },
  indicatorActive: {
    backgroundColor: '#faca3a',
    width: 24,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
  },
  startButton: {
    backgroundColor: '#4a9a4a',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5aca5a',
  },
  startButtonDisabled: {
    backgroundColor: '#5a6a7a',
    borderColor: '#6a7a8a',
    opacity: 0.5,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HelperSelectScreen;
