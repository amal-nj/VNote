import React from "react";
import { Dimensions } from "react-native";
import {
  KeyboardAvoidingView,
  View,
  Button,
  Alert,
  Text,
  AsyncStorage,
  StyleSheet
} from "react-native";
import { HelperText, TextInput } from "react-native-paper";
export default class SigninScreen extends React.Component {
  // static navigationOptions = {
  //     header: null,
  // };

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      spinner: false,
      error: false
    };

    this._signInHandler = this._signInHandler.bind(this);
  }

  _signInHandler = async () => {
    if (this.state.email.includes("@") && this.state.password) {
      const user = {
        email: this.state.email.toLowerCase(),
        password: this.state.password
      };
      this.setState({ spinner: true });

      fetch("https://vnote-api.herokuapp.com/api/auth/login", {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(data => {
          if (data.ok) {
            return data.json();
          } else {
            throw new Error("Something went wrong");
          }
        })
        .then(async res => {
          console.log(res);
          if (res.token) {
            console.log(res.data);

            await AsyncStorage.setItem("userToken", res.token);
            await AsyncStorage.setItem("user", JSON.stringify(res.user));
            this.setState({ spinner: false });
            this.props.navigation.navigate("App");
          }
        })
        .catch(async err => {
          await Alert.alert("Error", "Invalid email or password");

          this.setState({ spinner: false });

          console.log("Error", err);
        });
    } else {
      this.setState({ error: true });
    }
  };

  render() {
    return (
      <KeyboardAvoidingView style={{ flexGrow: 1 }} behavior="padding" enabled>
        <View style={style.container}>
          <TextInput
            label="Email"
            mode="outlined"
            keyboardType="email-address"
            onChangeText={email => this.setState({ email })}
            style={style.input}
            value={this.state.email}
          />
          <HelperText
            type="error"
            visible={this.state.error && !this.state.email.includes("@")}
          >
            Email address is invalid!
          </HelperText>
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry={true}
            onChangeText={password => this.setState({ password })}
            style={style.input}
            placeholder="Password"
            value={this.state.password}
          />
          <HelperText
            type="error"
            visible={this.state.error && this.state.password === ""}
          >
            Please enter your password!
          </HelperText>

          {this.state.spinner && (
            <Text style={style.spinnerTextStyle}>Processing ...</Text>
          )}
          {!this.state.spinner && (
            <Button title="Sign in!" onPress={this._signInHandler} />
          )}
          <Button
            title="Register"
            onPress={() => {
              this.props.navigation.navigate("Register");
            }}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get("window").width;

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    backgroundColor: "#FFFFFF",
    width: DEVICE_WIDTH - 100,
    height: 40,
    marginHorizontal: 20,
    borderRadius: 20,
    color: "#333333",
    marginBottom: 30,
    paddingLeft: 15
  },
  spinnerTextStyle: {
    textAlign: "center"
  }
});
