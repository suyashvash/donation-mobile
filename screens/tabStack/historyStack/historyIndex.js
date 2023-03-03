import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../../../utils/routes';
import HistoryScreen from './historyScreen';


const HistoryStack = createStackNavigator();

export default function HistoryNavigator() {
  return (
    <HistoryStack.Navigator screenOptions={{headerShown: false}} initialRouteName={Routes.tabStack.historyStack.historyScreen}>
      <HistoryStack.Screen name={Routes.tabStack.historyStack.historyScreen} component={HistoryScreen} />
    </HistoryStack.Navigator>
  );
}