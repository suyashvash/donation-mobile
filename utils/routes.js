export const Routes = {

    onBoardingStack:{
        tag: 'onBoardingStack',
        welcomeScreen: 'WelcomeScreen',
        login: 'Login',
        register: 'Register',
        forgotPassword: 'ForgotPassword',
    },
    tabStack:{
        tag: 'tabStack',   
        homeStack:{
            tag: 'homeStack',
            homeScreen: 'HomeScreen',
            ngoDetails: 'NGO Details',
            ngoLocation: 'NGO Location',

        },
        alertStack:{
            tag: 'alertStack',
            alertBoard: 'Alert Board',
            campgainDetails: 'Campgain Details',
            donateScreen: 'Donate',
            volunteerScreen: 'Volunteer',
            slotScreen: 'Book Slot',
        },
        historyStack:{
            tag: 'historyStack',
            historyScreen: 'History Screen',
            donationDetails: 'Donation Details',
        },
        profileStack:{
            tag: 'profileStack',
            profileScreen: 'Profile Screen',
            editProfile: 'Edit Profile',
            changePassword: 'Change Password',
        }
    }
}