import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPatients, getAppointments } from '../utils/database';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const [stats, setStats] = useState({ patients: 0, appointments: 0, todayAppointments: 0 });
  const [user, setUser] = useState(null);

  const loadData = async () => {
    try {
      const patients = await getPatients();
      const appointments = await getAppointments();
      const userData = await AsyncStorage.getItem('currentUser');
      const currentUser = userData ? JSON.parse(userData) : null;
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter(a => a.date === today);
      
      setStats({
        patients: patients.length,
        appointments: appointments.length,
        todayAppointments: todayAppointments.length,
      });
      setUser(currentUser);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  // Recargar datos cada vez que la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const styles = getStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>¡Hola, {user?.name || 'Usuario'}!</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('es-ES')}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="people" size={30} color={colors.primary} />
          <Text style={styles.statNumber}>{stats.patients}</Text>
          <Text style={styles.statLabel}>Pacientes</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={30} color={colors.primary} />
          <Text style={styles.statNumber}>{stats.appointments}</Text>
          <Text style={styles.statLabel}>Citas Totales</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="today" size={30} color={colors.primary} />
          <Text style={styles.statNumber}>{stats.todayAppointments}</Text>
          <Text style={styles.statLabel}>Citas Hoy</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Pacientes')}>
          <Ionicons name="person-add" size={24} color="#fff" />
          <Text style={styles.actionText}>Nuevo Paciente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={() => navigation.navigate('Citas')}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.actionText}>Nueva Cita</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, padding: 20, paddingTop: 40 },
  welcome: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  date: { fontSize: 14, color: '#fff', marginTop: 5, opacity: 0.9 },
  statsContainer: { flexDirection: 'row', padding: 15, justifyContent: 'space-between' },
  statCard: { 
    flex: 1, 
    backgroundColor: colors.card, 
    marginHorizontal: 5, 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginTop: 5 },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 5 },
  quickActions: { padding: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: colors.text },
  actionButton: { 
    backgroundColor: colors.primary, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10 
  },
  secondaryButton: { backgroundColor: colors.success },
  actionText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});