import { Platform } from "react-native"

const shadowAndroid = {
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 6,
}

const shadowIos = {
    shadowColor: 'grey',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3},
}

export const envConfig = {
    shadow: Platform.OS === 'ios' ? shadowIos : shadowAndroid,
}