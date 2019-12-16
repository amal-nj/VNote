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
