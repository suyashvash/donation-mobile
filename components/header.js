import React from "react";
import { View, Text, StyleSheet, Image, FlatList, Dimensions } from "react-native";
import { Colors } from "../utils/colors";



export default function Header(props) {

    return(
        <View style={styles.container}>
            <View>
                <Text style={{color:'grey',fontSize:14}}>{props.subTitle}</Text>
                <Text style={{color:'black',fontSize:20}}>{props.title}</Text>
            </View>
            {props.headerRight && (props.headerRight)}
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        width:Dimensions.get('screen').width,
        padding:20,
        paddingTop:50,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        // position:'absolute',
        // top:0,
    }
})