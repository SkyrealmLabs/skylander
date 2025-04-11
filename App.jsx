import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import 'react-native-gesture-handler';

import { theme } from "./app/core/theme";
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  HomeScreen,
  LocationStatusScreen,
  RegisterLocationScreen,
  AddLocationDetailsScreen,
  AddLocationCoordinateScreen,
  VideoRecorderScreen,
  EditProfileScreen,
  AdminHomeScreen,
  AdminLocationListScreen,
  AdminLocationDetailsScreen,
  AdminArucoScannerScreen
} from "./app/screens";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="LocationStatusScreen" component={LocationStatusScreen} />
          <Stack.Screen name="RegisterLocationScreen" component={RegisterLocationScreen} />
          <Stack.Screen name="AddLocationDetailsScreen" component={AddLocationDetailsScreen} />
          <Stack.Screen name="AddLocationCoordinateScreen" component={AddLocationCoordinateScreen} />
          <Stack.Screen name="VideoRecorderScreen" component={VideoRecorderScreen} />
          <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} />
          <Stack.Screen name="AdminLocationListScreen" component={AdminLocationListScreen} />
          <Stack.Screen name="AdminLocationDetailsScreen" component={AdminLocationDetailsScreen} />
          <Stack.Screen name="AdminArucoScannerScreen" component={AdminArucoScannerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
