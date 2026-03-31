import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function AjustesScreen() {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await AsyncStorage.getItem('@medical:settings');
    if (settings) {
      const { notifications: notif } = JSON.parse(settings);
      setNotifications(notif ?? true);
    }
  };

  const toggleNotifications = async (value) => {
    setNotifications(value);
    await AsyncStorage.setItem('@medical:settings', JSON.stringify({ notifications: value }));
  };

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout }
    ]);
  };

  const styles = getStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={50} color={colors.primary} />
        </View>
        <Text style={styles.name}>{user?.name || 'Usuario'}</Text>
        <Text style={styles.email}>{user?.email || 'usuario@email.com'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apariencia</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon" size={24} color={colors.primary} />
            <Text style={styles.settingText}>Modo Oscuro</Text>
          </View>
          <Switch value={isDarkMode} onValueChange={toggleTheme} trackColor={{ false: '#767577', true: colors.primary }} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications" size={24} color={colors.primary} />
            <Text style={styles.settingText}>Recordatorios de citas</Text>
          </View>
          <Switch value={notifications} onValueChange={toggleNotifications} trackColor={{ false: '#767577', true: colors.primary }} />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={24} color="#fff" />
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, alignItems: 'center', padding: 25, paddingTop: 40 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  email: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 4 },
  section: { backgroundColor: colors.surface, marginTop: 15, paddingHorizontal: 20, paddingVertical: 10 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 10 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  settingInfo: { flexDirection: 'row', alignItems: 'center' },
  settingText: { fontSize: 16, marginLeft: 12, color: colors.text },
  logoutButton: { flexDirection: 'row', backgroundColor: colors.error, margin: 20, padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});