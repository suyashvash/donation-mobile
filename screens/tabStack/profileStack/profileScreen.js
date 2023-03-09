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
import { setUserLogOutState } from "../../../src/features/userSlice";
import { useDispatch } from "react-redux";
import { getAuth, signOut } from "firebase/auth";
import { LoadingModal } from "react-native-loading-modal";



export default function ProfileScreen({navigation,route}) {


    useEffect(() => {
        getProfile()
    },[])

    const store = useStore()
    const auth = getAuth();
    const dispatch = useDispatch()


    const firestore = getFirestore();

    const [profile, setProfile] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);

    const userRef = doc(firestore, "mobileUsers", `${store.UserId}`);

    const getProfile= async() => {
        setIsLoading(true)
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            let user = docSnap.data()
            setProfile(user)
            setIsLoading(false)
        }else{
            setProfile(null)
            setIsLoading(false)
        }
      }

      const logout = () => {
        setModalVisible(true)
        signOut(auth).then(() => {
            dispatch(setUserLogOutState())
            setModalVisible(false)
            navigation.replace(Routes.onBoardingStack.tag)
        })
       
      }


    return(
        <View style={styles.container}>
            <LoadingModal modalVisible={modalVisible} />
            <Header title='Profile' subTitle='My,' />
            <View style={styles.board}>
                {
                    !isLoading ?

                        profile!=null? 
                        <View style={{flex:1,justifyContent:'flex-start',alignItems:'flex-start',padding:10}}>
                              <Text style={styles.heading}>Name</Text>
                              <Text style={styles.details}>{profile.name}</Text>

                              <Text style={styles.heading}>Email</Text>
                              <Text style={styles.details}>{profile.email}</Text>

                              <Text style={styles.heading}>Joined On</Text>
                              <Text style={styles.details}>{moment(profile.createdAt).fromNow()}</Text>
                              <TouchableOpacity onPress={logout} style={{padding:5,marginTop:15,borderRadius:5,backgroundColor:Colors.primary,paddingHorizontal:15}}>
                                <Text style={{fontSize:18,color:'white'}}>Logout</Text>
                                </TouchableOpacity>
                        </View>
                        :
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:18,color:'grey'}}>No User!</Text>
                            <TouchableOpacity onPress={logout} style={{padding:5,marginTop:15,borderRadius:5,backgroundColor:Colors.primary,paddingHorizontal:15}}>
                                <Text style={{fontSize:18,color:'white'}}>Logout</Text>
                            </TouchableOpacity>
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
        shadowColor: Platform.OS=='ios'?'grey': 'black',
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
    }, heading: {
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
