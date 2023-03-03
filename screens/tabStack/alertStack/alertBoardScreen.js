import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, Linking, Platform, ActivityIndicator } from "react-native";
import Header from "../../../components/header";
import { Colors } from "../../../utils/colors";
import { getDatabase, ref, onValue, set, orderByValue, orderByChild, orderByKey, orderByPriority, child, remove } from 'firebase/database';
import { getDistanceFromLatLonInKm } from "../../../configs/envConfig";
import useStore, { SelectedLocation } from "../../../src/app/useStore";
import { doc, getDoc ,getFirestore} from "firebase/firestore";
import { Routes } from "../../../utils/routes";


export default function AlertBoardScreen({navigation,route}) {


    useEffect(() => {
        getListing()
    },[])

    const db = getDatabase();
    const firestore = getFirestore();
    const selectedLocation = SelectedLocation()

    const [alertList, setAlertList] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const getListing= async() => {
        if(selectedLocation==null){
            return
        }

        setIsLoading(true)
        const reference = ref(db,'campaign/');
        onValue(reference, (snapshot) => {
        let listings=[]
        if(snapshot.val()){
            const values = Object.values(snapshot.val())
            values.forEach(async(camp,index) => {
                console.log(camp.ngoUID)
                const ngoRef = doc(firestore, "ngo", `${camp.ngoUID}`);
                const docSnap = await getDoc(ngoRef);
                if (docSnap.exists()) {

                    let ngo = docSnap.data()
            
                    let distance = getDistanceFromLatLonInKm(selectedLocation.latitude,selectedLocation.longitude,ngo.lat,ngo.long)

                    if(distance <= 10){
                        let tempData = camp
                        tempData.ngo = ngo
                        tempData.distance = Math.round(distance)
                        listings.push(tempData)

                        const ordered=  listings.sort((a, b) => parseFloat(b.distance) < parseFloat(a.distance));
                        setAlertList(ordered)
                        setIsLoading(false)

                    }
                  } else {
                    setIsLoading(false)
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                  }

                
            })
        }else{
            setIsLoading(false)
        }


 
        });
      }


    const renderAlerts = ({item}) => {

        const percentage = (item.amountRec/item.totalAmount)*100

        const openDetails = () => {
            navigation.navigate(Routes.tabStack.alertStack.campgainDetails,{data:item})
        }

        return(
            <TouchableOpacity onPress={openDetails} style={styles.alert}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
                    <View>
                        <Text style={styles.alertHeading}>{item.title}</Text>
                        <Text style={[styles.alertDetails]} numberOfLines={2} ellipsizeMode='tail'>{item.description}</Text>
                        <Text style={{fontSize:16,marginTop:10}}>{item.distance} KM away</Text>
                    </View>
                    

                </View>
                
                <View style={{width:'100%',marginTop:20}}>
                    <View style={{width:'90%', height:5,borderRadius:10,backgroundColor:'whitesmoke'}}/>
                    <View style={{width:`${percentage}%`, height:5,borderRadius:10,backgroundColor:Colors.primary,position:'absolute',top:0,left:0}}/>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'baseline',paddingVertical:10}}>
                        <Text style={{fontSize:22}}>{item.amountRec}</Text>
                        <Text >/{item.totalAmount}</Text>
                    </View>
                </View>  
            </TouchableOpacity>
        )
    }


    return(
        <View style={styles.container}>
            <Header title='Alert Board' subTitle='Latest,' />
            <View style={styles.board}>
                {selectedLocation!==null?
                    !isLoading ?

                        alertList?.length > 0 ?
                            <FlatList
                            data={alertList}
                            renderItem={renderAlerts}
                            keyExtractor={item => item.campaignId}
                            contentContainerStyle={{paddingBottom:80}}
                        />
                        :
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:18,color:'grey'}}>No campaigns right now!</Text>
                        </View>
                    :
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <ActivityIndicator size='large' color={Colors.primary} />
                    </View>
                    :
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:18,color:'grey'}}>Unable to get your location</Text>
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
        color:Colors.secondary,
        fontSize:16,
        fontWeight:'bold',
    },
    alertDetails:{
        color:'grey',
 
        fontSize:14,
        marginTop:5,
    }
})
