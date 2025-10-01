import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { helpers } from '../data/questions';

const HelperSelectScreen = ({ navigation }) => {
  const [selectedHelpers, setSelectedHelpers] = useState([]);

  const toggleHelper = (helper) => {
    if (selectedHelpers.find(h => h.id === helper.id)) {
      setSelectedHelpers(selectedHelpers.filter(h => h.id !== helper.id));
    } else {
      if (selectedHelpers.length < 3) {
        setSelectedHelpers([...selectedHelpers, helper]);
      } else {
        Alert.alert('Team Full', 'You can only select 3 helpers!');
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Helper Team</Text>
      <Text style={styles.subtitle}>Select 3 helpers - You can use ONE during the quiz</Text>
      
      <View style={styles.slotsContainer}>
        {[0, 1, 2].map(index => (
          <View key={index} style={[styles.slot, selectedHelpers[index] && styles.slotFilled]}>
            {selectedHelpers[index] ? (
              <>
                <Text style={styles.slotIcon}>{selectedHelpers[index].icon}</Text>
                <Text style={styles.slotName}>{selectedHelpers[index].name}</Text>
              </>
            ) : (
              <Text style={styles.slotEmpty}>Empty</Text>
            )}
          </View>
        ))}
      </View>

      <ScrollView style={styles.helpersList}>
        {helpers.map(helper => {
          const isSelected = selectedHelpers.find(h => h.id === helper.id);
          return (
            <TouchableOpacity
              key={helper.id}
              style={[styles.helperCard, isSelected && styles.helperCardSelected]}
              onPress={() => toggleHelper(helper)}
            >
              <View style={styles.helperInfo}>
                <Text style={styles.helperIcon}>{helper.icon}</Text>
                <View style={styles.helperDetails}>
                  <Text style={styles.helperName}>{helper.name}</Text>
                  <View style={styles.helperSkills}>
                    <Text style={styles.skill}>⚛️ {helper.physics}%</Text>
                    <Text style={styles.skill}>📐 {helper.math}%</Text>
                    <Text style={styles.skill}>⚗️ {helper.chemistry}%</Text>
                    <Text style={styles.skill}>🧬 {helper.biology}%</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity 
        style={[styles.startButton, selectedHelpers.length !== 3 && styles.startButtonDisabled]}
        onPress={startQuiz}
      >
        <Text style={styles.startButtonText}>
          {selectedHelpers.length === 3 ? 'START QUIZ' : `SELECT ${3 - selectedHelpers.length} MORE`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a4a5a',
    padding: 20,
  },
  title: {
    color: '#faca3a',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#9aaa9a',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  slotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  slot: {
    width: 80,
    height: 80,
    backgroundColor: '#4a5a6a',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6a7a8a',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotFilled: {
    borderColor: '#4a9a4a',
    borderStyle: 'solid',
    backgroundColor: '#4a5a4a',
  },
  slotIcon: {
    fontSize: 30,
  },
  slotName: {
    color: '#9aaa9a',
    fontSize: 10,
    marginTop: 5,
  },
  slotEmpty: {
    color: '#6a7a8a',
    fontSize: 12,
  },
  helpersList: {
    flex: 1,
  },
  helperCard: {
    backgroundColor: '#5a6a7a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#6a7a8a',
  },
  helperCardSelected: {
    borderColor: '#4a9a4a',
    backgroundColor: '#4a6a5a',
  },
  helperInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helperIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  helperDetails: {
    flex: 1,
  },
  helperName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  helperSkills: {
    flexDirection: 'row',
    gap: 10,
  },
  skill: {
    color: '#9aaa9a',
    fontSize: 12,
  },
  startButton: {
    backgroundColor: '#4a9a4a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  startButtonDisabled: {
    backgroundColor: '#5a5a5a',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HelperSelectScreen;