import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getPatients, addAppointment, updateAppointment, deleteAppointment } from '../utils/database';
import { scheduleAppointmentNotification } from '../utils/notifications';
import { useTheme } from '../context/ThemeContext';

export default function AddEditAppointmentScreen({ route, navigation }) {
  const { colors, isDarkMode } = useTheme();
  const appointment = route.params?.appointment;
  const patient = route.params?.patient;
  const isEditing = !!appointment;

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(patient || (appointment ? { id: appointment.patient_id, name: appointment.patient_name } : null));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [form, setForm] = useState({
    doctorName: appointment?.doctor_name || '',
    date: appointment?.date || new Date().toISOString().split('T')[0],
    time: appointment?.time || '09:00',
    reason: appointment?.reason || '',
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const allPatients = await getPatients();
    setPatients(allPatients);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setForm({ ...form, date: `${year}-${month}-${day}` });
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const hours = String(selectedTime.getHours()).padStart(2, '0');
      const minutes = String(selectedTime.getMinutes()).padStart(2, '0');
      setForm({ ...form, time: `${hours}:${minutes}` });
    }
  };

  const validateForm = () => {
    if (!selectedPatient) {
      Alert.alert('Error', 'Selecciona un paciente');
      return false;
    }
    if (!form.doctorName.trim()) {
      Alert.alert('Error', 'Ingresa el nombre del doctor');
      return false;
    }
    if (!form.date) {
      Alert.alert('Error', 'Ingresa la fecha');
      return false;
    }
    if (!form.time) {
      Alert.alert('Error', 'Ingresa la hora');
      return false;
    }
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(form.date)) {
      Alert.alert('Error', 'Formato de fecha inválido. Usa YYYY-MM-DD');
      return false;
    }
    
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(form.time)) {
      Alert.alert('Error', 'Formato de hora inválido. Usa HH:MM (ej: 14:30)');
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const appointmentData = {
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctorName: form.doctorName.trim(),
      date: form.date,
      time: form.time,
      reason: form.reason.trim(),
    };

    let result;
    if (isEditing) {
      result = await updateAppointment(appointment.id, appointmentData);
    } else {
      result = await addAppointment(appointmentData);
    }

    if (result.success) {
      if (!isEditing) {
        await scheduleAppointmentNotification({
          id: result.id,
          patient_name: selectedPatient.name,
          date: form.date,
          time: form.time,
          reason: form.reason,
        });
      }
      
      Alert.alert('Éxito', `Cita ${isEditing ? 'actualizada' : 'agregada'} correctamente`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error || 'Error al guardar la cita');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Eliminar Cita',
      '¿Estás seguro de eliminar esta cita?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteAppointment(appointment.id);
            if (result.success) {
              Alert.alert('Éxito', 'Cita eliminada correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } else {
              Alert.alert('Error', 'No se pudo eliminar la cita');
            }
          }
        }
      ]
    );
  };

  const styles = getStyles(colors, isDarkMode);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>{isEditing ? 'Editar Cita' : 'Nueva Cita'}</Text>

        {/* Selección de paciente */}
        <Text style={styles.label}>Paciente *</Text>
        {!selectedPatient ? (
          <View>
            {patients.length > 0 ? (
              patients.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.patientOption}
                  onPress={() => setSelectedPatient(p)}
                >
                  <Text style={styles.patientName}>{p.name}</Text>
                  <Text style={styles.patientEmail}>{p.email || 'Sin email'}</Text>
                  <Text style={styles.patientPhone}>{p.phone || 'Sin teléfono'}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyPatients}>
                <Text style={styles.emptyText}>No hay pacientes registrados</Text>
                <TouchableOpacity 
                  style={styles.createPatientButton}
                  onPress={() => navigation.navigate('AddEditPatient', {})}
                >
                  <Text style={styles.createPatientText}>+ Crear Paciente</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.selectedPatient}>
            <View>
              <Text style={styles.selectedPatientName}>{selectedPatient.name}</Text>
              <Text style={styles.selectedPatientDetails}>
                {selectedPatient.email} {selectedPatient.phone ? `• ${selectedPatient.phone}` : ''}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedPatient(null)}>
              <Text style={styles.changeText}>Cambiar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Nombre del doctor */}
        <Text style={styles.label}>Nombre del Doctor *</Text>
        <TextInput
          style={styles.input}
          value={form.doctorName}
          onChangeText={(text) => setForm({ ...form, doctorName: text })}
          placeholder="Ej: Dr. Juan Pérez"
          placeholderTextColor={colors.textSecondary}
        />

        {/* Fecha */}
        <Text style={styles.label}>Fecha *</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerText}>{form.date}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date(form.date)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
          />
        )}

        {/* Hora */}
        <Text style={styles.label}>Hora *</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.datePickerText}>{form.time}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={new Date(`2000-01-01T${form.time}:00`)}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onTimeChange}
          />
        )}

        {/* Motivo de la cita */}
        <Text style={styles.label}>Motivo de la cita</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.reason}
          onChangeText={(text) => setForm({ ...form, reason: text })}
          placeholder="Motivo de la consulta"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
        />

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Actualizar Cita' : 'Guardar Cita'}
            </Text>
          </TouchableOpacity>
          
          {isEditing && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Eliminar Cita</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.card,
    color: colors.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    backgroundColor: colors.card,
  },
  datePickerText: {
    fontSize: 16,
    color: colors.text,
  },
  patientOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: colors.card,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  patientEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  patientPhone: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  selectedPatient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    backgroundColor: isDarkMode ? colors.primary + '20' : '#E6F4FE',
  },
  selectedPatientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  selectedPatientDetails: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  changeText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  emptyPatients: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 10,
  },
  createPatientButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createPatientText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: colors.error,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});