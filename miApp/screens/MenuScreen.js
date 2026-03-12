import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function MenuScreen(){

return(

<View style={styles.container}>

<Text style={styles.title}>MENÚ PRINCIPAL</Text>

<TouchableOpacity style={styles.button}>
<Text style={styles.buttonText}>Mi perfil</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.button}>
<Text style={styles.buttonText}>Pacientes</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.button}>
<Text style={styles.buttonText}>Citas</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.button}>
<Text style={styles.buttonText}>Ajustes</Text>
</TouchableOpacity>

</View>

)
}

const styles = StyleSheet.create({

container:{
flex:1,
justifyContent:"center",
alignItems:"center",
backgroundColor:"#f2f2f2"
},

title:{
fontSize:18,
fontWeight:"bold",
marginBottom:40
},

button:{
backgroundColor:"#7bc4de",
width:"70%",
padding:15,
borderRadius:10,
marginBottom:15,
alignItems:"center"
},

buttonText:{
color:"white",
fontWeight:"bold"
}

});