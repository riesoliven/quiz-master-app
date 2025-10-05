import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore, COLLECTIONS } from '../services/firebase';
import { initializeUserStats } from '../services/userStatsService';
import { getHelperById } from '../data/helpers';

const AVATARS = ['🧑‍🎓', '👨‍💻', '👩‍🔬', '🧙‍♂️', '🦸‍♀️', '🤓', '🧑‍🚀', '👩‍🎨'];

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🧑‍🎓');
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!email || !password || !confirmPassword || !username) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters');
      return false;
    }

    if (username.length > 20) {
      Alert.alert('Error', 'Username must be less than 20 characters');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      // Create user account FIRST (so we have auth)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Create user profile in Firestore
      const userDocRef = doc(firestore, COLLECTIONS.USERS, userId);
      await setDoc(userDocRef, {
        username: username,
        email: email,
        avatar: selectedAvatar,
        createdAt: serverTimestamp(),
        level: 1,
        totalGamesPlayed: 0,
        coins: 500, // Starting coins
        gems: 0, // Starting gems
        energy: 25, // Starting energy (full)
        lastEnergyUpdate: serverTimestamp(),
        isAdmin: false,
        helpers: {
          // Start with 3 FREE helpers unlocked with base ratings
          'sir_sam': {
            unlocked: true,
            level: 1,
            exp: 0,
            ratings: {
              'Arithmetic & Algebra': getHelperById('sir_sam').ratings['Arithmetic & Algebra'].base,
              'Geometry & Trigonometry': getHelperById('sir_sam').ratings['Geometry & Trigonometry'].base,
              'Statistics & Probability': getHelperById('sir_sam').ratings['Statistics & Probability'].base,
              'Physics': getHelperById('sir_sam').ratings['Physics'].base,
              'Chemistry': getHelperById('sir_sam').ratings['Chemistry'].base,
              'Biology': getHelperById('sir_sam').ratings['Biology'].base,
              'History': getHelperById('sir_sam').ratings['History'].base,
              'Sports & Entertainment': getHelperById('sir_sam').ratings['Sports & Entertainment'].base,
              'Literature': getHelperById('sir_sam').ratings['Literature'].base,
              'Astronomy': getHelperById('sir_sam').ratings['Astronomy'].base,
              'Geography': getHelperById('sir_sam').ratings['Geography'].base,
              'Technology': getHelperById('sir_sam').ratings['Technology'].base
            }
          },
          'manny_pacquiao': {
            unlocked: true,
            level: 1,
            exp: 0,
            ratings: {
              'Arithmetic & Algebra': getHelperById('manny_pacquiao').ratings['Arithmetic & Algebra'].base,
              'Geometry & Trigonometry': getHelperById('manny_pacquiao').ratings['Geometry & Trigonometry'].base,
              'Statistics & Probability': getHelperById('manny_pacquiao').ratings['Statistics & Probability'].base,
              'Physics': getHelperById('manny_pacquiao').ratings['Physics'].base,
              'Chemistry': getHelperById('manny_pacquiao').ratings['Chemistry'].base,
              'Biology': getHelperById('manny_pacquiao').ratings['Biology'].base,
              'History': getHelperById('manny_pacquiao').ratings['History'].base,
              'Sports & Entertainment': getHelperById('manny_pacquiao').ratings['Sports & Entertainment'].base,
              'Literature': getHelperById('manny_pacquiao').ratings['Literature'].base,
              'Astronomy': getHelperById('manny_pacquiao').ratings['Astronomy'].base,
              'Geography': getHelperById('manny_pacquiao').ratings['Geography'].base,
              'Technology': getHelperById('manny_pacquiao').ratings['Technology'].base
            }
          },
          'annie_librarian': {
            unlocked: true,
            level: 1,
            exp: 0,
            ratings: {
              'Arithmetic & Algebra': getHelperById('annie_librarian').ratings['Arithmetic & Algebra'].base,
              'Geometry & Trigonometry': getHelperById('annie_librarian').ratings['Geometry & Trigonometry'].base,
              'Statistics & Probability': getHelperById('annie_librarian').ratings['Statistics & Probability'].base,
              'Physics': getHelperById('annie_librarian').ratings['Physics'].base,
              'Chemistry': getHelperById('annie_librarian').ratings['Chemistry'].base,
              'Biology': getHelperById('annie_librarian').ratings['Biology'].base,
              'History': getHelperById('annie_librarian').ratings['History'].base,
              'Sports & Entertainment': getHelperById('annie_librarian').ratings['Sports & Entertainment'].base,
              'Literature': getHelperById('annie_librarian').ratings['Literature'].base,
              'Astronomy': getHelperById('annie_librarian').ratings['Astronomy'].base,
              'Geography': getHelperById('annie_librarian').ratings['Geography'].base,
              'Technology': getHelperById('annie_librarian').ratings['Technology'].base
            }
          }
        }
      });

      // Create initial leaderboard entry
      const leaderboardDocRef = doc(firestore, COLLECTIONS.LEADERBOARD, userId);
      await setDoc(leaderboardDocRef, {
        userId: userId,
        username: username,
        avatar: selectedAvatar,
        highScore: 0,
        message: '',
        lastUpdated: serverTimestamp(),
      });

      // Initialize user stats
      await initializeUserStats(userId);

      Alert.alert('Success', 'Account created successfully!');
      // Navigation is handled by AuthContext
    } catch (error) {
      setLoading(false);
      let message = 'Signup failed';

      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address';
          break;
        case 'auth/weak-password':
          message = 'Password is too weak';
          break;
        default:
          message = error.message;
      }

      Alert.alert('Signup Failed', message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>🎮 Create Account</Text>
          <Text style={styles.subtitle}>Join Quiz Master</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Choose a username"
                placeholderTextColor="#6a7a8a"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                maxLength={20}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Choose Your Avatar</Text>
              <View style={styles.avatarGrid}>
                {AVATARS.map((avatar) => (
                  <TouchableOpacity
                    key={avatar}
                    style={[
                      styles.avatarOption,
                      selectedAvatar === avatar && styles.avatarSelected
                    ]}
                    onPress={() => setSelectedAvatar(avatar)}
                  >
                    <Text style={styles.avatarIcon}>{avatar}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                placeholderTextColor="#6a7a8a"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="At least 6 characters"
                placeholderTextColor="#6a7a8a"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter password"
                placeholderTextColor="#6a7a8a"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.signupButton, loading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.signupButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a4a5a',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    color: '#faca3a',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#9aaa9a',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    backgroundColor: 'rgba(90, 106, 122, 0.5)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#9aaa9a',
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: '#5a6a7a',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 16,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  avatarOption: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5a6a7a',
  },
  avatarSelected: {
    borderColor: '#faca3a',
    backgroundColor: 'rgba(250, 202, 58, 0.2)',
  },
  avatarIcon: {
    fontSize: 28,
  },
  signupButton: {
    backgroundColor: '#4a9a4a',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#5aca5a',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#9aaa9a',
    fontSize: 14,
  },
  loginLink: {
    color: '#faca3a',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
