import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Routes } from '../../utils/routes';
import { Colors } from '../../utils/colors';
import { View, Text } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import IonIcons from '@expo/vector-icons/Ionicons';
import MaterialCommunity from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export const Screen = () => {
    return(
        <View>
            <Text>Screen</Text>
        </View>
    )
}

const MainTabStack = createBottomTabNavigator();

export default function TabStack() {

    const tabProperties = {
        headerShown: false,
        tabBarShowLabel: false,
      }


    return (
        <MainTabStack.Navigator
      initialRouteName={Routes.tabStack.homeStack.tag}
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#A2A2A8'
      }} >
      <MainTabStack.Screen name={Routes.tabStack.homeStack.tag} component={Screen}
        options={({ navigation, route }) => ({
          ...tabProperties, headerTitle: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunity name={'home'} size={30} color={color} />
        })}
      />
      <MainTabStack.Screen name={Routes.tabStack.alertStack.tag} component={Screen}
        options={({ navigation, route }) => ({
          ...tabProperties, headerTitle: 'Alert Board',
          tabBarIcon: ({ color }) => <MaterialCommunity name={'clipboard-alert'} size={25} color={color} />
        })}
      />
      <MainTabStack.Screen name={Routes.tabStack.historyStack.tag} component={Screen}
        options={({ navigation, route }) => ({
          ...tabProperties, headerTitle: 'History',
          tabBarIcon: ({ color }) => 
          <MaterialCommunity name={'history'} size={30} color={color} />

        })}
      />

      <MainTabStack.Screen name={Routes.tabStack.profileStack.tag} component={Screen}
        options={({ navigation, route }) => ({
          ...tabProperties, headerTitle: 'My Profile',
          tabBarIcon: ({ color }) => <MaterialIcons name={'person'} size={30} color={color} />
        })}
      />



    


    </MainTabStack.Navigator>

    );
}