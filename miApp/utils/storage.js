import AsyncStorage from '@react-native-async-storage/async-storage';

// Claves para AsyncStorage
const KEYS = {
  USERS: '@medical:users',
  PATIENTS: '@medical:patients',
  APPOINTMENTS: '@medical:appointments',
  MEDICAL_NOTES: '@medical:notes',
  CURRENT_USER: '@medical:current_user',
  SETTINGS: '@medical:settings',
};

// ============ USUARIOS ============
export const registerUser = async (name, email, password) => {
  try {
    const users = await getUsers();
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, error: 'Email ya registrado' };
    }
     
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error al registrar' };
  }
};

export const loginUser = async (email, password) => {
  try {
    const users = await getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, error: 'Credenciales incorrectas' };
  } catch (error) {
    return { success: false, error: 'Error al iniciar sesión' };
  }
};

export const getCurrentUser = async () => {
  const user = await AsyncStorage.getItem(KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(KEYS.CURRENT_USER);
};

export const updateUserProfile = async (userId, updatedData) => {
  try {
    const users = await getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedData };
      await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
      
      // Actualizar usuario actual si es el mismo
      const currentUser = await getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        const { password, ...userWithoutPassword } = users[index];
        await AsyncStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
      }
      return { success: true };
    }
    return { success: false, error: 'Usuario no encontrado' };
  } catch (error) {
    return { success: false, error: 'Error al actualizar' };
  }
};

const getUsers = async () => {
  const users = await AsyncStorage.getItem(KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

// ============ PACIENTES ============
export const getPatients = async () => {
  const patients = await AsyncStorage.getItem(KEYS.PATIENTS);
  return patients ? JSON.parse(patients) : [];
};

export const getPatientById = async (id) => {
  const patients = await getPatients();
  return patients.find(p => p.id === id);
};

export const addPatient = async (patient) => {
  const patients = await getPatients();
  const newPatient = {
    id: Date.now().toString(),
    ...patient,
    createdAt: new Date().toISOString(),
  };
  patients.push(newPatient);
  await AsyncStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
  return newPatient;
};

export const updatePatient = async (id, updatedData) => {
  const patients = await getPatients();
  const index = patients.findIndex(p => p.id === id);
  if (index !== -1) {
    patients[index] = { ...patients[index], ...updatedData };
    await AsyncStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
    return patients[index];
  }
  return null;
};

export const deletePatient = async (id) => {
  const patients = await getPatients();
  const filtered = patients.filter(p => p.id !== id);
  await AsyncStorage.setItem(KEYS.PATIENTS, JSON.stringify(filtered));
  
  // Eliminar citas y notas del paciente
  const appointments = await getAppointments();
  const filteredAppointments = appointments.filter(a => a.patientId !== id);
  await AsyncStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(filteredAppointments));
  
  const notes = await getMedicalNotes();
  const filteredNotes = notes.filter(n => n.patientId !== id);
  await AsyncStorage.setItem(KEYS.MEDICAL_NOTES, JSON.stringify(filteredNotes));
};

export const searchPatients = async (query) => {
  const patients = await getPatients();
  if (!query) return patients;
  return patients.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    (p.email && p.email.toLowerCase().includes(query.toLowerCase())) ||
    (p.phone && p.phone.includes(query))
  );
};

// ============ CITAS ============
export const getAppointments = async () => {
  const appointments = await AsyncStorage.getItem(KEYS.APPOINTMENTS);
  return appointments ? JSON.parse(appointments) : [];
};

export const getAppointmentsByPatient = async (patientId) => {
  const appointments = await getAppointments();
  return appointments.filter(a => a.patientId === patientId);
};

export const getTodayAppointments = async () => {
  const appointments = await getAppointments();
  const today = new Date().toISOString().split('T')[0];
  return appointments.filter(a => a.date === today);
};

export const addAppointment = async (appointment) => {
  const appointments = await getAppointments();
  const newAppointment = {
    id: Date.now().toString(),
    ...appointment,
    createdAt: new Date().toISOString(),
  };
  appointments.push(newAppointment);
  await AsyncStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
  return newAppointment;
};

export const updateAppointment = async (id, updatedData) => {
  const appointments = await getAppointments();
  const index = appointments.findIndex(a => a.id === id);
  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...updatedData };
    await AsyncStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appointments));
    return appointments[index];
  }
  return null;
};

export const deleteAppointment = async (id) => {
  const appointments = await getAppointments();
  const filtered = appointments.filter(a => a.id !== id);
  await AsyncStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(filtered));
};

// ============ NOTAS MÉDICAS ============
export const getMedicalNotes = async () => {
  const notes = await AsyncStorage.getItem(KEYS.MEDICAL_NOTES);
  return notes ? JSON.parse(notes) : [];
};

export const getMedicalNotesByPatient = async (patientId) => {
  const notes = await getMedicalNotes();
  return notes.filter(n => n.patientId === patientId).sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
};

export const addMedicalNote = async (note) => {
  const notes = await getMedicalNotes();
  const newNote = {
    id: Date.now().toString(),
    ...note,
    date: new Date().toISOString(),
  };
  notes.push(newNote);
  await AsyncStorage.setItem(KEYS.MEDICAL_NOTES, JSON.stringify(notes));
  return newNote;
};

export const deleteMedicalNote = async (id) => {
  const notes = await getMedicalNotes();
  const filtered = notes.filter(n => n.id !== id);
  await AsyncStorage.setItem(KEYS.MEDICAL_NOTES, JSON.stringify(filtered));
};

// ============ CONFIGURACIÓN ============
export const getSettings = async () => {
  const settings = await AsyncStorage.getItem(KEYS.SETTINGS);
  return settings ? JSON.parse(settings) : { darkMode: false, notifications: true };
};

export const saveSettings = async (settings) => {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

// ============ DATOS DE EJEMPLO ============
export const seedSampleData = async () => {
  const patients = await getPatients();
  if (patients.length === 0) {
    // Agregar pacientes de ejemplo
    const samplePatients = [
      {
        id: '1',
        name: 'María García',
        email: 'maria@email.com',
        phone: '123-456-7890',
        birthDate: '1990-05-15',
        address: 'Calle Principal 123',
      },
      {
        id: '2',
        name: 'Carlos López',
        email: 'carlos@email.com',
        phone: '098-765-4321',
        birthDate: '1985-08-20',
        address: 'Avenida Central 456',
      },
    ];
    
    for (const patient of samplePatients) {
      await addPatient(patient);
    }
    
    // Agregar citas de ejemplo
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    await addAppointment({
      patientId: '1',
      patientName: 'María García',
      doctorName: 'Dr. Martínez',
      date: today,
      time: '10:00',
      reason: 'Consulta general',
      status: 'pending',
    });
    
    await addAppointment({
      patientId: '2',
      patientName: 'Carlos López',
      doctorName: 'Dra. Rodríguez',
      date: tomorrow,
      time: '15:30',
      reason: 'Revisión de resultados',
      status: 'pending',
    });
  }
};