import React from "react";
import { StyleSheet, View, Text, AsyncStorage,ScrollView,Image } from "react-native";
import { NavigationEvents } from "react-navigation";
import {Button} from 'react-native-paper'

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
      `https://vnote-api.herokuapp.com/api/profile/getFollowers/${this.props.navigation.getParam("user","")._id}`,
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
        `https://vnote-api.herokuapp.com/api/profile/${request}/${this.props.navigation.getParam("user","")._id}`,
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
  localFollow = () => {
      let followers=this.state.followers
     
    this.setState({ pageSate: !this.state.pageState });
    
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

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ flex: 1 }}
        >
          <Image
            source={require("../assets/profile.jpg")}
            style={{
              flex: 1,
              width: null,
              height: null,
              resizeMode: "contain",
              marginTop: 0
            }}
          ></Image>
          <View style={styles.container2}>
            <Text style={{ fontSize: 25 }}>@{this.props.navigation.getParam("user", "").username}</Text>
            <View style={{ textAlign: "left", alignSelf: "stretch" }}>
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "stretch",
                  padding: 1,
                  marginVertical: 5,
                }}
              >______________________________________________________</Text>
            </View>
            <Text style={{fontSize:15,marginBottom:10,padding:5, paddingHorizontal:8}}>
              Bio: Lorm tempore repellat eius veritatis qui nam quisquam neque,
              omnis natus velit, hic dolorem quos? Cum, provident.
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              {/* <Button
              style={{
                  backgroundColor: "#ffe800",
                  color: "#023333",
                  margin: 10
                }}
              
                onPress={async () => {
               this.localFollow()
                }}
                theme={{
                  colors: {
                    primary: "#000",
                    underlineColor: "transparent"
                  }
                }}
              >
                {followingState}
              </Button> */}
            </View>
          </View>
        </ScrollView>
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
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -200,
    padding: 20,
    alignSelf: "stretch"
  }
});