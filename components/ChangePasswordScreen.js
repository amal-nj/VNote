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

export default class ChangePasswordScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      oldpassword: "",
      password: "",
      confirmpassword: "",
      spinner: false,
      error: false
    };

    this._changeHandler = this._changeHandler.bind(this);
  }

  _changeHandler = async () => {
    let check=this.state.oldpassword && this.state.password && this.state.confirmpassword;
  
    if (check && this.state.password === this.state.confirmpassword && this.state.oldpassword!==this.state.password) {
      const changes = {
        password:this.state.oldpassword,
        newPassword: this.state.password
      };
      this.setState({ spinner: true });
      let id=await AsyncStorage.getItem('user')
      let token=await AsyncStorage.getItem('userToken')
      id=JSON.parse(id)._id
      console.log(id)
      fetch(`https://vnote-api.herokuapp.com/api/auth/User/${id}`, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
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
          await Alert.alert('Password changed', 'Your password has beed changed successfully');
          this.setState({ spinner: true });
          this.props.navigation.goBack();
        })
        .catch(async err => {
          await Alert.alert("Invalid password", "Please enter your account's current password");

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
          <Text>Change Password</Text>
          <TextInput
            label="Current password"
            mode="outlined"
            secureTextEntry={true}
            onChangeText={oldpassword => this.setState({ oldpassword })}
            style={style.input}
            value={this.state.oldpassword}
          />
          <HelperText
            type="error"
            visible={this.state.error && this.state.oldpassword === ""}
          >
            Please enter your current password!
          </HelperText>
          <TextInput
            label="New password"
            mode="outlined"
            secureTextEntry={true}
            onChangeText={password => this.setState({ password })}
            style={style.input}
            value={this.state.password}
          />
          <HelperText
            type="error"
            visible={this.state.error && (this.state.password === "" || this.state.password<6)}
          >
            Password should contain at least 6 letters or digits
          </HelperText>
          <HelperText
            type="error"
            visible={this.state.error && this.state.password === this.state.oldpassword}
          >
            New password cannot match the old password!
          </HelperText>
          <TextInput
            label="Confirm password"
            mode="outlined"
            secureTextEntry={true}
            onChangeText={confirmpassword => this.setState({ confirmpassword })}
            style={style.input}
            value={this.state.confirmpassword}
          />
          <HelperText
            type="error"
            visible={this.state.error && this.state.confirmpassword === ""}
          >
            Please confirm your password!
          </HelperText>
          <HelperText
            type="error"
            visible={
              this.state.error &&
              this.state.confirmpassword !== this.state.password
            }
          >
            Password confirmation does not match the password
          </HelperText>

          {this.state.spinner && (
            <Text style={style.spinnerTextStyle}>Processing ...</Text>
          )}
          {!this.state.spinner && (
            <Button title="Change" onPress={this._changeHandler} />
          )}

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
