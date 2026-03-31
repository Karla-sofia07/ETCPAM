import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getPatients, searchPatients, deletePatient } from '../utils/database';
import { useTheme } from '../context/ThemeContext';

export default function PacientesScreen({ navigation }) {
  const { colors } = useTheme();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadPatients = async () => {
    const data = await getPatients();
    setPatients(data);
  };

  const handleSearch = async (text) => {
    setSearchQuery(text);
    const results = await searchPatients(text);
    setPatients(results);
  };

  const handleDelete = (id, name) => {
    Alert.alert('Eliminar Paciente', `¿Eliminar a ${name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
          await deletePatient(id);
          loadPatients();
        }
      }
    ]);
  };

  useFocusEffect(useCallback(() => { loadPatients(); }, []));

  const onRefresh = async () => { setRefreshing(true); await loadPatients(); setRefreshing(false); };

  const styles = getStyles(colors);

  const renderPatient = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PatientDetail', { patient: item })}>
      <View style={styles.avatar}><Ionicons name="person-circle" size={50} color={colors.primary} /></View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>{item.email || 'Sin email'}</Text>
        <Text style={styles.phone}>{item.phone || 'Sin teléfono'}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => navigation.navigate('AddEditPatient', { patient: item })} style={styles.actionBtn}>
          <Ionicons name="create-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} style={styles.actionBtn}>
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar paciente..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddEditPatient', { patient: null })}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Nuevo Paciente</Text>
      </TouchableOpacity>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPatient}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={50} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No hay pacientes</Text>
          </View>
        }
      />
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, paddingVertical: 12, marginLeft: 10, fontSize: 16, color: colors.text },
  addButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: { marginRight: 15 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  details: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  phone: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  actions: { flexDirection: 'row' },
  actionBtn: { padding: 8 },
  empty: { alignItems: 'center', paddingTop: 50 },
  emptyText: { fontSize: 16, color: colors.textSecondary, marginTop: 10 },
});