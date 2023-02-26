import React,{useState} from "react";
import { StyleSheet, Text, View,Image,TouchableOpacity,TextInput,KeyboardAvoidingView,ScrollView,Alert, Dimensions } from "react-native";
import { Colors } from "../../utils/colors";
import logoBlack from '../../assets/logo/doNationBlack.png'
import { Routes } from "../../utils/routes";
import { getAuth, signInWithEmailAndPassword ,sendEmailVerification } from "firebase/auth";
import { LoadingModal } from "react-native-loading-modal";
import { setActiveUser } from "../../src/features/userSlice";
import { useDispatch } from "react-redux";


export default function LoginScreen({navigation}) {

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [modalVisible, setModalVisible] = useState(false);

    const auth = getAuth();
    const dispatch = useDispatch()


    const login = () => {
        if(email.trim()!="" && password.trim()!==""){
            setModalVisible(true)
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setModalVisible(false)
                if(!user.emailVerified){
                    Alert.alert('Login','Please verify your email')
                }else{
                    const activeUserData = {uid:user.uid,loggedIn:true}
                    dispatch(setActiveUser(activeUserData))
                    navigation.replace(Routes.tabStack.tag)   
                }
            })
            .catch((error) => {
                setModalVisible(false)
                Alert.alert('Login',`${error}`)
            })
        }else{
            Alert.alert('Login','Please enter email and password')
        }
    }


    return(
        <KeyboardAvoidingView style={{flex:1}} behavior="height">
            <LoadingModal modalVisible={modalVisible} />
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={{width:'100%',position:'absolute',top:'20%',justifyContent:'center',alignItems:'center'}}>
                        <Image source={logoBlack} style={{width: 50, height: 50}}/>
                        <Text style={{color: Colors.black, fontSize: 16,marginTop:20}}>Welcome Back</Text>
                        <Text style={{color: 'white', fontSize: 35, fontWeight: 'bold'}}>DoNation</Text>
                    </View>
                   

                    <View style={{width:'100%',justifyContent:'flex-start',padding:20,paddingTop:30,alignItems:'flex-start',position:'absolute',bottom:0,height:Dimensions.get('screen').height*0.5,backgroundColor:'white',borderTopRightRadius:40,borderTopLeftRadius:40}}>
                        <Text style={{fontSize:25,fontWeight:'bold'}}>Login</Text>
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
                    
                        <TouchableOpacity style={{width:'100%',paddingVertical:12,borderRadius:10,marginTop:30,justifyContent:'center',alignItems:'center',backgroundColor:Colors.primary}} onPress={() => login()}>
                            <Text style={{color: Colors.white, fontSize: 18, fontWeight: 'bold', marginLeft: 5}}>Login</Text>
                        </TouchableOpacity>
                    
                        <TouchableOpacity onPress={() => navigation.navigate(Routes.onBoardingStack.forgotPassword)}>
                            <Text style={{color: Colors.secondary, fontSize: 16, marginTop: 10}}>Forgot Password?</Text>
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