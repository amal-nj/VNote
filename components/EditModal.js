import React from "react";
import { StyleSheet, ScrollView, Text, AsyncStorage, Button,Alert } from "react-native";
import { Button as PaperButton, TextInput, HelperText} from 'react-native-paper';
import store from '../redux/store'
export default class EditModal extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          post: this.props.navigation.getParam('post',"").body,
          error:''
      };
      this.post=this.post.bind(this)
  }
  async post(){
    console.log("i'm trying to post")
    const { navigation } = this.props;

    if (this.state.post!="") {
      const post = {
        body:this.state.post
      };
      let token=await AsyncStorage.getItem('userToken')
      fetch(`http://93f22bba.ngrok.io/api/post/edit/${this.props.navigation.getParam('post',"")._id}`, {
        method: "PUT",
        body: JSON.stringify(post),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
        .then(data => {
          if (!data.ok) {
            throw new Error("Something went wrong");
          } 
        })
        .then(async res => {
        //  navigation.getParam('updatePosts', 'default value')()
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
          title="Edit"
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