import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect,useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, Linking, Platform, ActivityIndicator } from "react-native";
import Header from "../../../components/header";
import { Colors } from "../../../utils/colors";
import { getDatabase, ref, onValue, set, orderByValue, orderByChild, orderByKey, orderByPriority, child, remove } from 'firebase/database';
import { getDistanceFromLatLonInKm } from "../../../configs/envConfig";
import useStore, { SelectedLocation } from "../../../src/app/useStore";
import { doc, getDoc ,getFirestore} from "firebase/firestore";
import { Routes } from "../../../utils/routes";
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { BottomSheet } from "../../../components/bottomSheet";

export default function AlertBoardScreen({navigation,route}) {


    useEffect(() => {
        getListing()
    },[])

    const bottomSheetRef = React.useRef(null);

    const radiusList =[
      {id:1,value:10},
      {id:2,value:20},
      {id:3,value:30},
      {id:4,value:40},
      {id:5,value:50},
      {id:6,value:60},
    ]
  
    const taglist =[
      {id:1,value:"disaster",text:"Disaster"},
      {id:2,value:"education",text:"Education"},
      {id:3,value:"health",text:"Health"},
      {id:4,value:'children',text:'Children'},
      {id:5,value:'women',text:'Women'},
      {id:6,value:'animals',text:'Animals'},
    ]
  
    const [tags,setTags] = useState([])
    const [radius,setRadius] = useState(10)

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
                const ngoRef = doc(firestore, "ngo", `${camp.ngoUID}`);
                const docSnap = await getDoc(ngoRef);
                if (docSnap.exists()) {

                    let ngo = docSnap.data()
            
                    let distance = getDistanceFromLatLonInKm(selectedLocation.latitude,selectedLocation.longitude,ngo.lat,ngo.long)

                    if(distance <= radius){

                        if(tags.length > 0){
                            let temp = tags.filter((tag) => ngo.tag.includes(tag))
                            if(temp.length > 0){
                                let tempData = camp
                                tempData.ngo = ngo
                                tempData.distance = Math.round(distance)
                                listings.push(tempData)

                                const ordered=  listings.sort((a, b) => parseFloat(b.distance) < parseFloat(a.distance));
                                setAlertList(ordered)
                                setIsLoading(false)
                            }else{
                                setAlertList([])
                                setIsLoading(false)
                            }
                        }else{
                            let tempData = camp
                            tempData.ngo = ngo
                            tempData.distance = Math.round(distance)
                            listings.push(tempData)
    
                            const ordered=  listings.sort((a, b) => parseFloat(b.distance) < parseFloat(a.distance));
                            setAlertList(ordered)
                            setIsLoading(false)
                        }
                        
                      

                    }
                  } else {
                    setIsLoading(false)
                    // doc.data() will be undefined in this case
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

    const openFilter = () => {
        bottomSheetRef.current.open()
      }
    
      const selectFilter = (value) => {
        setRadius(value)
        // bottomSheetRef.current.close()
        // getNGOList(coordinates,undefined,value)
      }
    
      const selectTag = (value) => {
        let valueNew = value.toLowerCase()
        let tempGen = [...tags];
        if( tempGen.indexOf(valueNew) === -1){
            tempGen.push(valueNew)
            setTags(tempGen)
        }else{
            tempGen.splice(tempGen.indexOf(valueNew),1)
            setTags(tempGen)
        }
    
      }
    
      const applyFilter = () => {
        bottomSheetRef.current.close()
        getListing()
      }


    return(
        <View style={styles.container}>
            <Header title='Alert Board' subTitle='Latest,'  headerRight={(
                  <TouchableOpacity onPress={openFilter}>
                    <MaterialIcons name="filter-list" size={28} color={Colors.secondary} />
                  </TouchableOpacity>
                )}/>
            <View style={styles.board}>
                {selectedLocation!==null?
                    !isLoading ?
                        alertList &&
                        <>
                            <FlatList
                            data={alertList}
                            renderItem={renderAlerts}
                            keyExtractor={item => item.campaignId}
                            ListEmptyComponent={
                                <View style={{flex:1,height:500,justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{fontSize:18,color:'grey'}}>No campaigns right now!</Text>
                                </View>
                            }
                            contentContainerStyle={{paddingBottom:80}}
                        />
                        <BottomSheet ref={bottomSheetRef} height={Dimensions.get('screen').height*0.6} heading='Filter' >
                            <View style={{justifyContent:'flex-start',alignItems:'flex-start',padding:10}}>
                            <Text style={styles.heading}>Select Radius</Text>
                            <View style={{width:'100%',flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:10,flexWrap:'wrap',marginBottom:30}}>
                                {
                                radiusList.map((item)=>(
                                    <TouchableOpacity onPress={()=>selectFilter(item.value)} key={item.id} style={{padding:5,borderRadius:20,borderColor:Colors.primary,borderWidth:1,paddingHorizontal:20,backgroundColor:radius==item.value?Colors.primary:'white',margin:8,marginLeft:0}}>
                                    <Text style={{color:radius==item.value?'white':'black'}}>{item.value} KM</Text>
                                    </TouchableOpacity>
                                ))
                                }
                            </View>
                            <Text style={styles.heading}>Select Tags</Text>
                            <View style={{width:'100%',flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:10,flexWrap:'wrap',marginBottom:30}}>
                                {
                                taglist.map((item)=>(
                                    <TouchableOpacity onPress={()=>selectTag(item.value)} key={item.id} style={{padding:5,borderRadius:20,borderColor:Colors.primary,borderWidth:1,paddingHorizontal:20,backgroundColor:tags.includes(item.value)?Colors.primary:'white',margin:5}}>
                                    <Text style={{color:tags.includes(item.value)?'white':'black'}}>{item.text}</Text>
                                    </TouchableOpacity>
                                ))
                                }
                            </View>

                            <TouchableOpacity onPress={applyFilter} style={{width:'100%',paddingVertical:12,paddingHorizontal:15,borderRadius:8,marginVertical:10,justifyContent:'center',alignItems:'center',backgroundColor:Colors.primary,marginBottom:30}} >
                                <Text style={{color: Colors.white, fontSize: 16, fontWeight: 'bold', marginLeft: 5}}>Submit</Text>
                            </TouchableOpacity>

                            </View>

                        </BottomSheet>
                        </>

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
        shadowColor:Platform.OS=='ios'?'grey': 'black',
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
