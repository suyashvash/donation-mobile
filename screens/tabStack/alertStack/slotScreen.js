import React, {useState}from "react";
import { View,Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, TextInput} from "react-native";
import { Colors } from "../../../utils/colors"; 



export default function SlotScreen({navigation,route}) {


    const [selectDate, setselectDate]= useState(1)
    const [selectTime, setselectTime]= useState(1)


const dates = [{date:1, day:"MON"},{date:2, day:"TUE"},{date:3, day:"WED"},{date:4, day:"THUR"},{date:5, day:"FRI"},{date:6, day:"SAT"},{date:7, day:"SUN"}]
const timeslot = [{id:1, text: "10 am to 12 pm"},{id:2, text: "12 pm to 1 pm"},{id:6, text: "1 pm to 2 pm"},{id:3, text: "1 pm to 2 pm"},{id:4, text: "2 pm to 3 pm"}]




    const DateBox =(props)=>{

        return(
            <TouchableOpacity onPress={()=>{setselectDate(props.date)}} style={ selectDate==props.date?styles.dateBoxSelected: styles.dateBox}>
                    <Text style={{fontSize:12, color: selectDate==props.date?"white":"black"}}>{props.day}</Text>
                    <Text style={{fontSize:22, color: selectDate==props.date?"white":"black"}}>{props.date}</Text>

                </TouchableOpacity>
        )
    }

    const TimeBox =(props)=>{


        return(
            <TouchableOpacity onPress={()=>{setselectTime(props.id)}}style={selectTime==props.id?styles.timeBoxSelected: styles.timeBox}>
                <Text style={{width:"100%", textAlign:"center",color:selectTime==props.id?"white": "black"}}>{props.time}</Text>
            </TouchableOpacity>
        )
    }


    return (
        <View style={styles.container}>
            <ScrollView>
            <Text style={styles.heading}>Select Date</Text>
            <ScrollView horizontal={true} contentContainerStyle={{padding:10, paddingTop:0}}>
                {
                    dates.map((item, index)=>(
                        <DateBox key={index} date={item.date} day={item.day}/>
                    ))
                }

            </ScrollView>

            <Text style={styles.heading}>Select Time</Text>
            <View style={styles.timeHolder}>
                {
                    timeslot.map((item, index)=>(
                      <TimeBox time={item.text} id={item.id} key={index}/>  
                    ))
                }
            </View>
            <Text style={styles.heading}>
                Enter Address
            </Text>
            <TextInput style={styles.input} placeholder="Your Address"/>
            <Text style={styles.heading}>Enter Amount</Text>
            <TextInput style={styles.input} placeholder="Your Amount"/>

            <TouchableOpacity style={{backgroundColor: Colors.primary, padding:10, width: "100%", borderRadius: 10,paddingVertical:20,marginBottom:60}}>
                <Text style={{width:"100%",textAlign: "center", fontSize:18, fontWeight: "bold"}}>Submit</Text>
            </TouchableOpacity>
    </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start"   ,
        backgroundColor: "white",
        padding: 10,

     },
     heading: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 2,
        padding: 10,
        color: Colors.secondary
    },
    details: {
        fontSize: 15,
        marginBottom: 15,
        color: 'grey',
        width:'85%'
    },
    dateBox:{
        width: 70,
        height: 70,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:'whitesmoke',
        borderRadius: 5,
        margin: 10,
    },
    input:{
        width:'90%',
        backgroundColor:'white',
        padding:10,
        paddingLeft:0,
        borderBottomColor:'grey',
        borderBottomWidth:1,
        paddingHorizontal:20,
        fontSize:16,
        padding: 10,
        marginBottom: 30,
        marginLeft:10
    },
    timeHolder:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        width: "90%",
    },
    timeBox:{
        backgroundColor: "whitesmoke",
        borderRadius: 50,
        margin: 5,
        width: "45%",
        padding: 10,

    },
    dateBoxSelected:{
        backgroundColor:Colors.primary,
        width: 70,
        height: 70,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5,
        margin: 10,

    },
    timeBoxSelected:{
        backgroundColor: Colors.primary,
        borderRadius: 50,
        margin: 5,
        width: "45%",
        padding: 10,

    }
})