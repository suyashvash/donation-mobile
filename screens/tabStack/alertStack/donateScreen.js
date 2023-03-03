import { LinearGradient } from "expo-linear-gradient";
import React,{useEffect, useState} from "react";
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, Linking, Platform, ScrollView, Alert } from "react-native";
import { width } from "../../../configs/envConfig";
import { Colors } from "../../../utils/colors";
import { Routes } from "../../../utils/routes";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getDatabase, ref, onValue, set, get,off } from 'firebase/database';
import { TextInput } from "react-native-gesture-handler";
import { doc, getDoc ,getFirestore,updateDoc,arrayUnion, Firestore} from "firebase/firestore";
import useStore from "../../../src/app/useStore";
import { LoadingModal } from "react-native-loading-modal";


export default function DonateScreen({navigation,route}) {

    const store = useStore()

 

    useEffect(() => {
        getStatus()
        return () => {
            off(ref(db,'campaign/'+ `${campaginDetails.campaignId}`))
        }
    },[])

    const db = getDatabase();
    const firestore = getFirestore();
    useEffect(() => {
        getVolunteers()
        return () => {
            off(ref(db,'campaign/'+ `${campaginDetails.campaignId}/volunteers`))
        }
    },[])


    const [amountRec,setAmountRec] = useState(0)
    const [enteredAmount,setEnteredAmount] = useState(0)
    const [modalVisible,setModalVisible] = useState(false)
    const [volunteers,setVolunteers] = useState([])

    const ngoDetails = route.params.data.ngo
    const campaginDetails = route.params.data

    const percentage = (amountRec/campaginDetails.totalAmount)*100


    const getStatus = () => {
        const reference = ref(db,'campaign/'+ `${campaginDetails.campaignId}/amountRec`);
        onValue(reference, (snapshot) => {
            const data = snapshot.val();
            setAmountRec(data)
        });
    }

    const getVolunteers = () => {
        const reference = ref(db,'campaign/'+ `${campaginDetails.campaignId}/volunteers`);
        onValue(reference, (snapshot) => {
            const data = snapshot.val();
            if(data){
                const filtered = data.filter(item=>item.delivered===true)
                setVolunteers(filtered)
            }else{
                setVolunteers([])
            }
         
        });
    }

     const userRef = doc(firestore, "mobileUsers", `${store.UserId}`);


    const volunteer = async() => {
        setModalVisible(true)
 
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {

            let user = docSnap.data()
            let userDonations = JSON.parse(user.donations)
            let volunteerUser ={
                name:user.name,
                email:user.email,
                uid : user.uid,
                amount : enteredAmount,
                delivered : false,
                deliveredOn : null,
                createdAt: new Date().getTime()
            }

            let userDonObj={
                campaignName:campaginDetails.title,
                campaignId:campaginDetails.campaignId,
                campaignDescription:campaginDetails.description,
                amount :enteredAmount,
                totalAmount:campaginDetails.totalAmount,
                delivered:volunteerUser.delivered,
                deliveredOn: volunteerUser.deliveredOn,
                createdAt:volunteerUser.createdAt
            }

            userDonations.push(userDonObj)
  
            const reference = ref(db,'campaign/'+ `${campaginDetails.campaignId}/volunteers`);
            get(reference).then(async(snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val()
                    data.push(volunteerUser)
                    set(reference,data)
                    await updateDoc(userRef, {
                        donations: JSON.stringify(userDonations)
                    }).then(()=>{
                        Alert.alert('Success','Donation Successful')
                        setModalVisible(false)
                      })
                      .catch((err)=>{
                        console.log(err)
                        setModalVisible(false)
                      })
                    
                }else{
                    set(reference,[volunteerUser])
                    await updateDoc(userRef, {
                        donations:JSON.stringify(userDonations)
                    }).then(()=>{
                        Alert.alert('Success','Donation Successful')
                        setModalVisible(false)
                      })
                      .catch((err)=>{
                        console.log(err)
                        setModalVisible(false)
                      })
                }
            }).catch((error) => {
                setModalVisible(false)
                console.error(error);
            });

        }else{
            setModalVisible(true)
            Alert.alert('Error','User not found')
        }

        
    }

    const bookService =()=>{
        Alert.alert('Booking Service','In Development !')
    }


    return(
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{paddingBottom:50}}>
            <LoadingModal modalVisible={modalVisible} />

            <View style={{width:width,padding:15,justifyContent:'center',alignItems:'flex-start'}}>
                <Text style={[styles.heading]}>{campaginDetails.title}</Text>
                <Text style={styles.details}>{campaginDetails.description}</Text>
                <Text style={[styles.details]}>Hosted By - {ngoDetails.name}</Text>
                
                <Text style={styles.heading}>Status</Text>
                {/* <Text style={styles.details}>{percentage}% Done | {getVolunteers().length} People Donated</Text> */}
                <View style={{width:'100%',marginVertical:10,marginBottom:30}}>
                    <View style={{width:'90%', height:5,borderRadius:10,backgroundColor:'whitesmoke'}}/>
                    <View style={{width:`${percentage}%`, height:5,borderRadius:10,backgroundColor:Colors.primary,position:'absolute',top:0,left:0}}/>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'baseline',paddingVertical:10}}>
                        <Text style={{fontSize:22}}>{amountRec}</Text>
                        <Text >/{campaginDetails.totalAmount}</Text>
                    </View>
                </View>  


                {
                    percentage != 100  &&
                    <>
                    
                        <Text style={styles.heading}>Doantion</Text>

                        <TextInput
                            style={styles.input}
                            keyboardType='number-pad'
                            placeholder="Enter Amount to Donate"
                            placeholderTextColor={Colors.black}
                            onChangeText={text => setEnteredAmount(text)}
                            value={enteredAmount}
                            secureTextEntry={false}
                        />  
                        <TouchableOpacity onPress={volunteer} style={{width:'100%',paddingVertical:12,paddingHorizontal:15,borderRadius:8,marginVertical:10,justifyContent:'center',alignItems:'center',backgroundColor:Colors.primary,marginBottom:30}} >
                            <Text style={{color: Colors.white, fontSize: 16, fontWeight: 'bold', marginLeft: 5}}>Volunteer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={bookService} style={{width:'100%',paddingVertical:12,paddingHorizontal:15,borderRadius:8,marginVertical:5,justifyContent:'center',alignItems:'center',marginBottom:30,borderColor:Colors.primary,borderWidth:1}} >
                            <Text style={{color: Colors.secondary, fontSize: 14, marginLeft: 5}}>Book a Delivery Service !</Text>
                        </TouchableOpacity>

                        <Text style={styles.heading}>Note</Text>
                        <Text style={styles.details}>By Volunteering for this campaign, you agree to donate to this campaign by yourself with full honesty !</Text>
                        <Text style={styles.details}>Your Donation will only be counted after the NGO recevies the goods !</Text>
                    
                    </>
                    
                }

        
               
            </View>
            </ScrollView>
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
    input:{
        width:'90%',
        backgroundColor:'white',
        padding:10,
        paddingLeft:0,
        borderBottomColor:'grey',
        borderBottomWidth:1,
        paddingHorizontal:20,
        fontSize:16,

    }
})