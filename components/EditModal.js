import React from "react";
import { StyleSheet, ScrollView, Text, AsyncStorage,Alert } from "react-native";
import { Button, TextInput, HelperText} from 'react-native-paper';
import store from '../redux/store'
export default class EditModal extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          post: this.props.navigation.getParam('post',"").body,
          error:'',
          spinner:false
      };
      this.post=this.post.bind(this)
  }
  async post(){
    console.log("i'm trying to post")
    const { navigation } = this.props;
    this.setState({spinner:true})

    if (this.state.post!="") {
      const post = {
        body:this.state.post
      };
      let token=await AsyncStorage.getItem('userToken')
      fetch(`https://vnote-api.herokuapp.com/api/post/edit/${this.props.navigation.getParam('post',"")._id}`, {
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
        this.setState({spinner:false})

         this.props.navigation.goBack();

        })
        .catch(async err => {
          this.setState({spinner:false})

          await Alert.alert("Error posting note","Something went wrong");
          console.log("Error", err);
        });
       
    } else {
      this.setState({ error: true });
    }
  
  }

  render() {
    return (
      <ScrollView style={{flex:1}} >
       <TextInput
            onChangeText={post => this.setState({ post })}
            value={this.state.post}   
            style={{backgroundColor:'white'}}   
            multiline={true}
            error={this.state.error && this.state.post===""}
            theme={{
              colors: {
                primary: "#003c3c",
                underlineColor: "transparent"
              }
            }}    
       />
       <HelperText
            type="error"
            visible={this.state.error && this.state.post===""}
          >
          Posts cannot be empty!
          </HelperText>
          {this.state.spinner && (
          <Text style={{ textAlign: "center" }}>Processing ...</Text>
        )}
        {!this.state.spinner && (
          <Button
          onPress={this.post}
          style={styles.button}
            theme={{
              colors: {
                primary: "#000",
                underlineColor: "transparent"
              }
            }}
        >Edit</Button>)}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "#ffcd16",
    color: "#ffcd16"
  }
});
