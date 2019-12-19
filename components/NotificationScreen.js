
import React, { Component } from "react";
import { Text, TouchableOpacity, View, StyleSheet,ScrollView,Image,ImageBackground } from "react-native";
import Constants from "expo-constants";
import store from '../redux/store'
import NotificationCard from './NotificationCard'
import { connect } from "react-redux";

// import { ScrollView } from "react-native-gesture-handler";
class NotificationScreen extends Component {
 
  
  render() {
    let notifications=store.getState().notifications.filter(noti=>{
      return noti.isReceived
    })
    notifications=notifications.map((noti,i)=>{
      return (<NotificationCard key={i} post={noti}/>)
    })
    notifications=notifications.reverse()
    console.log("notifications",store.getState().notifications)

    return (   
        <View style={{ flex: 1 }} contentContainerStyle={{ flex: 1}}>
        <ImageBackground
          source={require("../assets/walking_phon3.jpg")}
          style={{
            flex: 1,
            width: null,
            height: null,
            resizeMode: "contain",
            marginTop: 0
          }}
        >
           <ScrollView style={styles.scrollView}>

            {notifications}
            </ScrollView>
        </ImageBackground>
     
        </View>
    );
  }
}
function mapStateToProps(state) {
  return { notifications: state.notifications };
}

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({checkLogStatus, logOut, clearNotification, clearAllNotifications}, dispatch);
// }

export default connect(mapStateToProps)(NotificationScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,

  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center"
  },
  scrollView: {
    paddingHorizontal: 10,

  }
});
