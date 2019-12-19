import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  AsyncStorage,
  Alert,
  View,
  Image,
  KeyboardAvoidingView
} from "react-native";
import { Button, TextInput, HelperText } from "react-native-paper";
import store from "../redux/store";
export default class NotfModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiver: "",
      post: "",
      error: "",
      spinner:false
    };
    this.post = this.post.bind(this);
  }
  async post() {
    console.log("i'm trying to post");
    const { navigation } = this.props;
    this.setState({spinner:true})
    if (this.state.post !== "" && this.state.receiver !== "") {
      let id = await AsyncStorage.getItem("user");
      let token = await AsyncStorage.getItem("userToken");
      id = JSON.parse(id)._id;
      //this is just to make sure user exists
      fetch(
        `https://vnote-api.herokuapp.com/api/notifications/UserId/${this.state.receiver.toLowerCase()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      )
        .then(data => {
          if (data.ok) {
            return data.json();
          } else {
            throw new Error("Something went wrong");
          }
        })
        .then(async res => {
          console.log(id);
          let receiverid = res.id;
          const post = {
            body: this.state.post,
            location: {
              lat: store.getState().location.lat,
              lng: store.getState().location.lng
            }
          };
          fetch(
            `https://vnote-api.herokuapp.com/api/notifications/note/${receiverid}`,
            {
              method: "POST",
              body: JSON.stringify(post),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              }
            }
          )
            .then(data2 => {
              if (data2.ok) {
                return data2.json();
              } else {
                throw new Error("Something went wrong");
              }
            })
            .then(res2 => {
              this.setState({spinner:false})

              this.props.navigation.goBack();

              console.log(res2);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(async err => {
          await Alert.alert(
            "User does not exist",
            "Please make sure you entered a valid username"
          );
          this.setState({ spinner: false });

          console.log("Error", err);
        });
    } else {
      this.setState({ error: true });
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView contentContainerStyle={{ flex: 1 }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
            }}
          ></Text>
          <Text style={{ textAlign: "center", fontSize: 18, padding: 20 }}>
            Leave a note for another user in this location
          </Text>
          <TextInput
            placeholder="username"
            onChangeText={receiver => this.setState({ receiver })}
            value={this.state.receiver}
            style={{ backgroundColor: "white" }}
            error={this.state.error && this.state.receiver === ""}
            theme={{
              colors: {
                primary: "#003c3c",
                underlineColor: "transparent"
              }
            }}
          />
          <HelperText
            type="error"
            visible={this.state.error && this.state.receiver === ""}
          >
            Please enter a username
          </HelperText>

          <TextInput
            placeholder="What's on your mind?"
            onChangeText={post => this.setState({ post })}
            value={this.state.post}
            style={{ backgroundColor: "white" }}
            multiline={true}
            error={this.state.error && this.state.post === ""}
            theme={{
              colors: {
                primary: "#003c3c",
                underlineColor: "transparent"
              }
            }}
          />
          <HelperText
            type="error"
            visible={this.state.error && this.state.post === ""}
          >
            Posts cannot be empty!
          </HelperText>
        </KeyboardAvoidingView>
        {this.state.spinner && (
          <Text style={{ textAlign: "center" }}>Processing ...</Text>
        )}
        {!this.state.spinner && (
        <Button
          onPress={this.post}
          style={styles.button}
          theme={{
            colors: {
              primary: "#000",
              underlineColor: "transparent"
            }
          }}
        >
          Post
        </Button>)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "#ffcd16",
    color: "#ffcd16"
  }
});
