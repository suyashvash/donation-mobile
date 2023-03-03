import { LinearGradient } from "expo-linear-gradient";
import React,{useState} from "react";
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, Linking, Platform } from "react-native";
import { width } from "../../../configs/envConfig";
import { Colors } from "../../../utils/colors";
import { Routes } from "../../../utils/routes";
import AntDesign from 'react-native-vector-icons/AntDesign';


export default function NgoDetailsScreen({navigation,route}) {

    const ngoDetails = route.params.data


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

    return(
        <View style={styles.container}>
            <View style={{width:width,height:280,backgroundColor:'black',}}>
                <Image resizeMode='cover' source={{uri:ngoDetails.image}} style={{width:'100%',height:'100%'}} />
            </View>
            <View style={{width:width,padding:15,justifyContent:'center',alignItems:'flex-start'}}>
                <Text style={styles.heading}>Name</Text>
                <Text style={styles.details}>{ngoDetails.name}</Text>

                <Text style={styles.heading}>Description</Text>
                <Text style={styles.details}>{ngoDetails.address}</Text>

                <Text style={styles.heading}>Distance</Text>
                <Text style={styles.details}>{ngoDetails.distance} KM</Text>


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