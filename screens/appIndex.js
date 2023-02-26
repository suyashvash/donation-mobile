import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../utils/routes';
import OnBoardingNavigator from './onBoardingStack/onBaordingIndex';
import TabStack from './tabStack/tabIndex';
import useStore from '../src/app/useStore';

const AppStack = createStackNavigator();

export default function AppNavigator() {

  const userStore = useStore()


  return (
    <AppStack.Navigator 
    screenOptions={{
        headerShown: false
      }}
    initialRouteName={ userStore.loggedIn? Routes.tabStack.tag : Routes.onBoardingStack.tag}>
      <AppStack.Screen name={Routes.onBoardingStack.tag} component={OnBoardingNavigator} />
      <AppStack.Screen name={Routes.tabStack.tag} component={TabStack} />
    </AppStack.Navigator>
  );
}