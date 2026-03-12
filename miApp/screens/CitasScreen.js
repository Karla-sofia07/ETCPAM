import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CitasScreen(){

return(

<View style={styles.container}>

<Calendar/>

<TouchableOpacity style={styles.button}>
<Text style={styles.buttonText}>Agregar cita</Text>
</TouchableOpacity>

</View>

)
}

const styles = StyleSheet.create({

container:{
flex:1,
alignItems:"center",
justifyContent:"center",
backgroundColor:"#f2f2f2"
},

button:{
marginTop:30,
backgroundColor:"#7bc4de",
padding:15,
borderRadius:20,
width:"60%",
alignItems:"center"
},

buttonText:{
color:"white",
fontWeight:"bold"
}

})