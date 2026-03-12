import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function PacientesScreen(){

return(

<View style={styles.container}>

<TextInput
placeholder="Buscar"
style={styles.search}
/>

<View style={styles.table}>

<View style={styles.rowHeader}>
<Text style={styles.header}>Nombre</Text>
<Text style={styles.header}>Edad</Text>
</View>

<View style={styles.row}>
<Text>Juan Pérez</Text>
<Text>45</Text>
</View>

<View style={styles.row}>
<Text>María López</Text>
<Text>30</Text>
</View>

<View style={styles.row}>
<Text>Carlos Hernández</Text>
<Text>60</Text>
</View>

</View>

<TouchableOpacity style={styles.button}>
<Text style={styles.buttonText}>Agregar paciente</Text>
</TouchableOpacity>

</View>

)
}

const styles = StyleSheet.create({

container:{
flex:1,
alignItems:"center",
backgroundColor:"#f2f2f2",
paddingTop:80
},

search:{
width:"80%",
borderWidth:1,
borderRadius:20,
padding:10,
marginBottom:20
},

table:{
width:"80%",
borderWidth:1
},

rowHeader:{
flexDirection:"row",
justifyContent:"space-between",
backgroundColor:"#3f8fc1",
padding:10
},

header:{
color:"white",
fontWeight:"bold"
},

row:{
flexDirection:"row",
justifyContent:"space-between",
padding:10,
borderTopWidth:1
},

button:{
marginTop:40,
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