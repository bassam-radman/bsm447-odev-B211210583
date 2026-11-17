
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@react-native-vector-icons/ionicons';

import ListScreen from './screens/ListScreen';
import DetailScreen from './screens/DetailScreen';
import SavedScreen from './screens/SavedScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Alt sekmeler
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#173B65',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: 65,
          paddingTop: 5,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Liste"
        component={ListScreen}
        options={{
          tabBarLabel: 'Elementler',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'list' : 'list-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Kaydedilenler"
        component={SavedScreen}
        options={{
          tabBarLabel: 'Kaydedilenler',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'bookmark' : 'bookmark-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Ana uygulama
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: '#173B65',
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      >
        <Stack.Screen
          name="AnaSayfa"
          component={HomeTabs}
          options={{
            headerShown: false,
            title: 'Element Atlası',
          }}
        />

        <Stack.Screen
          name="Detay"
          component={DetailScreen}
          options={{
            title: 'Element Detayı',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
