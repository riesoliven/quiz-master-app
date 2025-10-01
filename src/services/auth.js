import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_EMAILS = [
  'sam_r@gmail.com', // Replace with YOUR email
];

const ADMIN_PASSWORD = 'quiz2024admin'; // CHANGE THIS!

export const userRoles = {
  ADMIN: 'admin',
  PLAYER: 'player'
};

export const checkUserRole = async () => {
  const userEmail = await AsyncStorage.getItem('userEmail');
  if (ADMIN_EMAILS.includes(userEmail)) {
    return userRoles.ADMIN;
  }
  return userRoles.PLAYER;
};

export const isAdmin = async () => {
  const role = await checkUserRole();
  return role === userRoles.ADMIN;
};

export const verifyAdminPassword = (password) => {
  return password === ADMIN_PASSWORD;
};