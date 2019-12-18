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
import axios from 'axios'
export default class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
      spinner: false,
      error: false
    };

    this._registerHandler = this._registerHandler.bind(this);
  }

  _registerHandler = async () => {
    
    let check=this.state.username&&this.state.email.includes("@") && this.state.password && this.state.confirmpassword 
    if (check && this.state.password===this.state.confirmpassword) {
     

      this.setState({ spinner: true });
      const user = {
        username: this.state.username.toLowerCase(),
        email: this.state.email.toLowerCase(),
        password: this.state.password
      };
      
      fetch("https://37dde31d.ngrok.io/api/auth/register",{method: "POST",body: JSON.stringify(user), headers: {
        'Content-Type': 'application/json'
      }})
      .then(data=>{
        if (data.ok) {
          return data.json();
        } else {
          throw new Error('Something went wrong');
        }
      })
      .then((res) => {
        
        console.log(res)
        this.setState({ spinner: false });
        this.props.navigation.navigate("Signin");

      
    })
      .catch( async err => {
          await Alert.alert('Error', 'A user with this email or user name already exists. Please change your email or user name and retry again');
  
          this.setState({ spinner: false });
  
          console.log("Error",err)
  
        })
    
    } else {

      this.setState({ error: true });
    }
  };

  render() {
    return (
      <KeyboardAvoidingView style={{ flexGrow: 1 }} behavior="padding" enabled>
        <View style={style.container}>
          <Text>Register</Text>
          <TextInput
          label='User name'
          mode="outlined"
            onChangeText={username => this.setState({ username })}
            style={style.input}
            value={this.state.username}
          />
          <HelperText
            type="error"
            visible={this.state.error && this.state.username === ""}
          >
            Please a user name!
          </HelperText>

          <TextInput
          label='Email'
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
          label='Password'
          mode="outlined"
            secureTextEntry={true}
            onChangeText={password => this.setState({ password })}
            style={style.input}
            value={this.state.password}
          />
          <HelperText
            type="error"
            visible={this.state.error && (this.state.password === ""|| this.state.password<6)}
          >
          Password should contain at least 6 letters or digits
          </HelperText>
          <TextInput
          label='Confirm password'
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
            visible={this.state.error && this.state.confirmpassword !==this.state.password}
          >
            Password confirmation does not match the password
          </HelperText>

          {this.state.spinner && (
            <Text style={style.spinnerTextStyle}>Processing ...</Text>
          )}
          {!this.state.spinner && (
            <Button title="Register" onPress={this._registerHandler} />
          )}
     
          <Button
            title="Sign In"
            onPress={() => {
              this.props.navigation.navigate("Signin");
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
