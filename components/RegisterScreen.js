import React from "react";
import { Dimensions } from "react-native";
import {
  KeyboardAvoidingView,
  View,
  Alert,
  Text,
  AsyncStorage,
  StyleSheet,
  Image
} from "react-native";
import { HelperText, TextInput,Button } from "react-native-paper";
import axios from 'axios'
import { ScrollView } from "react-native-gesture-handler";
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
        password: this.state.password,
        avatar: Math.floor(Math.random() * 3)
      };
      
      fetch("https://vnote-api.herokuapp.com/api/auth/register",{method: "POST",body: JSON.stringify(user), headers: {
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
      <ScrollView contentContainerStyle={{ flex: 1}}>
      <Image
          source={require("../assets/register.png")}
          style={{ flex: 1, width: null, height: null, resizeMode: "contain", marginTop:-250 }}
        ></Image>
   
        <View style={style.container}>
          <TextInput
          label='User name'
          mode="outlined"
            onChangeText={username => this.setState({ username })}
            style={style.input}
            value={this.state.username}
            error={this.state.error && this.state.username === ""}
            theme={{
                    colors: {
                      primary:'#003c3c',
                      underlineColor:'transparent',
                      
                    }
                  }}
          />
          <HelperText
          style={{ marginTop: -20 }}

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
            error={this.state.error && !this.state.email.includes("@")}
            theme={{
                    colors: {
                      primary:'#003c3c',
                      underlineColor:'transparent',
                      
                    }
                  }}
          />
          <HelperText
          style={{ marginTop: -20 }}

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
            error={this.state.error && (this.state.password === ""|| this.state.password<6)}
            theme={{
                    colors: {
                      primary:'#003c3c',
                      underlineColor:'transparent',
                      
                    }
                  }}
          />
          <HelperText
          style={{ marginTop: -20 }}

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
            error={this.state.error && (this.state.confirmpassword === ""||this.state.confirmpassword !==this.state.password)}
            theme={{
                    colors: {
                      primary:'#003c3c',
                      underlineColor:'transparent',
                      
                    }
                  }}
          />
          <HelperText
          style={{ marginTop: -20 }}

            type="error"
            visible={this.state.error && this.state.confirmpassword === ""}
          >
            Please confirm your password!
          </HelperText>
          <HelperText
          style={{ marginTop: 0 }}

            type="error"
            visible={this.state.error && this.state.confirmpassword !==this.state.password}
          >
            Password confirmation does not match the password
          </HelperText>

          {this.state.spinner && (
            <Text style={style.spinnerTextStyle}>Processing ...</Text>
          )}
          {!this.state.spinner && (
            <Button  onPress={this._registerHandler} style={style.button}
              theme={{
                    colors: {
                      primary:'#fff',
                      underlineColor:'transparent',
                      
                    }
                  }}>Register</Button>
          )}
          <Text style={{fontSize: 10, marginVertical:15}}>_________________     Have an account?     _________________</Text>
          <Button
          onPress={() => {
              this.props.navigation.navigate("Signin");
            }}
            theme={{
                    colors: {
                      primary:'#000',
                      underlineColor:'transparent',
                      
                    }
                  }}          >Sign in</Button>
        </View>
        </ScrollView>

    );
  }
}

const DEVICE_WIDTH = Dimensions.get("window").width;

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -250
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
  },
  button: {
    backgroundColor: "#ffe800",
    color: "#023333",
    marginTop: 20

  }
});
