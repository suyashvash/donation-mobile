import React,{useState,useEffect} from "react";
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, Linking, Platform, ScrollView } from "react-native";
import { width } from "../../../configs/envConfig";
import { Colors } from "../../../utils/colors";
import { getDatabase, ref, onValue, set, get,off } from 'firebase/database';

export default function VolunteerScreen({navigation,route}) {

    const campaginDetails = route.params.data

    const [volunteers,setVolunteers] = useState([])

    const db = getDatabase();

    useEffect(() => {
        getVolunteers()
        return () => {
            off(ref(db,'campaign/'+ `${campaginDetails.campaignId}`))
        }
    },[])


    const getVolunteers = () => {
        const reference = ref(db,'campaign/'+ `${campaginDetails.campaignId}/volunteers`);
        onValue(reference, (snapshot) => {
            const data = snapshot.val();
            setVolunteers(data)
        });
    }


    const renderItem = ({item}) => {
        return(
            <View style={styles.card}>
                <Image style={{width:40,height:40,borderRadius:50}} source={{uri:"https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}}/>
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.address}>{item.email}</Text>
                    <Text style={{marginTop:10}}>Donation Amount - {item.amount}</Text>
                </View>
            </View>
        )
    }

    return(
        <View style={styles.container}>
            <FlatList
                data={volunteers}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    card:{
        width:width*0.9,
        backgroundColor:'white',
        borderRadius:10,
        marginVertical:10,
        flexDirection:'row',
        alignSelf:'center',
        justifyContent:'center',
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 10,
        borderBottomColor:'lightgrey',
        borderBottomWidth:0.5,
        padding:20,
    },


    textContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'flex-start',
        paddingLeft:10
    },
    name:{
        fontSize:16,
        fontWeight:'bold',
        color:Colors.secondary
    },
    address:{
        fontSize:14,
        color:'grey'

    }
})