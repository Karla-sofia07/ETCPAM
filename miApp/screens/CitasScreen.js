import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getAppointments, deleteAppointment, updateAppointmentStatus } from '../utils/database';
import { useTheme } from '../context/ThemeContext';

export default function CitasScreen({ navigation }) {
  const { colors } = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAppointments = async () => {
    const data = await getAppointments();
    setAppointments(data);
  };

  const handleComplete = async (id) => {
    await updateAppointmentStatus(id, 'completed');
    loadAppointments();
    Alert.alert('Éxito', 'Cita marcada como completada');
  };

  const handleDelete = (id) => {
    Alert.alert('Eliminar Cita', '¿Eliminar esta cita?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
          await deleteAppointment(id);
          loadAppointments();
        }
      }
    ]);
  };

  useFocusEffect(useCallback(() => { loadAppointments(); }, []));

  const onRefresh = async () => { setRefreshing(true); await loadAppointments(); setRefreshing(false); };

  const styles = getStyles(colors);

  const renderAppointment = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.patientName}>{item.patient_name}</Text>
          <Text style={styles.doctorName}>Dr. {item.doctor_name}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'completed' ? colors.success : colors.warning }]}>
          <Text style={styles.statusText}>{item.status === 'completed' ? 'Completada' : 'Pendiente'}</Text>
        </View>
      </View>
      
      <View style={styles.infoRow}>
        <Ionicons name="calendar" size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>{item.date}</Text>
        <Ionicons name="time" size={16} color={colors.textSecondary} style={styles.marginLeft} />
        <Text style={styles.infoText}>{item.time}</Text>
      </View>
      
      {item.reason && (
        <View style={styles.infoRow}>
          <Ionicons name="medical" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>Motivo: {item.reason}</Text>
        </View>
      )}
      
      {item.status !== 'completed' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.completeButton]} onPress={() => handleComplete(item.id)}>
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={styles.buttonText}>Completar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash" size={18} color="#fff" />
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddEditAppointment', {})}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Nueva Cita</Text>
      </TouchableOpacity>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAppointment}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={50} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No hay citas programadas</Text>
          </View>
        }
      />
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  addButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    margin: 15,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  card: {
    backgroundColor: colors.card,
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  patientName: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  doctorName: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  infoText: { fontSize: 14, color: colors.textSecondary, marginLeft: 8 },
  marginLeft: { marginLeft: 15 },
  buttonRow: { flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' },
  button: { flex: 1, flexDirection: 'row', padding: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
  completeButton: { backgroundColor: colors.success },
  deleteButton: { backgroundColor: colors.error },
  buttonText: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
  empty: { alignItems: 'center', paddingTop: 50 },
  emptyText: { fontSize: 16, color: colors.textSecondary, marginTop: 10 },
});