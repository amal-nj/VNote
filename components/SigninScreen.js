import React from "react";
import { Dimensions } from "react-native";
import {
  KeyboardAvoidingView,
  View,
  Alert,
  Text,
  AsyncStorage,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { HelperText, TextInput, Button } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
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
        <ScrollView contentContainerStyle={{ flex: 1}} >
        <Image
          source={require("../assets/signin2.png")}
          style={{ flex: 1, width: null, height: null, resizeMode: "contain", marginTop: 20 }}
        ></Image>
        
        <View style={style.container}>
        <Text style={{fontSize:25, fontFamily:'lalezar'}}>VNote</Text>

          <TextInput
            label="Email"
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
            label="Password"
            mode="outlined"
            secureTextEntry={true}
            onChangeText={password => this.setState({ password })}
            style={style.input}
            placeholder="Password"
            value={this.state.password}
            error={this.state.error && this.state.password === ""}
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
            visible={this.state.error && this.state.password === ""}
          >
            Please enter your password!
          </HelperText>

          {this.state.spinner && (
            <Text style={style.spinnerTextStyle}>Processing ...</Text>
          )}
          {!this.state.spinner && (
            <Button
            dark={true}
              onPress={this._signInHandler}
              style={style.button}
              theme={{
                    colors: {
                      primary:'#fff',
                      underlineColor:'transparent',
                      
                    }
                  }}
            >Sign in</Button>
          )}
          <Text style={{fontSize: 10, marginVertical:15}}>_________________     Don't have an account?     _________________</Text>
          <Button
            onPress={() => {
              this.props.navigation.navigate("Register");
            }}
            theme={{
                    colors: {
                      primary:'#000',
                      underlineColor:'transparent',
                      
                    }
                  }}>Register</Button>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
   
    );
  }
}

const DEVICE_WIDTH = Dimensions.get("window").width;
const  screenHeight= Dimensions.get('window').height;

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -70,
    backgroundColor:'white'

  },
  containerContent: {
    height: screenHeight-10,
    justifyContent: 'center',
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

  }
});
