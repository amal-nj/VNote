import { TabScreen } from "./components/TabScreen";
import SigninScreen from "./components/SigninScreen";
import RegisterScreen from "./components/RegisterScreen";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import store from "./redux/store";
import React from "react";
import AuthLoadingScreen from "./components/AuthLoadingScreen";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

const AuthStack = createSwitchNavigator({
  Signin: SigninScreen,
  Register: RegisterScreen
});
const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      Starter: AuthLoadingScreen,
      App: TabScreen,
      Auth: AuthStack
    },
    {
      initialRouteName: "Starter"
    }
  )
);

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <PaperProvider>
          <AppContainer />
        </PaperProvider>
      </Provider>
    );
  }
}

// import React from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity
// } from 'react-native';
// import {Notifications } from 'expo';
// import * as Permissions from 'expo-permissions';

// const PUSH_REGISTRATION_ENDPOINT = 'http://93f22bba.ngrok.io/token';
// const MESSAGE_ENPOINT = 'http://93f22bba.ngrok.io/message';

// export default class App extends React.Component {
//   state = {
//     notification: null,
//     messageText: ''
//   }

//   handleNotification = (notification) => {
//     this.setState({ notification });
//   }

//   handleChangeText = (text) => {
//     this.setState({ messageText: text });
//   }

//   sendMessage = async () => {
//     fetch(MESSAGE_ENPOINT, {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         message: this.state.messageText,
//       }),
//     });
//     this.setState({ messageText: '' });
//   }

//   registerForPushNotificationsAsync = async () => {
//     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
//     if (status !== 'granted') {
//       return;
//     }
//     let token = await Notifications.getExpoPushTokenAsync();
//     console.log(token)
//     this.notificationSubscription = Notifications.addListener((notification) => {
//         console.log(notification)
//         this.setState({ notification });
//       });
//     return fetch(PUSH_REGISTRATION_ENDPOINT, {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         token: {
//           value: token,
//         },
//         user: {
//           username: 'warly',
//           name: 'Dan Ward'
//         },
//       }),
//     });

//   }

//   async componentDidMount() {
//     await this.registerForPushNotificationsAsync();
//   }

//   renderNotification() {
//     return(
//       <View style={styles.container}>
//         <Text style={styles.label}>A new message was recieved!</Text>
//         <Text>{this.state.notification.data.message}</Text>
//       </View>
//     )
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <TextInput
//           value={this.state.messageText}
//           onChangeText={this.handleChangeText}
//           style={styles.textInput}
//         />
//         <TouchableOpacity
//           style={styles.button}
//           onPress={this.sendMessage}
//         >
//           <Text style={styles.buttonText}>Send</Text>
//         </TouchableOpacity>
//         {this.state.notification ?
//           this.renderNotification()
//         : null}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#474747',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   textInput: {
//     height: 50,
//     width: 300,
//     borderColor: '#f6f6f6',
//     borderWidth: 1,
//     backgroundColor: '#fff',
//     padding: 10
//   },
//   button: {
//     padding: 10
//   },
//   buttonText: {
//     fontSize: 18,
//     color: '#fff'
//   },
//   label: {
//     fontSize: 18
//   }
// });

// import React, { Component } from "react";
// import { Text, View, Button } from "react-native";
// // window.navigator.userAgent='react-native'
// import SocketIOClient from "socket.io-client";

// export default class HelloWorldApp extends Component {
//   constructor(props) {
//     super(props);
//     this.socket = SocketIOClient("http://93f22bba.ngrok.io");
//     this.socket.on("hello", () => {
//       console.log("hello to you to");
//     });
//   }
//   render() {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text>Hello, world!</Text>
//         <Button
//           title="send"
//           onPress={() => {
//             this.socket.emit("message", "messages[0");
//           }}
//         />
//         <Button
//           title="disconnect"
//           onPress={() => {
//             this.socket.emit('disconnect',"");
//           }}
//         />
//       </View>
//     );
//   }
// }
