import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { getCurrentUser, logoutUser } from '../utils/storage';

export default function MenuScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [activeScreen, setActiveScreen] = useState('Inicio');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const navigateTo = (screenName, screenTitle) => {
    setActiveScreen(screenTitle);
    navigation.dispatch(DrawerActions.closeDrawer());
    setTimeout(() => {
      navigation.navigate(screenName);
    }, 100);
  };

  const menuItems = [
    { 
      icon: 'home-outline', 
      activeIcon: 'home', 
      label: 'Inicio', 
      screen: 'Home',
      description: 'Dashboard y resumen'
    },
    { 
      icon: 'people-outline', 
      activeIcon: 'people', 
      label: 'Pacientes', 
      screen: 'Patients',
      description: 'Gestionar pacientes'
    },
    { 
      icon: 'calendar-outline', 
      activeIcon: 'calendar', 
      label: 'Citas', 
      screen: 'Appointments',
      description: 'Ver y gestionar citas'
    },
    { 
      icon: 'person-outline', 
      activeIcon: 'person', 
      label: 'Perfil', 
      screen: 'Profile',
      description: 'Mi información personal'
    },
    { 
      icon: 'settings-outline', 
      activeIcon: 'settings', 
      label: 'Ajustes', 
      screen: 'Settings',
      description: 'Configuración de la app'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con información del usuario */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="medical" size={40} color="#86DFFF" />
            </View>
          </View>
          <Text style={styles.appName}>SeguriMedic</Text>
          {user && (
            <>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </>
          )}
        </View>

        {/* Estadísticas rápidas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={20} color="#86DFFF" />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Pacientes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={20} color="#86DFFF" />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Citas Hoy</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="document-text" size={20} color="#86DFFF" />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Notas</Text>
          </View>
        </View>

        {/* Menú de navegación */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Navegación</Text>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                activeScreen === item.label && styles.activeMenuItem
              ]}
              onPress={() => navigateTo(item.screen, item.label)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons 
                  name={activeScreen === item.label ? item.activeIcon : item.icon} 
                  size={24} 
                  color={activeScreen === item.label ? '#86DFFF' : '#666'} 
                />
                <View style={styles.menuItemText}>
                  <Text style={[
                    styles.menuItemLabel,
                    activeScreen === item.label && styles.activeMenuItemLabel
                  ]}>
                    {item.label}
                  </Text>
                  <Text style={styles.menuItemDescription}>{item.description}</Text>
                </View>
              </View>
              {activeScreen === item.label && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Sección de soporte */}
        <View style={styles.supportSection}>
          <Text style={styles.menuTitle}>Soporte</Text>
          
          <TouchableOpacity style={styles.supportItem}>
            <Ionicons name="help-circle-outline" size={22} color="#666" />
            <Text style={styles.supportText}>Ayuda</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.supportItem}>
            <Ionicons name="information-circle-outline" size={22} color="#666" />
            <Text style={styles.supportText}>Acerca de</Text>
          </TouchableOpacity>
        </View>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#ff4444" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* Versión de la app */}
        <Text style={styles.versionText}>Versión 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#86DFFF',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  userEmail: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },
  menuSection: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  activeMenuItem: {
    backgroundColor: '#E6F4FE',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  activeMenuItemLabel: {
    color: '#86DFFF',
    fontWeight: '600',
  },
  menuItemDescription: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  activeIndicator: {
    width: 4,
    height: 20,
    backgroundColor: '#86DFFF',
    borderRadius: 2,
  },
  supportSection: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 2,
  },
  supportText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 25,
    marginBottom: 15,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffdddd',
  },
  logoutText: {
    fontSize: 15,
    color: '#ff4444',
    marginLeft: 12,
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: '#ccc',
    marginBottom: 20,
    marginTop: 10,
  },
});