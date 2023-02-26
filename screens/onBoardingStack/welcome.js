import React from "react";
import { StyleSheet, Text, View ,Image,TouchableOpacity} from "react-native";
import { Colors } from "../../utils/colors";
import logoWhite from '../../assets/logo/doNationWhite.png'
import { Routes } from "../../utils/routes";


export default function WelcomeScreen({navigation}) {


    return(
        <View style={styles.container}>
            <Image source={logoWhite} style={{width: 200, height: 200}}/>
            <Text style={{color: Colors.white, fontSize: 16,marginTop:20}}>Welcome to</Text>
            <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>DoNation</Text>

            <View style={{width:'100%',marginTop: 20,justifyContent:'center',alignItems:'center',position:'absolute',bottom:80}}>

                <TouchableOpacity onPress={()=>navigation.navigate(Routes.onBoardingStack.login)} style={{width:'80%',paddingVertical:12,borderRadius:10,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                    <Text style={{color: Colors.white, fontSize: 20, fontWeight: 'bold', marginLeft: 5}}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>navigation.navigate(Routes.onBoardingStack.register)}>
                    <Text style={{color: Colors.white, fontSize: 18, marginTop: 10}}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',

    }
})