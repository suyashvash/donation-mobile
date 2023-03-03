import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../../../utils/routes';
import AlertBoardScreen from './alertBoardScreen';
import CampaginDetailScreen from './alertDetails';
import DonateScreen from './donateScreen';
import VolunteerScreen from './volunteersScreen';


const AlertStack = createStackNavigator();

export default function AlertBoardNavigator() {
  return (
    <AlertStack.Navigator screenOptions={{headerShown: false}} initialRouteName={Routes.tabStack.alertStack.alertBoard}>
      <AlertStack.Screen name={Routes.tabStack.alertStack.alertBoard} component={AlertBoardScreen} />
      <AlertStack.Screen name={Routes.tabStack.alertStack.campgainDetails} component={CampaginDetailScreen} options={{
        headerShown: true, headerTransparent :true
      }} />
       <AlertStack.Screen name={Routes.tabStack.alertStack.donateScreen} component={DonateScreen} options={{
        headerShown: true, 
      }} />
      <AlertStack.Screen name={Routes.tabStack.alertStack.volunteerScreen} component={VolunteerScreen} options={{
        headerShown: true, 
      }} />
    </AlertStack.Navigator>
  );
}