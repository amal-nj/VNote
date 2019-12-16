
import React, { Component } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Constants from "expo-constants";

export default class NotificationScreen extends Component {
 
  
  render() {
    return (
        <View style={styles.container}>
            <Text style={styles.paragraph}>Notfications here</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1"
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center"
  }
});
