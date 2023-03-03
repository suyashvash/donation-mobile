import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../../utils/routes';
import LoginScreen from './loginScreen';
import RegisterScreen from './registerScreen';
import WelcomeScreen from './welcome';

const OnBoardingStack = createStackNavigator();

export default function OnBoardingNavigator() {
  return (
    <OnBoardingStack.Navigator screenOptions={{headerShown: false}} initialRouteName={Routes.onBoardingStack.welcomeScreen}>
      <OnBoardingStack.Screen name={Routes.onBoardingStack.welcomeScreen} component={WelcomeScreen} />
      <OnBoardingStack.Screen name={Routes.onBoardingStack.login} component={LoginScreen} />
      <OnBoardingStack.Screen name={Routes.onBoardingStack.register} component={RegisterScreen} />
    </OnBoardingStack.Navigator>
  );
}