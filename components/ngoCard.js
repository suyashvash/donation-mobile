import React from "react";
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { Colors } from "../utils/colors";
import {Routes} from "../utils/routes" 
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const width = Dimensions.get('window').width;

export default function NGOCard(props) {

    const ngo = props.data

    const navigation = useNavigation()


    const onPress = () => {
        navigation.navigate(Routes.tabStack.homeStack.ngoDetails,{data:ngo})
    }
  

    return(
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Image source={{uri:props.image}} style={{width:'100%',height:'100%',borderRadius:10,position:'absolute',zIndex:-10}} />
            <LinearGradient style={{ overflow:'hidden',width: '100%', height: '100%', position: 'absolute', top: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' ,borderRadius:10}} colors={[ 'rgba(0,0,0,0.3)','transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}>
                <View style={{ width: '100%', height: '100%',  justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <View style={{width:'100%',alignItems:'flex-end',padding:10}}>
                        <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>{props.distance} KM</Text>
                    </View>
                    <View style={{width:'100%',alignItems:'flex-start',padding: 10, }}>
                        <Text style={{color:'white',fontSize:20}}>{props.name}</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{color:'white',fontSize:14,marginTop:5}}>{props.address}</Text>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width:width/2.3,
        height: 190,
        margin: 10,
        marginVertical: 10,
        borderRadius: 8,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        backgroundColor: '#fff',
        elevation: 4, // Android,
        borderColor: '#0002',
        borderWidth: 0.5,
        backgroundColor: 'lightgrey',
        borderRadius: 10,
    }
})