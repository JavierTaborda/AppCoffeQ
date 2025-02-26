import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import {colors} from '../../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary, 
        tabBarInactiveTintColor: colors.inactive, 
        tabBarStyle: {
          backgroundColor: colors.lightWhite, 
          boxShadow: "0px 0px 10px #c5c5c5", 
          height: 60, 
          borderTopWidth: 0,  
          padding: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12, 
          fontWeight: "bold",
        },
      }}
    >
     
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="food-variant"
              size={28}
              color={color}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Payments"
        options={{
          title: "Pagos",
          tabBarBadge: 3,
          tabBarBadgeStyle: {
            backgroundColor: colors.secondary,
            color: colors.white,
            fontSize: 10,
            fontWeight: "bold",
          },

          tabBarIcon: ({ color }) => (
            <FontAwesome name="money" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="History"
        options={{
          title: "Consumos",
          tabBarBadgeStyle: {
            backgroundColor: colors.secondary,
            color: colors.white,
            fontSize: 10,
            fontWeight: "bold",
          },

          tabBarIcon: ({ color }) => (
            <FontAwesome name="bars" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Products"
        options={{
          title: "Productos",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="coffee" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}