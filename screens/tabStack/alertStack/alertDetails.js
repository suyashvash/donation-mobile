import { LinearGradient } from "expo-linear-gradient";
import React,{useEffect, useState} from "react";
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, Linking, Platform, ScrollView } from "react-native";
import { width } from "../../../configs/envConfig";
import { Colors } from "../../../utils/colors";
import { Routes } from "../../../utils/routes";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase, ref, onValue, set, get,off } from 'firebase/database';


export default function CampaginDetailScreen({navigation,route}) {

    useEffect(() => {
        getStatus()
        return () => {
            off(ref(db,'campaign/'+ `${campaginDetails.campaignId}/amountRec`))
        }
    },[])

    useEffect(() => {
        getVolunteers()
        return () => {
            off(ref(db,'campaign/'+ `${campaginDetails.campaignId}/volunteers`))
        }
    },[])

    const db = getDatabase();

    const [amountRec,setAmountRec] = useState(0)
    const [volunteers,setVolunteers] = useState([])

    const ngoDetails = route.params.data.ngo
    const campaginDetails = route.params.data

    const percentage = (amountRec/campaginDetails.totalAmount)*100

    const getVolunteers = () => {
        const reference = ref(db,'campaign/'+ `${campaginDetails.campaignId}/volunteers`);
        onValue(reference, (snapshot) => {
            const data = snapshot.val();
            if(data){
                const filtered = data.filter(item=>item.delivered===true)
                setVolunteers(filtered)
            }else{
                setVolunteers([])
            }
         
        });
    }


    const getStatus = () => {
        const reference = ref(db,'campaign/'+ `${campaginDetails.campaignId}/amountRec`);
        onValue(reference, (snapshot) => {
            const data = snapshot.val();
            setAmountRec(data)
        });
    }

    const onpenMaps = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${ngoDetails.lat},${ngoDetails.long}`;
        const label = `${ngoDetails.name}`;
        const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
        });

            
        Linking.openURL(url);
    }

    const openEmail = () => {
        Linking.openURL(`mailto:${ngoDetails.email}`)
    }


    const donate = () => {
        navigation.navigate(Routes.tabStack.alertStack.donateScreen,{data:campaginDetails})
    }

    const viewVolunteers=()=>{
        navigation.navigate(Routes.tabStack.alertStack.volunteerScreen,{data:campaginDetails})
    }

    return(
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{paddingBottom:50}}>
            <View style={{width:width,height:280,backgroundColor:'black',}}>
                <Image resizeMode='cover' source={{uri:ngoDetails.image}} style={{width:'100%',height:'100%'}} />
            </View>
            <LinearGradient colors={['transparent','black']} style={{width:width,height:280,position:'absolute',top:0,left:0,justifyContent:'flex-end',paddingLeft:10}}>
                <Text style={[styles.heading,{color:'white',fontSize:20}]}>{campaginDetails.title}</Text>
                <Text style={[styles.details,{color:'white'}]}>Hosted By - {ngoDetails.name}</Text>
            </LinearGradient>

            <View style={{width:width,padding:15,justifyContent:'center',alignItems:'flex-start'}}>
                <Text style={styles.heading}>Status</Text>
                <Text style={styles.details}>{percentage}% Done | {volunteers.length} People Donated</Text>
                <View style={{width:'100%',marginVertical:10}}>
                    <View style={{width:'90%', height:5,borderRadius:10,backgroundColor:'whitesmoke'}}/>
                    <View style={{width:`${percentage}%`, height:5,borderRadius:10,backgroundColor:Colors.primary,position:'absolute',top:0,left:0}}/>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'baseline',paddingVertical:10}}>
                        <Text style={{fontSize:22}}>{amountRec}</Text>
                        <Text >/{campaginDetails.totalAmount}</Text>
                    </View>
                </View>  

                {
                    percentage != 100  &&
                    <TouchableOpacity onPress={donate} style={{paddingVertical:12,paddingHorizontal:15,borderRadius:8,marginVertical:10,justifyContent:'center',alignItems:'center',backgroundColor:Colors.primary,marginBottom:30}} >
                        <Text style={{color: Colors.white, fontSize: 16, fontWeight: 'bold', marginLeft: 5}}>Donate Now !</Text>
                    </TouchableOpacity>
                }

              

                <Text style={styles.heading}>Campaign Description</Text>
                <Text style={styles.details}>{campaginDetails.description}</Text>

                <TouchableOpacity disabled={volunteers.length==0} onPress={viewVolunteers} style={{ width:'100%',marginTop:10, flexDirection: 'row', justifyContent: 'space-between',alignItems:'center' }}>
                    <View style={{width:'80%'}}>
                        <Text style={styles.heading}>Campaign Volunteers</Text>
                        <Text style={styles.details}>{volunteers.length} People Donated</Text>
                    </View>
                    <AntDesign name="right" size={20} color={Colors.secondary} />
                </TouchableOpacity>

                <Text style={styles.heading}>Address</Text>
                <Text style={styles.details}>{ngoDetails.address}</Text>


                <Text style={styles.heading}>Distance</Text>
                <Text style={styles.details}>{campaginDetails.distance} KM</Text>


                <TouchableOpacity onPress={openEmail} style={{ width:'100%', flexDirection: 'row', justifyContent: 'space-between',alignItems:'center' }}>
                    <View style={{width:'80%'}}>
                        <Text style={styles.heading}>Contact</Text>
                        <Text style={styles.details}>Open Email</Text>
                    </View>
                    <AntDesign name="right" size={20} color={Colors.secondary} />
                </TouchableOpacity>

                <TouchableOpacity onPress={onpenMaps} style={{ paddingBottom: 15,width:'100%', flexDirection: 'row', justifyContent: 'space-between',alignItems:'center' }}>
                    <View style={{width:'80%'}}>
                        <Text style={styles.heading}>Location</Text>
                        <Text style={styles.details}>Open Maps</Text>
                    </View>
                    <AntDesign name="right" size={20} color={Colors.secondary} />
                </TouchableOpacity>


               
            </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 2,
        color: Colors.secondary
    },
    details: {
        fontSize: 15,
        marginBottom: 15,
        color: 'grey',
        width:'85%'
    },
})