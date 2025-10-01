import React, { useState } from 'react';
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

const { width, height } = Dimensions.get('window');

const MainMenuScreen = ({ navigation }) => {
  // ALL state hooks MUST be inside the component
  const [secretTaps, setSecretTaps] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
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
      { name: 'Mathematics', accuracy: 85, icon: '🔢' },
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

  const handlePasswordSubmit = () => {
    if (verifyAdminPassword(passwordInput)) {
      setShowPasswordModal(false);
      setPasswordInput('');
      navigation.navigate('QuestionManager');
    } else {
      Alert.alert('Access Denied', 'Incorrect password');
      setPasswordInput('');
    }
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
                    <Text style={styles.avatar}>{userData.avatar}</Text>
                    <View style={styles.levelIndicator}>
                      <Text style={styles.levelText}>{userData.level}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                
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
});

export default MainMenuScreen;