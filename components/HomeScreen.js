import React from "react";
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  Alert,
  Button,
  SafeAreaView,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import { FAB } from "react-native-paper";
import { setLocation, setPosts, setFilteredPosts } from "../redux/actions";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import store from "../redux/store";
import PostCard from "./PostCard";
var counter = 1;
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
    this.getPosts=this.getPosts.bind(this)
  }

  _bootstrap = async () => {
    const userName = "Amal";
    this.setState({ name: userName });
  };

  onPress = async () => {
    await Location.startLocationUpdatesAsync("location", {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 3000,
      distanceInterval: 0
      // deferredUpdatesDistance: 3
    });
  };

  getPosts = async () => {
    let id = await AsyncStorage.getItem("user");
    let token = await AsyncStorage.getItem("userToken");
    id = JSON.parse(id)._id;

    console.log(id);
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
  componentDidMount() {
    this._bootstrap();
    this.getPosts();

  }

  render() {
    const sortedList=store.getState().filteredPosts.reverse()
    return (
      <View style={styles.container}>
        <Text>Welcome {this.state.name}</Text>
        <Text>to Home Screen</Text>
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            {sortedList.map((post, key) => (
              <PostCard key={key} post={post} updatePosts={this.getPosts} navigation={this.props.navigation}/>
            ))}
          </ScrollView>
        </SafeAreaView>
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => this.props.navigation.navigate("PostModal",{
              updatePosts: ()=>this.getPosts()
            })}
        />
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

export default connect(mapStateToProps)(HomeScreen);
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  fab: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 0
  },
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20
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

console.log("here");
TaskManager.defineTask("location", ({ data, error }) => {
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
      console.log("current location:", currentLocation);
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
      // console.log("filtered posts", filterdPosts);
    } catch (err) {
      console.log(err);
    }
  }
});
