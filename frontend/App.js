import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BlogListScreen from './screens/BlogListScreen';
import BlogDetailScreen from './screens/BlogDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="BlogList" component={BlogListScreen} />
        <Stack.Screen name="BlogDetail" component={BlogDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
