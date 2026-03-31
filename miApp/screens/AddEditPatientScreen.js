import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { addPatient, updatePatient } from '../utils/database';
import { useTheme } from '../context/ThemeContext';

export default function AddEditPatientScreen({ route, navigation }) {
  const { colors } = useTheme();
  const patient = route.params?.patient;
  const isEditing = !!patient;

  const [form, setForm] = useState({
    name: patient?.name || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    birthDate: patient?.birth_date || '',
    address: patient?.address || '',
  });

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    let result;
    if (isEditing) {
      result = await updatePatient(patient.id, form);
    } else {
      result = await addPatient(form);
    }

    if (result.success) {
      Alert.alert('Éxito', `Paciente ${isEditing ? 'actualizado' : 'agregado'} correctamente`);
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const styles = getStyles(colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>{isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}</Text>
        
        <Text style={styles.label}>Nombre completo *</Text>
        <TextInput style={styles.input} value={form.name} onChangeText={(text) => setForm({ ...form, name: text })} placeholder="Ej: Juan Pérez" placeholderTextColor={colors.textSecondary} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={form.email} onChangeText={(text) => setForm({ ...form, email: text })} placeholder="correo@ejemplo.com" keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.textSecondary} />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput style={styles.input} value={form.phone} onChangeText={(text) => setForm({ ...form, phone: text })} placeholder="123-456-7890" keyboardType="phone-pad" placeholderTextColor={colors.textSecondary} />

        <Text style={styles.label}>Fecha de nacimiento</Text>
        <TextInput style={styles.input} value={form.birthDate} onChangeText={(text) => setForm({ ...form, birthDate: text })} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textSecondary} />

        <Text style={styles.label}>Dirección</Text>
        <TextInput style={[styles.input, styles.textArea]} value={form.address} onChangeText={(text) => setForm({ ...form, address: text })} placeholder="Dirección completa" multiline numberOfLines={3} placeholderTextColor={colors.textSecondary} />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{isEditing ? 'Actualizar' : 'Guardar'} Paciente</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  form: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: colors.text, marginBottom: 5, marginTop: 10 },
  input: { 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: 10, 
    padding: 12, 
    fontSize: 16, 
    backgroundColor: colors.card,
    color: colors.text,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  saveButton: { backgroundColor: colors.primary, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30, marginBottom: 20 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});