import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['https://react-stockcontrol.vercel.app'],
  config: {
    screens: {
      Login: 'login',
      Register: 'register',
      Dashboard: 'dashboard',
      Stock: 'stock',
    },
  },
};

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Stock" component={Stock} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
