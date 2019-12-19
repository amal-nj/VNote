import React from "react";
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import { FAB, Portal, Provider } from "react-native-paper";

import {
  setLocation,
  setPosts,
  setFilteredPosts,
  setNotifications,
  setFilteredNotifications,
  setShouldFilter
} from "../redux/actions";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import store from "../redux/store";
import PostCard from "./PostCard";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

var counter = 1;
const PUSH_REGISTRATION_ENDPOINT = "https://vnote-api.herokuapp.com/token/:id";
const MESSAGE_ENPOINT = "https://vnote-api.herokuapp.com/message";
import SocketIOClient from "socket.io-client";

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      notification: null,
      messageText: "",
      open: false
    };
    this.getPosts = this.getPosts.bind(this);
    this.socket = SocketIOClient("https://vnote-api.herokuapp.com/");
    this.socket.on("newPost", msg => {
      let currentLocation = store.getState().location;
      console.log("I'm triggered");
      //limit here is higher cuz user may not be in the range now but will reach it later
      let limit = 30;
      if (
        getDistanceFromLatLonInm(
          msg.lat,
          msg.lng,
          currentLocation.lat,
          currentLocation.lng
        ) < limit
      ) {
        console.log("true");

        this.getPosts();
      }
    });
    this.socket.on("notification1", async receivedid => {
      console.log("new notification");

      let id = await AsyncStorage.getItem("user");
      id = JSON.parse(id)._id;
      //if the new notification in the data base belongs to this user
      //then get it from the data base
      if (id === receivedid) {
        console.log("id match");
        store.dispatch(setShouldFilter(false));
        this.getNotifications();
      }
    });
  }

  _bootstrap = async () => {
    const userName = "Amal";
    this.setState({ name: userName });
  };

  handleNotification = notification => {
    if (notification.origin === "received") {
      console.log("a badge should be added!");
    } else {
      this.props.navigation.navigate("Notify");
    }
    // this.setState({ notification });
  };

  // handleChangeText = text => {
  //   this.setState({ messageText: text });
  // };

  // sendMessage = async () => {
  //   fetch(MESSAGE_ENPOINT, {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       message: this.state.messageText
  //     })
  //   });
  //   this.setState({ messageText: "" });
  // };

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      let Expotoken = await Notifications.getExpoPushTokenAsync();

      this.notificationSubscription = Notifications.addListener(
        this.handleNotification
      );
      let id = await AsyncStorage.getItem("user");
      let token = await AsyncStorage.getItem("userToken");
      id = JSON.parse(id)._id;
      console.log("token function invoked");
      fetch(`https://vnote-api.herokuapp.com/api/notifications/token/${id}`, {
        method: "POST",
        body: JSON.stringify({
          expoToken: Expotoken
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
        .then(data => {
          // console.log(data)
        })
        .catch(err => {
          // console.log(err)
        });
    } else {
      alert("Must use physical device for Push Notifications");
    }
  };

  onPress = async () => {
    await Location.startLocationUpdatesAsync("location", {
      accuracy: Location.Accuracy.High,
      timeInterval: 3000,
      distanceInterval: 0
      // deferredUpdatesDistance: 3
    });
  };

  getPosts = async () => {
    let id = await AsyncStorage.getItem("user");
    let token = await AsyncStorage.getItem("userToken");
    id = JSON.parse(id)._id;
    // console.log("get posts token:", token);
    // console.log(id);
    fetch("https://vnote-api.herokuapp.com/api/post", {
      method: "GET",
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
      .then(res => {
        // console.log("initial post fetch", res);
        // console.log(res);
        store.dispatch(setPosts(res));
        this.onPress();
      })
      .catch(async err => {
        console.log("Error", err);
        await Alert.alert(
          "Error",
          "Something went wrong while fetching the posts"
        );
      });
  };
  getNotifications = async () => {
    let id = await AsyncStorage.getItem("user");
    let token = await AsyncStorage.getItem("userToken");
    id = JSON.parse(id)._id;
    console.log("getting notifications...");
    fetch(`https://vnote-api.herokuapp.com/api/notifications/${id}`, {
      method: "GET",
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
      .then(res => {
        console.log("operation successeded");

        // console.log("notifications:", res);
        store.dispatch(setNotifications(res.notifications));
        store.dispatch(setShouldFilter(true));
        filterNotifications();
      })
      .catch(async err => {
        console.log("Error", err);
        await Alert.alert(
          "Error",
          "Something went wrong while fetching user's notifications"
        );
      });
  };
  componentDidMount() {
    this._bootstrap();
    this.getPosts();
    this.getNotifications();

    this.registerForPushNotificationsAsync();
  }

  render() {
    const sortedList = store.getState().filteredPosts.reverse();
    // console.log(sortedList);

    return (
      <View style={{ flex: 1 }}>
        <Image
          source={require("../assets/home4.png")}
          style={{
            flex: 1,
            width: null,
            height: null,
            resizeMode: "contain",
            marginTop: -150
          }}
        ></Image>
        {sortedList.length === 0 && (
          <View style={styles.container}>
            <Text
              style={{ fontSize: 18, textAlign: "center", alignSelf: "stretch",marginTop:150,padding:20 }}
            >
              There are no posts in this location yet. Be the first to post!
            </Text>
          </View>
        )}

        <View style={styles.container}>
          <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
              {sortedList.map((post, key) => {
                {
                  /* console.log("poooost", post); */
                }
                return (
                  <PostCard
                    key={key}
                    post={post}
                    updatePosts={this.getPosts}
                    navigation={this.props.navigation}
                  />
                );
              })}
            </ScrollView>
          </SafeAreaView>

          <FAB
            style={styles.fab}
            icon="comment-account"
            onPress={() =>
              this.props.navigation.navigate("NotfModal", {
                updatePosts: () => this.getPosts()
              })
            }
          />
          <FAB
            style={{
              position: "absolute",
              marginBottom: 85,
              marginLeft: 20,
              marginRight: 20,
              right: 0,
              bottom: 0,
              backgroundColor: "#000"
            }}
            icon="plus"
            onPress={() =>
              this.props.navigation.navigate("PostModal", {
                updatePosts: () => this.getPosts()
              })
            }
          />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return { filteredPosts: state.filteredPosts };
}

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({checkLogStatus, logOut, clearNotification, clearAllNotifications}, dispatch);
// }
const DEVICE_WIDTH = Dimensions.get("window").width;

export default connect(mapStateToProps)(HomeScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -80
  },
  fab: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: "#000"
  },
  scrollView: {
    marginHorizontal: 20,
    width: DEVICE_WIDTH - 40,
    flex: 1
  },
  text: {
    fontSize: 42
  }
});

function getDistanceFromLatLonInm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d * 1000;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

try {
  TaskManager.defineTask("location", async ({ data, error }) => {
    if (error) {
      // Error occurred - check `error.message` for more details.
      return;
    }
    if (data) {
      try {
        const { locations } = data;
        // do something with the locations captured in the background
        console.log("----------" + counter + "----------");
        counter++;
        // console.log("Received new locations", data);
        location = data.locations[0].coords;
        // console.log('state', store.getState())
        let limit = 10;
        store.dispatch(
          setLocation({ lat: location.latitude, lng: location.longitude })
        );

        let currentLocation = store.getState().location;
        // console.log("current location:", currentLocation);
        let posts = store.getState().posts;
        // console.log("store posts", posts);

        let filterdPosts = posts.filter(post => {
          return (
            limit >
            getDistanceFromLatLonInm(
              post.location.lat,
              post.location.lng,
              currentLocation.lat,
              currentLocation.lng
            )
          );
        });
        if (JSON.stringify(posts) !== JSON.stringify(filterdPosts)) {
          store.dispatch(setFilteredPosts(filterdPosts));
        }

        //
        //
        filterNotifications();
        // console.log("filtered posts", filterdPosts);
      } catch (err) {
        console.log(err);
      }
    }
  });
} catch (err) {
  console.log("I'm just useless");
}

async function filterNotifications() {
  if (store.getState().shouldFilter) {
    let limit = 10;
    let currentLocation = store.getState().location;

    let notifications = store.getState().notifications;
    // console.log("store posts", posts);
    // console.log("notification", notifications)
    let filterdNotifications = notifications.filter(notification => {
      return (
        limit >
        getDistanceFromLatLonInm(
          notification.location.lat,
          notification.location.lng,
          currentLocation.lat,
          currentLocation.lng
        )
      );
    });
    // console.log("filtered notf",filterdNotifications)
    let token = await AsyncStorage.getItem("userToken");

    if (
      JSON.stringify(store.getState().filteredNotifications) !==
      JSON.stringify(filterdNotifications)
    ) {
      console.log("updating store with new notifications");
      store.dispatch(setFilteredNotifications(filterdNotifications));
    }
    filterdNotifications.forEach(note => {
      // console.log("found unseen notifications here")

      if (!note.isReceived) {
        ///
        // console.log(note);
        console.log("found unseen notifications");
        fetch(
          `https://vnote-api.herokuapp.com/api/notifications/notify/${note._id}`,
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
          .then(res => {
            console.log("notification sent");

            // console.log("notifications:", res)
          })
          .catch(async err => {
            console.log("Error", err);
            // await Alert.alert(
            //   "Error",
            //   "Something went wrong while fetching user's notifications"
            // );
          });
        ///
      }
    });
  }
}
