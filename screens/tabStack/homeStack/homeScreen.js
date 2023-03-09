import React,{useState,useEffect} from "react"
import { View, Text ,StyleSheet,Image,FlatList, Dimensions, TextInput, ActivityIndicator, TouchableOpacity, Alert} from "react-native"
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
import { BottomSheet } from "../../../components/bottomSheet"

export default function HomeScreen() {

  useEffect(() => {
    getUserCordinates()
  },[])

  const db = getFirestore();
  const dispatch = useDispatch()

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

  const width = Dimensions.get('window').width;
  const [ngoList,setNgoList] = useState(null)
  const [loading,setLoading] = useState(false)
  const [coordinates,setCoordinates] = useState(null)
  const [search,setSearch] = useState(null)
  const [radius,setRadius] = useState(10)

  const getNGOList = async(myCords,name) => {
    if(myCords == null){
      Alert.alert('Location',"Please enable location")
      return;
    }
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
  
      let distance = getDistanceFromLatLonInKm(myCords.latitude,myCords.longitude,doc.data().lat,doc.data().long)
      if(distance <= radius ){
        if(tags.length > 0){
          console.warn(tags)
          let tag = doc.data().tag
          let flag = false
          for(let i=0;i<tags.length;i++){
            if(tag.includes(tags[i])){
              flag = true
            }
          }
          if(flag){
            let tempData = doc.data()
            tempData.distance = Math.round(distance)
            temp.push(tempData)
          }
        }else{
          let tempData = doc.data()
          tempData.distance = Math.round(distance)
          temp.push(tempData)
        }

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
      getNGOList(locationObject,undefined)
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
    getNGOList(coordinates,undefined)
  }

  return (
    !loading ?
     ngoList!==null?
      <View style={styles.container}>
      
        <FlatList
          data={ngoList}
          ListHeaderComponent={
            <>
              <Header title='Suyash' subTitle='Hello,'
                headerRight={(
                  <TouchableOpacity onPress={openFilter}>
                    <MaterialIcons name="filter-list" size={28} color={Colors.secondary} />
                  </TouchableOpacity>
                )}
              
              />
              <View style={{width:Dimensions.get('screen').width,padding:10,justifyContent:'center',alignItems:'center'}}>
                <View style={[{width:'95%',padding:10,backgroundColor:'white',flexDirection:'row',borderRadius:8},envConfig.shadow]}>
                    <MaterialIcons name="search" size={24} color="grey" />
                    <TextInput onEndEditing={(e)=>searchNGO(e.nativeEvent.text)} placeholder="Search" style={{marginLeft:10,fontSize:16,width:'80%'}} />
                </View>
              </View>
              <View style={{width:Dimensions.get('screen').width,padding:10,paddingHorizontal:20,justifyContent:'center',alignItems:'flex-start'}}>
                <Text style={{fontSize:18,fontWeight:'bold'}}>NGO In {radius} KM</Text>
              </View>
            </>
          }
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.uid}
          renderItem={renderNGO}
          ListEmptyComponent={
            <View style={{height:500, justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:18,width:width,textAlign:'center'}}>No NGO Found</Text>
            </View>
          }
          horizontal={false} numColumns={2}
          contentContainerStyle={ngoList?.length==1 ? { width: width,alignItems:'flex-start'} : { width: width,alignItems:'flex-start' }}
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
                <Text style={{fontSize:18,width:width*0.8,textAlign:'center'}}>Can't connect to network !</Text>
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
    },
    heading: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 2,
      color: Colors.secondary
  },

})