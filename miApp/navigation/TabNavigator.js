import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import PacientesScreen from "../screens/PacientesScreen";
import CitasScreen from "../screens/CitasScreen";
import AjustesScreen from "../screens/AjustesScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {

  return (
    <Tab.Navigator>

      <Tab.Screen
        name="Pacientes"
        component={PacientesScreen}
      />

      <Tab.Screen
        name="Citas"
        component={CitasScreen}
      />

      <Tab.Screen
        name="Ajustes"
        component={AjustesScreen}
      />

    </Tab.Navigator>
  );
}