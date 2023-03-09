import React,{useState} from "react";
import { StyleSheet, Text, View,Image,TouchableOpacity,TextInput,KeyboardAvoidingView,ScrollView,Alert, Dimensions } from "react-native";
import { Colors } from "../../utils/colors";
import logoBlack from '../../assets/logo/doNationWhite.png'
import { Routes } from "../../utils/routes";
import { getAuth, createUserWithEmailAndPassword ,sendEmailVerification } from "firebase/auth";
import { LoadingModal } from "react-native-loading-modal";
import { getFirestore ,doc,setDoc} from "firebase/firestore";

export default function RegisterScreen({navigation}) {

    const [email,setEmail] = useState('')
    const [name,setName] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPassword,setConfirmPassword] = useState('')
    const [modalVisible, setModalVisible] = useState(false);

    const auth = getAuth();
    const db = getFirestore();

    const saveUser = (user) => {
        const userRef = doc(db, "mobileUsers", user.uid);
        const mobileUser = {
            name: name,
            email: email,
            uid: user.uid,
            mobile: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            country: '',
            donations: JSON.stringify([]),
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
        }
        setDoc(userRef, mobileUser).then(() => {
            setModalVisible(false)
            navigation.navigate(Routes.onBoardingStack.login)
        })
        .catch((error) => {
            setModalVisible(false)
            Alert.alert('Register',`${error}`)
        })
    }


    const actionCodeSettings = {
        url: 'https://donationweb.web.app/',
        handleCodeInApp: true,
        iOS: {bundleId: 'com.donation.app'},
        android: { packageName: 'com.donation.app', installApp: true, minimumVersion: '12'},
        dynamicLinkDomain: "donationweb.page.link"
      };
    

    const register = () => {
        if(email.trim()!="" && password.trim()!==""){
            if(password==confirmPassword){
                setModalVisible(true)
                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;

                    sendEmailVerification(user, actionCodeSettings)
                    .then(() => {
                        saveUser(user)
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        setModalVisible(false)
                        Alert.alert('Register',errorMessage)
                    })
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setModalVisible(false)
                    Alert.alert('Register',errorMessage)
                    // ..
                })
            }else{
                Alert.alert('Register',"Password and Confirm Password doesn't match")
            }
        }else{
            Alert.alert('Register',"Please fill all the fields")
        }


    }


    return(
        <KeyboardAvoidingView style={{flex:1}} behavior="height">
                <LoadingModal modalVisible={modalVisible} />
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={{width:'100%',position:'absolute',top:'15%',justifyContent:'center',alignItems:'center'}}>
                        <Image source={logoBlack} style={{width: 50, height: 50}}/>
                        <Text style={{color: 'white', fontSize: 16,marginTop:20}}>Register With</Text>
                        <Text style={{color: 'white', fontSize: 35, fontWeight: 'bold'}}>DoNation</Text>
                    </View>
                   

                    <View style={{width:'100%',justifyContent:'flex-start',padding:20,paddingTop:30,alignItems:'flex-start',position:'absolute',bottom:0,height:Dimensions.get('screen').height*0.6,backgroundColor:'white',borderTopRightRadius:40,borderTopLeftRadius:40}}>
                        <Text style={{fontSize:25,fontWeight:'bold'}}>Register</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor={Colors.black}
                            onChangeText={text => setName(text)}
                            value={name}
                            secureTextEntry={false}
                        />  

                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={Colors.black}
                            onChangeText={text => setEmail(text)}
                            value={email}
                            secureTextEntry={false}
                        />  
                        <TextInput

                            style={styles.input}    
                            placeholder="Password"
                            placeholderTextColor={Colors.black}
                            onChangeText={text => setPassword(text)}
                            value={password}
                            secureTextEntry={true}
                        />

                        <TextInput

                        style={styles.input}    
                        placeholder="Confirm Password"
                        placeholderTextColor={Colors.black}
                        onChangeText={text => setConfirmPassword(text)}
                        value={confirmPassword}
                        secureTextEntry={true}
                        />
                    
                        <TouchableOpacity style={{width:'100%',paddingVertical:12,borderRadius:10,marginTop:30,justifyContent:'center',alignItems:'center',backgroundColor:Colors.primary}} onPress={register}>
                            <Text style={{color: Colors.white, fontSize: 18, fontWeight: 'bold', marginLeft: 5}}>Register</Text>
                        </TouchableOpacity>
                    
                    </View>
                </ScrollView>
        </KeyboardAvoidingView>

    )


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,

    },

    input:{
        width:'90%',
        backgroundColor:'white',
        padding:10,
        paddingLeft:0,
        borderBottomColor:'grey',
        borderBottomWidth:1,
        marginTop:20,
        paddingHorizontal:20,
        fontSize:16,

    }
})