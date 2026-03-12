import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import MenuScreen from './screens/MenuScreen';
import PacientesScreen from "./screens/PacientesScreen";
import CitasScreen from "./screens/CitasScreen";
import AjustesScreen from "./screens/AjustesScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen}/>
        <Stack.Screen name="Menu" component={MenuScreen}/>
        <Stack.Screen name="Pacientes" component={PacientesScreen}/>
        <Stack.Screen name="Citas" component={CitasScreen}/>
        <Stack.Screen name="Ajustes" component={AjustesScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}