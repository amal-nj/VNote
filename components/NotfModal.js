import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  AsyncStorage,
  Button,
  Alert
} from "react-native";
import {
  Button as PaperButton,
  TextInput,
  HelperText
} from "react-native-paper";
import store from "../redux/store";
export default class NotfModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receiver: "",
      post: "",
      error: ""
    };
    this.post = this.post.bind(this);
  }
  async post() {
    console.log("i'm trying to post");
    const { navigation } = this.props;

    if(this.state.post !== "" && this.state.receiver !== "") {
   
      let id = await AsyncStorage.getItem("user");
      let token = await AsyncStorage.getItem("userToken");
      id = JSON.parse(id)._id;
      //this is just to make sure user exists
      fetch(
        `https://37dde31d.ngrok.io/api/notifications/UserId/${this.state.receiver.toLowerCase()}`,
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
          console.log(id)
            let receiverid=res.id
            const post = {
                body: this.state.post,
                location: {
                  lat: store.getState().location.lat,
                  lng: store.getState().location.lng
                }
              };
            fetch(
                `https://37dde31d.ngrok.io/api/notifications/note/${receiverid}`,
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
                .then(res2=>{
                    this.props.navigation.goBack();

                    console.log(res2)
                }
                )
                .catch(err=>{
                    console.log(err)

                })
          
        })
        .catch(async err => {
          await Alert.alert(
            "User does not exist",
            "Please make sure you entered a valid username"
          );
          console.log("Error", err);
        });
    } else {
      this.setState({ error: true });
    }
  }

  render() {
    return (
      <ScrollView>
        <Text>Leave a note for another user in this location</Text>
        <TextInput
          placeholder="username"
          onChangeText={receiver => this.setState({ receiver })}
          value={this.state.receiver}
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
        />
        <HelperText
          type="error"
          visible={this.state.error && this.state.post === ""}
        >
          Posts cannot be empty!
        </HelperText>
        <Button title="Post" onPress={this.post} />
      </ScrollView>
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
