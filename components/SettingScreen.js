import React from "react";
import { StyleSheet, View, Text, Button, AsyncStorage } from "react-native";
import { createStackNavigator } from "react-navigation-stack";

export default class SettingScreen extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
  }
  componentDidMount() {
    this._bootstrap();
  }

  _bootstrap = async () => {
    const userName = "Amal";
    this.setState({ name: userName });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome {this.state.name}</Text>
        <Text>to Setting Screen</Text>
        <Button
          title="Change Password"
          onPress={() => {
            this.props.navigation.push("ChangePassword");
          }}
        />
        <Button
          title="Sign Out"
          onPress={async () => {
            await AsyncStorage.clear();
            this.props.navigation.navigate("Auth");
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
