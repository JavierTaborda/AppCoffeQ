import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import {colors} from '../../constants/colors';

export default function TabLayout() {
  return (
      <Tabs
          screenOptions={{
              tabBarActiveTintColor: colors.primary, // Color de las pestañas activas
              tabBarInactiveTintColor: colors.inactive, // Color de las pestañas inactivas
              tabBarStyle: {
                  backgroundColor: colors.lightWhite, // Color de fondo de la barra de pestañas
                  boxShadow: '0px 0px 10px #c5c5c5', // Sombra de la barra de pestañas
                  height: 60, // Altura de la barra de pestañas           
                  borderTopWidth: 0, // Grosor del borde superior de la barra de pestañas
                  padding:0,   
              }, 
              tabBarLabelStyle: {
                  fontSize: 12, // Tamaño de la fuente de las etiquetas de pestañas 
                  fontWeight: 'bold', // Peso de la fuente de las etiquetas de pestañas
                },              
                                
          }}
      >
       
        <Tabs.Screen 
            name="Payments" 
            options={{
                title: 'Pagos',
                tabBarBadge: 3,
                tabBarBadgeStyle: {
                    backgroundColor: colors.secondary,
                    color: colors.white,
                    fontSize: 10,
                    fontWeight: 'bold',
                },
                
                tabBarIcon: ({color}) => <FontAwesome name="money" size={28} color={color} />,
            }}
        />
         <Tabs.Screen 
            name="index" 
            options={{
                title: 'Home',
                tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food-variant" size={28} color={color} />,
            }}
        />
        <Tabs.Screen 
            name="Products" 
            options={{
                title: 'Productos',
                tabBarIcon: ({ color }) => <FontAwesome name="coffee" size={28} color={color} />,
            }}
        />
    </Tabs>
  )
}