import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { 
  getAppointmentsByPatient, 
  getMedicalNotesByPatient,
  deleteAppointment,
  deleteMedicalNote,
  addMedicalNote
} from '../utils/database';

export default function PatientDetailScreen({ route, navigation }) {
  const { colors } = useTheme();
  const { patient } = route.params;
  const [appointments, setAppointments] = useState([]);
  const [medicalNotes, setMedicalNotes] = useState([]);
  const [activeTab, setActiveTab] = useState('info');
  const [modalVisible, setModalVisible] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [vitalSigns, setVitalSigns] = useState({
    weight: '',
    bloodPressure: '',
    temperature: '',
    heartRate: ''
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const apts = await getAppointmentsByPatient(patient.id);
    const notes = await getMedicalNotesByPatient(patient.id);
    setAppointments(apts);
    setMedicalNotes(notes);
  };

  const handleDeleteAppointment = (id) => {
    Alert.alert('Eliminar Cita', '¿Eliminar esta cita?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { await deleteAppointment(id); loadData(); } }
    ]);
  };

  const handleDeleteNote = (id) => {
    Alert.alert('Eliminar Nota', '¿Eliminar esta nota?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { await deleteMedicalNote(id); loadData(); } }
    ]);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) { Alert.alert('Error', 'Escribe una nota'); return; }
    const noteData = {
      patientId: patient.id, 
      patientName: patient.name, 
      note: newNote,
      weight: vitalSigns.weight ? parseFloat(vitalSigns.weight) : null,
      bloodPressure: vitalSigns.bloodPressure || null,
      temperature: vitalSigns.temperature ? parseFloat(vitalSigns.temperature) : null,
      heartRate: vitalSigns.heartRate ? parseInt(vitalSigns.heartRate) : null,
    };
    await addMedicalNote(noteData);
    setNewNote(''); 
    setVitalSigns({ weight: '', bloodPressure: '', temperature: '', heartRate: '' });
    setModalVisible(false); 
    loadData();
    Alert.alert('Éxito', 'Nota agregada');
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={80} color="#fff" />
        <Text style={styles.patientName}>{patient.name}</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('AddEditPatient', { patient })}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'info' && styles.activeTab]} onPress={() => setActiveTab('info')}>
          <Ionicons name="information-circle" size={24} color={activeTab === 'info' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'info' && { color: colors.primary }]}>Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'appointments' && styles.activeTab]} onPress={() => setActiveTab('appointments')}>
          <Ionicons name="calendar" size={24} color={activeTab === 'appointments' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'appointments' && { color: colors.primary }]}>Citas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'notes' && styles.activeTab]} onPress={() => setActiveTab('notes')}>
          <Ionicons name="document-text" size={24} color={activeTab === 'notes' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'notes' && { color: colors.primary }]}>Notas</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'info' && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Información Personal</Text>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={20} color={colors.primary} />
              <Text style={styles.infoText}>Nombre: {patient.name}</Text>
            </View>
            {patient.email && (
              <View style={styles.infoRow}>
                <Ionicons name="mail" size={20} color={colors.primary} />
                <Text style={styles.infoText}>Email: {patient.email}</Text>
              </View>
            )}
            {patient.phone && (
              <View style={styles.infoRow}>
                <Ionicons name="call" size={20} color={colors.primary} />
                <Text style={styles.infoText}>Teléfono: {patient.phone}</Text>
              </View>
            )}
            {patient.birth_date && (
              <View style={styles.infoRow}>
                <Ionicons name="cake" size={20} color={colors.primary} />
                <Text style={styles.infoText}>Edad: {calculateAge(patient.birth_date)} años</Text>
              </View>
            )}
            {patient.address && (
              <View style={styles.infoRow}>
                <Ionicons name="location" size={20} color={colors.primary} />
                <Text style={styles.infoText}>Dirección: {patient.address}</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'appointments' && (
          <View>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddEditAppointment', { patient })}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Nueva Cita</Text>
            </TouchableOpacity>
            {appointments.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="calendar-outline" size={50} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No hay citas registradas</Text>
              </View>
            ) : (
              appointments.map(item => (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{item.date} - {item.time}</Text>
                    <TouchableOpacity onPress={() => handleDeleteAppointment(item.id)}>
                      <Ionicons name="trash" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemText}>Dr. {item.doctor_name}</Text>
                  {item.reason && <Text style={styles.itemText}>Motivo: {item.reason}</Text>}
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'notes' && (
          <View>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Nueva Nota Médica</Text>
            </TouchableOpacity>
            {medicalNotes.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={50} color={colors.textSecondary} />
                <Text style={styles.emptyText}>No hay notas médicas</Text>
              </View>
            ) : (
              medicalNotes.map(item => (
                <View key={item.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>
                      {new Date(item.date).toLocaleDateString('es-ES')}
                    </Text>
                    <TouchableOpacity onPress={() => handleDeleteNote(item.id)}>
                      <Ionicons name="trash" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.noteText}>{item.note}</Text>
                  {(item.weight || item.blood_pressure || item.temperature || item.heart_rate) && (
                    <View style={styles.vitalSigns}>
                      <Text style={styles.vitalTitle}>Signos Vitales:</Text>
                      <View style={styles.vitalRow}>
                        {item.weight && <Text style={styles.vitalText}>⚖️ Peso: {item.weight} kg</Text>}
                        {item.blood_pressure && <Text style={styles.vitalText}>❤️ Presión: {item.blood_pressure}</Text>}
                        {item.temperature && <Text style={styles.vitalText}>🌡️ Temp: {item.temperature}°C</Text>}
                        {item.heart_rate && <Text style={styles.vitalText}>💓 Pulso: {item.heart_rate} bpm</Text>}
                      </View>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Nueva Nota Médica</Text>
            <TextInput 
              style={[styles.textArea, { borderColor: colors.border, color: colors.text }]} 
              placeholder="Nota médica..." 
              placeholderTextColor={colors.textSecondary} 
              multiline 
              value={newNote} 
              onChangeText={setNewNote} 
            />
            <Text style={[styles.subLabel, { color: colors.text }]}>Signos Vitales (opcional)</Text>
            <TextInput 
              style={[styles.input, { borderColor: colors.border, color: colors.text }]} 
              placeholder="Peso (kg)" 
              placeholderTextColor={colors.textSecondary} 
              value={vitalSigns.weight} 
              onChangeText={text => setVitalSigns({...vitalSigns, weight: text})} 
              keyboardType="numeric" 
            />
            <TextInput 
              style={[styles.input, { borderColor: colors.border, color: colors.text }]} 
              placeholder="Presión arterial (ej: 120/80)" 
              placeholderTextColor={colors.textSecondary} 
              value={vitalSigns.bloodPressure} 
              onChangeText={text => setVitalSigns({...vitalSigns, bloodPressure: text})} 
            />
            <TextInput 
              style={[styles.input, { borderColor: colors.border, color: colors.text }]} 
              placeholder="Temperatura (°C)" 
              placeholderTextColor={colors.textSecondary} 
              value={vitalSigns.temperature} 
              onChangeText={text => setVitalSigns({...vitalSigns, temperature: text})} 
              keyboardType="numeric" 
            />
            <TextInput 
              style={[styles.input, { borderColor: colors.border, color: colors.text }]} 
              placeholder="Frecuencia cardíaca (bpm)" 
              placeholderTextColor={colors.textSecondary} 
              value={vitalSigns.heartRate} 
              onChangeText={text => setVitalSigns({...vitalSigns, heartRate: text})} 
              keyboardType="numeric" 
            />
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleAddNote}>
              <Text style={styles.saveButtonText}>Guardar Nota</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, alignItems: 'center', padding: 20, paddingTop: 40 },
  patientName: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  editButton: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginTop: 10 },
  editButtonText: { color: '#fff', marginLeft: 5 },
  tabsContainer: { flexDirection: 'row', backgroundColor: colors.card, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { fontSize: 12, marginTop: 4, color: colors.textSecondary },
  content: { flex: 1, padding: 15 },
  infoCard: { backgroundColor: colors.card, borderRadius: 10, padding: 15, marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: colors.text },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  infoText: { marginLeft: 10, fontSize: 14, color: colors.text },
  addButton: { 
    flexDirection: 'row', 
    backgroundColor: colors.primary, 
    padding: 12, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 15 
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
  itemCard: { backgroundColor: colors.card, borderRadius: 10, padding: 15, marginBottom: 10 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  itemText: { fontSize: 14, color: colors.textSecondary, marginTop: 5 },
  noteText: { fontSize: 14, color: colors.text, marginVertical: 8, lineHeight: 20 },
  vitalSigns: { backgroundColor: colors.surface, padding: 10, borderRadius: 8, marginTop: 10 },
  vitalTitle: { fontSize: 14, fontWeight: 'bold', color: colors.primary, marginBottom: 8 },
  vitalRow: { flexDirection: 'row', flexWrap: 'wrap' },
  vitalText: { fontSize: 12, color: colors.textSecondary, marginRight: 15, marginBottom: 5 },
  emptyContainer: { alignItems: 'center', paddingTop: 50 },
  emptyText: { fontSize: 14, color: colors.textSecondary, marginTop: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { margin: 20, borderRadius: 15, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  subLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 10 },
  textArea: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, minHeight: 80, textAlignVertical: 'top', marginBottom: 10 },
  saveButton: { padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 10 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelText: { textAlign: 'center', marginTop: 10, fontSize: 14 },
});