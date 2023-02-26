import { createSlice } from '@reduxjs/toolkit'

const initialState = { uid: null, loggedIn: false,selectedLocation: null}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setActiveUser: (state, action) => {
            state.uid = action.payload.uid
            state.loggedIn = action.payload.loggedIn
        },
        setUserLogOutState: (state) => {
            state.uid = null
            state.loggedIn = false
            state.selectedLocation = null
        },
        setSelectedLocation: (state, action) => {
            state.selectedLocation = action.payload.selectedLocation
        }
    }
});

export const { setActiveUser, setUserLogOutState,setSelectedLocation } = userSlice.actions
export const selectedUID = (state) => state.user.uid
export const selectLoggedIN = (state) => state.user.loggedIn
export const selectSelectedLocation = (state) => state.user.selectedLocation
export default userSlice.reducer