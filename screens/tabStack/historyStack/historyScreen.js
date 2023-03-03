import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, Linking, Platform, ActivityIndicator } from "react-native";
import Header from "../../../components/header";
import { Colors } from "../../../utils/colors";
import { getDatabase, ref, onValue, set, orderByValue, orderByChild, orderByKey, orderByPriority, child, remove } from 'firebase/database';
import { getDistanceFromLatLonInKm } from "../../../configs/envConfig";
import useStore, { SelectedLocation } from "../../../src/app/useStore";
import { getFirestore ,collection, query, doc, getDoc,startAt,endAt} from "firebase/firestore";
import { Routes } from "../../../utils/routes";
import moment from "moment";


export default function HistoryScreen({navigation,route}) {


    useEffect(() => {
        getListing()
    },[donations])

    const store = useStore()


    const firestore = getFirestore();

    const [donations, setDonations] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const userRef = doc(firestore, "mobileUsers", `${store.UserId}`);

    const getListing= async() => {
        setIsLoading(true)
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            let user = docSnap.data()
            const donations = JSON.parse(user.donations)
            console.log(donations)
            setDonations(donations)
            setIsLoading(false)
        }
      }


    const renderDonations = ({item}) => {

        const percentage = (item.amount/item.totalAmount)*100


        return(
            <View  style={styles.alert}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
                    <View>
                        <Text style={styles.alertHeading}>{item.campaignName}</Text>
                        <Text style={styles.alertDetails} numberOfLines={2} ellipsizeMode='tail'>{item.campaignDescription}</Text>
                    </View>
                   
                </View>
                
                <View style={{width:'100%',marginTop:20,alignItems:'flex-start'}}>
                    <View style={{width:'90%', height:5,borderRadius:10,backgroundColor:'whitesmoke'}}/>
                    <View style={{width:`${percentage}%`, height:5,borderRadius:10,backgroundColor:Colors.primary,position:'absolute',top:0,left:0}}/>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'baseline',paddingVertical:10}}>
                        <Text style={{fontSize:18}}>Donated {item.amount}</Text>
                        <Text >/{item.totalAmount}</Text>
                    </View>
                    <Text>{moment(item.createdAt).fromNow()}</Text>
                    {
                        item.delivered ?
                        <View style={{marginTop:10,padding:2,paddingHorizontal:12,backgroundColor:'green',borderRadius:5}}>
                            <Text style={{color:'white'}}>Delivered</Text>
                        </View>
                        :
                        <View style={{marginTop:10,padding:2,paddingHorizontal:12,backgroundColor:'red',borderRadius:5}}>
                            <Text style={{color:'white'}}>Not Recevied Yet</Text>
                        </View>
                    }
                   
                </View>  
            </View>
        )
    }


    return(
        <View style={styles.container}>
            <Header title='Donations' subTitle='My,' />
            <View style={styles.board}>
                {
                    !isLoading ?

                        donations?.length > 0 ?
                            <FlatList
                            data={donations}
                            renderItem={renderDonations}
                            keyExtractor={item => item.campaignId}
                            contentContainerStyle={{paddingBottom:80}}
                        />
                        :
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:18,color:'grey'}}>No Donations right now!</Text>
                        </View>
                    :
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <ActivityIndicator size='large' color={Colors.primary} />
                    </View>
                }
               
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'flex-start',
        alignItems:'center'
    },
    board:{
        width:Dimensions.get('screen').width,
        height:Dimensions.get('screen').height*0.8,
        backgroundColor:'white',
        padding:10,
        borderTopLeftRadius:40,
        borderTopRightRadius:40,
        // borderColor:'lightgrey',
        // borderWidth:1,
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 10,
    },
    alert:{
        width:'100%',
        padding:10,
        backgroundColor:'white',
        borderBottomColor:'lightgrey',
        borderBottomWidth:1,
        paddingVertical:20
    },
    alertHeading:{
        color:'black',
        fontSize:16,

    },
    alertDetails:{
        color:'grey',
        fontSize:14,
        marginTop:5,
    }
})
