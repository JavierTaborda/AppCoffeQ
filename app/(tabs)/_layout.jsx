import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'green', tabBarInactiveTintColor: 'gray' }}>
       
        <Tabs.Screen 
            name="Payments" 
            options={{
                title: 'Pagos',
                tabBarIcon: ({ color }) => <FontAwesome name="money" size={24} color={color} />,
            }}
        />
         <Tabs.Screen 
            name="index" 
            options={{
                title: 'Home',
                tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food-variant" size={24} color={color} />,
            }}
        />
        <Tabs.Screen 
            name="Products" 
            options={{
                title: 'Productos',
                tabBarIcon: ({ color }) => <FontAwesome name="coffee" size={24} color={color} />,
            }}
        />
    </Tabs>
  )
}