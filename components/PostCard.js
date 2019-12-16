import React, { Component } from "react";
import { Text, View, AsyncStorage, Image, Alert } from "react-native";
import { Avatar, Button, Card, Title, Paragraph } from "react-native-paper";
import store from "../redux/store";
import {setFilteredPosts } from "../redux/actions";

export default class PostCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      token: ""
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
              console.log("id",this.props.post._id)
            fetch(
                `http://93f22bba.ngrok.io/api/post/delete/${this.props.post._id}`,
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
                  console.log("deleteing post");
                  // this.updatePosts();
                })
                .catch(async err => {
                  await Alert.alert("Error deleting post","Something went wrong");
                  console.log("Error", err);
                });
            
          }
        },
        {
          text: "Cancel",
          onPress: () => {
          },
          style: "cancel"
        }
      ],
      { cancelable: false }
    );

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
    let actions =
      this.props.post.user._id === this.state.userid ? (
        <Card.Actions>
          <Button  onPress={() => this.props.navigation.navigate("EditModal",{
              post: this.props.post,
            })}>Edit</Button>
          <Button onPress={this.deletePost}>Delete</Button>
        </Card.Actions>
      ) : (
        <Text></Text>
      );
    return (
      <Card>
        <Card.Title
          title={`@${this.props.post.user.username}`}
          subtitle={this.props.post.updatedAt}
          right={props => (
            <Avatar.Image
              {...props}
              size={50}
              source={{
                uri:
                  "https://pbs.twimg.com/profile_images/1168194986774552576/hHMau3Rz_400x400.jpg"
              }}
            />
          )}
        />

        <Card.Content>
          <Paragraph>{this.props.post.body}</Paragraph>
        </Card.Content>
        {actions}
      </Card>
    );
  }
}
