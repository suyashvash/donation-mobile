import React,{useState,useEffect} from "react"
import { View, Text ,StyleSheet,Image,FlatList, Dimensions, TextInput, ActivityIndicator} from "react-native"
import Header from "../../../components/header"
import { envConfig } from "../../../src/config/envConfig"
import { Colors } from "../../../utils/colors"
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { homeListing } from "../../../utils/dummyData/homeListing"
import NGOCard from "../../../components/ngoCard"
import { getFirestore ,collection, query, where, getDocs,startAt,endAt} from "firebase/firestore";
import * as Location from 'expo-location';
import { setSelectedLocation } from "../../../src/features/userSlice"
import { useDispatch } from "react-redux"

export default function HomeScreen() {

  useEffect(() => {
    getUserCordinates()
  },[])

  const db = getFirestore();
  const dispatch = useDispatch()

  const width = Dimensions.get('window').width;
  const [ngoList,setNgoList] = useState(null)
  const [loading,setLoading] = useState(false)
  const [coordinates,setCoordinates] = useState(null)
  const [search,setSearch] = useState(null)

  const getNGOList = async(myCords,name) => {
    setLoading(true)
    let temp = []
    let ref;
    if(name){
      ref = query(collection(db, "ngo"), where("name", "==", name))
    }else{
      ref = query(collection(db, "ngo"))
    }
    const querySnapshot = await getDocs(ref)
    querySnapshot.forEach((doc) => {
      console.warn(doc.data())
      let distance = getDistanceFromLatLonInKm(myCords.latitude,myCords.longitude,doc.data().lat,doc.data().long)
      if(distance <= 15){
        let tempData = doc.data()
        tempData.distance = Math.round(distance)
        temp.push(tempData)
      }
      // else{
      //   console.warn(distance)
      // }
    })
    //console.warn(temp)
    const ordered=  temp.sort((a, b) => parseFloat(b.distance) < parseFloat(a.distance));
    setNgoList(ordered)
    setLoading(false)
  }



  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Earth's radius in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance;
  }
  
  function deg2rad(degrees) {
    return degrees * (Math.PI/180);
  }

  const getUserCordinates = async () => {
    (async () => {
      setLoading(true)
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false)
        console.warn('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      if(!location){
        setLoading(false)
        return;
      }
      const locationObject = { latitude: location.coords.latitude, longitude: location.coords.longitude }

      dispatch(setSelectedLocation({selectedLocation:locationObject}))
      setCoordinates(locationObject)
      getNGOList(locationObject)
    })();
  }


  const searchNGO = (name) => {
   
    getNGOList(coordinates,name)
    setSearch(name)
  }


  const renderNGO = ({item}) => {
    return(
      <NGOCard 
        name={item.name}
        address={item.address}
        distance={item.distance}
        image={item.image}
        id={item.id}
        data={item}
      />
    )

  }



  return (
    !loading ?
     ngoList?.length > 0 ?
      <View style={styles.container}>
      
        <FlatList
          data={ngoList}
          ListHeaderComponent={
            <>
              <Header title='Suyash' subTitle='Hello,'/>
              <View style={{width:Dimensions.get('screen').width,padding:10,justifyContent:'center',alignItems:'center'}}>
                <View style={[{width:'95%',padding:10,backgroundColor:'white',flexDirection:'row',borderRadius:8},envConfig.shadow]}>
                    <MaterialIcons name="search" size={24} color="grey" />
                    <TextInput onEndEditing={(e)=>searchNGO(e.nativeEvent.text)} placeholder="Search" style={{marginLeft:10,fontSize:16,width:'80%'}} />
                </View>
              </View>
              <View style={{width:Dimensions.get('screen').width,padding:10,paddingHorizontal:20,justifyContent:'center',alignItems:'flex-start'}}>
                <Text style={{fontSize:18,fontWeight:'bold'}}>NGO Near You</Text>
              </View>
            </>
          }
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.uid}
          renderItem={renderNGO}
          horizontal={false} numColumns={2}
          contentContainerStyle={ngoList?.length==1 ? { width: width,alignItems:'flex-start'} : { width: width,alignItems:'flex-start' }}
          />
    
      </View>
      :
      <View style={{flex:1,justifyContent:'flex-start',alignItems:'center',backgroundColor:'white'}}>
            <Header title='Suyash' subTitle='Hello,'/>
            <View style={{width:Dimensions.get('screen').width,padding:10,justifyContent:'center',alignItems:'center'}}>
              <View style={[{width:'95%',padding:10,backgroundColor:'whitesmoke',flexDirection:'row',borderRadius:8},envConfig.shadow]}>
                  <MaterialIcons name="search" size={24} color="grey" />
              </View>
            </View>
            <View style={{width:Dimensions.get('screen').width,padding:10,paddingHorizontal:20,justifyContent:'center',alignItems:'flex-start'}}>
              <Text style={{fontSize:18,fontWeight:'bold'}}>NGO Near You !</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:18,width:width*0.8,textAlign:'center'}}>No NGO Found Under 10KM Radius with name {search}</Text>
            </View>
     
    </View>

    :
    <View style={{flex:1,justifyContent:'flex-start',alignItems:'center',backgroundColor:'white'}}>
          <Header title='Suyash' subTitle='Hello,'/>
            <View style={{width:Dimensions.get('screen').width,padding:10,justifyContent:'center',alignItems:'center'}}>
              <View style={[{width:'95%',padding:10,backgroundColor:'whitesmoke',flexDirection:'row',borderRadius:8},envConfig.shadow]}>
                  <MaterialIcons name="search" size={24} color="grey" />
              </View>
            </View>
            <View style={{width:Dimensions.get('screen').width,padding:10,paddingHorizontal:20,justifyContent:'center',alignItems:'flex-start'}}>
              <Text style={{fontSize:18,fontWeight:'bold'}}>NGO Near You</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
     
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'flex-start',
    }

})