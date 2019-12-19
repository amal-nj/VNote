import React from "react";
import { StyleSheet, View, Text, AsyncStorage, Image } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { Button } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

export default class SettingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
    };
  }
  async componentDidMount() {
    let username = await AsyncStorage.getItem("user");
    username = JSON.parse(username).username;
    this.setState({ username });
  }

  render() {
    return (
      <View style={styles.container}>
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
            <Text style={{ fontSize: 25 }}>@{this.state.username}</Text>
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
              <Button
                style={{
                  backgroundColor: "#ffe800",
                  color: "#023333",
                  margin: 10
                }}
                onPress={() => {
                  this.props.navigation.push("ChangePassword");
                }}
                theme={{
                  colors: {
                    primary: "#000",
                    underlineColor: "transparent"
                  }
                }}
              >
                Change Password
              </Button>
              <Button
              style={{
                  backgroundColor: "#ffe800",
                  color: "#023333",
                  margin: 10
                }}
                title="Sign Out"
                onPress={async () => {
                  await AsyncStorage.clear();
                  this.props.navigation.navigate("Auth");
                }}
                theme={{
                  colors: {
                    primary: "#000",
                    underlineColor: "transparent"
                  }
                }}
              >
                Sign out
              </Button>
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
    marginTop: -300,
    padding: 20,
    alignSelf: "stretch"
  }
});
