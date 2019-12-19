import React, { Component } from "react";
import {
  Text,
  View,
  AsyncStorage,
  Image,
  Alert,
  StyleSheet
} from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import store from "../redux/store";
import { setFilteredPosts } from "../redux/actions";

export default class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      token: "",
      spinner:''
    };
    this.deletePost = this.deletePost.bind(this);
  }
  async getId() {
    let id = await AsyncStorage.getItem("user");
    let token = await AsyncStorage.getItem("userToken");
    id = JSON.parse(id)._id;
    this.setState({ userid: id, token: token });
  }
  async deletePost() {

    Alert.alert(
      "Delete",
      "Do you want to delete this post?",
      [
        {
          text: "Yes",
          onPress: () => {
            this.setState({spinner:true})
            console.log("id", this.props.post._id);
            fetch(
              `https://vnote-api.herokuapp.com/api/post/delete/${this.props.post._id}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${this.state.token}`
                }
              }
            )
              .then(data => {
                if (!data.ok) {
                  throw new Error("Something went wrong");
                }
              })
              .then(async res => {
                this.setState({ spinner: false });

                console.log("deleteing post");

                // this.updatePosts();
              })
              .catch(async err => {
                await Alert.alert(
                  "Error deleting post",
                  "Something went wrong"
                );
                this.setState({ spinner: false });

                console.log("Error", err);
              });
          }
        },
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
    this.setState({spinner:false})

  }
  // async updatePosts() {
  //   function getDistanceFromLatLonInm(lat1, lon1, lat2, lon2) {
  //     var R = 6371; // Radius of the earth in km
  //     var dLat = deg2rad(lat2 - lat1); // deg2rad below
  //     var dLon = deg2rad(lon2 - lon1);
  //     var a =
  //       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //       Math.cos(deg2rad(lat1)) *
  //         Math.cos(deg2rad(lat2)) *
  //         Math.sin(dLon / 2) *
  //         Math.sin(dLon / 2);
  //     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //     var d = R * c; // Distance in km
  //     return d * 1000;
  //   }

  //   function deg2rad(deg) {
  //     return deg * (Math.PI / 180);
  //   }

  //   try {
  //     let limit = 10;
  //     let currentLocation = store.getState().location;
  //     this.props.updatePosts();
  //     let posts = store.getState().posts;
  //   //   console.log("store posts", posts);

  //     let filterdPosts = posts.filter(post => {
  //       return (
  //         limit >
  //         getDistanceFromLatLonInm(
  //           post.location.lat,
  //           post.location.lng,
  //           currentLocation.lat,
  //           currentLocation.lng
  //         )
  //       );
  //     });
  //     if (JSON.stringify(posts) !== JSON.stringify(filterdPosts)) {
  //       store.dispatch(setFilteredPosts(filterdPosts));
  //     }
  //   //   console.log("filtered posts", filterdPosts);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  componentDidMount() {
    this.getId();
  }
  render() {
    //   const date=new Date(this.props.post.updatedAt)
    //   console.log("hours", date.getHours())
    // console.log("here")
    let actions =
      this.props.post.user._id === this.state.userid ? (
        <Card.Actions>
          <Button
            onPress={() =>
              this.props.navigation.navigate("EditModal", {
                post: this.props.post
              })
            }
            theme={{
              colors: {
                primary: "#000",
                underlineColor: "transparent"
              }
            }}
            style={style.button}
          >
            Edit
          </Button>
          <Button
            onPress={this.deletePost}
            style={style.button}
            theme={{
              colors: {
                primary: "#000",
                underlineColor: "transparent"
              }
            }}
          >
            Delete
          </Button>
        </Card.Actions>
      ) : (
        <Text></Text>
      );
    return (
      <View style={{ marginVertical: 5 }}>
        <Card
          style={{ borderRadius: 20 }}
          onPress={() => {
            console.log(this.props.navigation);
            this.props.navigation.navigate("usersProfile", {
              user: this.props.post.user
            });
          }}
        >
          <Card.Title />
          <Card.Content>
            <Text style={{fontSize:20}}>{`@${this.props.post.user.username}`}</Text>
            <Paragraph style={{ textAlign: "right", alignSelf: "stretch" }}>
              {this.props.post.body}
            </Paragraph>
            <Text style={{fontSize:10, color:'grey',textAlign:'right'}}>{this.props.post.updatedAt.split("T")[0]}</Text>

          </Card.Content>
          {actions}
        </Card>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -70,
    backgroundColor: "white"
  },
  button: {
    backgroundColor: "#ffe800",
    color: "#023333",
    margin: 5
  }
});
