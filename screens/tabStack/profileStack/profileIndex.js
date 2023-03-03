import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../../../utils/routes';
import ProfileScreen from './profileScreen';

const ProfileStack = createStackNavigator();

export default function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{headerShown: false}} initialRouteName={Routes.tabStack.profileStack.profileScreen}>
      <ProfileStack.Screen name={Routes.tabStack.profileStack.profileScreen} component={ProfileScreen} />

    </ProfileStack.Navigator>
  );
}