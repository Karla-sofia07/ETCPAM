import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function LoginScreen({navigation}) {
  return (
    <View style={styles.container}>

      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.subtitle}>Ingresa tus datos</Text>

      <Text>Correo Electrónico</Text>
      <TextInput style={styles.input}/>

      <Text>Contraseña</Text>
      <TextInput style={styles.input} secureTextEntry/>

      <TouchableOpacity onPress={()=>navigation.navigate("ResetPassword")}>
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}
      onPress={()=>navigation.navigate("Menu")}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
container:{
flex:1,
backgroundColor:"#f2f2f2",
alignItems:"center",
justifyContent:"center"
},

logo:{
width:200,
height:80,
resizeMode:"contain",
marginBottom:40
},

subtitle:{
marginBottom:20,
fontSize:16
},

input:{
width:"80%",
backgroundColor:"#d6edf5",
padding:10,
borderRadius:10,
marginBottom:15
},

link:{
color:"#2b8cff",
marginBottom:40
},

button:{
backgroundColor:"#7bc4de",
padding:15,
borderRadius:30,
width:"60%",
alignItems:"center"
},

buttonText:{
color:"white",
fontWeight:"bold"
}

});