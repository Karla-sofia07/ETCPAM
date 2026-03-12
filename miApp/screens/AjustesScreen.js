import { View, Text, Switch, StyleSheet } from "react-native";
import { useState } from "react";

export default function AjustesScreen(){

const [darkMode,setDarkMode]=useState(false)

return(

<View style={styles.container}>

<View style={styles.card}>
<Text style={styles.title}>General</Text>

<View style={styles.row}>
<Text>Modo oscuro</Text>
<Switch
value={darkMode}
onValueChange={setDarkMode}
/>
</View>

</View>

<View style={styles.card}>
<Text style={styles.title}>Accesibilidad</Text>

<View style={styles.row}>
<Text>Tamaño de fuente</Text>
<Text>Pequeña</Text>
</View>

</View>

</View>

)
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#f2f2f2",
padding:30
},

card:{
backgroundColor:"#e9dfd2",
padding:20,
borderRadius:20,
marginBottom:20
},

title:{
fontWeight:"bold",
marginBottom:10
},

row:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
}

})