import React from "react";
import { StyleSheet, View, Text, Button, AsyncStorage } from "react-native";
import { NavigationEvents } from "react-navigation";

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      initialState: false,
      pageSate: false,
      followers: [],
      following: []
    };
    this.updateFollowers = this.updateFollowers.bind(this);
  }
  async componentDidMount() {
    let id = await AsyncStorage.getItem("user");
    id = JSON.parse(id)._id;
    let s = this.props.navigation.getParam("user","").followers.includes(id);
    console.log("s",s)
    this.setState({ initialState: s, pageState: s });
    this.getFollowers();
  }
  async getFollowers() {
    let token = await AsyncStorage.getItem("userToken");
    fetch(
      `https://37dde31d.ngrok.io/api/profile/getFollowers/${this.props.navigation.getParam("user","")._id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    ).then(data2 => {
        console.log("got the data")

        if (data2.ok) {
          return data2.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then(data => {
          console.log("got the data")
        this.setState({ followers: data.followers, following: data.following });
      })
      .catch(err => {
        console.log(err);
      });
  }
  async updateFollowers() {
      console.log("function invoked")
    if (this.state.pageSate !== this.state.initialState) {
      let token = await AsyncStorage.getItem("userToken");

      let request = this.state.pageSate ? "follow" : "unfollow";
        console.log("passed condition")
      fetch(
        `https://37dde31d.ngrok.io/api/profile/${request}/${this.props.navigation.getParam("user","")._id}`,
        {
          method: "POST",
          body:JSON.stringify({}),
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
        .catch(err => {
          console.log(err);
        });
    }
  }
  localFollow = (followingState) => {
      let followers=this.state.followers
      if(followingState=="Unfollow"){
        
      }
      else{

      }
    this.setState({ pageSate: !this.pageState });
    
  };

  render() {
    const followingState = this.state.pageSate ? "Follow":"Unfollow";
    const followersList = this.state.followers.map(user => {
      return <Text>{user.username}</Text>;
    });
    const followingList = this.state.following.map(user => {
      return <Text>{user.username}</Text>;
    });
    return (
      <View style={styles.container}>
        <NavigationEvents onWillBlur={this.updateFollowers} />
        <Text>
          Welcome {this.props.navigation.getParam("user", "").username}
        </Text>
        <Text>Followers</Text>
        {followersList}
        <Text>Following</Text>
        {followingList}
        <Button title={followingState} onPress={(followingState)=>this.localFollow(followingState)} />
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
