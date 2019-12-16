import React from "react";
import { StyleSheet, ScrollView, Text, AsyncStorage, Button,Alert } from "react-native";
import { Button as PaperButton, TextInput, HelperText} from 'react-native-paper';
import store from '../redux/store'
export default class PostModal extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          post: '',
          error:''
      };
      this.post=this.post.bind(this)
  }
  async post(){
    console.log("i'm trying to post")
    const { navigation } = this.props;

    if (this.state.post!="") {
      const post = {
        body:this.state.post,
        location:{
          lat:store.getState().location.lat,
          lng:store.getState().location.lng
        }
      };
      let token=await AsyncStorage.getItem('userToken')
      fetch(`https://vnote-api.herokuapp.com/api/post`, {
        method: "POST",
        body: JSON.stringify(post),
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
        .then(async res => {
         navigation.getParam('updatePosts', 'default value')()
         this.props.navigation.goBack();

        })
        .catch(async err => {
          await Alert.alert("Error posting note","Something went wrong");
          console.log("Error", err);
        });
       
    } else {
      this.setState({ error: true });
    }
  
  }

  render() {
    return (
      <ScrollView >
       <TextInput
            placeholder="What's on your mind?" 
            onChangeText={post => this.setState({ post })}
            value={this.state.post}       
       />
       <HelperText
            type="error"
            visible={this.state.error && this.state.post===""}
          >
          Posts cannot be empty!
          </HelperText>
        <Button
          title="Post"
          onPress={this.post}
        />
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
