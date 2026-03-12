import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function ResetPasswordScreen() {
return(

<View style={styles.container}>

<Text style={styles.title}>Restablecer la contraseña</Text>

<Text style={styles.text}>
¿Cuál es tu correo electrónico, nombre o nombre de usuario?
</Text>

<TextInput style={styles.input} placeholder="Buscar"/>

<TouchableOpacity style={styles.button}>
<Text style={styles.buttonText}>Buscar</Text>
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
marginBottom:20
},

text:{
textAlign:"center",
width:"80%",
marginBottom:20
},

input:{
width:"80%",
backgroundColor:"#eee",
padding:10,
borderRadius:10,
marginBottom:20
},

button:{
backgroundColor:"#7bc4de",
padding:12,
borderRadius:20,
width:"40%",
alignItems:"center"
},

buttonText:{
color:"white"
}

});