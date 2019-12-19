import React from "react";
import { View, Text, AsyncStorage, StyleSheet } from "react-native";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { Badge } from "react-native-paper";
import HomeScreen from "./HomeScreen";
import SettingScreen from "./SettingScreen";
import ChangePasswordScreen from "./ChangePasswordScreen";
import PostModal from "./PostModal";
import NotfModal from "./NotfModal";

import EditModal from "./EditModal";
import NotificationScreen from "./NotificationScreen";
import ProfileScreen from "./ProfileScreen";
// const SignoutScreen = () => {}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

const settingsNavigator = createStackNavigator(
  {
    Profile: {
      screen: SettingScreen,
      navigationOptions: {
        headerShown: false
      }
    },

    ChangePassword: ChangePasswordScreen
  },
  {
    initialRouteName: "Profile"
  }
);

const homeNavigator = createStackNavigator(
  {
    Posts: {
      screen: HomeScreen,
      navigationOptions: {
        headerShown: false
      }
    },
    PostModal: {
      screen: PostModal,
      mode: "modal"
    },
    EditModal: {
      screen: EditModal,
      mode: "modal"
    },
    NotfModal: {
      screen: NotfModal,
      mode: "modal"
    },
    usersProfile: {
      screen: ProfileScreen,
      mode: "modal"
    }
  },
  {
    initialRouteName: "Posts"
  }
);
export const TabScreen = createBottomTabNavigator(
  {
    Home: {
      screen: homeNavigator,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: ({ tintColor }) => (
          <View>
           
            <Ionicons name="ios-home" color={tintColor} size={25} />      
          </View>
        )
      }
    },
    Settings: {
      screen: settingsNavigator,

      navigationOptions: {
        tabBarLabel: "Settings",
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-settings" color={tintColor} size={25} />
        )
      }
    },
    Notify: {
      screen: NotificationScreen,
      navigationOptions: {
        tabBarLabel: "Notifications",
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-notifications" color={tintColor} size={25} />
        )
      }
    }
    //,
    // Signout: {
    //     screen: SignoutScreen,
    //     navigationOptions: {
    //         tabBarLabel: 'Signout',
    //         tabBarIcon: ({ tintColor }) => (
    //             <SimpleLineIcons name="logout" color={tintColor} size={20} />
    //         ),
    //         tabBarOnPress: async ({navigation}) => {
    //             await AsyncStorage.clear();
    //             navigation.navigate('Auth');
    //         }
    //     }
    // }
  },
  {
    tabBarOptions: {
      activeTintColor: "red",
      inactiveTintColor: "grey",
      showIcon: true
    }
  }
);
