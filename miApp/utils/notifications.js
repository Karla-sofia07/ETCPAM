import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurar manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Solicitar permisos
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permisos de notificaciones no otorgados');
      return false;
    }
    
    // Configurar canal para Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('appointments', {
        name: 'Recordatorios de citas',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF4A90E2',
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error solicitando permisos:', error);
    return false;
  }
};

// Programar notificación para una cita
export const scheduleAppointmentNotification = async (appointment) => {
  try {
    const settings = await AsyncStorage.getItem('@medical:settings');
    const { notifications } = settings ? JSON.parse(settings) : { notifications: true };
    
    if (!notifications) return null;
    
    const { id, patient_name, date, time, reason } = appointment;
    const [year, month, day] = date.split('-');
    const [hour, minute] = time.split(':');
    
    const appointmentDate = new Date(year, month - 1, day, hour, minute);
    const notificationTime = new Date(appointmentDate.getTime() - 60 * 60 * 1000);
    
    if (notificationTime > new Date()) {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔔 Recordatorio de cita médica',
          body: `Cita con ${patient_name} a las ${time}\nMotivo: ${reason || 'Consulta médica'}`,
          data: { appointmentId: id },
          sound: true,
        },
        trigger: { date: notificationTime, channelId: 'appointments' },
      });
      return identifier;
    }
    return null;
  } catch (error) {
    console.error('Error programando notificación:', error);
    return null;
  }
};

// Programar todas las notificaciones
export const scheduleAllAppointmentNotifications = async (appointments) => {
  for (const appointment of appointments) {
    await scheduleAppointmentNotification(appointment);
  }
};

// Cancelar todas las notificaciones
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};