// Daily Subject of the Day system
// Uses UTC date to ensure consistency globally

const subjects = [
  'Arithmetic & Algebra',
  'Geometry & Trigonometry',
  'Statistics & Probability',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Sports & Entertainment',
  'Literature',
  'Astronomy'
];
const subjectIcons = {
  'Arithmetic & Algebra': '📐',
  'Geometry & Trigonometry': '📏',
  'Statistics & Probability': '📊',
  'Physics': '⚛️',
  'Chemistry': '⚗️',
  'Biology': '🧬',
  'History': '🏛️',
  'Sports & Entertainment': '⚽',
  'Literature': '📚',
  'Astronomy': '🔭'
};

// Get current UTC date as a string (YYYY-MM-DD)
const getUTCDateString = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Simple hash function to convert date string to a number
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Get today's featured subject
export const getSubjectOfTheDay = () => {
  const dateString = getUTCDateString();
  const hash = hashString(dateString);
  const subjectIndex = hash % subjects.length;

  const subject = subjects[subjectIndex];

  return {
    subject: subject,
    icon: subjectIcons[subject],
    date: dateString,
    bonus: 0.20 // 20% bonus
  };
};

// Check if a question is from today's featured subject
export const isSubjectOfTheDay = (questionSubject) => {
  const todaySubject = getSubjectOfTheDay();
  return questionSubject === todaySubject.subject;
};

// Calculate bonus points for subject of the day
export const calculateBonusPoints = (basePoints, questionSubject) => {
  if (isSubjectOfTheDay(questionSubject)) {
    const bonus = Math.floor(basePoints * 0.20);
    return {
      total: basePoints + bonus,
      bonus: bonus,
      isBonusQuestion: true
    };
  }

  return {
    total: basePoints,
    bonus: 0,
    isBonusQuestion: false
  };
};
