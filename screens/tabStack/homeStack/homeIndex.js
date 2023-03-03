import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../../../utils/routes';
import HomeScreen from './homeScreen';
import NgoDetailsScreen from './ngoDetailScreen';

const HomeStack = createStackNavigator();

export default function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{headerShown: false}} initialRouteName={Routes.tabStack.homeStack.homeScreen}>
      <HomeStack.Screen name={Routes.tabStack.homeStack.homeScreen} component={HomeScreen} />
      <HomeStack.Screen name={Routes.tabStack.homeStack.ngoDetails} component={NgoDetailsScreen} options={{
        headerShown: true, headerTransparent :true
      }} />
    </HomeStack.Navigator>
  );
}