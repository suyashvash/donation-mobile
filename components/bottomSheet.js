import React from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import { Text, } from "react-native";
import { Colors } from "../utils/colors";



export const BottomSheet = React.forwardRef((props, ref) => (
        <RBSheet
            ref={ref} closeOnDragDown={true} closeOnPressMask={props.closeOnPressMask? props.closeOnPressMask :true}
            height={props.height ? props.height : 300} animationType={'fade'} dragFromTopOnly
            customStyles={{
            container: { padding: 10, borderTopRightRadius: 20, borderTopLeftRadius: 20 },
            draggableIcon: { backgroundColor: Colors.primary }
            }}>

        <Text style={{ padding: 5, fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginVertical: 10,textDecorationLine:'underline' }}>{props.heading}</Text>

        {props.children}

        </RBSheet>
    ))
