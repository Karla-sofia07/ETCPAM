import * as SQLite from 'expo-sqlite';

// Abrir la base de datos
const db = SQLite.openDatabaseSync('medical.db');

// Inicializar todas las tablas
export const initDatabase = async () => {
  try {
    // Tabla de usuarios
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de pacientes
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        birth_date TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tabla de citas
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        patient_name TEXT NOT NULL,
        doctor_name TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        reason TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE
      );
    `);

    // Tabla de notas médicas
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS medical_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        patient_name TEXT NOT NULL,
        note TEXT NOT NULL,
        weight REAL,
        blood_pressure TEXT,
        temperature REAL,
        heart_rate INTEGER,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE
      );
    `);

    console.log('✅ Base de datos SQLite inicializada');
    
    // Insertar usuario de prueba si no existe
    const users = await db.getAllAsync('SELECT * FROM users');
    if (users.length === 0) {
      await db.runAsync(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        ['Doctor Demo', 'demo@test.com', '123456']
      );
      console.log('✅ Usuario de prueba creado: demo@test.com / 123456');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error inicializando DB:', error);
    return false;
  }
};

// ============ USUARIOS ============
// utils/database.js
export const registerUser = async (name, email, password) => {
  try {
    await db.runAsync(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    return { success: true };
  } catch (error) {
    console.error('Error en registerUser:', error);
    // Mensaje de error más claro
    if (error.message.includes('UNIQUE constraint failed')) {
      return { success: false, error: 'El email ya está registrado' };
    }
    return { success: false, error: 'Error al registrar usuario' };
  }
};

export const loginUser = async (email, password) => {
  try {
    const user = await db.getFirstAsync(
      'SELECT id, name, email FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    
    if (user) {
      return { success: true, user };
    }
    return { success: false, error: 'Credenciales incorrectas' };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al iniciar sesión' };
  }
};

export const getCurrentUser = async () => {
  // Por ahora retornamos null, manejaremos la sesión con AsyncStorage o estado global
  return null;
};

// ============ PACIENTES ============
export const getPatients = async () => {
  try {
    const patients = await db.getAllAsync('SELECT * FROM patients ORDER BY name ASC');
    return patients;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getPatientById = async (id) => {
  try {
    const patient = await db.getFirstAsync('SELECT * FROM patients WHERE id = ?', [id]);
    return patient;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const addPatient = async (patient) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO patients (name, email, phone, birth_date, address) VALUES (?, ?, ?, ?, ?)',
      [patient.name, patient.email || null, patient.phone || null, patient.birthDate || null, patient.address || null]
    );
    return { success: true, id: result.lastInsertRowId };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al agregar paciente' };
  }
};

export const updatePatient = async (id, patient) => {
  try {
    await db.runAsync(
      'UPDATE patients SET name = ?, email = ?, phone = ?, birth_date = ?, address = ? WHERE id = ?',
      [patient.name, patient.email || null, patient.phone || null, patient.birthDate || null, patient.address || null, id]
    );
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al actualizar paciente' };
  }
};

export const deletePatient = async (id) => {
  try {
    await db.runAsync('DELETE FROM patients WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al eliminar paciente' };
  }
};

export const searchPatients = async (query) => {
  try {
    const patients = await db.getAllAsync(
      'SELECT * FROM patients WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? ORDER BY name ASC',
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    return patients;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// ============ CITAS ============
export const getAppointments = async () => {
  try {
    const appointments = await db.getAllAsync('SELECT * FROM appointments ORDER BY date DESC, time DESC');
    return appointments;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getAppointmentsByPatient = async (patientId) => {
  try {
    const appointments = await db.getAllAsync(
      'SELECT * FROM appointments WHERE patient_id = ? ORDER BY date DESC, time DESC',
      [patientId]
    );
    return appointments;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const addAppointment = async (appointment) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO appointments (patient_id, patient_name, doctor_name, date, time, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [appointment.patientId, appointment.patientName, appointment.doctorName, appointment.date, appointment.time, appointment.reason || null, 'pending']
    );
    return { success: true, id: result.lastInsertRowId };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al agregar cita' };
  }
};

export const updateAppointmentStatus = async (id, status) => {
  try {
    await db.runAsync('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

export const deleteAppointment = async (id) => {
  try {
    await db.runAsync('DELETE FROM appointments WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

// ============ NOTAS MÉDICAS ============
export const getMedicalNotesByPatient = async (patientId) => {
  try {
    const notes = await db.getAllAsync(
      'SELECT * FROM medical_notes WHERE patient_id = ? ORDER BY date DESC',
      [patientId]
    );
    return notes;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const addMedicalNote = async (note) => {
  try {
    const result = await db.runAsync(
      'INSERT INTO medical_notes (patient_id, patient_name, note, weight, blood_pressure, temperature, heart_rate) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [note.patientId, note.patientName, note.note, note.weight || null, note.bloodPressure || null, note.temperature || null, note.heartRate || null]
    );
    return { success: true, id: result.lastInsertRowId };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

export const deleteMedicalNote = async (id) => {
  try {
    await db.runAsync('DELETE FROM medical_notes WHERE id = ?', [id]);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

export const updateAppointment = async (id, appointment) => {
  try {
    await db.runAsync(
      'UPDATE appointments SET doctor_name = ?, date = ?, time = ?, reason = ? WHERE id = ?',
      [appointment.doctorName, appointment.date, appointment.time, appointment.reason || null, id]
    );
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Error al actualizar cita' };
  }
};

// ============ DATOS DE EJEMPLO ============
export const seedSampleData = async () => {
  const patients = await getPatients();
  if (patients.length === 0) {
    // Agregar pacientes de ejemplo
    await addPatient({ name: 'María García', email: 'maria@email.com', phone: '123-456-7890', birthDate: '1990-05-15', address: 'Calle Principal 123' });
    await addPatient({ name: 'Carlos López', email: 'carlos@email.com', phone: '098-765-4321', birthDate: '1985-08-20', address: 'Avenida Central 456' });
    
    // Obtener los pacientes para sus IDs
    const allPatients = await getPatients();
    const today = new Date().toISOString().split('T')[0];
    
    // Agregar citas de ejemplo
    for (const patient of allPatients) {
      await addAppointment({
        patientId: patient.id,
        patientName: patient.name,
        doctorName: 'Dr. Martínez',
        date: today,
        time: '10:00',
        reason: 'Consulta general'
      });
    }
  }
};

export default db;